from flask import jsonify, request

from app.api import api_bp
from app.services import early_reader, nc_classifier, readability, vocabulary
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
            # Textstat metrics first (fast, no API call)
            scores = readability.analyse(text)

            # NC classifier overrides the FK-derived year group and band with
            # Claude's curriculum-grounded assessment, then adds a rationale.
            nc = nc_classifier.classify(text, scores)

            vocab = vocabulary.analyse(text)
            result = {
                "profile": profile,
                **scores,
                "year_group_estimate": nc["year_group_estimate"],
                "book_band_estimate": nc["book_band_estimate"],
                "book_band_colour": nc["book_band_colour"],
                "nc_rationale": nc.get("nc_rationale", ""),
                "warnings": list({*scores.get("warnings", []), *nc.get("warnings", [])}),
                "vocabulary": vocab,
            }
    except ClaudeServiceError as exc:
        return jsonify({"error": str(exc)}), 503

    return jsonify(result)
