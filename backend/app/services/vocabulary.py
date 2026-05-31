"""
Tier 2/3 vocabulary extraction via Claude.
Used for developing and fluent reader profiles.
"""

from app.prompts import vocabulary as prompt
from app.services.claude_client import claude


def analyse(text: str) -> dict:
    """Return {"tier2": [...], "tier3": [...]} vocabulary analysis."""
    return claude.complete_json(
        system=prompt.SYSTEM,
        user=prompt.user_message(text),
        max_tokens=1024,
    )
