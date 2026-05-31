import os

from flask import Flask, send_from_directory

from app.config import config
from app.extensions import cors, db, limiter


def create_app(config_name: str = "development") -> Flask:
    app = Flask(__name__, static_folder="static", static_url_path="")

    cfg = config[config_name]
    app.config.from_object(cfg)

    # Extensions
    cors.init_app(app, resources={r"/api/*": {"origins": app.config["CORS_ORIGINS"]}})
    limiter.init_app(app)

    if app.config.get("ENABLE_DB") and app.config.get("SQLALCHEMY_DATABASE_URI"):
        db.init_app(app)

    # Blueprints
    from app.api import api_bp
    app.register_blueprint(api_bp, url_prefix="/api")

    # Serve React SPA for all non-API routes (production)
    @app.route("/", defaults={"path": ""})
    @app.route("/<path:path>")
    def serve_frontend(path):
        static_folder = app.static_folder or "static"
        full_path = os.path.join(static_folder, path)
        if path and os.path.exists(full_path):
            return send_from_directory(static_folder, path)
        return send_from_directory(static_folder, "index.html")

    return app
