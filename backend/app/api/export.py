from flask import Response, jsonify, request

from app.api import api_bp
from app.services import pdf_builder


@api_bp.route("/export/pdf", methods=["POST"])
def export_pdf():
    data = request.get_json(silent=True) or {}
    original_text = data.get("original_text", "")
    if not original_text:
        return jsonify({"error": "original_text is required"}), 400

    try:
        pdf_bytes = pdf_builder.build(
            title=data.get("title", ""),
            original_text=original_text,
            analysis=data.get("analysis", {}),
            rewritten_text=data.get("rewritten_text"),
            rewritten_scores=data.get("rewritten_scores"),
            questions=data.get("questions"),
        )
    except Exception as exc:
        return jsonify({"error": f"PDF generation failed: {exc}"}), 500

    return Response(
        pdf_bytes,
        mimetype="application/pdf",
        headers={"Content-Disposition": "attachment; filename=export.pdf"},
    )
