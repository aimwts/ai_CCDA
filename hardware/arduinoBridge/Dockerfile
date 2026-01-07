# Use a lightweight Python base image
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Install system dependencies (serial, GPIO, etc.)
RUN apt-get update && apt-get install -y \
    python3-dev \
    build-essential \
    libffi-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements if you have one
COPY requirements.txt /app/requirements.txt

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy service code
COPY . /app

# Expose no ports (service pushes to backend)
# ENV variables can be added here if needed
# ENV BACKEND_URL=http://backend:3000

# Run the service
CMD ["python3", "main.py"]
