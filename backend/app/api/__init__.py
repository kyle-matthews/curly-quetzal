from flask import Blueprint

api_bp = Blueprint("api", __name__)

from app.api import analyse, adjust, questions, export  # noqa: E402, F401
