import os
import uuid
import logging
from typing import Dict, Any, List
from datetime import datetime
import json

from app.core.config import settings
from app.schemas.requests import ResumeBuilderRequest
from app.schemas.responses import ResumeGenerationResponse, ResumeSection
from app.agents.builder_agent import ResumeBuilderAgent

logger = logging.getLogger(__name__)

class ResumeGenerator:
    """Service for generating ATS-optimized resumes"""
    
    def __init__(self):
        self.builder_agent = ResumeBuilderAgent()
    
    async def generate(self, resume_data: ResumeBuilderRequest) -> ResumeGenerationResponse:
        """
        Generate an ATS-optimized resume
        
        Args:
            resume_data: The resume builder request data
            
        Returns:
            ResumeGenerationResponse: The generation results
        """
        try:
            # Generate a unique ID for this resume
            resume_id = str(uuid.uuid4())
            
            # Create a directory for this generated resume
            generated_dir = os.path.join(settings.UPLOAD_DIR, "generated", resume_id)
            os.makedirs(generated_dir, exist_ok=True)
            
            # Generate the resume using the builder agent
            generation_result = await self.builder_agent.build_resume(resume_data)
            
            # Save the generated resume in different formats
            file_paths = {}
            
            # Save as DOCX
            docx_path = os.path.join(generated_dir, f"resume_{resume_id}.docx")
            with open(docx_path, 'wb') as f:
                f.write(generation_result["docx_content"])
            file_paths["docx"] = f"/api/download/resume/{resume_id}/docx"
            
            # Save as PDF
            pdf_path = os.path.join(generated_dir, f"resume_{resume_id}.pdf")
            with open(pdf_path, 'wb') as f:
                f.write(generation_result["pdf_content"])
            file_paths["pdf"] = f"/api/download/resume/{resume_id}/pdf"
            
            # Save as HTML
            html_path = os.path.join(generated_dir, f"resume_{resume_id}.html")
            with open(html_path, 'w') as f:
                f.write(generation_result["html_content"])
            file_paths["html"] = f"/api/download/resume/{resume_id}/html"
            
            # Save as plain text
            txt_path = os.path.join(generated_dir, f"resume_{resume_id}.txt")
            with open(txt_path, 'w') as f:
                f.write(generation_result["text_content"])
            file_paths["txt"] = f"/api/download/resume/{resume_id}/txt"
            
            # Save metadata
            metadata = {
                "resume_id": resume_id,
                "template_used": resume_data.template_id or "modern",
                "ats_score": generation_result["ats_score"],
                "generation_time": datetime.now().isoformat(),
                "sections_included": [section.value for section in self._get_sections_included(resume_data)],
                "target_job_match": generation_result.get("target_job_match")
            }
            
            metadata_path = os.path.join(generated_dir, "metadata.json")
            with open(metadata_path, 'w') as f:
                json.dump(metadata, f, indent=2)
            
            # Create response
            response = ResumeGenerationResponse(
                resume_id=resume_id,
                generated_file_url=f"/api/view/resume/{resume_id}",
                template_used=resume_data.template_id or "modern",
                ats_score=generation_result["ats_score"],
                generation_time=datetime.now(),
                sections_included=self._get_sections_included(resume_data),
                target_job_match=generation_result.get("target_job_match"),
                download_links=file_paths
            )
            
            return response
            
        except Exception as e:
            logger.error(f"Error generating resume: {str(e)}")
            raise
    
    def _get_sections_included(self, resume_data: ResumeBuilderRequest) -> List[ResumeSection]:
        """
        Determine which sections are included in the resume
        
        Args:
            resume_data: The resume builder request data
            
        Returns:
            List[ResumeSection]: List of included resume sections
        """
        sections = [ResumeSection.CONTACT]
        
        section_map = {
            "summary": ResumeSection.SUMMARY,
            "work_experience": ResumeSection.EXPERIENCE,
            "education": ResumeSection.EDUCATION,
            "skills": ResumeSection.SKILLS,
            "certifications": ResumeSection.CERTIFICATIONS,
            "projects": ResumeSection.PROJECTS,
            "languages": ResumeSection.LANGUAGES,
        }
        
        for field, section in section_map.items():
            if getattr(resume_data, field) and len(getattr(resume_data, field)) > 0:
                sections.append(section)
        
        return sections

    async def get_resume_file(self, resume_id: str, format: str) -> tuple:
        """
        Get the resume file for download
        
        Args:
            resume_id: The unique ID of the resume
            format: The file format (pdf, docx)
            
        Returns:
            tuple: (file_path, file_name)
        """
        try:
            # Validate format
            if format not in ["pdf", "docx", "html", "txt"]:
                raise ValueError(f"Unsupported format: {format}")
                
            # Construct the file path
            file_name = f"resume_{resume_id}.{format}"
            file_path = os.path.join(settings.UPLOAD_DIR, "generated", resume_id, file_name)
            
            # Check if the file exists
            if not os.path.exists(file_path):
                raise FileNotFoundError(f"Resume file not found: {file_path}")
                
            return file_path, file_name
            
        except Exception as e:
            logger.error(f"Error getting resume file: {str(e)}")
            raise
        # Contact info is always included
        sections.append(ResumeSection.CONTACT)
        
        # Check for other sections
        if resume_data.summary:
            sections.append(ResumeSection.SUMMARY)
        
        if resume_data.education:
            sections.append(ResumeSection.EDUCATION)
        
        if resume_data.experience:
            sections.append(ResumeSection.EXPERIENCE)
        
        if resume_data.skills:
            sections.append(ResumeSection.SKILLS)
        
        if resume_data.projects:
            sections.append(ResumeSection.PROJECTS)
        
        if resume_data.certifications:
            sections.append(ResumeSection.CERTIFICATIONS)
        
        if resume_data.languages:
            sections.append(ResumeSection.LANGUAGES)
        
        if resume_data.interests:
            sections.append(ResumeSection.INTERESTS)
        
        if resume_data.references:
            sections.append(ResumeSection.REFERENCES)
        
        if resume_data.custom_sections:
            sections.append(ResumeSection.CUSTOM)
        
        return sections
