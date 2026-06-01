import json
import traceback

from flask import Response, jsonify, request
import logging

from app.api import api_bp

logger = logging.getLogger(__name__)
from app.services import rewriter
from app.services.claude_client import ClaudeServiceError
from app.utils.validators import validate_adjust_request


@api_bp.route("/adjust", methods=["POST"])
def adjust():
    data = request.get_json(silent=True) or {}
    errors = validate_adjust_request(data)
    if errors:
        return jsonify({"errors": errors}), 400

    text = data["text"].strip()
    profile = data["profile"]
    target = data["target"]

    # Resolve app-context values now, while we're inside the request context.
    # The generator runs outside the app context in Gunicorn sync workers.
    from app.services.claude_client import claude
    _ = claude.client  # initialise the Anthropic client while context is live
    model = claude.model  # cache model name; self.model reads current_app each time

    def generate():
        full_text = []
        try:
            for chunk in rewriter.stream_rewrite(text, target["type"], target["value"], model=model):
                full_text.append(chunk)
                yield f"data: {json.dumps({'chunk': chunk})}\n\n"

            rewritten = "".join(full_text)
            scores = rewriter.score_rewritten(rewritten, profile)
            yield f"data: {json.dumps({'event': 'done', 'rewritten_text': rewritten, 'scores': scores})}\n\n"
        except ClaudeServiceError as exc:
            yield f"data: {json.dumps({'event': 'error', 'message': str(exc)})}\n\n"
        except Exception as exc:
            logger.error("Unexpected error in adjust stream:\n%s", traceback.format_exc())
            yield f"data: {json.dumps({'event': 'error', 'message': 'Rewrite failed unexpectedly. Please try again.'})}\n\n"

    return Response(
        generate(),
        mimetype="text/event-stream",
        headers={
            "X-Accel-Buffering": "no",
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
        },
    )
