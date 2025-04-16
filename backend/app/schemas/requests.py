from pydantic import BaseModel, Field
from typing import List, Dict, Optional, Any
from enum import Enum
from datetime import date

class JobDescriptionRequest(BaseModel):
    """Request model for job description processing"""
    description: str = Field(..., description="The job description text")
    title: Optional[str] = Field(None, description="Job title")
    company: Optional[str] = Field(None, description="Company name")
    url: Optional[str] = Field(None, description="Job posting URL")

class EducationItem(BaseModel):
    """Education item for resume builder"""
    institution: str
    degree: str
    field_of_study: str
    start_date: date
    end_date: Optional[date] = None
    current: bool = False
    description: Optional[str] = None
    gpa: Optional[float] = None
    location: Optional[str] = None

class ExperienceItem(BaseModel):
    """Work experience item for resume builder"""
    company: str
    position: str
    start_date: date
    end_date: Optional[date] = None
    current: bool = False
    description: List[str]
    location: Optional[str] = None

class SkillLevel(str, Enum):
    """Skill proficiency level"""
    BEGINNER = "beginner"
    INTERMEDIATE = "intermediate"
    ADVANCED = "advanced"
    EXPERT = "expert"

class SkillItem(BaseModel):
    """Skill item for resume builder"""
    name: str
    level: Optional[SkillLevel] = None
    years: Optional[int] = None

class ProjectItem(BaseModel):
    """Project item for resume builder"""
    name: str
    description: str
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    current: bool = False
    url: Optional[str] = None
    technologies: List[str] = []

class CertificationItem(BaseModel):
    """Certification item for resume builder"""
    name: str
    issuer: str
    date_obtained: date
    expiry_date: Optional[date] = None
    url: Optional[str] = None
    description: Optional[str] = None

class ContactInfo(BaseModel):
    """Contact information for resume builder"""
    name: str
    email: str
    phone: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    zip_code: Optional[str] = None
    country: Optional[str] = None
    linkedin: Optional[str] = None
    github: Optional[str] = None
    website: Optional[str] = None
    other_links: Dict[str, str] = {}

class ResumeBuilderRequest(BaseModel):
    """Request model for resume builder"""
    contact_info: ContactInfo
    summary: Optional[str] = None
    education: List[EducationItem] = []
    experience: List[ExperienceItem] = []
    skills: List[SkillItem] = []
    projects: List[ProjectItem] = []
    certifications: List[CertificationItem] = []
    languages: List[str] = []
    interests: List[str] = []
    references: Optional[str] = "Available upon request"
    template_id: Optional[str] = "modern"
    target_job_description: Optional[str] = None
    custom_sections: Dict[str, List[str]] = {}
