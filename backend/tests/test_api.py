"""
Integration tests for API routes.
Claude service is mocked so no real API calls are made.
"""

import json
from unittest.mock import patch

from tests.conftest import SAMPLE_TEXT_MEDIUM


MOCK_VOCAB = {"tier2": [{"word": "evaporates", "sentence_index": 1}], "tier3": []}

MOCK_EARLY = {
    "profile": "early",
    "book_band": "Orange",
    "book_band_colour": "#FDBA74",
    "phonics_phase": 3,
    "decodability_pct": 72.4,
    "common_exception_words": ["the"],
    "gpc_inventory": ["s/s"],
    "raw_text_stats": {"word_count": 20, "avg_sentence_length": 5.0, "avg_syllables_per_word": 1.2},
    "warnings": [],
}

MOCK_QUESTIONS = {
    "questions": [
        {
            "domain": "2b",
            "domain_label": "Retrieve and record information",
            "question": "What causes water to evaporate?",
            "model_answer": "The sun heats water causing it to evaporate.",
            "difficulty": "literal",
        }
    ]
}


def test_analyse_developing(client):
    with patch("app.services.vocabulary.claude.complete_json", return_value=MOCK_VOCAB):
        resp = client.post(
            "/api/analyse",
            json={"text": SAMPLE_TEXT_MEDIUM, "profile": "developing"},
        )
    assert resp.status_code == 200
    data = resp.get_json()
    assert data["profile"] == "developing"
    assert "flesch_kincaid_grade" in data
    assert "vocabulary" in data


def test_analyse_early(client):
    with patch("app.services.early_reader.claude.complete_json", return_value=MOCK_EARLY):
        resp = client.post(
            "/api/analyse",
            json={"text": "The cat sat on the mat.", "profile": "early"},
        )
    assert resp.status_code == 200
    data = resp.get_json()
    assert data["profile"] == "early"
    assert "book_band" in data


def test_analyse_missing_text(client):
    resp = client.post("/api/analyse", json={"profile": "developing"})
    assert resp.status_code == 400


def test_analyse_invalid_profile(client):
    resp = client.post("/api/analyse", json={"text": "hello", "profile": "invalid"})
    assert resp.status_code == 400


def test_questions(client):
    with patch("app.services.question_generator.claude.complete_json", return_value=MOCK_QUESTIONS):
        resp = client.post(
            "/api/questions",
            json={
                "text": SAMPLE_TEXT_MEDIUM,
                "profile": "developing",
                "domains": ["2b"],
                "target_year_group": "Y4",
            },
        )
    assert resp.status_code == 200
    data = resp.get_json()
    assert len(data["questions"]) == 1
    assert data["questions"][0]["domain"] == "2b"
