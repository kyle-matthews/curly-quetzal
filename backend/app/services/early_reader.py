"""
Phonics/book band analysis for early reader profile.
The entire analysis is handled by Claude — no textstat.
"""

from app.prompts import early_reader as prompt
from app.services.claude_client import claude


def analyse(text: str, profile: str = "early") -> dict:
    return claude.complete_json(
        system=prompt.SYSTEM,
        user=prompt.user_message(text, profile),
        max_tokens=1024,
    )
