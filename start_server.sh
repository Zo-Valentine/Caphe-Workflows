#!/bin/bash
# Caphe Workflows Enhanced Server Startup Script

echo "🚀 Starting Caphe Workflows Enhanced Server..."
echo "=================================="

cd "/Users/Apple/Caphe Workflows/frameworks/caphe-workflows"

# Check if virtual environment exists
if [ -d "venv" ]; then
    echo "📦 Activating virtual environment..."
    source venv/bin/activate
elif [ -d "../caphe.env" ]; then
    echo "📦 Activating shared virtual environment..."
    source ../caphe.env/bin/activate
fi

# Install dependencies if needed
if [ ! -f ".deps_installed" ]; then
    echo "📥 Installing dependencies..."
    python3 -m pip install -r requirements.txt
    touch .deps_installed
fi

# Check database
if [ ! -f "workflows.db" ] || [ ! -s "workflows.db" ]; then
    echo "💾 Initializing database..."
    python3 -c "from workflow_db import WorkflowDatabase; WorkflowDatabase().index_all_workflows()"
fi

# Generate search index if needed
if [ ! -f "docs/api/search-index.json" ]; then
    echo "🔍 Generating search index..."
    python3 scripts/generate_search_index.py
fi

echo "✅ Starting Caphè Technologies Workflows server on http://localhost:8000"
echo "📊 Admin interface: http://localhost:8000/admin"
echo "🔍 API docs: http://localhost:8000/docs"
echo ""
echo "Press Ctrl+C to stop the server"

python3 run.py "$@"
