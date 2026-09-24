FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

RUN apt-get update && apt-get install -y \
    gcc \
    portaudio19-dev \
 && rm -rf /var/lib/apt/lists/*
 
WORKDIR /app

COPY backend_service/requirements.txt /app/

RUN pip install --no-cache-dir -r requirements.txt

COPY . /app

WORKDIR /app/backend_service

EXPOSE 8000

CMD ["daphne", "-b", "0.0.0.0", "-p", "8000", "backend_service.asgi:application"]