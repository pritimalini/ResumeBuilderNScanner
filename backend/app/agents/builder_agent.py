import logging
from typing import Dict, Any, List
from datetime import datetime
import io

logger = logging.getLogger(__name__)

class ResumeBuilderAgent:
    """Agent for building ATS-optimized resumes"""
    
    async def build_resume(self, resume_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Build an ATS-optimized resume
        
        Args:
            resume_data: The resume builder request data
            
        Returns:
            Dict[str, Any]: The generated resume
        """
        try:
            # Initialize result structure
            result = {
                "docx_content": None,
                "pdf_content": None,
                "html_content": None,
                "text_content": None,
                "ats_score": 0.0,
                "target_job_match": None
            }
            
            # Generate resume content based on template
            template_id = resume_data.get("template_id", "modern")
            
            # Generate HTML content
            html_content = self._generate_html_resume(resume_data, template_id)
            result["html_content"] = html_content
            
            # Generate text content
            text_content = self._generate_text_resume(resume_data)
            result["text_content"] = text_content
            
            # Generate DOCX content (placeholder)
            # In a real implementation, this would use a library like python-docx
            docx_content = io.BytesIO()
            docx_content.write(b"Placeholder for DOCX content")
            result["docx_content"] = docx_content.getvalue()
            
            # Generate PDF content (placeholder)
            # In a real implementation, this would use a library like ReportLab or WeasyPrint
            pdf_content = io.BytesIO()
            pdf_content.write(b"Placeholder for PDF content")
            result["pdf_content"] = pdf_content.getvalue()
            
            # Calculate ATS score
            result["ats_score"] = self._calculate_ats_score(resume_data)
            
            # Calculate target job match if job description provided
            if resume_data.get("target_job_description"):
                result["target_job_match"] = self._calculate_job_match(resume_data)
            
            return result
            
        except Exception as e:
            logger.error(f"Error building resume: {str(e)}")
            raise
    
    def _generate_html_resume(self, resume_data: Dict[str, Any], template_id: str) -> str:
        """Generate HTML resume content"""
        # Extract data
        contact_info = resume_data.get("contact_info", {})
        summary = resume_data.get("summary", "")
        education = resume_data.get("education", [])
        experience = resume_data.get("experience", [])
        skills = resume_data.get("skills", [])
        projects = resume_data.get("projects", [])
        certifications = resume_data.get("certifications", [])
        languages = resume_data.get("languages", [])
        interests = resume_data.get("interests", [])
        references = resume_data.get("references", "")
        
        # Generate HTML based on template
        if template_id == "modern":
            html = self._generate_modern_template(
                contact_info, summary, education, experience, 
                skills, projects, certifications, languages, 
                interests, references
            )
        elif template_id == "professional":
            html = self._generate_professional_template(
                contact_info, summary, education, experience, 
                skills, projects, certifications, languages, 
                interests, references
            )
        elif template_id == "minimal":
            html = self._generate_minimal_template(
                contact_info, summary, education, experience, 
                skills, projects, certifications, languages, 
                interests, references
            )
        else:
            # Default to modern template
            html = self._generate_modern_template(
                contact_info, summary, education, experience, 
                skills, projects, certifications, languages, 
                interests, references
            )
        
        return html
    
    def _generate_modern_template(self, contact_info, summary, education, experience, 
                                skills, projects, certifications, languages, 
                                interests, references) -> str:
        """Generate HTML resume with modern template"""
        html = f"""
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>{contact_info.get('name', 'Resume')} - Resume</title>
            <style>
                body {{
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    line-height: 1.6;
                    color: #333;
                    margin: 0;
                    padding: 0;
                    background-color: #f9f9f9;
                }}
                .container {{
                    max-width: 800px;
                    margin: 0 auto;
                    background-color: white;
                    box-shadow: 0 0 10px rgba(0,0,0,0.1);
                    padding: 40px;
                }}
                header {{
                    text-align: center;
                    margin-bottom: 30px;
                }}
                h1 {{
                    color: #2c3e50;
                    margin: 0;
                    font-size: 36px;
                }}
                .contact-info {{
                    margin-top: 10px;
                    font-size: 14px;
                }}
                .contact-info a {{
                    color: #3498db;
                    text-decoration: none;
                }}
                .section {{
                    margin-bottom: 25px;
                }}
                h2 {{
                    color: #2c3e50;
                    border-bottom: 2px solid #3498db;
                    padding-bottom: 5px;
                    font-size: 22px;
                }}
                .item {{
                    margin-bottom: 15px;
                }}
                .item-header {{
                    display: flex;
                    justify-content: space-between;
                    font-weight: bold;
                }}
                .item-title {{
                    color: #2c3e50;
                }}
                .item-date {{
                    color: #7f8c8d;
                }}
                .item-subtitle {{
                    font-style: italic;
                    margin-bottom: 5px;
                }}
                .item-description {{
                    margin-top: 5px;
                }}
                .skills-list {{
                    display: flex;
                    flex-wrap: wrap;
                    gap: 10px;
                }}
                .skill {{
                    background-color: #eaf2f8;
                    padding: 5px 10px;
                    border-radius: 3px;
                    font-size: 14px;
                }}
                ul {{
                    padding-left: 20px;
                    margin-top: 5px;
                    margin-bottom: 5px;
                }}
                li {{
                    margin-bottom: 3px;
                }}
            </style>
        </head>
        <body>
            <div class="container">
                <header>
                    <h1>{contact_info.get('name', '')}</h1>
                    <div class="contact-info">
                        {contact_info.get('email', '')} | {contact_info.get('phone', '')}
                        {' | ' + contact_info.get('address', '') if contact_info.get('address') else ''}
                        {' | ' + f'<a href="{contact_info.get("linkedin", "")}" target="_blank">LinkedIn</a>' if contact_info.get('linkedin') else ''}
                        {' | ' + f'<a href="{contact_info.get("github", "")}" target="_blank">GitHub</a>' if contact_info.get('github') else ''}
                        {' | ' + f'<a href="{contact_info.get("website", "")}" target="_blank">Website</a>' if contact_info.get('website') else ''}
                    </div>
                </header>
        """
        
        # Summary Section
        if summary:
            html += f"""
                <div class="section">
                    <h2>Professional Summary</h2>
                    <p>{summary}</p>
                </div>
            """
        
        # Experience Section
        if experience:
            html += f"""
                <div class="section">
                    <h2>Professional Experience</h2>
            """
            
            for exp in experience:
                html += f"""
                    <div class="item">
                        <div class="item-header">
                            <span class="item-title">{exp.get('position', '')}</span>
                            <span class="item-date">{exp.get('start_date', '')} - {exp.get('end_date', 'Present') if not exp.get('current', False) else 'Present'}</span>
                        </div>
                        <div class="item-subtitle">{exp.get('company', '')}{', ' + exp.get('location', '') if exp.get('location') else ''}</div>
                """
                
                if exp.get('description'):
                    html += f"""
                        <ul class="item-description">
                    """
                    
                    if isinstance(exp['description'], list):
                        for desc in exp['description']:
                            html += f"""
                            <li>{desc}</li>
                            """
                    else:
                        html += f"""
                            <li>{exp['description']}</li>
                        """
                    
                    html += f"""
                        </ul>
                    """
                
                html += f"""
                    </div>
                """
            
            html += f"""
                </div>
            """
        
        # Education Section
        if education:
            html += f"""
                <div class="section">
                    <h2>Education</h2>
            """
            
            for edu in education:
                html += f"""
                    <div class="item">
                        <div class="item-header">
                            <span class="item-title">{edu.get('degree', '')}{' in ' + edu.get('field_of_study', '') if edu.get('field_of_study') else ''}</span>
                            <span class="item-date">{edu.get('start_date', '')} - {edu.get('end_date', 'Present') if not edu.get('current', False) else 'Present'}</span>
                        </div>
                        <div class="item-subtitle">{edu.get('institution', '')}{', ' + edu.get('location', '') if edu.get('location') else ''}</div>
                """
                
                if edu.get('gpa'):
                    html += f"""
                        <div>GPA: {edu.get('gpa')}</div>
                    """
                
                if edu.get('description'):
                    html += f"""
                        <p class="item-description">{edu.get('description')}</p>
                    """
                
                html += f"""
                    </div>
                """
            
            html += f"""
                </div>
            """
        
        # Skills Section
        if skills:
            html += f"""
                <div class="section">
                    <h2>Skills</h2>
                    <div class="skills-list">
            """
            
            for skill in skills:
                if isinstance(skill, dict) and 'name' in skill:
                    skill_name = skill['name']
                    skill_level = f" ({skill.get('level', '')})" if skill.get('level') else ""
                    html += f"""
                        <div class="skill">{skill_name}{skill_level}</div>
                    """
                elif isinstance(skill, str):
                    html += f"""
                        <div class="skill">{skill}</div>
                    """
            
            html += f"""
                    </div>
                </div>
            """
        
        # Projects Section
        if projects:
            html += f"""
                <div class="section">
                    <h2>Projects</h2>
            """
            
            for project in projects:
                html += f"""
                    <div class="item">
                        <div class="item-header">
                            <span class="item-title">{project.get('name', '')}</span>
                            <span class="item-date">{project.get('start_date', '')} - {project.get('end_date', 'Present') if not project.get('current', False) else 'Present'}</span>
                        </div>
                """
                
                if project.get('url'):
                    html += f"""
                        <div class="item-subtitle"><a href="{project.get('url')}" target="_blank">{project.get('url')}</a></div>
                    """
                
                if project.get('description'):
                    html += f"""
                        <p class="item-description">{project.get('description')}</p>
                    """
                
                if project.get('technologies'):
                    html += f"""
                        <div>Technologies: {', '.join(project.get('technologies'))}</div>
                    """
                
                html += f"""
                    </div>
                """
            
            html += f"""
                </div>
            """
        
        # Certifications Section
        if certifications:
            html += f"""
                <div class="section">
                    <h2>Certifications</h2>
            """
            
            for cert in certifications:
                html += f"""
                    <div class="item">
                        <div class="item-header">
                            <span class="item-title">{cert.get('name', '')}</span>
                            <span class="item-date">{cert.get('date_obtained', '')}{' - ' + cert.get('expiry_date', '') if cert.get('expiry_date') else ''}</span>
                        </div>
                        <div class="item-subtitle">{cert.get('issuer', '')}</div>
                """
                
                if cert.get('url'):
                    html += f"""
                        <div><a href="{cert.get('url')}" target="_blank">Credential</a></div>
                    """
                
                if cert.get('description'):
                    html += f"""
                        <p class="item-description">{cert.get('description')}</p>
                    """
                
                html += f"""
                    </div>
                """
            
            html += f"""
                </div>
            """
        
        # Languages Section
        if languages:
            html += f"""
                <div class="section">
                    <h2>Languages</h2>
                    <p>{', '.join(languages)}</p>
                </div>
            """
        
        # Interests Section
        if interests:
            html += f"""
                <div class="section">
                    <h2>Interests</h2>
                    <p>{', '.join(interests)}</p>
                </div>
            """
        
        # References Section
        if references:
            html += f"""
                <div class="section">
                    <h2>References</h2>
                    <p>{references}</p>
                </div>
            """
        
        html += f"""
            </div>
        </body>
        </html>
        """
        
        return html
    
    def _generate_professional_template(self, contact_info, summary, education, experience, 
                                      skills, projects, certifications, languages, 
                                      interests, references) -> str:
        """Generate HTML resume with professional template"""
        # Simplified implementation - in a real system this would be a complete template
        html = f"""
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>{contact_info.get('name', 'Resume')} - Resume</title>
            <style>
                body {{
                    font-family: 'Times New Roman', Times, serif;
                    line-height: 1.5;
                    color: #333;
                    margin: 0;
                    padding: 0;
                }}
                .container {{
                    max-width: 800px;
                    margin: 0 auto;
                    padding: 40px;
                }}
                /* Additional professional styling would go here */
            </style>
        </head>
        <body>
            <div class="container">
                <header>
                    <h1>{contact_info.get('name', '')}</h1>
                    <!-- Professional template content would go here -->
                </header>
                <p>Professional template content would be implemented here.</p>
            </div>
        </body>
        </html>
        """
        return html
    
    def _generate_minimal_template(self, contact_info, summary, education, experience, 
                                 skills, projects, certifications, languages, 
                                 interests, references) -> str:
        """Generate HTML resume with minimal template"""
        # Simplified implementation - in a real system this would be a complete template
        html = f"""
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>{contact_info.get('name', 'Resume')} - Resume</title>
            <style>
                body {{
                    font-family: Arial, sans-serif;
                    line-height: 1.4;
                    color: #333;
                    margin: 0;
                    padding: 0;
                }}
                .container {{
                    max-width: 800px;
                    margin: 0 auto;
                    padding: 40px;
                }}
                /* Additional minimal styling would go here */
            </style>
        </head>
        <body>
            <div class="container">
                <header>
                    <h1>{contact_info.get('name', '')}</h1>
                    <!-- Minimal template content would go here -->
                </header>
                <p>Minimal template content would be implemented here.</p>
            </div>
        </body>
        </html>
        """
        return html
    
    def _generate_text_resume(self, resume_data: Dict[str, Any]) -> str:
        """Generate plain text resume content"""
        # Extract data
        contact_info = resume_data.get("contact_info", {})
        summary = resume_data.get("summary", "")
        education = resume_data.get("education", [])
        experience = resume_data.get("experience", [])
        skills = resume_data.get("skills", [])
        projects = resume_data.get("projects", [])
        certifications = resume_data.get("certifications", [])
        languages = resume_data.get("languages", [])
        interests = resume_data.get("interests", [])
        references = resume_data.get("references", "")
        
        # Generate text content
        text = ""
        
        # Contact Information
        text += f"{contact_info.get('name', '').upper()}\n"
        text += f"{contact_info.get('email', '')}"
        if contact_info.get('phone'):
            text += f" | {contact_info.get('phone')}"
        if contact_info.get('address'):
            text += f" | {contact_info.get('address')}"
        if contact_info.get('linkedin'):
            text += f" | {contact_info.get('linkedin')}"
        text += "\n\n"
        
        # Summary
        if summary:
            text += "PROFESSIONAL SUMMARY\n"
            text += "-------------------\n"
            text += f"{summary}\n\n"
        
        # Experience
        if experience:
            text += "PROFESSIONAL EXPERIENCE\n"
            text += "----------------------\n"
            
            for exp in experience:
                text += f"{exp.get('position', '')} | {exp.get('company', '')}"
                if exp.get('location'):
                    text += f" | {exp.get('location')}"
                text += "\n"
                
                text += f"{exp.get('start_date', '')} - {exp.get('end_date', 'Present') if not exp.get('current', False) else 'Present'}\n"
                
                if exp.get('description'):
                    if isinstance(exp['description'], list):
                        for desc in exp['description']:
                            text += f"- {desc}\n"
                    else:
                        text += f"- {exp['description']}\n"
                
                text += "\n"
        
        # Education
        if education:
            text += "EDUCATION\n"
            text += "---------\n"
            
            for edu in education:
                text += f"{edu.get('degree', '')}"
                if edu.get('field_of_study'):
                    text += f" in {edu.get('field_of_study')}"
                text += f" | {edu.get('institution', '')}"
                if edu.get('location'):
                    text += f" | {edu.get('location')}"
                text += "\n"
                
                text += f"{edu.get('start_date', '')} - {edu.get('end_date', 'Present') if not edu.get('current', False) else 'Present'}\n"
                
                if edu.get('gpa'):
                    text += f"GPA: {edu.get('gpa')}\n"
                
                if edu.get('description'):
                    text += f"{edu.get('description')}\n"
                
                text += "\n"
        
        # Skills
        if skills:
            text += "SKILLS\n"
            text += "------\n"
            
            skill_texts = []
            for skill in skills:
                if isinstance(skill, dict) and 'name' in skill:
                    skill_text = skill['name']
                    if skill.get('level'):
                        skill_text += f" ({skill.get('level')})"
                    skill_texts.append(skill_text)
                elif isinstance(skill, str):
                    skill_texts.append(skill)
            
            text += ", ".join(skill_texts)
            text += "\n\n"
        
        # Projects
        if projects:
            text += "PROJECTS\n"
            text += "--------\n"
            
            for project in projects:
                text += f"{project.get('name', '')}"
                if project.get('start_date') or project.get('end_date'):
                    start = project.get('start_date', '')
                    end = project.get('end_date', 'Present') if not project.get('current', False) else 'Present'
                    text += f" | {start} - {end}"
                text += "\n"
                
                if project.get('url'):
                    text += f"{project.get('url')}\n"
                
                if project.get('description'):
                    text += f"{project.get('description')}\n"
                
                if project.get('technologies'):
                    text += f"Technologies: {', '.join(project.get('technologies'))}\n"
                
                text += "\n"
        
        # Certifications
        if certifications:
            text += "CERTIFICATIONS\n"
            text += "--------------\n"
            
            for cert in certifications:
                text += f"{cert.get('name', '')} | {cert.get('issuer', '')}"
                if cert.get('date_obtained'):
                    text += f" | {cert.get('date_obtained')}"
                text += "\n"
                
                if cert.get('description'):
                    text += f"{cert.get('description')}\n"
                
                text += "\n"
        
        # Languages
        if languages:
            text += "LANGUAGES\n"
            text += "---------\n"
            text += ", ".join(languages)
            text += "\n\n"
        
        # Interests
        if interests:
            text += "INTERESTS\n"
            text += "---------\n"
            text += ", ".join(interests)
            text += "\n\n"
        
        # References
        if references:
            text += "REFERENCES\n"
            text += "----------\n"
            text += references
            text += "\n"
        
        return text
    
    def _calculate_ats_score(self, resume_data: Dict[str, Any]) -> float:
        """Calculate ATS compatibility score"""
        # In a real implementation, this would use more sophisticated analysis
        # For this example, we'll use a simple scoring system
        
        score = 0.0
        max_score = 100.0
        
        # Check for essential sections
        if resume_data.get("contact_info", {}).get("name"):
            score += 5.0
        
        if resume_data.get("contact_info", {}).get("email"):
            score += 5.0
        
        if resume_data.get("contact_info", {}).get("phone"):
            score += 5.0
        
        if resume_data.get("summary"):
            score += 10.0
        
        if resume_data.get("experience"):
            score += 20.0
            
            # Check for detailed experience
            experience = resume_data.get("experience", [])
            for exp in experience:
                if exp.get("description") and (isinstance(exp["description"], list) and len(exp["description"]) >= 3):
                    score += 5.0
                    break
        
        if resume_data.get("education"):
            score += 15.0
        
        if resume_data.get("skills"):
            score += 15.0
            
            # Check for detailed skills
            if len(resume_data.get("skills", [])) >= 5:
                score += 5.0
        
        if resume_data.get("projects"):
            score += 5.0
        
        if resume_data.get("certifications"):
            score += 5.0
        
        # Check for target job description
        if resume_data.get("target_job_description"):
            score += 5.0
        
        return min(score, max_score)
    
    def _calculate_job_match(self, resume_data: Dict[str, Any]) -> float:
        """Calculate match percentage with target job"""
        # In a real implementation, this would use NLP to compare resume to job description
        # For this example, we'll use a placeholder
        
        # Placeholder for demonstration purposes
        return 75.0
