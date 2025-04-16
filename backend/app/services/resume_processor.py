import os
import uuid
import logging
from fastapi import UploadFile
import aiofiles
from datetime import datetime
from typing import Dict, Any, List

from app.core.config import settings
from app.schemas.responses import ResumeAnalysisResponse, ResumeSection
from app.agents.parser_agent import ResumeParserAgent

logger = logging.getLogger(__name__)

class ResumeProcessor:
    """Service for processing uploaded resume files"""
    
    async def process(self, file: UploadFile) -> ResumeAnalysisResponse:
        """
        Process an uploaded resume file
        
        Args:
            file: The uploaded resume file
            
        Returns:
            ResumeAnalysisResponse: The analysis results
        """
        try:
            # Generate a unique ID for this resume
            resume_id = str(uuid.uuid4())
            
            # Create a directory for this resume
            resume_dir = os.path.join(settings.UPLOAD_DIR, resume_id)
            os.makedirs(resume_dir, exist_ok=True)
            
            # Save the file
            file_path = os.path.join(resume_dir, file.filename)
            async with aiofiles.open(file_path, 'wb') as out_file:
                content = await file.read()
                await out_file.write(content)
            
            # Reset file position
            await file.seek(0)
            
            # Get file info
            file_size = os.path.getsize(file_path)
            content_type = file.content_type
            
            # Initialize parser agent
            parser_agent = ResumeParserAgent()
            
            # Parse the resume
            parsed_content = await parser_agent.parse_resume(file_path)
            
            # Determine which sections were found
            sections_found = self._identify_sections(parsed_content)
            
            # Count words
            word_count = self._count_words(parsed_content)
            
            # Create response
            response = ResumeAnalysisResponse(
                resume_id=resume_id,
                filename=file.filename,
                content_type=content_type,
                file_size=file_size,
                upload_time=datetime.now(),
                sections_found=sections_found,
                word_count=word_count,
                parsed_content=parsed_content,
                status="success"
            )
            
            return response
            
        except Exception as e:
            logger.error(f"Error processing resume: {str(e)}")
            raise
    
    def _identify_sections(self, parsed_content: Dict[str, Any]) -> List[ResumeSection]:
        """Identify which sections are present in the parsed resume"""
        sections = []
        
        section_mapping = {
            "contact_info": ResumeSection.CONTACT,
            "summary": ResumeSection.SUMMARY,
            "education": ResumeSection.EDUCATION,
            "experience": ResumeSection.EXPERIENCE,
            "skills": ResumeSection.SKILLS,
            "projects": ResumeSection.PROJECTS,
            "certifications": ResumeSection.CERTIFICATIONS,
            "languages": ResumeSection.LANGUAGES,
            "interests": ResumeSection.INTERESTS,
            "references": ResumeSection.REFERENCES
        }
        
        for key, section in section_mapping.items():
            if key in parsed_content and parsed_content[key]:
                sections.append(section)
        
        # Check for custom sections
        if "custom_sections" in parsed_content and parsed_content["custom_sections"]:
            sections.append(ResumeSection.CUSTOM)
        
        return sections
    
    def _count_words(self, parsed_content: Dict[str, Any]) -> int:
        """Count the total number of words in the parsed resume"""
        word_count = 0
        
        # Function to count words in a string
        def count_words_in_string(text: str) -> int:
            if not text:
                return 0
            return len(text.split())
        
        # Count words in summary
        if "summary" in parsed_content and parsed_content["summary"]:
            word_count += count_words_in_string(parsed_content["summary"])
        
        # Count words in experience descriptions
        if "experience" in parsed_content and parsed_content["experience"]:
            for exp in parsed_content["experience"]:
                if "description" in exp:
                    if isinstance(exp["description"], list):
                        for desc in exp["description"]:
                            word_count += count_words_in_string(desc)
                    else:
                        word_count += count_words_in_string(exp["description"])
        
        # Count words in education descriptions
        if "education" in parsed_content and parsed_content["education"]:
            for edu in parsed_content["education"]:
                if "description" in edu:
                    word_count += count_words_in_string(edu["description"])
        
        # Count words in project descriptions
        if "projects" in parsed_content and parsed_content["projects"]:
            for proj in parsed_content["projects"]:
                if "description" in proj:
                    word_count += count_words_in_string(proj["description"])
        
        # Count words in skills (just the skill names)
        if "skills" in parsed_content and parsed_content["skills"]:
            for skill in parsed_content["skills"]:
                if isinstance(skill, dict) and "name" in skill:
                    word_count += 1  # Count each skill as one word
                elif isinstance(skill, str):
                    word_count += 1  # Count each skill as one word
        
        return word_count
