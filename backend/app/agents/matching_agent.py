import logging
from typing import Dict, Any, List
import re
from difflib import SequenceMatcher

logger = logging.getLogger(__name__)

class MatchingAlgorithmAgent:
    """Agent for comparing resumes against job descriptions"""
    
    async def compare(self, resume_data: Dict[str, Any], job_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Compare a resume against a job description
        
        Args:
            resume_data: The processed resume data
            job_data: The processed job data
            
        Returns:
            Dict[str, Any]: Comparison results
        """
        try:
            # Initialize result structure
            result = {
                "keyword_matches": {},
                "skill_matches": {
                    "matched": [],
                    "missing": []
                },
                "experience_match": {
                    "years_match": False,
                    "level_match": False,
                    "relevance_score": 0.0
                },
                "education_match": {
                    "level_match": False,
                    "field_match": False
                },
                "section_matches": {},
                "overall_match_score": 0.0
            }
            
            # Extract parsed content from resume
            parsed_content = resume_data.get("parsed_content", {})
            
            # Compare keywords
            result["keyword_matches"] = self._compare_keywords(parsed_content, job_data)
            
            # Compare skills
            result["skill_matches"] = self._compare_skills(parsed_content, job_data)
            
            # Compare experience
            result["experience_match"] = self._compare_experience(parsed_content, job_data)
            
            # Compare education
            result["education_match"] = self._compare_education(parsed_content, job_data)
            
            # Compare sections
            result["section_matches"] = self._compare_sections(parsed_content, job_data)
            
            # Calculate overall match score
            result["overall_match_score"] = self._calculate_overall_match(result)
            
            return result
            
        except Exception as e:
            logger.error(f"Error comparing resume to job: {str(e)}")
            raise
    
    def _compare_keywords(self, parsed_content: Dict[str, Any], job_data: Dict[str, Any]) -> Dict[str, Dict[str, Any]]:
        """Compare keywords between resume and job description"""
        keyword_matches = {}
        
        # Get job keywords
        job_keywords = []
        if "keywords" in job_data:
            job_keywords.extend(job_data["keywords"])
        if "required_skills" in job_data:
            job_keywords.extend(job_data["required_skills"])
        if "preferred_skills" in job_data:
            job_keywords.extend(job_data["preferred_skills"])
        
        # Remove duplicates
        job_keywords = list(set(job_keywords))
        
        # Get resume text
        resume_text = ""
        if "summary" in parsed_content:
            resume_text += parsed_content["summary"] + " "
        
        if "experience" in parsed_content:
            for exp in parsed_content["experience"]:
                if "description" in exp:
                    if isinstance(exp["description"], list):
                        for desc in exp["description"]:
                            resume_text += desc + " "
                    else:
                        resume_text += exp["description"] + " "
        
        if "skills" in parsed_content:
            for skill in parsed_content["skills"]:
                if isinstance(skill, dict) and "name" in skill:
                    resume_text += skill["name"] + " "
                elif isinstance(skill, str):
                    resume_text += skill + " "
        
        # Check for each keyword
        for keyword in job_keywords:
            # Skip very short keywords
            if len(keyword) < 3:
                continue
                
            # Create regex pattern for the keyword
            pattern = r'\b' + re.escape(keyword) + r'\b'
            
            # Check if keyword is found in resume
            found = re.search(pattern, resume_text, re.IGNORECASE) is not None
            
            # Determine importance (higher for required skills)
            importance = 0.8 if keyword in job_data.get("required_skills", []) else 0.5
            
            # Get context if found
            context = None
            if found:
                # Try to get surrounding context
                match = re.search(r'(.{0,50})' + pattern + r'(.{0,50})', resume_text, re.IGNORECASE)
                if match:
                    context = match.group(0)
            
            # Determine section
            section = None
            if found:
                if re.search(pattern, str(parsed_content.get("summary", "")), re.IGNORECASE):
                    section = "summary"
                elif any(re.search(pattern, str(exp.get("description", "")), re.IGNORECASE) for exp in parsed_content.get("experience", [])):
                    section = "experience"
                elif any(re.search(pattern, str(skill), re.IGNORECASE) for skill in parsed_content.get("skills", [])):
                    section = "skills"
            
            # Add to results
            keyword_matches[keyword] = {
                "found": found,
                "importance": importance,
                "context": context,
                "section": section
            }
        
        return keyword_matches
    
    def _compare_skills(self, parsed_content: Dict[str, Any], job_data: Dict[str, Any]) -> Dict[str, List[str]]:
        """Compare skills between resume and job description"""
        skill_matches = {
            "matched": [],
            "missing": []
        }
        
        # Get job skills
        job_skills = []
        if "required_skills" in job_data:
            job_skills.extend(job_data["required_skills"])
        if "preferred_skills" in job_data:
            job_skills.extend(job_data["preferred_skills"])
        
        # Remove duplicates
        job_skills = list(set(job_skills))
        
        # Get resume skills
        resume_skills = []
        if "skills" in parsed_content:
            for skill in parsed_content["skills"]:
                if isinstance(skill, dict) and "name" in skill:
                    resume_skills.append(skill["name"])
                elif isinstance(skill, str):
                    resume_skills.append(skill)
        
        # Check for skill matches
        for job_skill in job_skills:
            # Check for exact match
            if job_skill in resume_skills:
                skill_matches["matched"].append(job_skill)
                continue
            
            # Check for fuzzy match
            found = False
            for resume_skill in resume_skills:
                similarity = SequenceMatcher(None, job_skill.lower(), resume_skill.lower()).ratio()
                if similarity > 0.8:  # High similarity threshold
                    skill_matches["matched"].append(job_skill)
                    found = True
                    break
            
            if not found:
                skill_matches["missing"].append(job_skill)
        
        return skill_matches
    
    def _compare_experience(self, parsed_content: Dict[str, Any], job_data: Dict[str, Any]) -> Dict[str, Any]:
        """Compare experience between resume and job description"""
        experience_match = {
            "years_match": False,
            "level_match": False,
            "relevance_score": 0.0
        }
        
        # Get job experience requirements
        job_experience = job_data.get("experience", {})
        required_years = job_experience.get("years", 0)
        required_level = job_experience.get("level", "")
        
        # Get resume experience
        resume_experience = parsed_content.get("experience", [])
        
        # Calculate total years of experience
        total_years = 0
        for exp in resume_experience:
            if "start_date" in exp and "end_date" in exp:
                # In a real implementation, this would calculate the actual time difference
                # For this example, we'll use a placeholder
                total_years += 2  # Placeholder
        
        # Check years match
        experience_match["years_match"] = total_years >= required_years
        
        # Check level match
        if required_level:
            # In a real implementation, this would use more sophisticated matching
            # For this example, we'll use a simple check
            for exp in resume_experience:
                if "position" in exp and required_level.lower() in exp["position"].lower():
                    experience_match["level_match"] = True
                    break
        else:
            experience_match["level_match"] = True  # No specific level required
        
        # Calculate relevance score
        relevance_score = 0.0
        if resume_experience:
            # In a real implementation, this would use NLP to compare experience relevance
            # For this example, we'll use a placeholder
            relevance_score = 0.7  # Placeholder
        
        experience_match["relevance_score"] = relevance_score
        
        return experience_match
    
    def _compare_education(self, parsed_content: Dict[str, Any], job_data: Dict[str, Any]) -> Dict[str, bool]:
        """Compare education between resume and job description"""
        education_match = {
            "level_match": False,
            "field_match": False
        }
        
        # Get job education requirements
        job_education = job_data.get("education", {})
        required_level = job_education.get("level", "")
        required_fields = job_education.get("fields", [])
        
        # Get resume education
        resume_education = parsed_content.get("education", [])
        
        # Check level match
        if required_level:
            for edu in resume_education:
                if "degree" in edu:
                    # Map degree to level
                    degree_level = self._map_degree_to_level(edu["degree"])
                    if self._is_level_sufficient(degree_level, required_level):
                        education_match["level_match"] = True
                        break
        else:
            education_match["level_match"] = True  # No specific level required
        
        # Check field match
        if required_fields:
            for edu in resume_education:
                if "field_of_study" in edu:
                    for required_field in required_fields:
                        if self._is_field_match(edu["field_of_study"], required_field):
                            education_match["field_match"] = True
                            break
        else:
            education_match["field_match"] = True  # No specific fields required
        
        return education_match
    
    def _map_degree_to_level(self, degree: str) -> str:
        """Map degree to education level"""
        degree = degree.lower()
        
        if any(term in degree for term in ["phd", "doctorate", "ph.d"]):
            return "phd"
        elif any(term in degree for term in ["master", "ms", "ma", "mba", "m.s", "m.a"]):
            return "master"
        elif any(term in degree for term in ["bachelor", "bs", "ba", "b.s", "b.a"]):
            return "bachelor"
        elif any(term in degree for term in ["associate", "as", "aa", "a.s", "a.a"]):
            return "associate"
        else:
            return "high_school"
    
    def _is_level_sufficient(self, actual_level: str, required_level: str) -> bool:
        """Check if actual education level meets or exceeds required level"""
        level_hierarchy = {
            "high_school": 1,
            "associate": 2,
            "bachelor": 3,
            "master": 4,
            "phd": 5
        }
        
        actual_rank = level_hierarchy.get(actual_level, 0)
        required_rank = level_hierarchy.get(required_level, 0)
        
        return actual_rank >= required_rank
    
    def _is_field_match(self, actual_field: str, required_field: str) -> bool:
        """Check if fields match"""
        # In a real implementation, this would use more sophisticated matching
        # For this example, we'll use a simple check
        return required_field.lower() in actual_field.lower()
    
    def _compare_sections(self, parsed_content: Dict[str, Any], job_data: Dict[str, Any]) -> Dict[str, float]:
        """Compare different sections between resume and job description"""
        section_matches = {
            "summary": 0.0,
            "experience": 0.0,
            "skills": 0.0,
            "education": 0.0
        }
        
        # Compare summary
        if "summary" in parsed_content and parsed_content["summary"]:
            # In a real implementation, this would use NLP to compare relevance
            # For this example, we'll use a placeholder
            section_matches["summary"] = 0.6  # Placeholder
        
        # Compare experience
        if "experience" in parsed_content and parsed_content["experience"]:
            # In a real implementation, this would compare experience to job responsibilities
            # For this example, we'll use a placeholder
            section_matches["experience"] = 0.7  # Placeholder
        
        # Compare skills
        if "skills" in parsed_content and parsed_content["skills"]:
            # Calculate percentage of required skills matched
            required_skills = job_data.get("required_skills", [])
            if required_skills:
                matched_skills = len([s for s in required_skills if s in str(parsed_content["skills"])])
                section_matches["skills"] = matched_skills / len(required_skills)
            else:
                section_matches["skills"] = 0.5  # Placeholder
        
        # Compare education
        if "education" in parsed_content and parsed_content["education"]:
            # In a real implementation, this would compare education to requirements
            # For this example, we'll use a placeholder
            section_matches["education"] = 0.8  # Placeholder
        
        return section_matches
    
    def _calculate_overall_match(self, result: Dict[str, Any]) -> float:
        """Calculate overall match score"""
        # Calculate keyword match percentage
        keyword_matches = result["keyword_matches"]
        total_keywords = len(keyword_matches)
        matched_keywords = sum(1 for match in keyword_matches.values() if match["found"])
        keyword_score = matched_keywords / total_keywords if total_keywords > 0 else 0
        
        # Calculate skill match percentage
        skill_matches = result["skill_matches"]
        total_skills = len(skill_matches["matched"]) + len(skill_matches["missing"])
        matched_skills = len(skill_matches["matched"])
        skill_score = matched_skills / total_skills if total_skills > 0 else 0
        
        # Get experience match score
        experience_match = result["experience_match"]
        experience_score = (
            (1 if experience_match["years_match"] else 0) +
            (1 if experience_match["level_match"] else 0) +
            experience_match["relevance_score"]
        ) / 3
        
        # Get education match score
        education_match = result["education_match"]
        education_score = (
            (1 if education_match["level_match"] else 0) +
            (1 if education_match["field_match"] else 0)
        ) / 2
        
        # Get section match scores
        section_matches = result["section_matches"]
        section_score = sum(section_matches.values()) / len(section_matches)
        
        # Calculate weighted overall score
        overall_score = (
            keyword_score * 0.3 +
            skill_score * 0.3 +
            experience_score * 0.2 +
            education_score * 0.1 +
            section_score * 0.1
        ) * 100
        
        return overall_score
