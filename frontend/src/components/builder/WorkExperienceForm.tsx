import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaPlus, FaTrash, FaEdit } from 'react-icons/fa';
import { WorkExperience } from '@/types';

interface WorkExperienceFormProps {
  onSubmit: (data: WorkExperience[]) => void;
  defaultValues?: WorkExperience[];
}

const WorkExperienceForm: React.FC<WorkExperienceFormProps> = ({ onSubmit, defaultValues = [] }) => {
  const [experiences, setExperiences] = useState<WorkExperience[]>(defaultValues);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [currentIndex, setCurrentIndex] = useState<number>(-1);
  const [achievements, setAchievements] = useState<string[]>([]);
  const [newAchievement, setNewAchievement] = useState<string>('');

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<WorkExperience>({
    defaultValues: {
      id: '',
      title: '',
      company: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
      achievements: [],
    }
  });

  const watchCurrent = watch('current');

  const handleAddExperience = (data: WorkExperience) => {
    const newExperience = {
      ...data,
      id: isEditing ? data.id : Date.now().toString(),
      achievements: [...achievements]
    };

    if (isEditing) {
      const updatedExperiences = [...experiences];
      updatedExperiences[currentIndex] = newExperience;
      setExperiences(updatedExperiences);
    } else {
      setExperiences([...experiences, newExperience]);
    }

    // Reset form
    reset({
      id: '',
      title: '',
      company: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
      achievements: [],
    });
    setAchievements([]);
    setIsEditing(false);
    setCurrentIndex(-1);
  };

  const handleEditExperience = (index: number) => {
    const experience = experiences[index];
    setIsEditing(true);
    setCurrentIndex(index);
    setAchievements(experience.achievements || []);

    // Set form values
    setValue('id', experience.id);
    setValue('title', experience.title);
    setValue('company', experience.company);
    setValue('location', experience.location || '');
    setValue('startDate', experience.startDate);
    setValue('endDate', experience.endDate || '');
    setValue('current', experience.current);
    setValue('description', experience.description);
  };

  const handleDeleteExperience = (index: number) => {
    const updatedExperiences = [...experiences];
    updatedExperiences.splice(index, 1);
    setExperiences(updatedExperiences);
  };

  const handleAddAchievement = () => {
    if (newAchievement.trim()) {
      setAchievements([...achievements, newAchievement.trim()]);
      setNewAchievement('');
    }
  };

  const handleDeleteAchievement = (index: number) => {
    const updatedAchievements = [...achievements];
    updatedAchievements.splice(index, 1);
    setAchievements(updatedAchievements);
  };

  const handleSaveAll = () => {
    onSubmit(experiences);
  };

  return (
    <div className="space-y-8">
      {/* List of existing experiences */}
      {experiences.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-medium mb-4">Your Work Experience</h3>
          <div className="space-y-4">
            {experiences.map((exp, index) => (
              <div key={exp.id} className="card p-4 bg-secondary-50">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">{exp.title}</h4>
                    <p className="text-secondary-600">{exp.company} {exp.location && `• ${exp.location}`}</p>
                    <p className="text-sm text-secondary-500">
                      {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button 
                      type="button"
                      onClick={() => handleEditExperience(index)}
                      className="p-1.5 text-secondary-600 hover:text-primary-600"
                    >
                      <FaEdit />
                    </button>
                    <button 
                      type="button"
                      onClick={() => handleDeleteExperience(index)}
                      className="p-1.5 text-secondary-600 hover:text-danger-600"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add/Edit experience form */}
      <div className="card">
        <h3 className="text-lg font-medium mb-4">
          {isEditing ? 'Edit Work Experience' : 'Add Work Experience'}
        </h3>
        
        <form onSubmit={handleSubmit(handleAddExperience)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Job Title */}
            <div>
              <label htmlFor="title" className="form-label">Job Title</label>
              <input
                id="title"
                type="text"
                className="form-input"
                {...register('title', { required: 'Job title is required' })}
              />
              {errors.title && (
                <p className="form-error">{errors.title.message}</p>
              )}
            </div>

            {/* Company */}
            <div>
              <label htmlFor="company" className="form-label">Company</label>
              <input
                id="company"
                type="text"
                className="form-input"
                {...register('company', { required: 'Company is required' })}
              />
              {errors.company && (
                <p className="form-error">{errors.company.message}</p>
              )}
            </div>

            {/* Location (Optional) */}
            <div>
              <label htmlFor="location" className="form-label">
                Location <span className="text-secondary-500 text-xs">(Optional)</span>
              </label>
              <input
                id="location"
                type="text"
                className="form-input"
                placeholder="City, State, Country"
                {...register('location')}
              />
            </div>

            {/* Start Date */}
            <div>
              <label htmlFor="startDate" className="form-label">Start Date</label>
              <input
                id="startDate"
                type="month"
                className="form-input"
                {...register('startDate', { required: 'Start date is required' })}
              />
              {errors.startDate && (
                <p className="form-error">{errors.startDate.message}</p>
              )}
            </div>

            {/* Current Position */}
            <div className="flex items-center mt-6">
              <input
                id="current"
                type="checkbox"
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                {...register('current')}
              />
              <label htmlFor="current" className="ml-2 block text-sm text-secondary-700">
                I currently work here
              </label>
            </div>

            {/* End Date (if not current) */}
            {!watchCurrent && (
              <div>
                <label htmlFor="endDate" className="form-label">End Date</label>
                <input
                  id="endDate"
                  type="month"
                  className="form-input"
                  {...register('endDate', { 
                    required: !watchCurrent ? 'End date is required' : false 
                  })}
                />
                {errors.endDate && (
                  <p className="form-error">{errors.endDate.message}</p>
                )}
              </div>
            )}
          </div>

          {/* Job Description */}
          <div>
            <label htmlFor="description" className="form-label">Job Description</label>
            <textarea
              id="description"
              rows={4}
              className="form-input"
              placeholder="Describe your responsibilities and role..."
              {...register('description', { required: 'Job description is required' })}
            ></textarea>
            {errors.description && (
              <p className="form-error">{errors.description.message}</p>
            )}
          </div>

          {/* Achievements */}
          <div>
            <label className="form-label">Key Achievements</label>
            
            <div className="flex mb-2">
              <input
                type="text"
                className="form-input rounded-r-none"
                placeholder="Add an achievement or accomplishment..."
                value={newAchievement}
                onChange={(e) => setNewAchievement(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddAchievement())}
              />
              <button
                type="button"
                onClick={handleAddAchievement}
                className="btn bg-primary-600 text-white px-4 rounded-l-none"
              >
                <FaPlus />
              </button>
            </div>
            
            {achievements.length > 0 ? (
              <ul className="mt-3 space-y-2">
                {achievements.map((achievement, index) => (
                  <li key={index} className="flex justify-between items-center bg-secondary-50 p-2 rounded">
                    <span className="text-sm">{achievement}</span>
                    <button
                      type="button"
                      onClick={() => handleDeleteAchievement(index)}
                      className="text-danger-500 hover:text-danger-700"
                    >
                      <FaTrash size={14} />
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-secondary-500 mt-2">
                No achievements added yet. Achievements help your resume stand out!
              </p>
            )}
          </div>

          <div className="flex justify-between pt-4">
            <button
              type="button"
              onClick={() => {
                reset();
                setAchievements([]);
                setIsEditing(false);
              }}
              className="btn btn-outline"
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {isEditing ? 'Update Experience' : 'Add Experience'}
            </button>
          </div>
        </form>
      </div>

      {/* Continue button */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleSaveAll}
          className="btn btn-success"
          disabled={experiences.length === 0}
        >
          Save & Continue
        </button>
      </div>
    </div>
  );
};

export default WorkExperienceForm;
