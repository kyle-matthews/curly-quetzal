"""
PDF generation via weasyprint.
Renders an HTML template to PDF bytes; no server-side state required —
the caller passes the full document payload.

weasyprint CSS notes:
- Do not use CSS custom properties (vars) — unsupported
- Do not use CSS Grid — use flexbox or table layout instead
- Bundle fonts in the image rather than loading from Google Fonts
"""

import io
from string import Template

import weasyprint


_HTML_TEMPLATE = Template("""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<style>
  body { font-family: Liberation Serif, serif; font-size: 11pt; color: #1f2937; margin: 20mm; }
  h1 { font-size: 18pt; color: #92400e; margin-bottom: 4mm; }
  h2 { font-size: 13pt; color: #78350f; border-bottom: 1px solid #d97706; padding-bottom: 2mm; margin-top: 8mm; }
  .meta { color: #6b7280; font-size: 9pt; margin-bottom: 6mm; }
  .scores { width: 100%; border-collapse: collapse; margin-bottom: 6mm; }
  .scores th { background: #fef3c7; text-align: left; padding: 2mm 3mm; font-size: 9pt; }
  .scores td { padding: 2mm 3mm; font-size: 9pt; border-bottom: 1px solid #f3f4f6; }
  .text-block { background: #f9fafb; border-left: 3px solid #d97706; padding: 3mm 4mm; font-size: 10pt; line-height: 1.6; white-space: pre-wrap; margin-bottom: 6mm; }
  .question { margin-bottom: 5mm; }
  .question .q { font-weight: bold; }
  .question .domain-tag { display: inline-block; background: #fef3c7; color: #92400e; font-size: 8pt; padding: 0.5mm 2mm; border-radius: 2mm; margin-bottom: 1mm; }
  .question .answer { color: #374151; font-style: italic; margin-top: 1mm; }
  .vocab { font-size: 9pt; }
  .vocab .tier2 { color: #1d4ed8; }
  .vocab .tier3 { color: #7c3aed; }
</style>
</head>
<body>
<h1>$title</h1>
<p class="meta">$meta</p>

$original_section

$scores_section

$rewrite_section

$questions_section
</body>
</html>""")


def build(
    title: str,
    original_text: str,
    analysis: dict,
    rewritten_text: str | None = None,
    rewritten_scores: dict | None = None,
    questions: list[dict] | None = None,
) -> bytes:
    """Return PDF bytes for the export payload."""
    html = _HTML_TEMPLATE.substitute(
        title=_esc(title or "Readability Export"),
        meta=_meta_line(analysis),
        original_section=_original_section(original_text),
        scores_section=_scores_section(analysis),
        rewrite_section=_rewrite_section(rewritten_text, rewritten_scores),
        questions_section=_questions_section(questions),
    )
    pdf_bytes = io.BytesIO()
    weasyprint.HTML(string=html).write_pdf(pdf_bytes)
    return pdf_bytes.getvalue()


def _esc(s: str) -> str:
    return (s or "").replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")


def _meta_line(analysis: dict) -> str:
    profile = analysis.get("profile", "")
    if profile == "early":
        band = analysis.get("book_band", "")
        phase = analysis.get("phonics_phase", "")
        return f"Profile: Early reader | Book band: {_esc(band)} | Phonics phase: {phase}"
    yg = analysis.get("year_group_estimate", "")
    band = analysis.get("book_band_estimate", "")
    fk = analysis.get("flesch_kincaid_grade", "")
    return f"Profile: {_esc(profile).capitalize()} | Year group estimate: {yg} | Book band: {_esc(band)} | F-K grade: {fk}"


def _original_section(text: str) -> str:
    return f'<h2>Original Text</h2><div class="text-block">{_esc(text)}</div>'


def _scores_section(analysis: dict) -> str:
    profile = analysis.get("profile", "")
    if profile == "early":
        rows = [
            ("Book band", analysis.get("book_band", "")),
            ("Phonics phase", analysis.get("phonics_phase", "")),
            ("Decodability", f'{analysis.get("decodability_pct", "")}%'),
            ("Word count", analysis.get("raw_text_stats", {}).get("word_count", "")),
        ]
    else:
        rows = [
            ("Flesch-Kincaid grade", analysis.get("flesch_kincaid_grade", "")),
            ("Flesch reading ease", analysis.get("flesch_reading_ease", "")),
            ("Gunning Fog", analysis.get("gunning_fog", "")),
            ("SMOG index", analysis.get("smog_index", "")),
            ("Year group estimate", analysis.get("year_group_estimate", "")),
            ("Book band estimate", analysis.get("book_band_estimate", "")),
        ]
    header = "<tr><th>Metric</th><th>Score</th></tr>"
    body = "".join(f"<tr><td>{_esc(str(k))}</td><td>{_esc(str(v))}</td></tr>" for k, v in rows)
    return f'<h2>Readability Scores</h2><table class="scores">{header}{body}</table>'


def _rewrite_section(text: str | None, scores: dict | None) -> str:
    if not text:
        return ""
    html = f'<h2>Rewritten Text</h2><div class="text-block">{_esc(text)}</div>'
    if scores:
        html += _scores_section(scores).replace("<h2>Readability Scores</h2>", "<h2>Rewritten Text Scores</h2>")
    return html


def _questions_section(questions: list[dict] | None) -> str:
    if not questions:
        return ""
    items = ""
    for q in questions:
        domain = _esc(q.get("domain", ""))
        label = _esc(q.get("domain_label", ""))
        question = _esc(q.get("question", ""))
        answer = _esc(q.get("model_answer", ""))
        items += (
            f'<div class="question">'
            f'<span class="domain-tag">{domain} — {label}</span><br>'
            f'<span class="q">{question}</span>'
            f'<p class="answer">Model answer: {answer}</p>'
            f"</div>"
        )
    return f"<h2>Comprehension Questions</h2>{items}"
