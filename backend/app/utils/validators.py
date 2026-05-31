from flask import current_app

VALID_PROFILES = {"early", "developing", "fluent"}
VALID_DOMAINS = {"2a", "2b", "2c", "2d", "2e", "2f", "2g"}
VALID_TARGET_TYPES = {"year_group", "book_band"}


def validate_analyse_request(data: dict) -> list[str]:
    errors = []
    text = data.get("text", "")
    if not text or not text.strip():
        errors.append("text is required")
    elif len(text) > current_app.config["MAX_TEXT_LENGTH"]:
        errors.append(f"text exceeds maximum length of {current_app.config['MAX_TEXT_LENGTH']} characters")
    if data.get("profile") not in VALID_PROFILES:
        errors.append(f"profile must be one of: {', '.join(VALID_PROFILES)}")
    return errors


def validate_adjust_request(data: dict) -> list[str]:
    errors = errors_from_analyse_base(data)
    target = data.get("target", {})
    if not isinstance(target, dict):
        errors.append("target must be an object")
    else:
        if target.get("type") not in VALID_TARGET_TYPES:
            errors.append(f"target.type must be one of: {', '.join(VALID_TARGET_TYPES)}")
        if not target.get("value"):
            errors.append("target.value is required")
    return errors


def validate_questions_request(data: dict) -> list[str]:
    errors = errors_from_analyse_base(data)
    domains = data.get("domains", [])
    if not isinstance(domains, list) or not domains:
        errors.append("domains must be a non-empty list")
    else:
        invalid = [d for d in domains if d not in VALID_DOMAINS]
        if invalid:
            errors.append(f"invalid domains: {', '.join(invalid)}")
    return errors


def errors_from_analyse_base(data: dict) -> list[str]:
    errors = []
    text = data.get("text", "")
    if not text or not text.strip():
        errors.append("text is required")
    elif len(text) > current_app.config["MAX_TEXT_LENGTH"]:
        errors.append(f"text exceeds maximum length of {current_app.config['MAX_TEXT_LENGTH']} characters")
    if data.get("profile") not in VALID_PROFILES:
        errors.append(f"profile must be one of: {', '.join(VALID_PROFILES)}")
    return errors
