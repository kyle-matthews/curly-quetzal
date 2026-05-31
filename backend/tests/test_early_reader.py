"""
Unit tests for early reader analysis.
Claude calls are mocked — these test service wiring, not prompt quality.
"""

from unittest.mock import patch

from app.services import early_reader


MOCK_RESULT = {
    "profile": "early",
    "book_band": "Orange",
    "book_band_colour": "#FDBA74",
    "phonics_phase": 3,
    "decodability_pct": 72.4,
    "common_exception_words": ["the", "was"],
    "gpc_inventory": ["s/s", "a/æ"],
    "raw_text_stats": {"word_count": 20, "avg_sentence_length": 5.0, "avg_syllables_per_word": 1.2},
    "warnings": [],
}


def test_analyse_calls_claude(app):
    with app.app_context():
        with patch("app.services.early_reader.claude.complete_json", return_value=MOCK_RESULT) as mock_claude:
            result = early_reader.analyse("The cat sat on the mat.", "early")
    mock_claude.assert_called_once()
    assert result["book_band"] == "Orange"
    assert result["phonics_phase"] == 3
