import logging
from typing import Dict, Any, List

logger = logging.getLogger(__name__)

class ScoringSystemAgent:
    """Agent for calculating ATS compatibility scores for resumes"""
    
    async def calculate_scores(self, match_results: Dict[str, Any]) -> Dict[str, Any]:
        """
        Calculate ATS compatibility scores based on matching results
        
        Args:
            match_results: The results from the matching algorithm
            
        Returns:
            Dict[str, Any]: Scoring results
        """
        try:
            # Initialize result structure
            result = {
                "overall_score": 0.0,
                "content_match_score": 0.0,
                "format_compatibility_score": 0.0,
                "section_evaluation_score": 0.0,
                "section_scores": {},
                "keyword_matches": match_results.get("keyword_matches", {})
            }
            
            # Calculate content match score (40 points)
            result["content_match_score"] = self._calculate_content_match_score(match_results)
            
            # Calculate format compatibility score (25 points)
            result["format_compatibility_score"] = self._calculate_format_compatibility_score(match_results)
            
            # Calculate section evaluation score (35 points)
            result["section_evaluation_score"] = self._calculate_section_evaluation_score(match_results)
            
            # Calculate section scores
            result["section_scores"] = self._calculate_section_scores(match_results)
            
            # Calculate overall score
            result["overall_score"] = (
                result["content_match_score"] +
                result["format_compatibility_score"] +
                result["section_evaluation_score"]
            )
            
            return result
            
        except Exception as e:
            logger.error(f"Error calculating scores: {str(e)}")
            raise
    
    def _calculate_content_match_score(self, match_results: Dict[str, Any]) -> float:
        """
        Calculate content match score (40 points)
        - Keyword presence and relevance (20 points)
        - Skills alignment (10 points)
        - Experience relevance (10 points)
        """
        score = 0.0
        
        # Keyword presence and relevance (20 points)
        keyword_matches = match_results.get("keyword_matches", {})
        if keyword_matches:
            # Calculate weighted keyword score
            total_importance = sum(match["importance"] for match in keyword_matches.values())
            matched_importance = sum(match["importance"] for match in keyword_matches.values() if match["found"])
            
            keyword_score = (matched_importance / total_importance) if total_importance > 0 else 0
            score += keyword_score * 20
        
        # Skills alignment (10 points)
        skill_matches = match_results.get("skill_matches", {})
        if skill_matches:
            matched = len(skill_matches.get("matched", []))
            total = matched + len(skill_matches.get("missing", []))
            
            skill_score = (matched / total) if total > 0 else 0
            score += skill_score * 10
        
        # Experience relevance (10 points)
        experience_match = match_results.get("experience_match", {})
        if experience_match:
            # Years match (3 points)
            if experience_match.get("years_match", False):
                score += 3
            
            # Level match (3 points)
            if experience_match.get("level_match", False):
                score += 3
            
            # Relevance score (4 points)
            relevance_score = experience_match.get("relevance_score", 0.0)
            score += relevance_score * 4
        
        return score
    
    def _calculate_format_compatibility_score(self, match_results: Dict[str, Any]) -> float:
        """
        Calculate format compatibility score (25 points)
        - Structure clarity (10 points)
        - Standard section organization (5 points)
        - Machine readability (10 points)
        """
        # For this example, we'll use placeholder scores
        # In a real implementation, this would analyze the resume format
        
        # Structure clarity (10 points)
        structure_score = 8.0  # Placeholder
        
        # Standard section organization (5 points)
        organization_score = 4.0  # Placeholder
        
        # Machine readability (10 points)
        readability_score = 7.0  # Placeholder
        
        return structure_score + organization_score + readability_score
    
    def _calculate_section_evaluation_score(self, match_results: Dict[str, Any]) -> float:
        """
        Calculate section evaluation score (35 points)
        - Professional summary/objective (5 points)
        - Work experience formatting and content (15 points)
        - Education and certifications (5 points)
        - Skills presentation (10 points)
        """
        score = 0.0
        
        # Get section matches
        section_matches = match_results.get("section_matches", {})
        
        # Professional summary/objective (5 points)
        summary_score = section_matches.get("summary", 0.0) * 5
        score += summary_score
        
        # Work experience formatting and content (15 points)
        experience_score = section_matches.get("experience", 0.0) * 15
        score += experience_score
        
        # Education and certifications (5 points)
        education_match = match_results.get("education_match", {})
        education_score = 0.0
        
        if education_match.get("level_match", False):
            education_score += 2.5
        
        if education_match.get("field_match", False):
            education_score += 2.5
        
        score += education_score
        
        # Skills presentation (10 points)
        skills_score = section_matches.get("skills", 0.0) * 10
        score += skills_score
        
        return score
    
    def _calculate_section_scores(self, match_results: Dict[str, Any]) -> Dict[str, Dict[str, Any]]:
        """Calculate detailed scores for each resume section"""
        section_scores = {}
        
        # Summary section
        section_scores["summary"] = {
            "score": match_results.get("section_matches", {}).get("summary", 0.0) * 5,
            "max_score": 5.0,
            "feedback": self._generate_summary_feedback(match_results),
            "keywords_found": self._get_keywords_in_section(match_results, "summary"),
            "keywords_missing": []
        }
        
        # Experience section
        section_scores["experience"] = {
            "score": match_results.get("section_matches", {}).get("experience", 0.0) * 15,
            "max_score": 15.0,
            "feedback": self._generate_experience_feedback(match_results),
            "keywords_found": self._get_keywords_in_section(match_results, "experience"),
            "keywords_missing": []
        }
        
        # Education section
        education_match = match_results.get("education_match", {})
        education_score = 0.0
        
        if education_match.get("level_match", False):
            education_score += 2.5
        
        if education_match.get("field_match", False):
            education_score += 2.5
        
        section_scores["education"] = {
            "score": education_score,
            "max_score": 5.0,
            "feedback": self._generate_education_feedback(match_results),
            "keywords_found": self._get_keywords_in_section(match_results, "education"),
            "keywords_missing": []
        }
        
        # Skills section
        section_scores["skills"] = {
            "score": match_results.get("section_matches", {}).get("skills", 0.0) * 10,
            "max_score": 10.0,
            "feedback": self._generate_skills_feedback(match_results),
            "keywords_found": [skill for skill in match_results.get("skill_matches", {}).get("matched", [])],
            "keywords_missing": [skill for skill in match_results.get("skill_matches", {}).get("missing", [])]
        }
        
        return section_scores
    
    def _generate_summary_feedback(self, match_results: Dict[str, Any]) -> str:
        """Generate feedback for the summary section"""
        summary_score = match_results.get("section_matches", {}).get("summary", 0.0)
        
        if summary_score >= 0.8:
            return "Excellent summary that effectively highlights your qualifications for the role."
        elif summary_score >= 0.6:
            return "Good summary, but could be more tailored to the specific job requirements."
        elif summary_score >= 0.4:
            return "Average summary that mentions some relevant qualifications but lacks specificity."
        else:
            return "Summary needs improvement. Consider adding more job-specific keywords and highlighting relevant qualifications."
    
    def _generate_experience_feedback(self, match_results: Dict[str, Any]) -> str:
        """Generate feedback for the experience section"""
        experience_score = match_results.get("section_matches", {}).get("experience", 0.0)
        experience_match = match_results.get("experience_match", {})
        
        feedback = ""
        
        if experience_match.get("years_match", False):
            feedback += "Your years of experience meet the job requirements. "
        else:
            feedback += "Your resume may not clearly demonstrate the required years of experience. "
        
        if experience_match.get("level_match", False):
            feedback += "Your experience level aligns with the job requirements. "
        else:
            feedback += "Consider highlighting experience that better matches the required level. "
        
        if experience_score >= 0.8:
            feedback += "Your experience descriptions effectively demonstrate relevant skills and achievements."
        elif experience_score >= 0.6:
            feedback += "Your experience descriptions are good but could include more job-specific accomplishments."
        elif experience_score >= 0.4:
            feedback += "Consider revising your experience descriptions to better highlight relevant skills and achievements."
        else:
            feedback += "Your experience descriptions need significant improvement to demonstrate relevance to the job."
        
        return feedback
    
    def _generate_education_feedback(self, match_results: Dict[str, Any]) -> str:
        """Generate feedback for the education section"""
        education_match = match_results.get("education_match", {})
        
        if education_match.get("level_match", False) and education_match.get("field_match", False):
            return "Your education credentials fully meet the job requirements."
        elif education_match.get("level_match", False):
            return "Your education level meets the requirements, but consider highlighting relevance to the required field of study."
        elif education_match.get("field_match", False):
            return "Your field of study is relevant, but your education level may not meet the requirements."
        else:
            return "Your education credentials may not meet the job requirements. Consider highlighting other relevant qualifications or certifications."
    
    def _generate_skills_feedback(self, match_results: Dict[str, Any]) -> str:
        """Generate feedback for the skills section"""
        skill_matches = match_results.get("skill_matches", {})
        matched = len(skill_matches.get("matched", []))
        missing = len(skill_matches.get("missing", []))
        total = matched + missing
        
        if total == 0:
            return "No specific skills were identified for comparison."
        
        match_percentage = (matched / total) if total > 0 else 0
        
        if match_percentage >= 0.8:
            return "Excellent skills match. Your resume includes most of the required skills for this position."
        elif match_percentage >= 0.6:
            return "Good skills match. Consider adding some of the missing skills if you have them."
        elif match_percentage >= 0.4:
            return "Average skills match. Your resume is missing several key skills required for this position."
        else:
            return "Poor skills match. Your resume is missing many of the required skills for this position."
    
    def _get_keywords_in_section(self, match_results: Dict[str, Any], section: str) -> List[str]:
        """Get keywords found in a specific section"""
        keywords = []
        
        keyword_matches = match_results.get("keyword_matches", {})
        for keyword, match in keyword_matches.items():
            if match.get("found", False) and match.get("section") == section:
                keywords.append(keyword)
        
        return keywords
