"""
Difficulty adjustment: streams a rewritten version of the text at a target level.
The final done payload includes re-computed readability scores.
"""

from collections.abc import Generator

from app.prompts import rewriter as prompt
from app.services import readability
from app.services.claude_client import claude


def stream_rewrite(text: str, target_type: str, target_value: str) -> Generator[str, None, None]:
    """Yield text chunks from Claude while rewriting."""
    desc = prompt.target_description(target_type, target_value)
    yield from claude.stream_text(
        system=prompt.SYSTEM,
        user=prompt.user_message(text, desc),
        max_tokens=2048,
    )


def score_rewritten(text: str, profile: str) -> dict:
    """Run readability scoring on the rewritten text for before/after comparison."""
    if profile == "early":
        from app.services import early_reader
        return early_reader.analyse(text)
    return readability.analyse(text)
