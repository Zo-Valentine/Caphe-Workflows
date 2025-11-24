#!/bin/bash
# Railway start script for Caphe Workflows API

# Get port from Railway or default to 8000
export PORT=${PORT:-8000}

echo "🚀 Starting Caphe Workflows on 0.0.0.0:$PORT"
echo "Port value: $PORT"

# Start with explicit host and port (variable will be expanded)
python run.py --host 0.0.0.0 --port "$PORT"
