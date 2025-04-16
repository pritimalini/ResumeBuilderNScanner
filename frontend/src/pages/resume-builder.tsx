import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import LoadingOverlay from '@/components/common/LoadingOverlay';
import { useTheme } from '@/context/ThemeContext';
import PersonalInfoForm from '@/components/builder/PersonalInfoForm';
import SummaryForm from '@/components/builder/SummaryForm';
import WorkExperienceForm from '@/components/builder/WorkExperienceForm';
import EducationForm from '@/components/builder/EducationForm';
import SkillsForm from '@/components/builder/SkillsForm';
import TemplateSelector from '@/components/builder/TemplateSelector';
import ResumePreview from '@/components/builder/ResumePreview';
import { ResumeData, WorkExperience, Education, Skill } from '@/types';
import { builderApi } from '@/services/api';

const ResumeBuilder: React.FC = () => {
  const { theme } = useTheme();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [templateId, setTemplateId] = useState<string>('');
  
  // Resume data state
  const [resumeData, setResumeData] = useState<ResumeData>({
    personalInfo: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      location: '',
      linkedin: '',
      website: '',
      // Remove the title property as it's not in the type definition
    },
    summary: '',
    workExperience: [],
    education: [],
    skills: [],
    certifications: [],
    projects: [],
    languages: []
  });
  
  const steps = [
    'Personal Information',
    'Professional Summary',
    'Work Experience',
    'Education',
    'Skills',
    'Template Selection',
    'Review & Download'
  ];

  // Handle form submissions for each step
  const handlePersonalInfoSubmit = (data: any) => {
    setResumeData(prev => ({
      ...prev,
      personalInfo: data
    }));
    setCurrentStep(prev => prev + 1);
  };

  const handleSummarySubmit = (data: { summary: string }) => {
    setResumeData(prev => ({
      ...prev,
      summary: data.summary
    }));
    setCurrentStep(prev => prev + 1);
  };

  const handleWorkExperienceSubmit = (data: WorkExperience[]) => {
    setResumeData(prev => ({
      ...prev,
      workExperience: data
    }));
    setCurrentStep(prev => prev + 1);
  };

  const handleEducationSubmit = (data: Education[]) => {
    setResumeData(prev => ({
      ...prev,
      education: data
    }));
    setCurrentStep(prev => prev + 1);
  };

  const handleSkillsSubmit = (data: Skill[]) => {
    setResumeData(prev => ({
      ...prev,
      skills: data
    }));
    setCurrentStep(prev => prev + 1);
  };

  const handleTemplateSelect = (id: string) => {
    setTemplateId(id);
    setCurrentStep(prev => prev + 1);
  };

  const handleSectionEdit = (section: string) => {
    switch (section) {
      case 'personalInfo':
        setCurrentStep(1);
        break;
      case 'summary':
        setCurrentStep(2);
        break;
      case 'workExperience':
        setCurrentStep(3);
        break;
      case 'education':
        setCurrentStep(4);
        break;
      case 'skills':
        setCurrentStep(5);
        break;
      default:
        break;
    }
  };

  const handleDownloadResume = async (format: 'pdf' | 'docx') => {
    try {
      setIsLoading(true);
      
      // In a real app, this would call the API to generate the resume
      const response = await builderApi.buildResume({
        ...resumeData,
        templateId,
        format
      });
      
      // Download the file
      const downloadUrl = builderApi.downloadResume(response.data.resumeId, format);
      window.open(downloadUrl, '_blank');
      
      toast.success(`Resume successfully generated in ${format.toUpperCase()} format`);
    } catch (error) {
      console.error('Error generating resume:', error);
      toast.error('Failed to generate resume. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Render the current step component
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <PersonalInfoForm 
            onSubmit={handlePersonalInfoSubmit} 
            defaultValues={resumeData.personalInfo} 
          />
        );
      case 2:
        return (
          <SummaryForm 
            onSubmit={handleSummarySubmit} 
            defaultValue={resumeData.summary} 
          />
        );
      case 3:
        return (
          <WorkExperienceForm 
            onSubmit={handleWorkExperienceSubmit} 
            defaultValues={resumeData.workExperience} 
          />
        );
      case 4:
        return (
          <EducationForm 
            onSubmit={handleEducationSubmit} 
            defaultValues={resumeData.education} 
          />
        );
      case 5:
        return (
          <SkillsForm 
            onSubmit={handleSkillsSubmit} 
            defaultValues={resumeData.skills} 
          />
        );
      case 6:
        return (
          <TemplateSelector 
            onSelect={handleTemplateSelect} 
            defaultValue={templateId} 
          />
        );
      case 7:
        return (
          <ResumePreview 
            resumeData={resumeData} 
            templateId={templateId} 
            onEdit={handleSectionEdit} 
            onDownload={handleDownloadResume} 
          />
        );
      default:
        return <div>Unknown step</div>;
    }
  };

  return (
    <>
      <Head>
        <title>Resume Builder - Create an ATS-Optimized Resume</title>
        <meta name="description" content="Build a professional, ATS-optimized resume from scratch with our step-by-step resume builder." />
      </Head>

      <div className={`space-y-8 ${theme === 'dark' ? 'text-white' : ''}`}>
        {/* Page Header */}
        <div className={`mb-8 ${theme === 'dark' ? 'text-white' : ''}`}>
          <h1 className="text-3xl font-bold mb-2">Resume Builder</h1>
          <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-secondary-600'}`}>
            Create a professional, ATS-optimized resume from scratch with our step-by-step builder.
          </p>
        </div>

        {/* Step Indicator */}
        <div className="mb-8 overflow-x-auto">
          <div className="flex min-w-max">
            {steps.map((step, index) => (
              <React.Fragment key={index}>
                <div className={`flex flex-col items-center ${currentStep === index + 1 ? 'text-primary-600' : currentStep > index + 1 ? 'text-success-700' : theme === 'dark' ? 'text-gray-400' : 'text-secondary-500'}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                    currentStep === index + 1 
                      ? 'bg-primary-600 text-white' 
                      : currentStep > index + 1 
                        ? 'bg-success-500 text-white' 
                        : 'bg-secondary-200'
                  }`}>
                    {currentStep > index + 1 ? '✓' : index + 1}
                  </div>
                  <span className="text-sm whitespace-nowrap">{step}</span>
                </div>
                
                {index < steps.length - 1 && (
                  <div className={`w-16 h-1 ${currentStep > index + 1 ? 'bg-success-500' : theme === 'dark' ? 'bg-gray-700' : 'bg-secondary-200'}`}></div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          {isLoading && <LoadingOverlay />}
          
          <div className={`card ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : ''}`}>
            {currentStep !== 7 && (
              <h2 className="text-2xl font-semibold mb-6">
                {steps[currentStep - 1]}
              </h2>
            )}
            
            {renderStepContent()}
            
            {/* Navigation Buttons - Only show for steps 1-6, not on the preview page */}
            {currentStep < 7 && (
              <div className="flex justify-between mt-8">
                <button
                  onClick={() => setCurrentStep(prev => Math.max(prev - 1, 1))}
                  disabled={currentStep === 1}
                  className={`btn ${currentStep === 1 ? theme === 'dark' ? 'bg-gray-700 text-gray-400 cursor-not-allowed' : 'bg-gray-200 text-gray-400 cursor-not-allowed' : theme === 'dark' ? 'btn-outline border-gray-600 text-gray-300 hover:bg-gray-700' : 'btn-outline'}`}
                >
                  Previous
                </button>
                
                {/* Skip button for optional sections */}
                {(currentStep === 3 || currentStep === 4 || currentStep === 5) && (
                  <button
                    onClick={() => setCurrentStep(prev => prev + 1)}
                    className={`btn ${theme === 'dark' ? 'bg-purple-700 hover:bg-purple-800 text-white' : 'btn-secondary'}`}
                  >
                    Skip this step
                  </button>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default ResumeBuilder;
