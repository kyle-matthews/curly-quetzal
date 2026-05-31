import os


class BaseConfig:
    SECRET_KEY = os.environ.get("FLASK_SECRET_KEY", "dev-secret-key")
    ANTHROPIC_API_KEY = os.environ.get("ANTHROPIC_API_KEY", "")
    CLAUDE_MODEL = os.environ.get("CLAUDE_MODEL", "claude-sonnet-4-6")
    CORS_ORIGINS = os.environ.get("CORS_ORIGINS", "http://localhost:5173").split(",")
    RATELIMIT_DEFAULT = os.environ.get("RATELIMIT_DEFAULT", "60 per minute")
    RATELIMIT_STORAGE_URI = os.environ.get("RATELIMIT_STORAGE_URI", "memory://")
    MAX_TEXT_LENGTH = 10_000
    ENABLE_DB = os.environ.get("ENABLE_DB", "false").lower() == "true"
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    @property
    def SQLALCHEMY_DATABASE_URI(self):
        return os.environ.get("DATABASE_URL") if self.ENABLE_DB else None


class DevelopmentConfig(BaseConfig):
    DEBUG = True


class ProductionConfig(BaseConfig):
    DEBUG = False

    @property
    def SQLALCHEMY_DATABASE_URI(self):
        uri = os.environ.get("DATABASE_URL")
        if self.ENABLE_DB and not uri:
            raise RuntimeError("DATABASE_URL must be set in production when ENABLE_DB=true")
        return uri


class TestingConfig(BaseConfig):
    TESTING = True
    SQLALCHEMY_DATABASE_URI = "sqlite:///:memory:"
    RATELIMIT_ENABLED = False
    ANTHROPIC_API_KEY = "test-key"


config = {
    "development": DevelopmentConfig,
    "production": ProductionConfig,
    "testing": TestingConfig,
}
