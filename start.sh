#!/bin/bash
# Railway start script for Caphe Workflows API

echo "🚀 Starting Caphe Workflows API..."
python run.py --port ${PORT:-8000} --host 0.0.0.0
