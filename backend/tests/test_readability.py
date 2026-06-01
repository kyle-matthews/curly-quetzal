from app.services import readability
from app.utils.mappings import fk_grade_to_year_group, fk_grade_to_book_band
from tests.conftest import SAMPLE_TEXT_MEDIUM


def test_analyse_returns_expected_keys(app):
    with app.app_context():
        result = readability.analyse(SAMPLE_TEXT_MEDIUM)
    assert "flesch_kincaid_grade" in result
    assert "flesch_reading_ease" in result
    assert "gunning_fog" in result
    assert "smog_index" in result
    assert "year_group_estimate" in result
    assert "book_band_estimate" in result
    assert "raw_text_stats" in result
    assert "warnings" in result


def test_short_text_warning(app):
    with app.app_context():
        result = readability.analyse("The cat sat.")
    assert any("short" in w.lower() for w in result["warnings"])


def test_fk_grade_to_year_group():
    assert fk_grade_to_year_group(1.0) == "Y1"
    assert fk_grade_to_year_group(2.0) == "Y2"
    assert fk_grade_to_year_group(4.0) == "Y2"  # Gold-level Y2 text; old US-centric scale gave Y4
    assert fk_grade_to_year_group(7.0) == "Y4"


def test_fk_grade_to_book_band():
    band = fk_grade_to_book_band(3.0)
    assert isinstance(band, str)
    assert len(band) > 0
