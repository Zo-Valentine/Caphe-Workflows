"""
Main entry point for Railway/Railpack deployment
Railpack will auto-detect this and run: uvicorn main:app --host 0.0.0.0 --port $PORT
"""
from api_server import app

# Railpack will automatically run: uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}
# No need for additional configuration!

if __name__ == "__main__":
    import uvicorn
    import os
    
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
