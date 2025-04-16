import logging
from typing import Dict, Any, List

logger = logging.getLogger(__name__)

class RecommendationAgent:
    """Agent for generating recommendations to improve resume ATS scores"""
    
    async def generate_recommendations(self, resume_data: Dict[str, Any], job_data: Dict[str, Any], score_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Generate recommendations for improving resume ATS score
        
        Args:
            resume_data: The processed resume data
            job_data: The processed job data
            score_data: The scoring results
            
        Returns:
            Dict[str, Any]: Recommendation results
        """
        try:
            # Initialize result structure
            result = {
                "recommendations": [],
                "potential_score_increase": 0.0
            }
            
            # Generate recommendations for each section
            self._generate_summary_recommendations(resume_data, job_data, score_data, result)
            self._generate_experience_recommendations(resume_data, job_data, score_data, result)
            self._generate_education_recommendations(resume_data, job_data, score_data, result)
            self._generate_skills_recommendations(resume_data, job_data, score_data, result)
            self._generate_format_recommendations(resume_data, job_data, score_data, result)
            
            # Calculate potential score increase
            result["potential_score_increase"] = self._calculate_potential_increase(result["recommendations"])
            
            return result
            
        except Exception as e:
            logger.error(f"Error generating recommendations: {str(e)}")
            raise
    
    def _generate_summary_recommendations(self, resume_data: Dict[str, Any], job_data: Dict[str, Any], score_data: Dict[str, Any], result: Dict[str, Any]):
        """Generate recommendations for the summary section"""
        parsed_content = resume_data.get("parsed_content", {})
        summary = parsed_content.get("summary", "")
        
        # Get section score
        section_score = score_data.get("section_scores", {}).get("summary", {})
        score = section_score.get("score", 0.0)
        max_score = section_score.get("max_score", 5.0)
        
        # If score is already high, no need for recommendations
        if score >= 0.8 * max_score:
            return
        
        # Check if summary exists
        if not summary:
            result["recommendations"].append({
                "section": "summary",
                "recommendation": "Add a professional summary that highlights your qualifications for the role.",
                "impact": 0.8,
                "implementation_difficulty": "medium",
                "before_example": None,
                "after_example": f"Experienced professional with expertise in {', '.join(job_data.get('required_skills', [])[:3])} seeking a {job_data.get('title', 'position')} role where I can leverage my skills in {', '.join(job_data.get('required_skills', [])[3:6])} to drive results."
            })
            return
        
        # Check for keyword inclusion
        missing_keywords = []
        for keyword, match in score_data.get("keyword_matches", {}).items():
            if match.get("importance", 0) > 0.7 and not match.get("found", False):
                missing_keywords.append(keyword)
        
        if missing_keywords:
            result["recommendations"].append({
                "section": "summary",
                "recommendation": f"Include key job-specific terms in your summary: {', '.join(missing_keywords[:5])}.",
                "impact": 0.6,
                "implementation_difficulty": "easy",
                "before_example": summary[:100] + "..." if len(summary) > 100 else summary,
                "after_example": f"Experienced professional with expertise in {', '.join(missing_keywords[:3])} seeking to leverage skills in {', '.join(missing_keywords[3:5])} to drive results."
            })
        
        # Check summary length
        if len(summary.split()) < 30:
            result["recommendations"].append({
                "section": "summary",
                "recommendation": "Expand your summary to better highlight your qualifications and include more relevant keywords.",
                "impact": 0.5,
                "implementation_difficulty": "medium",
                "before_example": summary,
                "after_example": None
            })
    
    def _generate_experience_recommendations(self, resume_data: Dict[str, Any], job_data: Dict[str, Any], score_data: Dict[str, Any], result: Dict[str, Any]):
        """Generate recommendations for the experience section"""
        parsed_content = resume_data.get("parsed_content", {})
        experience = parsed_content.get("experience", [])
        
        # Get section score
        section_score = score_data.get("section_scores", {}).get("experience", {})
        score = section_score.get("score", 0.0)
        max_score = section_score.get("max_score", 15.0)
        
        # If score is already high, no need for recommendations
        if score >= 0.8 * max_score:
            return
        
        # Check if experience exists
        if not experience:
            result["recommendations"].append({
                "section": "experience",
                "recommendation": "Add detailed work experience with bullet points highlighting achievements and responsibilities.",
                "impact": 0.9,
                "implementation_difficulty": "hard",
                "before_example": None,
                "after_example": None
            })
            return
        
        # Check for action verbs
        has_action_verbs = False
        action_verbs = ["Achieved", "Implemented", "Developed", "Led", "Managed", "Created", "Improved", "Reduced", "Increased", "Delivered"]
        
        for exp in experience:
            if "description" in exp:
                if isinstance(exp["description"], list):
                    for desc in exp["description"]:
                        if any(verb.lower() in desc.lower() for verb in action_verbs):
                            has_action_verbs = True
                            break
                else:
                    if any(verb.lower() in exp["description"].lower() for verb in action_verbs):
                        has_action_verbs = True
                        break
        
        if not has_action_verbs:
            result["recommendations"].append({
                "section": "experience",
                "recommendation": "Use strong action verbs to start your bullet points (e.g., Achieved, Implemented, Developed, Led).",
                "impact": 0.7,
                "implementation_difficulty": "easy",
                "before_example": "Responsible for project management and team coordination.",
                "after_example": "Led cross-functional teams to deliver projects 15% ahead of schedule and under budget."
            })
        
        # Check for quantifiable achievements
        has_quantifiable = False
        for exp in experience:
            if "description" in exp:
                if isinstance(exp["description"], list):
                    for desc in exp["description"]:
                        if any(char.isdigit() for char in desc):
                            has_quantifiable = True
                            break
                else:
                    if any(char.isdigit() for char in exp["description"]):
                        has_quantifiable = True
                        break
        
        if not has_quantifiable:
            result["recommendations"].append({
                "section": "experience",
                "recommendation": "Add quantifiable achievements with metrics and percentages to demonstrate impact.",
                "impact": 0.8,
                "implementation_difficulty": "medium",
                "before_example": "Improved team productivity and reduced costs.",
                "after_example": "Improved team productivity by 30% and reduced operational costs by $50,000 annually."
            })
        
        # Check for keyword inclusion
        missing_keywords = []
        for keyword, match in score_data.get("keyword_matches", {}).items():
            if match.get("importance", 0) > 0.7 and not match.get("found", False):
                missing_keywords.append(keyword)
        
        if missing_keywords:
            result["recommendations"].append({
                "section": "experience",
                "recommendation": f"Incorporate these key job-specific terms in your experience descriptions: {', '.join(missing_keywords[:5])}.",
                "impact": 0.7,
                "implementation_difficulty": "medium",
                "before_example": None,
                "after_example": None
            })
    
    def _generate_education_recommendations(self, resume_data: Dict[str, Any], job_data: Dict[str, Any], score_data: Dict[str, Any], result: Dict[str, Any]):
        """Generate recommendations for the education section"""
        parsed_content = resume_data.get("parsed_content", {})
        education = parsed_content.get("education", [])
        
        # Get section score
        section_score = score_data.get("section_scores", {}).get("education", {})
        score = section_score.get("score", 0.0)
        max_score = section_score.get("max_score", 5.0)
        
        # If score is already high, no need for recommendations
        if score >= 0.8 * max_score:
            return
        
        # Check if education exists
        if not education:
            result["recommendations"].append({
                "section": "education",
                "recommendation": "Add your educational background, including degrees, institutions, and graduation dates.",
                "impact": 0.6,
                "implementation_difficulty": "easy",
                "before_example": None,
                "after_example": None
            })
            return
        
        # Check education match
        education_match = score_data.get("education_match", {})
        
        if not education_match.get("level_match", True):
            result["recommendations"].append({
                "section": "education",
                "recommendation": "Highlight your highest level of education more prominently to meet job requirements.",
                "impact": 0.5,
                "implementation_difficulty": "easy",
                "before_example": None,
                "after_example": None
            })
        
        if not education_match.get("field_match", True):
            result["recommendations"].append({
                "section": "education",
                "recommendation": "Emphasize coursework or projects related to the required field of study.",
                "impact": 0.4,
                "implementation_difficulty": "medium",
                "before_example": None,
                "after_example": None
            })
        
        # Check for GPA
        has_gpa = False
        for edu in education:
            if "gpa" in edu and edu["gpa"]:
                has_gpa = True
                break
        
        if not has_gpa and any(edu.get("end_date", "2010") >= "2018" for edu in education):
            result["recommendations"].append({
                "section": "education",
                "recommendation": "Include your GPA if it's 3.0 or higher and you've graduated within the last 5 years.",
                "impact": 0.3,
                "implementation_difficulty": "easy",
                "before_example": None,
                "after_example": None
            })
    
    def _generate_skills_recommendations(self, resume_data: Dict[str, Any], job_data: Dict[str, Any], score_data: Dict[str, Any], result: Dict[str, Any]):
        """Generate recommendations for the skills section"""
        parsed_content = resume_data.get("parsed_content", {})
        skills = parsed_content.get("skills", [])
        
        # Get section score
        section_score = score_data.get("section_scores", {}).get("skills", {})
        score = section_score.get("score", 0.0)
        max_score = section_score.get("max_score", 10.0)
        
        # If score is already high, no need for recommendations
        if score >= 0.8 * max_score:
            return
        
        # Check if skills exists
        if not skills:
            result["recommendations"].append({
                "section": "skills",
                "recommendation": "Add a dedicated skills section that lists your technical and soft skills.",
                "impact": 0.8,
                "implementation_difficulty": "easy",
                "before_example": None,
                "after_example": None
            })
            return
        
        # Check for missing skills
        missing_skills = score_data.get("section_scores", {}).get("skills", {}).get("keywords_missing", [])
        
        if missing_skills:
            # Filter to skills that the person might actually have
            relevant_missing_skills = []
            for skill in missing_skills:
                # Check if skill is mentioned elsewhere in the resume
                if skill.lower() in str(parsed_content).lower():
                    relevant_missing_skills.append(skill)
            
            if relevant_missing_skills:
                result["recommendations"].append({
                    "section": "skills",
                    "recommendation": f"Add these key skills that are mentioned in your resume but not in your skills section: {', '.join(relevant_missing_skills[:5])}.",
                    "impact": 0.7,
                    "implementation_difficulty": "easy",
                    "before_example": None,
                    "after_example": None
                })
            
            # Recommend adding missing required skills
            required_missing = [skill for skill in missing_skills if skill in job_data.get("required_skills", [])]
            if required_missing:
                result["recommendations"].append({
                    "section": "skills",
                    "recommendation": f"If you have these skills, add them to your skills section as they are required for the job: {', '.join(required_missing[:5])}.",
                    "impact": 0.8,
                    "implementation_difficulty": "medium",
                    "before_example": None,
                    "after_example": None
                })
        
        # Check skills format
        skills_format_ok = all(isinstance(skill, dict) and "name" in skill for skill in skills)
        
        if not skills_format_ok:
            result["recommendations"].append({
                "section": "skills",
                "recommendation": "Format your skills section as a clear, scannable list rather than paragraph format.",
                "impact": 0.5,
                "implementation_difficulty": "easy",
                "before_example": "Proficient in Python, Java, and SQL with experience in data analysis and project management.",
                "after_example": "Technical Skills: Python, Java, SQL\nData Skills: Data Analysis, Visualization\nOther: Project Management, Agile Methodology"
            })
    
    def _generate_format_recommendations(self, resume_data: Dict[str, Any], job_data: Dict[str, Any], score_data: Dict[str, Any], result: Dict[str, Any]):
        """Generate recommendations for resume format"""
        # Check format compatibility score
        format_score = score_data.get("format_compatibility_score", 0.0)
        
        # If score is already high, no need for recommendations
        if format_score >= 20.0:
            return
        
        # General format recommendations
        result["recommendations"].append({
            "section": "format",
            "recommendation": "Use a clean, ATS-friendly resume template with standard section headings.",
            "impact": 0.6,
            "implementation_difficulty": "medium",
            "before_example": None,
            "after_example": None
        })
        
        result["recommendations"].append({
            "section": "format",
            "recommendation": "Ensure your contact information is at the top of the resume and includes phone, email, and LinkedIn.",
            "impact": 0.4,
            "implementation_difficulty": "easy",
            "before_example": None,
            "after_example": None
        })
        
        result["recommendations"].append({
            "section": "format",
            "recommendation": "Use standard section headings (e.g., 'Experience' instead of 'Career Journey').",
            "impact": 0.5,
            "implementation_difficulty": "easy",
            "before_example": "Career Journey",
            "after_example": "Professional Experience"
        })
        
        # File format recommendation
        result["recommendations"].append({
            "section": "format",
            "recommendation": "Submit your resume as a .docx or .pdf file to ensure compatibility with ATS systems.",
            "impact": 0.3,
            "implementation_difficulty": "easy",
            "before_example": None,
            "after_example": None
        })
    
    def _calculate_potential_increase(self, recommendations: List[Dict[str, Any]]) -> float:
        """Calculate the potential score increase from implementing recommendations"""
        # Calculate weighted impact
        total_impact = 0.0
        
        for rec in recommendations:
            impact = rec.get("impact", 0.0)
            
            # Adjust impact based on difficulty
            difficulty = rec.get("implementation_difficulty", "medium")
            if difficulty == "easy":
                difficulty_factor = 1.0
            elif difficulty == "medium":
                difficulty_factor = 0.8
            else:  # hard
                difficulty_factor = 0.6
            
            total_impact += impact * difficulty_factor
        
        # Cap the potential increase
        max_increase = 30.0  # Maximum possible increase in points
        potential_increase = min(total_impact * 10.0, max_increase)
        
        return potential_increase
