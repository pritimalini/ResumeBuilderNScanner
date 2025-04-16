import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaPlus, FaTrash, FaEdit } from 'react-icons/fa';
import { Education } from '@/types';

interface EducationFormProps {
  onSubmit: (data: Education[]) => void;
  defaultValues?: Education[];
}

const EducationForm: React.FC<EducationFormProps> = ({ onSubmit, defaultValues = [] }) => {
  const [educationList, setEducationList] = useState<Education[]>(defaultValues);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [currentIndex, setCurrentIndex] = useState<number>(-1);
  const [achievements, setAchievements] = useState<string[]>([]);
  const [newAchievement, setNewAchievement] = useState<string>('');

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<Education>({
    defaultValues: {
      id: '',
      institution: '',
      degree: '',
      field: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      gpa: '',
      achievements: [],
    }
  });

  const watchCurrent = watch('current');

  const handleAddEducation = (data: Education) => {
    const newEducation = {
      ...data,
      id: isEditing ? data.id : Date.now().toString(),
      achievements: [...achievements]
    };

    if (isEditing) {
      const updatedEducationList = [...educationList];
      updatedEducationList[currentIndex] = newEducation;
      setEducationList(updatedEducationList);
    } else {
      setEducationList([...educationList, newEducation]);
    }

    // Reset form
    reset({
      id: '',
      institution: '',
      degree: '',
      field: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      gpa: '',
      achievements: [],
    });
    setAchievements([]);
    setIsEditing(false);
    setCurrentIndex(-1);
  };

  const handleEditEducation = (index: number) => {
    const education = educationList[index];
    setIsEditing(true);
    setCurrentIndex(index);
    setAchievements(education.achievements || []);

    // Set form values
    setValue('id', education.id);
    setValue('institution', education.institution);
    setValue('degree', education.degree);
    setValue('field', education.field);
    setValue('location', education.location || '');
    setValue('startDate', education.startDate);
    setValue('endDate', education.endDate || '');
    setValue('current', education.current);
    setValue('gpa', education.gpa || '');
  };

  const handleDeleteEducation = (index: number) => {
    const updatedEducationList = [...educationList];
    updatedEducationList.splice(index, 1);
    setEducationList(updatedEducationList);
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
    onSubmit(educationList);
  };

  return (
    <div className="space-y-8">
      {/* List of existing education */}
      {educationList.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-medium mb-4">Your Education</h3>
          <div className="space-y-4">
            {educationList.map((edu, index) => (
              <div key={edu.id} className="card p-4 bg-secondary-50">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">{edu.degree} in {edu.field}</h4>
                    <p className="text-secondary-600">{edu.institution} {edu.location && `• ${edu.location}`}</p>
                    <p className="text-sm text-secondary-500">
                      {edu.startDate} - {edu.current ? 'Present' : edu.endDate}
                      {edu.gpa && ` • GPA: ${edu.gpa}`}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button 
                      type="button"
                      onClick={() => handleEditEducation(index)}
                      className="p-1.5 text-secondary-600 hover:text-primary-600"
                    >
                      <FaEdit />
                    </button>
                    <button 
                      type="button"
                      onClick={() => handleDeleteEducation(index)}
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

      {/* Add/Edit education form */}
      <div className="card">
        <h3 className="text-lg font-medium mb-4">
          {isEditing ? 'Edit Education' : 'Add Education'}
        </h3>
        
        <form onSubmit={handleSubmit(handleAddEducation)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Institution */}
            <div>
              <label htmlFor="institution" className="form-label">Institution</label>
              <input
                id="institution"
                type="text"
                className="form-input"
                {...register('institution', { required: 'Institution is required' })}
              />
              {errors.institution && (
                <p className="form-error">{errors.institution.message}</p>
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

            {/* Degree */}
            <div>
              <label htmlFor="degree" className="form-label">Degree</label>
              <input
                id="degree"
                type="text"
                className="form-input"
                placeholder="e.g. Bachelor of Science, Master's"
                {...register('degree', { required: 'Degree is required' })}
              />
              {errors.degree && (
                <p className="form-error">{errors.degree.message}</p>
              )}
            </div>

            {/* Field of Study */}
            <div>
              <label htmlFor="field" className="form-label">Field of Study</label>
              <input
                id="field"
                type="text"
                className="form-input"
                placeholder="e.g. Computer Science, Business Administration"
                {...register('field', { required: 'Field of study is required' })}
              />
              {errors.field && (
                <p className="form-error">{errors.field.message}</p>
              )}
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

            {/* Current Student */}
            <div className="flex items-center mt-6">
              <input
                id="current"
                type="checkbox"
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                {...register('current')}
              />
              <label htmlFor="current" className="ml-2 block text-sm text-secondary-700">
                I am currently studying here
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

            {/* GPA (Optional) */}
            <div>
              <label htmlFor="gpa" className="form-label">
                GPA <span className="text-secondary-500 text-xs">(Optional)</span>
              </label>
              <input
                id="gpa"
                type="text"
                className="form-input"
                placeholder="e.g. 3.8/4.0"
                {...register('gpa')}
              />
            </div>
          </div>

          {/* Achievements */}
          <div>
            <label className="form-label">
              Achievements & Activities <span className="text-secondary-500 text-xs">(Optional)</span>
            </label>
            
            <div className="flex mb-2">
              <input
                type="text"
                className="form-input rounded-r-none"
                placeholder="Add honors, awards, or relevant activities..."
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
                No achievements added yet. Include honors, awards, or relevant activities.
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
              {isEditing ? 'Update Education' : 'Add Education'}
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
          disabled={educationList.length === 0}
        >
          Save & Continue
        </button>
      </div>
    </div>
  );
};

export default EducationForm;
