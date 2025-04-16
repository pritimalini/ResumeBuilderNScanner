import logging
from typing import Dict, Any, List
import re
import nltk
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
from collections import Counter

logger = logging.getLogger(__name__)

class KeywordAnalystAgent:
    """Agent for analyzing keywords in resumes and job descriptions"""
    
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
    
    async def analyze_resume_keywords(self, resume_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Analyze keywords in a resume
        
        Args:
            resume_data: The parsed resume data
            
        Returns:
            Dict[str, Any]: Keyword analysis results
        """
        try:
            # Initialize result structure
            result = {
                "technical_skills": [],
                "soft_skills": [],
                "industry_terms": [],
                "action_verbs": [],
                "keyword_density": {},
                "section_keywords": {},
                "top_keywords": []
            }
            
            # Extract parsed content
            parsed_content = resume_data.get("parsed_content", {})
            
            # Extract text from different sections
            resume_text = self._extract_text_from_resume(parsed_content)
            
            # Extract technical skills
            result["technical_skills"] = self._extract_technical_skills(parsed_content, resume_text)
            
            # Extract soft skills
            result["soft_skills"] = self._extract_soft_skills(resume_text)
            
            # Extract industry terms
            result["industry_terms"] = self._extract_industry_terms(resume_text)
            
            # Extract action verbs
            result["action_verbs"] = self._extract_action_verbs(resume_text)
            
            # Calculate keyword density
            result["keyword_density"] = self._calculate_keyword_density(resume_text)
            
            # Extract keywords by section
            result["section_keywords"] = self._extract_section_keywords(parsed_content)
            
            # Identify top keywords
            all_keywords = (
                result["technical_skills"] + 
                result["soft_skills"] + 
                result["industry_terms"] + 
                result["action_verbs"]
            )
            result["top_keywords"] = self._get_top_keywords(all_keywords)
            
            return result
            
        except Exception as e:
            logger.error(f"Error analyzing resume keywords: {str(e)}")
            raise
    
    async def analyze_job_keywords(self, job_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Analyze keywords in a job description
        
        Args:
            job_data: The processed job data
            
        Returns:
            Dict[str, Any]: Keyword analysis results
        """
        try:
            # Initialize result structure
            result = {
                "required_skills": [],
                "preferred_skills": [],
                "technical_keywords": [],
                "soft_skills": [],
                "industry_terms": [],
                "action_verbs": [],
                "keyword_density": {},
                "section_keywords": {},
                "top_keywords": []
            }
            
            # Extract job description text
            job_text = job_data.get("raw_description", "")
            
            # Use existing required and preferred skills
            result["required_skills"] = job_data.get("required_skills", [])
            result["preferred_skills"] = job_data.get("preferred_skills", [])
            
            # Extract technical keywords
            result["technical_keywords"] = self._extract_technical_skills({}, job_text)
            
            # Extract soft skills
            result["soft_skills"] = self._extract_soft_skills(job_text)
            
            # Extract industry terms
            result["industry_terms"] = self._extract_industry_terms(job_text)
            
            # Extract action verbs
            result["action_verbs"] = self._extract_action_verbs(job_text)
            
            # Calculate keyword density
            result["keyword_density"] = self._calculate_keyword_density(job_text)
            
            # Extract keywords by section
            result["section_keywords"] = self._extract_job_section_keywords(job_data)
            
            # Identify top keywords
            all_keywords = (
                result["required_skills"] + 
                result["preferred_skills"] + 
                result["technical_keywords"] + 
                result["soft_skills"] + 
                result["industry_terms"]
            )
            result["top_keywords"] = self._get_top_keywords(all_keywords)
            
            return result
            
        except Exception as e:
            logger.error(f"Error analyzing job keywords: {str(e)}")
            raise
    
    def _extract_text_from_resume(self, parsed_content: Dict[str, Any]) -> str:
        """Extract text from different sections of the resume"""
        text = ""
        
        # Extract summary
        if "summary" in parsed_content:
            text += parsed_content["summary"] + " "
        
        # Extract experience descriptions
        if "experience" in parsed_content:
            for exp in parsed_content["experience"]:
                if "description" in exp:
                    if isinstance(exp["description"], list):
                        for desc in exp["description"]:
                            text += desc + " "
                    else:
                        text += exp["description"] + " "
        
        # Extract education descriptions
        if "education" in parsed_content:
            for edu in parsed_content["education"]:
                if "description" in edu:
                    text += edu["description"] + " "
        
        # Extract project descriptions
        if "projects" in parsed_content:
            for proj in parsed_content["projects"]:
                if "description" in proj:
                    text += proj["description"] + " "
        
        # Extract skills
        if "skills" in parsed_content:
            for skill in parsed_content["skills"]:
                if isinstance(skill, dict) and "name" in skill:
                    text += skill["name"] + " "
                elif isinstance(skill, str):
                    text += skill + " "
        
        return text
    
    def _extract_technical_skills(self, parsed_content: Dict[str, Any], text: str) -> List[str]:
        """Extract technical skills from the resume or job description"""
        technical_skills = []
        
        # Common technical skills to look for
        common_tech_skills = [
            # Programming languages
            "Python", "Java", "JavaScript", "TypeScript", "C\\+\\+", "C#", "Ruby", "PHP", "Swift", "Kotlin", "Go",
            # Web technologies
            "HTML", "CSS", "React", "Angular", "Vue", "Node.js", "Express", "Django", "Flask", "Spring", "ASP.NET",
            # Databases
            "SQL", "NoSQL", "MongoDB", "MySQL", "PostgreSQL", "Oracle", "SQLite", "Redis", "Elasticsearch",
            # Cloud platforms
            "AWS", "Azure", "GCP", "Google Cloud", "Heroku", "Firebase",
            # DevOps tools
            "Docker", "Kubernetes", "Jenkins", "Git", "GitHub", "GitLab", "Terraform", "Ansible", "CI/CD",
            # Data science and ML
            "Machine Learning", "AI", "Data Science", "TensorFlow", "PyTorch", "Pandas", "NumPy", "SciPy",
            # Mobile development
            "Android", "iOS", "React Native", "Flutter", "Xamarin",
            # Other technologies
            "REST API", "GraphQL", "Microservices", "Serverless", "Blockchain", "IoT"
        ]
        
        # Check for skills in the text
        for skill in common_tech_skills:
            if re.search(r'\b' + skill + r'\b', text, re.IGNORECASE):
                technical_skills.append(skill)
        
        # Extract skills from the parsed content
        if "skills" in parsed_content:
            for skill in parsed_content["skills"]:
                if isinstance(skill, dict) and "name" in skill:
                    skill_name = skill["name"]
                    if skill_name not in technical_skills:
                        technical_skills.append(skill_name)
                elif isinstance(skill, str) and skill not in technical_skills:
                    technical_skills.append(skill)
        
        return technical_skills
    
    def _extract_soft_skills(self, text: str) -> List[str]:
        """Extract soft skills from the text"""
        soft_skills = []
        
        # Common soft skills to look for
        common_soft_skills = [
            "Communication", "Leadership", "Teamwork", "Problem Solving", "Critical Thinking",
            "Time Management", "Adaptability", "Flexibility", "Creativity", "Collaboration",
            "Interpersonal", "Organizational", "Analytical", "Attention to Detail", "Multitasking",
            "Decision Making", "Conflict Resolution", "Negotiation", "Presentation", "Customer Service",
            "Project Management", "Strategic Thinking", "Mentoring", "Coaching", "Emotional Intelligence"
        ]
        
        # Check for skills in the text
        for skill in common_soft_skills:
            if re.search(r'\b' + skill + r'\b', text, re.IGNORECASE):
                soft_skills.append(skill)
        
        return soft_skills
    
    def _extract_industry_terms(self, text: str) -> List[str]:
        """Extract industry-specific terms from the text"""
        industry_terms = []
        
        # Common industry terms to look for
        common_industry_terms = [
            # Software development
            "Agile", "Scrum", "Kanban", "Waterfall", "SDLC", "TDD", "BDD", "MVP", "Sprint",
            # Business
            "ROI", "KPI", "B2B", "B2C", "SaaS", "PaaS", "IaaS", "CRM", "ERP", "SEO",
            # Finance
            "P&L", "Balance Sheet", "Cash Flow", "GAAP", "Financial Analysis",
            # Healthcare
            "EMR", "EHR", "HIPAA", "Clinical", "Patient Care",
            # Marketing
            "Digital Marketing", "Content Strategy", "Brand Management", "Market Research",
            # HR
            "Talent Acquisition", "Performance Management", "Employee Relations"
        ]
        
        # Check for terms in the text
        for term in common_industry_terms:
            if re.search(r'\b' + term + r'\b', text, re.IGNORECASE):
                industry_terms.append(term)
        
        return industry_terms
    
    def _extract_action_verbs(self, text: str) -> List[str]:
        """Extract action verbs from the text"""
        action_verbs = []
        
        # Common action verbs to look for
        common_action_verbs = [
            "Achieved", "Analyzed", "Built", "Collaborated", "Created", "Designed", "Developed",
            "Established", "Implemented", "Improved", "Increased", "Led", "Managed", "Optimized",
            "Reduced", "Resolved", "Streamlined", "Transformed", "Delivered", "Launched",
            "Negotiated", "Organized", "Planned", "Presented", "Researched", "Supervised",
            "Trained", "Authored", "Coordinated", "Directed", "Generated", "Initiated"
        ]
        
        # Check for verbs in the text
        for verb in common_action_verbs:
            if re.search(r'\b' + verb + r'\b', text, re.IGNORECASE):
                action_verbs.append(verb)
        
        return action_verbs
    
    def _calculate_keyword_density(self, text: str) -> Dict[str, float]:
        """Calculate keyword density in the text"""
        # Tokenize the text
        tokens = word_tokenize(text.lower())
        
        # Remove stopwords
        stop_words = set(stopwords.words('english'))
        filtered_tokens = [token for token in tokens if token.isalpha() and token not in stop_words and len(token) > 2]
        
        # Count token frequencies
        token_freq = Counter(filtered_tokens)
        
        # Calculate density
        total_tokens = len(filtered_tokens)
        density = {}
        
        if total_tokens > 0:
            for token, count in token_freq.most_common(20):
                density[token] = count / total_tokens
        
        return density
    
    def _extract_section_keywords(self, parsed_content: Dict[str, Any]) -> Dict[str, List[str]]:
        """Extract keywords by section from the resume"""
        section_keywords = {}
        
        # Extract keywords from summary
        if "summary" in parsed_content:
            summary_text = parsed_content["summary"]
            section_keywords["summary"] = self._extract_keywords_from_text(summary_text)
        
        # Extract keywords from experience
        if "experience" in parsed_content:
            experience_keywords = []
            for exp in parsed_content["experience"]:
                if "description" in exp:
                    if isinstance(exp["description"], list):
                        for desc in exp["description"]:
                            experience_keywords.extend(self._extract_keywords_from_text(desc))
                    else:
                        experience_keywords.extend(self._extract_keywords_from_text(exp["description"]))
            section_keywords["experience"] = list(set(experience_keywords))
        
        # Extract keywords from education
        if "education" in parsed_content:
            education_keywords = []
            for edu in parsed_content["education"]:
                if "description" in edu and edu["description"]:
                    education_keywords.extend(self._extract_keywords_from_text(edu["description"]))
                if "field_of_study" in edu and edu["field_of_study"]:
                    education_keywords.extend(self._extract_keywords_from_text(edu["field_of_study"]))
            section_keywords["education"] = list(set(education_keywords))
        
        # Extract keywords from skills
        if "skills" in parsed_content:
            skills_keywords = []
            for skill in parsed_content["skills"]:
                if isinstance(skill, dict) and "name" in skill:
                    skills_keywords.append(skill["name"])
                elif isinstance(skill, str):
                    skills_keywords.append(skill)
            section_keywords["skills"] = skills_keywords
        
        return section_keywords
    
    def _extract_job_section_keywords(self, job_data: Dict[str, Any]) -> Dict[str, List[str]]:
        """Extract keywords by section from the job description"""
        section_keywords = {}
        
        # Extract keywords from responsibilities
        if "responsibilities" in job_data:
            resp_keywords = []
            for resp in job_data["responsibilities"]:
                resp_keywords.extend(self._extract_keywords_from_text(resp))
            section_keywords["responsibilities"] = list(set(resp_keywords))
        
        # Extract keywords from qualifications
        if "qualifications" in job_data:
            qual_keywords = []
            for qual_type in ["required", "preferred"]:
                if qual_type in job_data["qualifications"]:
                    for qual in job_data["qualifications"][qual_type]:
                        qual_keywords.extend(self._extract_keywords_from_text(qual))
            section_keywords["qualifications"] = list(set(qual_keywords))
        
        # Extract keywords from sections
        if "sections" in job_data:
            for section_name, section_text in job_data["sections"].items():
                section_keywords[section_name.lower().replace(" ", "_")] = self._extract_keywords_from_text(section_text)
        
        return section_keywords
    
    def _extract_keywords_from_text(self, text: str) -> List[str]:
        """Extract keywords from a text"""
        # Tokenize the text
        tokens = word_tokenize(text.lower())
        
        # Remove stopwords
        stop_words = set(stopwords.words('english'))
        filtered_tokens = [token for token in tokens if token.isalpha() and token not in stop_words and len(token) > 2]
        
        # Count token frequencies
        token_freq = Counter(filtered_tokens)
        
        # Return most common tokens
        return [token for token, _ in token_freq.most_common(10)]
    
    def _get_top_keywords(self, keywords: List[str]) -> List[str]:
        """Get top keywords from a list of keywords"""
        # Count keyword frequencies
        keyword_freq = Counter(keywords)
        
        # Return most common keywords
        return [keyword for keyword, _ in keyword_freq.most_common(20)]
