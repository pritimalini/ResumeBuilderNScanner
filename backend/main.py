from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Depends, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import uvicorn
import os
import logging
from datetime import datetime

# Import our application modules
from app.core.config import settings
from app.api.routes import router as api_router
from app.core.logging import setup_logging

# Initialize FastAPI app
app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Resume ATS Optimizer API",
    version="1.0.0",
)

# Setup CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Setup logging
setup_logging()
logger = logging.getLogger(__name__)

# Include API router
app.include_router(api_router, prefix=settings.API_PREFIX)

# Mount static files for uploads and generated resumes
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=settings.UPLOAD_DIR), name="uploads")

# Health check endpoint
@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "status": "online",
        "service": settings.PROJECT_NAME,
        "version": "1.0.0",
        "timestamp": datetime.now().isoformat()
    }

# Download endpoint for generated resumes
@app.get("/api/download/resume/{resume_id}/{format}")
async def download_resume(resume_id: str, format: str):
    """
    Download a generated resume in the specified format
    
    Args:
        resume_id: The resume ID
        format: The format to download (pdf, docx, html, txt)
    """
    try:
        # Validate format
        if format not in ["pdf", "docx", "html", "txt"]:
            raise HTTPException(status_code=400, detail=f"Unsupported format: {format}")
        
        # Construct file path
        file_path = os.path.join(settings.UPLOAD_DIR, "generated", resume_id, f"resume_{resume_id}.{format}")
        
        # Check if file exists
        if not os.path.exists(file_path):
            raise HTTPException(status_code=404, detail=f"Resume not found in {format} format")
        
        # Set content type based on format
        content_types = {
            "pdf": "application/pdf",
            "docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "html": "text/html",
            "txt": "text/plain"
        }
        
        # Return file response
        return FileResponse(
            path=file_path,
            filename=f"resume.{format}",
            media_type=content_types[format]
        )
    except Exception as e:
        logger.error(f"Error downloading resume: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error downloading resume: {str(e)}")

if __name__ == "__main__":
    # Run the application
    uvicorn.run(
        "main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG_MODE
    )

if __name__ == "__main__":
    # Run the application
    uvicorn.run(
        "main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG_MODE
    )
