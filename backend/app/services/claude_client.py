"""
Single point of all Anthropic SDK interaction.
Provides complete_json (sync JSON response) and stream_text (streaming generator).
Both methods apply prompt caching to the system prompt.
"""

import json
import logging
from collections.abc import Generator
from typing import Any

import anthropic
from flask import current_app

logger = logging.getLogger(__name__)


def _strip_code_fences(text: str) -> str:
    """Remove markdown code fences Claude sometimes wraps JSON in."""
    if text.startswith("```"):
        text = text.split("\n", 1)[-1]
        if text.endswith("```"):
            text = text[: text.rfind("```")]
    return text.strip()


class ClaudeServiceError(Exception):
    pass


class ClaudeClient:
    def __init__(self) -> None:
        self._client: anthropic.Anthropic | None = None

    @property
    def client(self) -> anthropic.Anthropic:
        if self._client is None:
            api_key = current_app.config["ANTHROPIC_API_KEY"]
            if not api_key:
                raise ClaudeServiceError("ANTHROPIC_API_KEY is not configured")
            self._client = anthropic.Anthropic(api_key=api_key)
        return self._client

    @property
    def model(self) -> str:
        return current_app.config["CLAUDE_MODEL"]

    def complete_json(
        self,
        system: str,
        user: str,
        max_tokens: int = 1024,
        cache_system: bool = True,
    ) -> dict[str, Any]:
        """Make a synchronous Claude call; parse and return JSON response."""
        system_block: list[dict] = [{"type": "text", "text": system}]
        if cache_system:
            system_block[0]["cache_control"] = {"type": "ephemeral"}

        try:
            response = self.client.messages.create(
                model=self.model,
                max_tokens=max_tokens,
                system=system_block,
                messages=[{"role": "user", "content": user}],
            )
        except anthropic.RateLimitError as exc:
            raise ClaudeServiceError("Rate limit reached. Please wait a moment and try again.") from exc
        except anthropic.APITimeoutError as exc:
            raise ClaudeServiceError("Analysis timed out. Please try again.") from exc
        except anthropic.APIError as exc:
            logger.error("Anthropic API error: %s", exc)
            raise ClaudeServiceError("Analysis service temporarily unavailable.") from exc

        raw = response.content[0].text.strip()
        self._log_cache_usage(response)

        try:
            return json.loads(_strip_code_fences(raw))
        except json.JSONDecodeError:
            logger.warning("JSON parse failed on first attempt, retrying with repair prompt. Raw: %.200s", raw)
            return self._repair_json(system, user, raw, max_tokens, cache_system)

    def _repair_json(
        self,
        system: str,
        original_user: str,
        bad_response: str,
        max_tokens: int,
        cache_system: bool,
    ) -> dict[str, Any]:
        repair_user = (
            f"{original_user}\n\n"
            f"Your previous response was not valid JSON:\n{bad_response}\n\n"
            "Return ONLY the JSON object, nothing else."
        )
        system_block: list[dict] = [{"type": "text", "text": system}]
        if cache_system:
            system_block[0]["cache_control"] = {"type": "ephemeral"}

        try:
            response = self.client.messages.create(
                model=self.model,
                max_tokens=max_tokens,
                system=system_block,
                messages=[{"role": "user", "content": repair_user}],
            )
            repaired = response.content[0].text.strip()
            return json.loads(_strip_code_fences(repaired))
        except (anthropic.APIError, json.JSONDecodeError) as exc:
            raise ClaudeServiceError("Analysis service returned an unreadable response. Please try again.") from exc

    def stream_text(
        self,
        system: str,
        user: str,
        max_tokens: int = 2048,
        cache_system: bool = True,
    ) -> Generator[str, None, None]:
        """Yield text chunks from a streaming Claude response."""
        system_block: list[dict] = [{"type": "text", "text": system}]
        if cache_system:
            system_block[0]["cache_control"] = {"type": "ephemeral"}

        try:
            with self.client.messages.stream(
                model=self.model,
                max_tokens=max_tokens,
                system=system_block,
                messages=[{"role": "user", "content": user}],
            ) as stream:
                for text in stream.text_stream:
                    yield text
        except anthropic.RateLimitError as exc:
            raise ClaudeServiceError("Rate limit reached. Please wait a moment and try again.") from exc
        except anthropic.APIError as exc:
            logger.error("Anthropic streaming error: %s", exc)
            raise ClaudeServiceError("Rewrite service temporarily unavailable.") from exc

    def _log_cache_usage(self, response: anthropic.types.Message) -> None:
        usage = response.usage
        if hasattr(usage, "cache_read_input_tokens"):
            logger.debug(
                "Cache usage — creation: %s, read: %s, uncached: %s",
                getattr(usage, "cache_creation_input_tokens", 0),
                usage.cache_read_input_tokens,
                usage.input_tokens,
            )


# Module-level singleton; instantiated lazily within app context
claude = ClaudeClient()
