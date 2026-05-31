import pytest

from app import create_app


@pytest.fixture()
def app():
    app = create_app("testing")
    yield app


@pytest.fixture()
def client(app):
    return app.test_client()


SAMPLE_TEXT_SHORT = "The cat sat on the mat. It was a big fat cat."

SAMPLE_TEXT_MEDIUM = (
    "The water cycle is the continuous movement of water on Earth. "
    "Water evaporates from oceans and lakes when the sun heats it. "
    "The water vapour rises into the atmosphere and cools, forming clouds. "
    "When clouds become heavy with water, precipitation falls as rain or snow. "
    "The water flows into rivers and streams, eventually returning to the sea."
)
