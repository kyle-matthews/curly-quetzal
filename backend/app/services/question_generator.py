"""
KS2 comprehension question generation via Claude.
"""

from app.prompts import questions as prompt
from app.services.claude_client import claude


def generate(
    text: str,
    domains: list[str],
    year_group: str,
    book_band: str = "Gold",
) -> dict:
    """Return {"questions": [...]} for the requested KS2 content domains."""
    return claude.complete_json(
        system=prompt.SYSTEM,
        user=prompt.user_message(text, domains, year_group, book_band),
        max_tokens=2048,
    )
