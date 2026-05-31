# ── Stage 1: Build React frontend ─────────────────────────────────────────────
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# ── Stage 2: Python runtime ────────────────────────────────────────────────────
FROM python:3.12-slim AS backend

# weasyprint system deps (Pango, Cairo for PDF rendering)
RUN apt-get update && apt-get install -y --no-install-recommends \
    libpango-1.0-0 \
    libpangocairo-1.0-0 \
    libcairo2 \
    libgdk-pixbuf-xlib-2.0-0 \
    libffi-dev \
    shared-mime-info \
    fonts-liberation \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY backend/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY backend/ ./backend/

# Copy compiled frontend into Flask static folder
COPY --from=frontend-builder /app/frontend/dist ./backend/app/static/

ENV FLASK_APP=backend/wsgi.py
ENV FLASK_ENV=production
ENV PYTHONPATH=/app

EXPOSE 8080

# 2 sync workers; 120s timeout covers the longest synchronous Claude calls
CMD ["gunicorn", "--bind", "0.0.0.0:8080", "--workers", "2", "--timeout", "120", "--chdir", "/app/backend", "wsgi:application"]
