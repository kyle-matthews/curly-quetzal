from flask import jsonify, request

from app.api import api_bp
from app.services import early_reader, readability, vocabulary
from app.services.claude_client import ClaudeServiceError
from app.utils.validators import validate_analyse_request


@api_bp.route("/analyse", methods=["POST"])
def analyse():
    data = request.get_json(silent=True) or {}
    errors = validate_analyse_request(data)
    if errors:
        return jsonify({"errors": errors}), 400

    text = data["text"].strip()
    profile = data["profile"]

    try:
        if profile == "early":
            result = early_reader.analyse(text, profile)
        else:
            scores = readability.analyse(text)
            vocab = vocabulary.analyse(text)
            result = {
                "profile": profile,
                **scores,
                "vocabulary": vocab,
            }
    except ClaudeServiceError as exc:
        return jsonify({"error": str(exc)}), 503

    return jsonify(result)
