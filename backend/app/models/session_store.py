"""
SQLAlchemy ORM models — inactive in MVP (ENABLE_DB=false).
Tables designed to persist analysis sessions, rewrites, and question sets
for a future "save to library" feature.

Activate by setting ENABLE_DB=true and running: flask db upgrade
"""

import uuid

from sqlalchemy import ARRAY, Column, DateTime, ForeignKey, String, Text, func
from sqlalchemy.dialects.postgresql import JSONB, UUID

from app.extensions import db


class Session(db.Model):
    __tablename__ = "sessions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    profile = Column(String(20), nullable=False)
    original_text = Column(Text, nullable=False)
    ip_hash = Column(String(64))
    expires_at = Column(DateTime(timezone=True))

    analyses = db.relationship("Analysis", back_populates="session", cascade="all, delete-orphan")
    rewrites = db.relationship("Rewrite", back_populates="session", cascade="all, delete-orphan")


class Analysis(db.Model):
    __tablename__ = "analyses"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    session_id = Column(UUID(as_uuid=True), ForeignKey("sessions.id", ondelete="CASCADE"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    score_data = Column(JSONB, nullable=False)
    model_used = Column(String(60))

    session = db.relationship("Session", back_populates="analyses")


class Rewrite(db.Model):
    __tablename__ = "rewrites"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    session_id = Column(UUID(as_uuid=True), ForeignKey("sessions.id", ondelete="CASCADE"))
    analysis_id = Column(UUID(as_uuid=True), ForeignKey("analyses.id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    target_type = Column(String(20))
    target_value = Column(String(20))
    rewritten_text = Column(Text)
    score_data = Column(JSONB)

    session = db.relationship("Session", back_populates="rewrites")
    question_sets = db.relationship("QuestionSet", back_populates="rewrite", cascade="all, delete-orphan")


class QuestionSet(db.Model):
    __tablename__ = "question_sets"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    session_id = Column(UUID(as_uuid=True), ForeignKey("sessions.id", ondelete="CASCADE"))
    rewrite_id = Column(UUID(as_uuid=True), ForeignKey("rewrites.id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    domains = Column(ARRAY(String))
    questions = Column(JSONB, nullable=False)

    rewrite = db.relationship("Rewrite", back_populates="question_sets")
