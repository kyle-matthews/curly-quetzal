"""
Mapping tables: Flesch-Kincaid grade → UK year group → book band.

Book bands follow the Book Trust / BookBand colour scheme used in most UK primaries.
FK grade thresholds are approximate and should be used alongside other metrics.
"""

# Book band ordered list (easiest → hardest)
BOOK_BANDS = [
    "Lilac",
    "Pink",
    "Red",
    "Yellow",
    "Blue",
    "Green",
    "Orange",
    "Turquoise",
    "Purple",
    "Gold",
    "White",
    "Lime",
    "Lime+",
]

# Approximate hex colours for each band (for UI display)
BOOK_BAND_COLOURS = {
    "Lilac": "#D8B4FE",
    "Pink": "#FBCFE8",
    "Red": "#FCA5A5",
    "Yellow": "#FDE68A",
    "Blue": "#93C5FD",
    "Green": "#86EFAC",
    "Orange": "#FDBA74",
    "Turquoise": "#5EEAD4",
    "Purple": "#C084FC",
    "Gold": "#FCD34D",
    "White": "#F9FAFB",
    "Lime": "#BEF264",
    "Lime+": "#A3E635",
}

# UK year groups in order
YEAR_GROUPS = ["Reception", "Y1", "Y2", "Y3", "Y4", "Y5", "Y6"]

# Approximate FK grade → year group
# FK grade 0–1 ≈ Reception/Y1, 2 ≈ Y2, etc.
FK_TO_YEAR_GROUP = [
    (0.0, 1.5, "Y1"),
    (1.5, 2.5, "Y2"),
    (2.5, 3.5, "Y3"),
    (3.5, 4.5, "Y4"),
    (4.5, 5.5, "Y5"),
    (5.5, 7.0, "Y6"),
]

# Year group → typical book band range
YEAR_GROUP_TO_BAND = {
    "Reception": ("Lilac", "Pink"),
    "Y1": ("Red", "Yellow"),
    "Y2": ("Blue", "Green"),
    "Y3": ("Orange", "Turquoise"),
    "Y4": ("Purple", "Gold"),
    "Y5": ("White", "Lime"),
    "Y6": ("Lime", "Lime+"),
}


def fk_grade_to_year_group(grade: float) -> str:
    for low, high, yg in FK_TO_YEAR_GROUP:
        if low <= grade < high:
            return yg
    if grade < 0:
        return "Y1"
    return "Y6"


def year_group_to_book_band(year_group: str) -> str:
    """Return the upper book band estimate for a year group."""
    bands = YEAR_GROUP_TO_BAND.get(year_group)
    if bands:
        return bands[1]
    return "Lime+"


def fk_grade_to_book_band(grade: float) -> str:
    return year_group_to_book_band(fk_grade_to_year_group(grade))


def book_band_colour(band: str) -> str:
    return BOOK_BAND_COLOURS.get(band, "#E5E7EB")
