import logging
from typing import Dict, Any, List
import re
import nltk
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords

logger = logging.getLogger(__name__)

class JobDescriptionAgent:
    """Agent for analyzing job descriptions"""
    
    def __init__(self):
        # Download NLTK resources if needed
        try:
            nltk.data.find('tokenizers/punkt')
        except LookupError:
            nltk.download('punkt')
        
        try:
            nltk.data.find('corpora/stopwords')
        except LookupError:
            nltk.download('stopwords')
    
    async def process_job_description(self, job_description: str) -> Dict[str, Any]:
        """
        Process a job description and extract structured information
        
        Args:
            job_description: The job description text
            
        Returns:
            Dict[str, Any]: Structured job data
        """
        try:
            # Initialize result structure
            result = {
                "title": "",
                "company": "",
                "location": "",
                "required_skills": [],
                "preferred_skills": [],
                "responsibilities": [],
                "qualifications": {
                    "required": [],
                    "preferred": []
                },
                "experience": {
                    "years": 0,
                    "level": "",
                    "description": ""
                },
                "education": {
                    "level": "",
                    "fields": []
                },
                "keywords": [],
                "sections": {}
            }
            
            # Extract job title
            result["title"] = self._extract_job_title(job_description)
            
            # Extract company name
            result["company"] = self._extract_company(job_description)
            
            # Extract location
            result["location"] = self._extract_location(job_description)
            
            # Extract required skills
            result["required_skills"] = self._extract_required_skills(job_description)
            
            # Extract preferred skills
            result["preferred_skills"] = self._extract_preferred_skills(job_description)
            
            # Extract responsibilities
            result["responsibilities"] = self._extract_responsibilities(job_description)
            
            # Extract qualifications
            qualifications = self._extract_qualifications(job_description)
            result["qualifications"]["required"] = qualifications["required"]
            result["qualifications"]["preferred"] = qualifications["preferred"]
            
            # Extract experience requirements
            result["experience"] = self._extract_experience_requirements(job_description)
            
            # Extract education requirements
            result["education"] = self._extract_education_requirements(job_description)
            
            # Extract keywords
            result["keywords"] = self._extract_keywords(job_description)
            
            # Extract sections
            result["sections"] = self._extract_sections(job_description)
            
            return result
            
        except Exception as e:
            logger.error(f"Error processing job description: {str(e)}")
            raise
    
    def _extract_job_title(self, text: str) -> str:
        """Extract job title from the job description"""
        # Look for common job title patterns
        title_patterns = [
            r'(?:Job Title|Position|Role):\s*([^\n]+)',
            r'^([A-Z][a-z]+(?: [A-Z][a-z]+){1,3}(?:\s*-\s*[A-Z][a-z]+(?:\s+[A-Z][a-z]+){0,2})?)'
        ]
        
        for pattern in title_patterns:
            match = re.search(pattern, text)
            if match:
                return match.group(1).strip()
        
        # If no match found, try to extract the first line
        first_line = text.strip().split('\n')[0]
        if len(first_line) < 100:  # Reasonable title length
            return first_line
        
        return ""
    
    def _extract_company(self, text: str) -> str:
        """Extract company name from the job description"""
        # Look for common company name patterns
        company_patterns = [
            r'(?:Company|Organization|Employer):\s*([^\n]+)',
            r'About ([A-Z][a-z]*(?: [A-Z][a-z]*){0,3}):',
            r'([A-Z][A-Za-z0-9]*(?: [A-Z][A-Za-z0-9]*){0,3}) is (?:looking|seeking|hiring)'
        ]
        
        for pattern in company_patterns:
            match = re.search(pattern, text)
            if match:
                return match.group(1).strip()
        
        return ""
    
    def _extract_location(self, text: str) -> str:
        """Extract location from the job description"""
        # Look for common location patterns
        location_patterns = [
            r'(?:Location|Place):\s*([^\n]+)',
            r'(?:in|at) ([A-Z][a-z]+(?: [A-Z][a-z]+){0,2}(?:,\s*[A-Z]{2}))',
            r'([A-Z][a-z]+(?:,\s*[A-Z]{2}))'
        ]
        
        for pattern in location_patterns:
            match = re.search(pattern, text)
            if match:
                return match.group(1).strip()
        
        return ""
    
    def _extract_required_skills(self, text: str) -> List[str]:
        """Extract required skills from the job description"""
        skills = []
        
        # Look for required skills section
        skills_section_pattern = r'(?:Required Skills|Skills Required|Requirements|Technical Skills).*?\n(.*?)(?:\n\n|\n[A-Z]+|\Z)'
        skills_section_match = re.search(skills_section_pattern, text, re.DOTALL | re.IGNORECASE)
        
        if skills_section_match:
            skills_text = skills_section_match.group(1)
            
            # Extract bullet points
            bullet_points = re.findall(r'[•\-*]\s*([^\n]+)', skills_text)
            for point in bullet_points:
                # Look for skill keywords
                skill_match = re.search(r'((?:[A-Z][a-z]+|[A-Z]+)(?:\+\+|#)?)', point)
                if skill_match:
                    skills.append(skill_match.group(1).strip())
                else:
                    # If no specific skill found, add the whole point
                    skills.append(point.strip())
        
        # Look for skills mentioned in the text
        common_skills = [
            "Python", "Java", "JavaScript", "C\\+\\+", "C#", "Ruby", "PHP", "Swift",
            "SQL", "NoSQL", "MongoDB", "MySQL", "PostgreSQL", "Oracle",
            "AWS", "Azure", "GCP", "Docker", "Kubernetes", "Jenkins",
            "React", "Angular", "Vue", "Node.js", "Django", "Flask",
            "Machine Learning", "AI", "Data Science", "Big Data",
            "Agile", "Scrum", "Kanban", "DevOps", "CI/CD"
        ]
        
        for skill in common_skills:
            if re.search(r'\b' + skill + r'\b', text, re.IGNORECASE):
                if skill not in skills:
                    skills.append(skill)
        
        return skills
    
    def _extract_preferred_skills(self, text: str) -> List[str]:
        """Extract preferred skills from the job description"""
        skills = []
        
        # Look for preferred skills section
        skills_section_pattern = r'(?:Preferred Skills|Nice to Have|Bonus Skills|Plus).*?\n(.*?)(?:\n\n|\n[A-Z]+|\Z)'
        skills_section_match = re.search(skills_section_pattern, text, re.DOTALL | re.IGNORECASE)
        
        if skills_section_match:
            skills_text = skills_section_match.group(1)
            
            # Extract bullet points
            bullet_points = re.findall(r'[•\-*]\s*([^\n]+)', skills_text)
            for point in bullet_points:
                # Look for skill keywords
                skill_match = re.search(r'((?:[A-Z][a-z]+|[A-Z]+)(?:\+\+|#)?)', point)
                if skill_match:
                    skills.append(skill_match.group(1).strip())
                else:
                    # If no specific skill found, add the whole point
                    skills.append(point.strip())
        
        return skills
    
    def _extract_responsibilities(self, text: str) -> List[str]:
        """Extract responsibilities from the job description"""
        responsibilities = []
        
        # Look for responsibilities section
        resp_section_pattern = r'(?:Responsibilities|Duties|What You\'ll Do|Job Description).*?\n(.*?)(?:\n\n|\n[A-Z]+|\Z)'
        resp_section_match = re.search(resp_section_pattern, text, re.DOTALL | re.IGNORECASE)
        
        if resp_section_match:
            resp_text = resp_section_match.group(1)
            
            # Extract bullet points
            bullet_points = re.findall(r'[•\-*]\s*([^\n]+)', resp_text)
            for point in bullet_points:
                responsibilities.append(point.strip())
        
        return responsibilities
    
    def _extract_qualifications(self, text: str) -> Dict[str, List[str]]:
        """Extract qualifications from the job description"""
        qualifications = {
            "required": [],
            "preferred": []
        }
        
        # Look for required qualifications section
        req_qual_pattern = r'(?:Required Qualifications|Minimum Qualifications|Basic Qualifications).*?\n(.*?)(?:\n\n|\n[A-Z]+|\Z)'
        req_qual_match = re.search(req_qual_pattern, text, re.DOTALL | re.IGNORECASE)
        
        if req_qual_match:
            req_qual_text = req_qual_match.group(1)
            
            # Extract bullet points
            bullet_points = re.findall(r'[•\-*]\s*([^\n]+)', req_qual_text)
            for point in bullet_points:
                qualifications["required"].append(point.strip())
        
        # Look for preferred qualifications section
        pref_qual_pattern = r'(?:Preferred Qualifications|Desired Qualifications).*?\n(.*?)(?:\n\n|\n[A-Z]+|\Z)'
        pref_qual_match = re.search(pref_qual_pattern, text, re.DOTALL | re.IGNORECASE)
        
        if pref_qual_match:
            pref_qual_text = pref_qual_match.group(1)
            
            # Extract bullet points
            bullet_points = re.findall(r'[•\-*]\s*([^\n]+)', pref_qual_text)
            for point in bullet_points:
                qualifications["preferred"].append(point.strip())
        
        return qualifications
    
    def _extract_experience_requirements(self, text: str) -> Dict[str, Any]:
        """Extract experience requirements from the job description"""
        experience = {
            "years": 0,
            "level": "",
            "description": ""
        }
        
        # Look for years of experience
        years_pattern = r'(\d+)(?:\+)?\s*(?:years|yrs)(?:\s*of)?\s*experience'
        years_match = re.search(years_pattern, text, re.IGNORECASE)
        
        if years_match:
            experience["years"] = int(years_match.group(1))
        
        # Look for experience level
        level_patterns = {
            "entry": r'(?:entry[\s-]*level|junior|beginner)',
            "mid": r'(?:mid[\s-]*level|intermediate)',
            "senior": r'(?:senior|experienced|expert)',
            "lead": r'(?:lead|principal|staff)'
        }
        
        for level, pattern in level_patterns.items():
            if re.search(pattern, text, re.IGNORECASE):
                experience["level"] = level
                break
        
        # Extract experience description
        exp_section_pattern = r'(?:Experience|Work Experience).*?\n(.*?)(?:\n\n|\n[A-Z]+|\Z)'
        exp_section_match = re.search(exp_section_pattern, text, re.DOTALL | re.IGNORECASE)
        
        if exp_section_match:
            experience["description"] = exp_section_match.group(1).strip()
        
        return experience
    
    def _extract_education_requirements(self, text: str) -> Dict[str, Any]:
        """Extract education requirements from the job description"""
        education = {
            "level": "",
            "fields": []
        }
        
        # Look for education level
        level_patterns = {
            "high_school": r'(?:high school|secondary education)',
            "associate": r'(?:associate\'s degree|associate degree)',
            "bachelor": r'(?:bachelor\'s degree|bachelor degree|B\.S\.|B\.A\.)',
            "master": r'(?:master\'s degree|master degree|M\.S\.|M\.A\.)',
            "phd": r'(?:ph\.?d\.?|doctorate)'
        }
        
        for level, pattern in level_patterns.items():
            if re.search(pattern, text, re.IGNORECASE):
                education["level"] = level
                break
        
        # Look for fields of study
        fields_pattern = r'(?:degree|education) in\s*((?:[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*(?:,\s*|/|\s+or\s+))*(?:[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*))'
        fields_match = re.search(fields_pattern, text)
        
        if fields_match:
            fields_text = fields_match.group(1)
            fields = re.split(r',\s*|/|\s+or\s+', fields_text)
            education["fields"] = [field.strip() for field in fields if field.strip()]
        
        return education
    
    def _extract_keywords(self, text: str) -> List[str]:
        """Extract important keywords from the job description"""
        # Tokenize the text
        tokens = word_tokenize(text.lower())
        
        # Remove stopwords
        stop_words = set(stopwords.words('english'))
        filtered_tokens = [token for token in tokens if token.isalpha() and token not in stop_words]
        
        # Count token frequencies
        token_freq = {}
        for token in filtered_tokens:
            if token in token_freq:
                token_freq[token] += 1
            else:
                token_freq[token] = 1
        
        # Sort by frequency
        sorted_tokens = sorted(token_freq.items(), key=lambda x: x[1], reverse=True)
        
        # Return top keywords
        return [token for token, freq in sorted_tokens[:20]]
    
    def _extract_sections(self, text: str) -> Dict[str, str]:
        """Extract different sections from the job description"""
        sections = {}
        
        # Common section headers
        section_headers = [
            "About Us", "Company Overview", "About the Company",
            "Job Description", "Position Summary", "Role Overview",
            "Responsibilities", "Duties", "What You'll Do",
            "Requirements", "Qualifications", "Skills",
            "Experience", "Work Experience", "Background",
            "Education", "Educational Requirements",
            "Benefits", "Perks", "What We Offer",
            "Application Process", "How to Apply"
        ]
        
        # Extract each section
        for i, header in enumerate(section_headers):
            pattern = f"(?:{header}).*?\\n(.*?)(?:\\n\\n|\\n(?:{section_headers[i+1] if i+1 < len(section_headers) else ''})|\Z)"
            match = re.search(pattern, text, re.DOTALL | re.IGNORECASE)
            
            if match:
                sections[header] = match.group(1).strip()
        
        return sections
