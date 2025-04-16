import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

interface SummaryFormProps {
  onSubmit: (data: { summary: string }) => void;
  defaultValue?: string;
}

const SummaryForm: React.FC<SummaryFormProps> = ({ onSubmit, defaultValue = '' }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      summary: defaultValue
    }
  });
  const [charCount, setCharCount] = useState<number>(defaultValue.length);
  
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCharCount(e.target.value.length);
  };

  const handleFormSubmit = (data: { summary: string }) => {
    onSubmit(data);
  };

  return (
    <div className="space-y-8">
      <div className="card">
        <h3 className="text-lg font-medium mb-4">Professional Summary</h3>
        
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          <div>
            <label htmlFor="summary" className="form-label">
              Write a compelling professional summary
            </label>
            <textarea
              id="summary"
              rows={6}
              className="form-input"
              placeholder="Summarize your professional background, key skills, and career goals in 3-5 sentences..."
              {...register('summary', { 
                required: 'Professional summary is required',
                minLength: {
                  value: 50,
                  message: 'Summary should be at least 50 characters'
                },
                maxLength: {
                  value: 500,
                  message: 'Summary should not exceed 500 characters'
                }
              })}
              onChange={handleChange}
            ></textarea>
            <div className="flex justify-between mt-1">
              <div>
                {errors.summary && (
                  <p className="form-error">{errors.summary.message as string}</p>
                )}
              </div>
              <div className={`text-xs ${charCount > 500 ? 'text-danger-600' : 'text-secondary-500'}`}>
                {charCount}/500 characters
              </div>
            </div>
          </div>

          <div className="bg-secondary-50 p-4 rounded-md">
            <h4 className="text-sm font-medium mb-2">Tips for a Strong Professional Summary:</h4>
            <ul className="text-sm text-secondary-700 space-y-1 list-disc pl-5">
              <li>Keep it concise and focused on your most relevant qualifications</li>
              <li>Tailor it to the specific job you're applying for</li>
              <li>Include your years of experience and key accomplishments</li>
              <li>Highlight your most relevant skills and expertise</li>
              <li>Avoid using first-person pronouns (I, me, my)</li>
            </ul>
          </div>

          <div className="pt-4">
            <button type="submit" className="btn btn-success">
              Save & Continue
            </button>
          </div>
        </form>
      </div>

      <div className="card bg-primary-50 border border-primary-100">
        <h4 className="text-md font-medium mb-3">Example Professional Summary</h4>
        <p className="text-secondary-700 text-sm italic">
          "Results-driven software engineer with 5+ years of experience developing scalable web applications using React, Node.js, and AWS. Specialized in building responsive user interfaces and optimizing application performance. Proven track record of reducing load times by 40% and implementing CI/CD pipelines that decreased deployment time by 60%. Passionate about clean code and mentoring junior developers."
        </p>
      </div>
    </div>
  );
};

export default SummaryForm;
