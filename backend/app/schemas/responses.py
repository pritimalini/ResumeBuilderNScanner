from pydantic import BaseModel, Field
from typing import List, Dict, Optional, Any
from enum import Enum
from datetime import datetime

class ResumeSection(str, Enum):
    """Resume section types"""
    CONTACT = "contact"
    SUMMARY = "summary"
    EDUCATION = "education"
    EXPERIENCE = "experience"
    SKILLS = "skills"
    PROJECTS = "projects"
    CERTIFICATIONS = "certifications"
    LANGUAGES = "languages"
    INTERESTS = "interests"
    REFERENCES = "references"
    CUSTOM = "custom"

class KeywordMatch(BaseModel):
    """Keyword match details"""
    keyword: str
    found: bool
    importance: float = Field(..., ge=0.0, le=1.0)
    context: Optional[str] = None
    section: Optional[ResumeSection] = None

class SectionScore(BaseModel):
    """Score for a specific resume section"""
    section: ResumeSection
    score: float = Field(..., ge=0.0, le=100.0)
    max_score: float = Field(..., ge=0.0, le=100.0)
    feedback: str
    keywords_found: List[str] = []
    keywords_missing: List[str] = []

class ResumeAnalysisResponse(BaseModel):
    """Response model for resume analysis"""
    resume_id: str
    filename: str
    content_type: str
    file_size: int
    upload_time: datetime
    sections_found: List[ResumeSection]
    word_count: int
    parsed_content: Dict[str, Any]
    status: str = "success"

class ScoringResponse(BaseModel):
    """Response model for resume scoring"""
    resume_id: str
    job_id: str
    overall_score: float = Field(..., ge=0.0, le=100.0)
    section_scores: List[SectionScore]
    keyword_matches: List[KeywordMatch]
    content_match_score: float = Field(..., ge=0.0, le=40.0)
    format_compatibility_score: float = Field(..., ge=0.0, le=25.0)
    section_evaluation_score: float = Field(..., ge=0.0, le=35.0)
    timestamp: datetime
    status: str = "success"

class RecommendationItem(BaseModel):
    """Individual recommendation item"""
    section: ResumeSection
    recommendation: str
    impact: float = Field(..., ge=0.0, le=1.0)
    implementation_difficulty: str
    before_example: Optional[str] = None
    after_example: Optional[str] = None

class RecommendationResponse(BaseModel):
    """Response model for resume recommendations"""
    resume_id: str
    job_id: str
    recommendations: List[RecommendationItem]
    potential_score_increase: float
    timestamp: datetime
    status: str = "success"

class ResumeGenerationResponse(BaseModel):
    """Response model for resume generation"""
    resume_id: str
    generated_file_url: str
    template_used: str
    ats_score: float = Field(..., ge=0.0, le=100.0)
    generation_time: datetime
    sections_included: List[ResumeSection]
    target_job_match: Optional[float] = None
    download_links: Dict[str, str]
    status: str = "success"
