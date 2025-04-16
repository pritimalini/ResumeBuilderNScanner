from fastapi import APIRouter, UploadFile, File, Form, HTTPException, BackgroundTasks
from typing import List, Optional, Dict, Any
import logging

from app.services.resume_processor import ResumeProcessor
from app.services.job_processor import JobProcessor
from app.services.score_calculator import ScoreCalculator
from app.services.recommendation_engine import RecommendationEngine
from app.services.resume_generator import ResumeGenerator
from app.schemas.requests import JobDescriptionRequest, ResumeBuilderRequest
from app.schemas.responses import (
    ResumeAnalysisResponse, 
    ScoringResponse, 
    RecommendationResponse,
    ResumeGenerationResponse
)

# Import settings routes
from app.api.settings_routes import router as settings_router

# Initialize router
router = APIRouter()
logger = logging.getLogger(__name__)

# Include settings routes
router.include_router(settings_router, prefix="/settings", tags=["settings"])

@router.post("/analyze-resume", response_model=ResumeAnalysisResponse)
async def analyze_resume(
    file: UploadFile = File(...),
    background_tasks: BackgroundTasks = None
):
    """
    Upload and analyze a resume file
    """
    try:
        # Initialize resume processor service
        resume_processor = ResumeProcessor()
        
        # Process the resume
        result = await resume_processor.process(file)
        
        return result
    except Exception as e:
        logger.error(f"Error analyzing resume: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error analyzing resume: {str(e)}")

@router.post("/process-job-description", response_model=Dict[str, Any])
async def process_job_description(
    job_data: JobDescriptionRequest
):
    """
    Process a job description
    """
    try:
        # Initialize job processor service
        job_processor = JobProcessor()
        
        # Process the job description
        result = await job_processor.process(job_data.description)
        
        return result
    except Exception as e:
        logger.error(f"Error processing job description: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error processing job description: {str(e)}")

@router.post("/calculate-score", response_model=ScoringResponse)
async def calculate_score(
    resume_id: str = Form(...),
    job_id: str = Form(...)
):
    """
    Calculate ATS score by comparing resume and job description
    """
    try:
        # Initialize score calculator service
        score_calculator = ScoreCalculator()
        
        # Calculate the score
        result = await score_calculator.calculate(resume_id, job_id)
        
        return result
    except Exception as e:
        logger.error(f"Error calculating score: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error calculating score: {str(e)}")

@router.post("/get-recommendations", response_model=RecommendationResponse)
async def get_recommendations(
    resume_id: str = Form(...),
    job_id: str = Form(...)
):
    """
    Get recommendations for improving resume ATS score
    """
    try:
        # Initialize recommendation engine service
        recommendation_engine = RecommendationEngine()
        
        # Get recommendations
        result = await recommendation_engine.generate(resume_id, job_id)
        
        return result
    except Exception as e:
        logger.error(f"Error generating recommendations: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error generating recommendations: {str(e)}")

@router.post("/build-resume", response_model=ResumeGenerationResponse)
async def build_resume(
    resume_data: ResumeBuilderRequest
):
    """
    Build a new ATS-optimized resume
    """
    try:
        # Initialize resume generator service
        resume_generator = ResumeGenerator()
        
        # Generate the resume
        result = await resume_generator.generate(resume_data)
        
        return result
    except Exception as e:
        logger.error(f"Error building resume: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error building resume: {str(e)}")

@router.get("/templates")
async def get_templates():
    """
    Get available resume templates
    """
    try:
        # In a real application, this would fetch templates from a database or file system
        templates = [
            {
                "id": "professional",
                "name": "Professional",
                "description": "A clean, traditional layout that works well for most industries.",
                "preview_url": "/templates/professional.png",
                "features": ["Clean layout", "Traditional format", "ATS-friendly", "Suitable for most industries"]
            },
            {
                "id": "modern",
                "name": "Modern",
                "description": "A contemporary design with a touch of color and modern typography.",
                "preview_url": "/templates/modern.png",
                "features": ["Modern design", "Subtle color accents", "ATS-friendly", "Good for creative fields"]
            },
            {
                "id": "executive",
                "name": "Executive",
                "description": "An elegant, sophisticated layout for senior professionals.",
                "preview_url": "/templates/executive.png",
                "features": ["Sophisticated layout", "Emphasis on achievements", "ATS-friendly", "Ideal for executives"]
            },
            {
                "id": "minimalist",
                "name": "Minimalist",
                "description": "A simple, clean design that focuses on content over style.",
                "preview_url": "/templates/minimalist.png",
                "features": ["Minimalist design", "Maximum content space", "Highly ATS-friendly", "Works for all industries"]
            },
            {
                "id": "technical",
                "name": "Technical",
                "description": "Designed specifically for technical roles with space for skills and projects.",
                "preview_url": "/templates/technical.png",
                "features": ["Technical focus", "Skills emphasis", "Project showcase", "Perfect for IT and engineering"]
            }
        ]
        
        return {"templates": templates}
    except Exception as e:
        logger.error(f"Error fetching templates: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error fetching templates: {str(e)}")

@router.get("/download/resume/{resume_id}/{format}")
async def download_resume(resume_id: str, format: str):
    """
    Download a generated resume in the specified format
    """
    try:
        # Validate format
        if format not in ["pdf", "docx"]:
            raise HTTPException(status_code=400, detail="Invalid format. Supported formats: pdf, docx")
        
        # Initialize resume generator service
        resume_generator = ResumeGenerator()
        
        # Get the resume file
        file_path, file_name = await resume_generator.get_resume_file(resume_id, format)
        
        # In a real application, this would return the actual file
        # For this implementation, we'll return a success message
        return {"message": f"Resume {resume_id} downloaded in {format} format", "file_name": file_name}
    except Exception as e:
        logger.error(f"Error downloading resume: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error downloading resume: {str(e)}")
