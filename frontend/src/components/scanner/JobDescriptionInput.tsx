import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTheme } from '@/context/ThemeContext';

interface JobDescriptionInputProps {
  onSubmit: (description: string, title: string) => void;
}

type FormData = {
  jobTitle: string;
  jobDescription: string;
};

const JobDescriptionInput: React.FC<JobDescriptionInputProps> = ({ onSubmit }) => {
  const { theme } = useTheme();
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
  const [charCount, setCharCount] = useState<number>(0);

  const onFormSubmit = (data: FormData) => {
    onSubmit(data.jobDescription, data.jobTitle);
  };

  return (
    <div className={`card ${theme === 'dark' ? 'bg-gray-800 border-gray-700 text-white' : ''}`}>
      <h2 className="text-2xl font-semibold mb-6">Enter Job Description</h2>
      
      <form onSubmit={handleSubmit(onFormSubmit)}>
        <div className="mb-4">
          <label htmlFor="jobTitle" className={`form-label ${theme === 'dark' ? 'text-gray-300' : ''}`}>
            Job Title
          </label>
          <input
            id="jobTitle"
            type="text"
            className={`form-input ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : ''}`}
            placeholder="e.g., Senior Software Engineer"
            {...register('jobTitle', { required: 'Job title is required' })}
          />
          {errors.jobTitle && (
            <p className="form-error">{errors.jobTitle.message}</p>
          )}
        </div>
        
        <div className="mb-4">
          <label htmlFor="jobDescription" className={`form-label ${theme === 'dark' ? 'text-gray-300' : ''}`}>
            Job Description
          </label>
          <textarea
            id="jobDescription"
            rows={10}
            className={`form-input ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : ''}`}
            placeholder="Paste the full job description here..."
            {...register('jobDescription', { 
              required: 'Job description is required',
              minLength: {
                value: 100,
                message: 'Job description should be at least 100 characters'
              }
            })}
            onChange={(e) => setCharCount(e.target.value.length)}
          />
          <div className="flex justify-between mt-1">
            {errors.jobDescription ? (
              <p className="form-error">{errors.jobDescription.message}</p>
            ) : (
              <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                For best results, include the complete job description
              </span>
            )}
            <span className={`text-xs ${charCount < 100 ? 'text-red-500' : theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              {charCount} characters
            </span>
          </div>
        </div>
        
        <div className="mt-6">
          <button
            type="submit"
            className={`btn w-full ${theme === 'dark' ? 'bg-purple-700 hover:bg-purple-800 text-white' : 'btn-primary'}`}
          >
            Analyze Resume
          </button>
        </div>
      </form>
      
      <div className={`mt-6 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
        <h3 className={`font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-2`}>Tips for best results:</h3>
        <ul className="list-disc pl-5 space-y-1">
          <li>Copy and paste the entire job description</li>
          <li>Include all sections (responsibilities, requirements, etc.)</li>
          <li>Don't modify or summarize the job description</li>
          <li>The more detailed the job description, the better the analysis</li>
        </ul>
      </div>
    </div>
  );
};

export default JobDescriptionInput;
