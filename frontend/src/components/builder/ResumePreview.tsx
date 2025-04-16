import React from 'react';
import { ResumeData } from '@/types';
import { FaDownload, FaEdit } from 'react-icons/fa';

interface ResumePreviewProps {
  resumeData: ResumeData;
  templateId: string;
  onEdit: (section: string) => void;
  onDownload: (format: 'pdf' | 'docx') => void;
}

const ResumePreview: React.FC<ResumePreviewProps> = ({ 
  resumeData, 
  templateId, 
  onEdit, 
  onDownload 
}) => {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Resume Preview</h3>
        <div className="flex space-x-3">
          <button 
            onClick={() => onDownload('pdf')} 
            className="btn btn-primary flex items-center"
          >
            <FaDownload className="mr-2" /> Download PDF
          </button>
          <button 
            onClick={() => onDownload('docx')} 
            className="btn btn-outline flex items-center"
          >
            <FaDownload className="mr-2" /> Download DOCX
          </button>
        </div>
      </div>

      <div className="card p-0 overflow-hidden">
        {/* Preview Header */}
        <div className="bg-secondary-800 text-white p-4">
          <div className="flex justify-between items-center">
            <h4 className="font-medium">Preview Mode</h4>
            <span className="text-sm bg-secondary-700 px-2 py-1 rounded">
              {templateId.charAt(0).toUpperCase() + templateId.slice(1)} Template
            </span>
          </div>
        </div>

        {/* Resume Preview Container */}
        <div className="bg-white border border-gray-200 mx-6 my-8 shadow-lg" style={{ aspectRatio: '8.5/11' }}>
          <div className="p-8 h-full overflow-auto">
            {/* Header / Contact Info */}
            <div className="mb-6 pb-4 border-b border-gray-200">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-2xl font-bold text-secondary-900">
                    {resumeData.personalInfo.firstName} {resumeData.personalInfo.lastName}
                  </h1>
                  <p className="text-secondary-700 mt-1">{resumeData.personalInfo.title || 'Professional Title'}</p>
                </div>
                <button 
                  onClick={() => onEdit('personalInfo')} 
                  className="text-primary-600 hover:text-primary-800"
                >
                  <FaEdit />
                </button>
              </div>
              <div className="mt-3 text-sm text-secondary-600 flex flex-wrap gap-x-4 gap-y-1">
                <span>{resumeData.personalInfo.email}</span>
                <span>{resumeData.personalInfo.phone}</span>
                <span>{resumeData.personalInfo.location}</span>
                {resumeData.personalInfo.linkedin && <span>{resumeData.personalInfo.linkedin}</span>}
                {resumeData.personalInfo.website && <span>{resumeData.personalInfo.website}</span>}
              </div>
            </div>

            {/* Summary */}
            <div className="mb-6">
              <div className="flex justify-between items-start">
                <h2 className="text-lg font-semibold text-secondary-900 mb-2">Professional Summary</h2>
                <button 
                  onClick={() => onEdit('summary')} 
                  className="text-primary-600 hover:text-primary-800"
                >
                  <FaEdit />
                </button>
              </div>
              <p className="text-sm text-secondary-700">{resumeData.summary}</p>
            </div>

            {/* Experience */}
            {resumeData.workExperience.length > 0 && (
              <div className="mb-6">
                <div className="flex justify-between items-start">
                  <h2 className="text-lg font-semibold text-secondary-900 mb-2">Work Experience</h2>
                  <button 
                    onClick={() => onEdit('workExperience')} 
                    className="text-primary-600 hover:text-primary-800"
                  >
                    <FaEdit />
                  </button>
                </div>
                <div className="space-y-4">
                  {resumeData.workExperience.map((exp) => (
                    <div key={exp.id}>
                      <div className="flex justify-between">
                        <h3 className="font-medium text-secondary-900">{exp.title}</h3>
                        <span className="text-sm text-secondary-600">
                          {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                        </span>
                      </div>
                      <p className="text-sm text-secondary-700">{exp.company}{exp.location ? `, ${exp.location}` : ''}</p>
                      <p className="text-sm text-secondary-600 mt-1">{exp.description}</p>
                      {exp.achievements.length > 0 && (
                        <ul className="mt-2 text-sm text-secondary-600 list-disc pl-5 space-y-1">
                          {exp.achievements.map((achievement, i) => (
                            <li key={i}>{achievement}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education */}
            {resumeData.education.length > 0 && (
              <div className="mb-6">
                <div className="flex justify-between items-start">
                  <h2 className="text-lg font-semibold text-secondary-900 mb-2">Education</h2>
                  <button 
                    onClick={() => onEdit('education')} 
                    className="text-primary-600 hover:text-primary-800"
                  >
                    <FaEdit />
                  </button>
                </div>
                <div className="space-y-4">
                  {resumeData.education.map((edu) => (
                    <div key={edu.id}>
                      <div className="flex justify-between">
                        <h3 className="font-medium text-secondary-900">{edu.degree} in {edu.field}</h3>
                        <span className="text-sm text-secondary-600">
                          {edu.startDate} - {edu.current ? 'Present' : edu.endDate}
                        </span>
                      </div>
                      <p className="text-sm text-secondary-700">
                        {edu.institution}{edu.location ? `, ${edu.location}` : ''}
                        {edu.gpa && ` • GPA: ${edu.gpa}`}
                      </p>
                      {edu.achievements && edu.achievements.length > 0 && (
                        <ul className="mt-2 text-sm text-secondary-600 list-disc pl-5 space-y-1">
                          {edu.achievements.map((achievement, i) => (
                            <li key={i}>{achievement}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Skills */}
            {resumeData.skills.length > 0 && (
              <div className="mb-6">
                <div className="flex justify-between items-start">
                  <h2 className="text-lg font-semibold text-secondary-900 mb-2">Skills</h2>
                  <button 
                    onClick={() => onEdit('skills')} 
                    className="text-primary-600 hover:text-primary-800"
                  >
                    <FaEdit />
                  </button>
                </div>
                
                {/* Group skills by category */}
                {(() => {
                  const groupedSkills: { [key: string]: typeof resumeData.skills } = {};
                  
                  resumeData.skills.forEach(skill => {
                    const category = skill.category || 'Other';
                    if (!groupedSkills[category]) {
                      groupedSkills[category] = [];
                    }
                    groupedSkills[category].push(skill);
                  });
                  
                  return Object.entries(groupedSkills).map(([category, skills]) => (
                    <div key={category} className="mb-3">
                      <h3 className="text-sm font-medium text-secondary-800 mb-1">{category}:</h3>
                      <p className="text-sm text-secondary-600">
                        {skills.map(skill => skill.name).join(', ')}
                      </p>
                    </div>
                  ));
                })()}
              </div>
            )}

            {/* Certifications */}
            {resumeData.certifications && resumeData.certifications.length > 0 && (
              <div className="mb-6">
                <div className="flex justify-between items-start">
                  <h2 className="text-lg font-semibold text-secondary-900 mb-2">Certifications</h2>
                  <button 
                    onClick={() => onEdit('certifications')} 
                    className="text-primary-600 hover:text-primary-800"
                  >
                    <FaEdit />
                  </button>
                </div>
                <div className="space-y-2">
                  {resumeData.certifications.map((cert) => (
                    <div key={cert.id} className="flex justify-between">
                      <div>
                        <span className="font-medium text-secondary-800">{cert.name}</span>
                        <span className="text-sm text-secondary-600 ml-2">({cert.issuer})</span>
                      </div>
                      <span className="text-sm text-secondary-600">{cert.date}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Projects */}
            {resumeData.projects && resumeData.projects.length > 0 && (
              <div className="mb-6">
                <div className="flex justify-between items-start">
                  <h2 className="text-lg font-semibold text-secondary-900 mb-2">Projects</h2>
                  <button 
                    onClick={() => onEdit('projects')} 
                    className="text-primary-600 hover:text-primary-800"
                  >
                    <FaEdit />
                  </button>
                </div>
                <div className="space-y-3">
                  {resumeData.projects.map((project) => (
                    <div key={project.id}>
                      <div className="flex justify-between">
                        <h3 className="font-medium text-secondary-900">{project.name}</h3>
                        {(project.startDate || project.endDate) && (
                          <span className="text-sm text-secondary-600">
                            {project.startDate}{project.endDate ? ` - ${project.endDate}` : ''}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-secondary-600 mt-1">{project.description}</p>
                      {project.technologies && project.technologies.length > 0 && (
                        <p className="text-sm text-secondary-600 mt-1">
                          <span className="font-medium">Technologies:</span> {project.technologies.join(', ')}
                        </p>
                      )}
                      {project.url && (
                        <p className="text-sm text-primary-600 mt-1">
                          <a href={project.url} target="_blank" rel="noopener noreferrer">{project.url}</a>
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Languages */}
            {resumeData.languages && resumeData.languages.length > 0 && (
              <div>
                <div className="flex justify-between items-start">
                  <h2 className="text-lg font-semibold text-secondary-900 mb-2">Languages</h2>
                  <button 
                    onClick={() => onEdit('languages')} 
                    className="text-primary-600 hover:text-primary-800"
                  >
                    <FaEdit />
                  </button>
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-2">
                  {resumeData.languages.map((language) => (
                    <div key={language.id} className="text-sm">
                      <span className="font-medium text-secondary-800">{language.name}</span>
                      <span className="text-secondary-600"> - {language.proficiency}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-secondary-50 p-4 rounded-md">
        <h4 className="text-sm font-medium mb-2">ATS Optimization Tips:</h4>
        <ul className="text-sm text-secondary-700 space-y-1 list-disc pl-5">
          <li>Your resume is formatted in an ATS-friendly way</li>
          <li>Use the download options to get your resume in PDF or DOCX format</li>
          <li>Remember to tailor your resume for each job application</li>
          <li>Use our Resume Scanner to test your resume against specific job descriptions</li>
        </ul>
      </div>
    </div>
  );
};

export default ResumePreview;
