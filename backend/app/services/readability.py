"""
textstat wrapper with UK year group and book band mappings.
Includes sanity checks and warnings for edge-case texts.
"""

import textstat

from app.utils.mappings import (
    book_band_colour,
    fk_grade_to_book_band,
    fk_grade_to_year_group,
)


def analyse(text: str) -> dict:
    """Run textstat analysis and return scores with UK curriculum mappings."""
    fk_grade = textstat.flesch_kincaid_grade(text)
    year_group = fk_grade_to_year_group(fk_grade)
    band = fk_grade_to_book_band(fk_grade)

    scores = {
        "flesch_kincaid_grade": round(fk_grade, 1),
        "flesch_reading_ease": round(textstat.flesch_reading_ease(text), 1),
        "gunning_fog": round(textstat.gunning_fog(text), 1),
        "smog_index": round(textstat.smog_index(text), 1),
        "year_group_estimate": year_group,
        "book_band_estimate": band,
        "book_band_colour": book_band_colour(band),
        "raw_text_stats": _raw_stats(text),
        "warnings": _warnings(text),
    }
    return scores


def _raw_stats(text: str) -> dict:
    word_count = textstat.lexicon_count(text, removepunct=True)
    sentence_count = max(textstat.sentence_count(text), 1)
    syllable_count = textstat.syllable_count(text)
    return {
        "word_count": word_count,
        "avg_sentence_length": round(word_count / sentence_count, 1),
        "avg_syllables_per_word": round(syllable_count / max(word_count, 1), 1),
    }


def _warnings(text: str) -> list[str]:
    warnings = []
    word_count = textstat.lexicon_count(text, removepunct=True)
    sentence_count = max(textstat.sentence_count(text), 1)

    if word_count < 100:
        warnings.append("Text is short (< 100 words) — readability scores may be unreliable.")

    avg_sent = word_count / sentence_count
    if avg_sent < 4 and sentence_count > 3:
        warnings.append(
            "Text appears to contain verse or lists — sentence-based scores may not reflect true difficulty."
        )

    return warnings
