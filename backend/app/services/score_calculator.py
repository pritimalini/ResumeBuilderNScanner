import logging
from typing import Dict, Any, List
from datetime import datetime

from app.services.resume_processor import ResumeProcessor
from app.services.job_processor import JobProcessor
from app.schemas.responses import ScoringResponse, SectionScore, KeywordMatch, ResumeSection
from app.agents.matching_agent import MatchingAlgorithmAgent
from app.agents.score_agent import ScoringSystemAgent

logger = logging.getLogger(__name__)

class ScoreCalculator:
    """Service for calculating ATS scores by comparing resumes and job descriptions"""
    
    def __init__(self):
        self.resume_processor = ResumeProcessor()
        self.job_processor = JobProcessor()
        self.matching_agent = MatchingAlgorithmAgent()
        self.scoring_agent = ScoringSystemAgent()
    
    async def calculate(self, resume_id: str, job_id: str) -> ScoringResponse:
        """
        Calculate ATS score by comparing resume and job description
        
        Args:
            resume_id: The resume ID
            job_id: The job ID
            
        Returns:
            ScoringResponse: The scoring results
        """
        try:
            # Get resume data
            # In a real implementation, this would retrieve the stored resume data
            # For now, we'll simulate this
            resume_data = await self._get_resume_data(resume_id)
            
            # Get job data
            job_data = await self.job_processor.get_job_by_id(job_id)
            
            # Use matching agent to compare resume and job
            match_results = await self.matching_agent.compare(resume_data, job_data)
            
            # Use scoring agent to calculate scores
            scoring_results = await self.scoring_agent.calculate_scores(match_results)
            
            # Create section scores
            section_scores = []
            for section, data in scoring_results["section_scores"].items():
                section_scores.append(
                    SectionScore(
                        section=ResumeSection(section),
                        score=data["score"],
                        max_score=data["max_score"],
                        feedback=data["feedback"],
                        keywords_found=data.get("keywords_found", []),
                        keywords_missing=data.get("keywords_missing", [])
                    )
                )
            
            # Create keyword matches
            keyword_matches = []
            for keyword, data in scoring_results["keyword_matches"].items():
                keyword_matches.append(
                    KeywordMatch(
                        keyword=keyword,
                        found=data["found"],
                        importance=data["importance"],
                        context=data.get("context"),
                        section=ResumeSection(data["section"]) if "section" in data else None
                    )
                )
            
            # Create response
            response = ScoringResponse(
                resume_id=resume_id,
                job_id=job_id,
                overall_score=scoring_results["overall_score"],
                section_scores=section_scores,
                keyword_matches=keyword_matches,
                content_match_score=scoring_results["content_match_score"],
                format_compatibility_score=scoring_results["format_compatibility_score"],
                section_evaluation_score=scoring_results["section_evaluation_score"],
                timestamp=datetime.now()
            )
            
            return response
            
        except Exception as e:
            logger.error(f"Error calculating score: {str(e)}")
            raise
    
    async def _get_resume_data(self, resume_id: str) -> Dict[str, Any]:
        """
        Retrieve resume data by ID
        
        Args:
            resume_id: The resume ID
            
        Returns:
            Dict[str, Any]: The resume data
        """
        # In a real implementation, this would retrieve the stored resume data from a database
        # For now, we'll return a placeholder
        # This would be replaced with actual data retrieval logic
        
        # Placeholder for demonstration purposes
        return {
            "resume_id": resume_id,
            "parsed_content": {
                "contact_info": {
                    "name": "John Doe",
                    "email": "john.doe@example.com",
                    "phone": "123-456-7890"
                },
                "summary": "Experienced software engineer with expertise in Python and web development.",
                "experience": [
                    {
                        "company": "Tech Company",
                        "position": "Senior Software Engineer",
                        "start_date": "2018-01-01",
                        "end_date": "2023-01-01",
                        "description": [
                            "Developed and maintained web applications using Python and Django",
                            "Led a team of 5 developers on various projects",
                            "Implemented CI/CD pipelines using GitHub Actions"
                        ]
                    }
                ],
                "education": [
                    {
                        "institution": "University of Technology",
                        "degree": "Bachelor of Science",
                        "field_of_study": "Computer Science",
                        "start_date": "2014-09-01",
                        "end_date": "2018-05-01"
                    }
                ],
                "skills": [
                    {"name": "Python", "level": "expert"},
                    {"name": "Django", "level": "advanced"},
                    {"name": "JavaScript", "level": "intermediate"},
                    {"name": "Docker", "level": "intermediate"},
                    {"name": "AWS", "level": "intermediate"}
                ]
            }
        }
