import os
import logging
from typing import Dict, Any, List
import json
import fitz  # PyMuPDF
import docx
from bs4 import BeautifulSoup
import re

logger = logging.getLogger(__name__)

class ResumeParserAgent:
    """Agent for parsing resume documents"""
    
    async def parse_resume(self, file_path: str) -> Dict[str, Any]:
        """
        Parse a resume file and extract structured information
        
        Args:
            file_path: Path to the resume file
            
        Returns:
            Dict[str, Any]: Structured resume data
        """
        try:
            # Get file extension
            _, ext = os.path.splitext(file_path)
            ext = ext.lower()
            
            # Extract text based on file type
            if ext == '.pdf':
                text = self._extract_from_pdf(file_path)
            elif ext == '.docx':
                text = self._extract_from_docx(file_path)
            elif ext in ['.html', '.htm']:
                text = self._extract_from_html(file_path)
            elif ext == '.txt':
                with open(file_path, 'r', encoding='utf-8') as f:
                    text = f.read()
            else:
                raise ValueError(f"Unsupported file format: {ext}")
            
            # Parse the extracted text
            parsed_data = self._parse_text(text)
            
            return parsed_data
            
        except Exception as e:
            logger.error(f"Error parsing resume: {str(e)}")
            raise
    
    def _extract_from_pdf(self, file_path: str) -> str:
        """Extract text from a PDF file"""
        text = ""
        try:
            # Open the PDF
            doc = fitz.open(file_path)
            
            # Extract text from each page
            for page in doc:
                text += page.get_text()
            
            # Close the document
            doc.close()
            
            return text
        except Exception as e:
            logger.error(f"Error extracting text from PDF: {str(e)}")
            raise
    
    def _extract_from_docx(self, file_path: str) -> str:
        """Extract text from a DOCX file"""
        text = ""
        try:
            # Open the DOCX
            doc = docx.Document(file_path)
            
            # Extract text from each paragraph
            for para in doc.paragraphs:
                text += para.text + "\n"
            
            return text
        except Exception as e:
            logger.error(f"Error extracting text from DOCX: {str(e)}")
            raise
    
    def _extract_from_html(self, file_path: str) -> str:
        """Extract text from an HTML file"""
        try:
            # Read the HTML file
            with open(file_path, 'r', encoding='utf-8') as f:
                html_content = f.read()
            
            # Parse the HTML
            soup = BeautifulSoup(html_content, 'html.parser')
            
            # Remove script and style elements
            for script in soup(["script", "style"]):
                script.extract()
            
            # Get text
            text = soup.get_text()
            
            # Break into lines and remove leading and trailing space on each
            lines = (line.strip() for line in text.splitlines())
            # Break multi-headlines into a line each
            chunks = (phrase.strip() for line in lines for phrase in line.split("  "))
            # Drop blank lines
            text = '\n'.join(chunk for chunk in chunks if chunk)
            
            return text
        except Exception as e:
            logger.error(f"Error extracting text from HTML: {str(e)}")
            raise
    
    def _parse_text(self, text: str) -> Dict[str, Any]:
        """
        Parse the extracted text into structured resume data
        
        In a real implementation, this would use NLP techniques to identify
        and extract different sections of the resume. For this example,
        we'll use a simplified approach with regex patterns.
        """
        parsed_data = {
            "contact_info": {},
            "summary": "",
            "education": [],
            "experience": [],
            "skills": [],
            "projects": [],
            "certifications": [],
            "languages": [],
            "interests": [],
            "references": "",
            "custom_sections": {}
        }
        
        # Extract contact information
        parsed_data["contact_info"] = self._extract_contact_info(text)
        
        # Extract summary/objective
        parsed_data["summary"] = self._extract_summary(text)
        
        # Extract education
        parsed_data["education"] = self._extract_education(text)
        
        # Extract experience
        parsed_data["experience"] = self._extract_experience(text)
        
        # Extract skills
        parsed_data["skills"] = self._extract_skills(text)
        
        # Extract projects
        parsed_data["projects"] = self._extract_projects(text)
        
        # Extract certifications
        parsed_data["certifications"] = self._extract_certifications(text)
        
        # Extract languages
        parsed_data["languages"] = self._extract_languages(text)
        
        # Extract interests
        parsed_data["interests"] = self._extract_interests(text)
        
        return parsed_data
    
    def _extract_contact_info(self, text: str) -> Dict[str, str]:
        """Extract contact information from the resume text"""
        contact_info = {}
        
        # Extract name (usually at the beginning of the resume)
        name_match = re.search(r'^([A-Z][a-z]+(?: [A-Z][a-z]+)+)', text.strip())
        if name_match:
            contact_info["name"] = name_match.group(1)
        
        # Extract email
        email_match = re.search(r'[\w\.-]+@[\w\.-]+\.\w+', text)
        if email_match:
            contact_info["email"] = email_match.group(0)
        
        # Extract phone number
        phone_match = re.search(r'(\+\d{1,3}[-.\s]?)?(\(?\d{3}\)?[-.\s]?)?\d{3}[-.\s]?\d{4}', text)
        if phone_match:
            contact_info["phone"] = phone_match.group(0)
        
        # Extract LinkedIn URL
        linkedin_match = re.search(r'linkedin\.com/in/[\w-]+', text)
        if linkedin_match:
            contact_info["linkedin"] = "https://www." + linkedin_match.group(0)
        
        # Extract GitHub URL
        github_match = re.search(r'github\.com/[\w-]+', text)
        if github_match:
            contact_info["github"] = "https://www." + github_match.group(0)
        
        return contact_info
    
    def _extract_summary(self, text: str) -> str:
        """Extract summary/objective from the resume text"""
        # Look for common section headers
        summary_patterns = [
            r'(?:SUMMARY|PROFESSIONAL SUMMARY|CAREER SUMMARY|PROFILE|OBJECTIVE).*?\n(.*?)(?:\n\n|\n[A-Z]+)',
            r'(?:Summary|Professional Summary|Career Summary|Profile|Objective).*?\n(.*?)(?:\n\n|\n[A-Z]+)'
        ]
        
        for pattern in summary_patterns:
            match = re.search(pattern, text, re.DOTALL)
            if match:
                return match.group(1).strip()
        
        return ""
    
    def _extract_education(self, text: str) -> List[Dict[str, Any]]:
        """Extract education information from the resume text"""
        education = []
        
        # Look for education section
        education_section_pattern = r'(?:EDUCATION|ACADEMIC BACKGROUND).*?\n(.*?)(?:\n\n|\n[A-Z]+|\Z)'
        education_section_match = re.search(education_section_pattern, text, re.DOTALL | re.IGNORECASE)
        
        if education_section_match:
            education_text = education_section_match.group(1)
            
            # Look for individual education entries
            # This is a simplified approach; a real implementation would be more sophisticated
            education_entries = re.split(r'\n(?=[A-Z])', education_text)
            
            for entry in education_entries:
                if not entry.strip():
                    continue
                
                education_item = {}
                
                # Extract institution
                institution_match = re.search(r'^(.*?)(?:,|\n)', entry)
                if institution_match:
                    education_item["institution"] = institution_match.group(1).strip()
                
                # Extract degree
                degree_match = re.search(r'(Bachelor|Master|Ph\.D|MBA|B\.S\.|M\.S\.|B\.A\.|M\.A\.|B\.E\.|M\.E\.)[^,\n]*', entry)
                if degree_match:
                    education_item["degree"] = degree_match.group(0).strip()
                
                # Extract field of study
                field_match = re.search(r'(?:in|of) ([^,\n]*)', entry)
                if field_match:
                    education_item["field_of_study"] = field_match.group(1).strip()
                
                # Extract dates
                date_match = re.search(r'(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|January|February|March|April|May|June|July|August|September|October|November|December)\.?\s+\d{4}\s*-\s*(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|January|February|March|April|May|June|July|August|September|October|November|December|Present)\.?\s+\d{0,4}', entry)
                if date_match:
                    education_item["start_date"] = date_match.group(1)
                    education_item["end_date"] = date_match.group(2)
                    if education_item["end_date"].lower() == "present":
                        education_item["current"] = True
                
                if education_item:
                    education.append(education_item)
        
        return education
    
    def _extract_experience(self, text: str) -> List[Dict[str, Any]]:
        """Extract work experience information from the resume text"""
        experience = []
        
        # Look for experience section
        experience_section_pattern = r'(?:EXPERIENCE|WORK EXPERIENCE|PROFESSIONAL EXPERIENCE|EMPLOYMENT).*?\n(.*?)(?:\n\n|\n[A-Z]+|\Z)'
        experience_section_match = re.search(experience_section_pattern, text, re.DOTALL | re.IGNORECASE)
        
        if experience_section_match:
            experience_text = experience_section_match.group(1)
            
            # Look for individual experience entries
            # This is a simplified approach; a real implementation would be more sophisticated
            experience_entries = re.split(r'\n(?=[A-Z][a-z]+ [A-Z][a-z]+|[A-Z]{2,})', experience_text)
            
            for entry in experience_entries:
                if not entry.strip():
                    continue
                
                experience_item = {}
                
                # Extract company
                company_match = re.search(r'^(.*?)(?:,|\n)', entry)
                if company_match:
                    experience_item["company"] = company_match.group(1).strip()
                
                # Extract position
                position_match = re.search(r'(Senior|Junior|Lead|Principal|Software|Engineer|Developer|Manager|Director|Analyst|Consultant)[^,\n]*', entry)
                if position_match:
                    experience_item["position"] = position_match.group(0).strip()
                
                # Extract dates
                date_match = re.search(r'(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|January|February|March|April|May|June|July|August|September|October|November|December)\.?\s+\d{4}\s*-\s*(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|January|February|March|April|May|June|July|August|September|October|November|December|Present)\.?\s+\d{0,4}', entry)
                if date_match:
                    experience_item["start_date"] = date_match.group(1)
                    experience_item["end_date"] = date_match.group(2)
                    if experience_item["end_date"].lower() == "present":
                        experience_item["current"] = True
                
                # Extract description
                description_lines = []
                for line in entry.split('\n'):
                    line = line.strip()
                    if line and line.startswith(('•', '-', '•', '*')):
                        description_lines.append(line.lstrip('•-*').strip())
                
                if description_lines:
                    experience_item["description"] = description_lines
                
                if experience_item:
                    experience.append(experience_item)
        
        return experience
    
    def _extract_skills(self, text: str) -> List[Dict[str, str]]:
        """Extract skills from the resume text"""
        skills = []
        
        # Look for skills section
        skills_section_pattern = r'(?:SKILLS|TECHNICAL SKILLS|CORE COMPETENCIES).*?\n(.*?)(?:\n\n|\n[A-Z]+|\Z)'
        skills_section_match = re.search(skills_section_pattern, text, re.DOTALL | re.IGNORECASE)
        
        if skills_section_match:
            skills_text = skills_section_match.group(1)
            
            # Split by common delimiters
            skill_entries = re.split(r'[,•\n]', skills_text)
            
            for entry in skill_entries:
                entry = entry.strip()
                if entry:
                    skills.append({"name": entry})
        
        return skills
    
    def _extract_projects(self, text: str) -> List[Dict[str, Any]]:
        """Extract projects from the resume text"""
        projects = []
        
        # Look for projects section
        projects_section_pattern = r'(?:PROJECTS|PROJECT EXPERIENCE).*?\n(.*?)(?:\n\n|\n[A-Z]+|\Z)'
        projects_section_match = re.search(projects_section_pattern, text, re.DOTALL | re.IGNORECASE)
        
        if projects_section_match:
            projects_text = projects_section_match.group(1)
            
            # Look for individual project entries
            project_entries = re.split(r'\n(?=[A-Z][a-z]+ [A-Z][a-z]+|[A-Z]{2,})', projects_text)
            
            for entry in project_entries:
                if not entry.strip():
                    continue
                
                project_item = {}
                
                # Extract project name
                name_match = re.search(r'^(.*?)(?:,|\n)', entry)
                if name_match:
                    project_item["name"] = name_match.group(1).strip()
                
                # Extract description
                description_lines = []
                for line in entry.split('\n'):
                    line = line.strip()
                    if line and line.startswith(('•', '-', '•', '*')):
                        description_lines.append(line.lstrip('•-*').strip())
                
                if description_lines:
                    project_item["description"] = " ".join(description_lines)
                
                # Extract technologies
                tech_match = re.search(r'(?:Technologies|Tech Stack|Tools):\s*(.*?)(?:\n|$)', entry)
                if tech_match:
                    technologies = [tech.strip() for tech in tech_match.group(1).split(',')]
                    project_item["technologies"] = technologies
                
                if project_item:
                    projects.append(project_item)
        
        return projects
    
    def _extract_certifications(self, text: str) -> List[Dict[str, Any]]:
        """Extract certifications from the resume text"""
        certifications = []
        
        # Look for certifications section
        certifications_section_pattern = r'(?:CERTIFICATIONS|CERTIFICATES).*?\n(.*?)(?:\n\n|\n[A-Z]+|\Z)'
        certifications_section_match = re.search(certifications_section_pattern, text, re.DOTALL | re.IGNORECASE)
        
        if certifications_section_match:
            certifications_text = certifications_section_match.group(1)
            
            # Split by newlines
            certification_entries = certifications_text.split('\n')
            
            for entry in certification_entries:
                entry = entry.strip()
                if entry:
                    certification_item = {"name": entry}
                    certifications.append(certification_item)
        
        return certifications
    
    def _extract_languages(self, text: str) -> List[str]:
        """Extract languages from the resume text"""
        languages = []
        
        # Look for languages section
        languages_section_pattern = r'(?:LANGUAGES).*?\n(.*?)(?:\n\n|\n[A-Z]+|\Z)'
        languages_section_match = re.search(languages_section_pattern, text, re.DOTALL | re.IGNORECASE)
        
        if languages_section_match:
            languages_text = languages_section_match.group(1)
            
            # Split by common delimiters
            language_entries = re.split(r'[,•\n]', languages_text)
            
            for entry in language_entries:
                entry = entry.strip()
                if entry:
                    languages.append(entry)
        
        return languages
    
    def _extract_interests(self, text: str) -> List[str]:
        """Extract interests from the resume text"""
        interests = []
        
        # Look for interests section
        interests_section_pattern = r'(?:INTERESTS|HOBBIES).*?\n(.*?)(?:\n\n|\n[A-Z]+|\Z)'
        interests_section_match = re.search(interests_section_pattern, text, re.DOTALL | re.IGNORECASE)
        
        if interests_section_match:
            interests_text = interests_section_match.group(1)
            
            # Split by common delimiters
            interest_entries = re.split(r'[,•\n]', interests_text)
            
            for entry in interest_entries:
                entry = entry.strip()
                if entry:
                    interests.append(entry)
        
        return interests
