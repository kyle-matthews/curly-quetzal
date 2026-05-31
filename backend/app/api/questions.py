from flask import jsonify, request

from app.api import api_bp
from app.services import question_generator
from app.services.claude_client import ClaudeServiceError
from app.utils.validators import validate_questions_request


@api_bp.route("/questions", methods=["POST"])
def questions():
    data = request.get_json(silent=True) or {}
    errors = validate_questions_request(data)
    if errors:
        return jsonify({"errors": errors}), 400

    try:
        result = question_generator.generate(
            text=data["text"].strip(),
            domains=data["domains"],
            year_group=data.get("target_year_group", "Y4"),
            book_band=data.get("target_book_band", "Gold"),
        )
    except ClaudeServiceError as exc:
        return jsonify({"error": str(exc)}), 503

    return jsonify(result)
