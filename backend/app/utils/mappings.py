"""
Mapping tables: Flesch-Kincaid grade → UK year group → book band.

Book bands follow the Book Trust / BookBand colour scheme used in most UK primaries.
FK grade thresholds are approximate and should be used alongside other metrics.
"""

# Book band ordered list (easiest → hardest)
# Levels 0–17 per the UK Book Trust / BookBand scheme.
BOOK_BANDS = [
    "Lilac",      # 0  – Reception emerging
    "Pink",       # 1  – Reception expected
    "Red",        # 2  – Y1 emerging / Reception expected
    "Yellow",     # 3  – Y1 emerging / Reception expected
    "Blue",       # 4  – Y1 expected
    "Green",      # 5  – Y1 expected
    "Orange",     # 6  – Y1/Y2 boundary
    "Turquoise",  # 7  – Y2 expected
    "Purple",     # 8  – Y2 expected
    "Gold",       # 9  – Y2 expected
    "White",      # 10 – Y2/Y3 boundary
    "Lime",       # 11 – Y3 emerging
    "Brown",      # 12 – Y3 expected
    "Grey",       # 13 – Y4 expected
    "Dark Blue",  # 14 – Y5 expected
    "Dark Red",   # 15 – Y6 expected
    "Black",      # 16 – Y6 confident exceeding
    "Black Plus", # 17 – Y6 super confident exceeding
]

# Approximate hex colours for each band (for UI display)
BOOK_BAND_COLOURS = {
    "Lilac":      "#D8B4FE",
    "Pink":       "#FBCFE8",
    "Red":        "#FCA5A5",
    "Yellow":     "#FDE68A",
    "Blue":       "#93C5FD",
    "Green":      "#86EFAC",
    "Orange":     "#FDBA74",
    "Turquoise":  "#5EEAD4",
    "Purple":     "#C084FC",
    "Gold":       "#FCD34D",
    "White":      "#F9FAFB",
    "Lime":       "#BEF264",
    "Brown":      "#A57C52",
    "Grey":       "#9CA3AF",
    "Dark Blue":  "#1E40AF",
    "Dark Red":   "#991B1B",
    "Black":      "#374151",
    "Black Plus": "#111827",
}

# UK year groups in order
YEAR_GROUPS = ["Reception", "Y1", "Y2", "Y3", "Y4", "Y5", "Y6"]

# Approximate FK grade → year group
FK_TO_YEAR_GROUP = [
    (0.0, 0.5, "Reception"),
    (0.5, 1.5, "Y1"),
    (1.5, 2.5, "Y2"),
    (2.5, 3.5, "Y3"),
    (3.5, 4.5, "Y4"),
    (4.5, 5.5, "Y5"),
    (5.5, 7.0, "Y6"),
]

# Year group → typical book band range (lower, upper) based on "Expected" column
# from the UK Book Trust band chart.
YEAR_GROUP_TO_BAND = {
    "Reception": ("Lilac",     "Yellow"),    # Levels 0–3
    "Y1":        ("Blue",      "Orange"),    # Levels 4–6
    "Y2":        ("Turquoise", "White"),     # Levels 7–10
    "Y3":        ("Lime",      "Brown"),     # Levels 11–12
    "Y4":        ("Grey",      "Grey"),      # Level 13
    "Y5":        ("Dark Blue", "Dark Blue"), # Level 14
    "Y6":        ("Dark Red",  "Black Plus"),# Levels 15–17
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
