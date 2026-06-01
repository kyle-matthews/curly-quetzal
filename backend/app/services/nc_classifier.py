"""
National Curriculum-based reading level classification via Claude.
Used for developing and fluent reader profiles — replaces FK-formula-derived
year group and band estimates with Claude's curriculum-grounded assessment.
"""

from app.prompts import nc_classifier as prompt
from app.services.claude_client import claude


def classify(text: str, metrics: dict) -> dict:
    """Return NC-based year_group_estimate, book_band_estimate, colour, rationale."""
    return claude.complete_json(
        system=prompt.SYSTEM,
        user=prompt.user_message(text, metrics),
        max_tokens=512,
    )
