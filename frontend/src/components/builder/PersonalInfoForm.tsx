import React from 'react';
import { useForm } from 'react-hook-form';

interface PersonalInfoFormProps {
  onSubmit: (data: any) => void;
  defaultValues?: any;
}

const PersonalInfoForm: React.FC<PersonalInfoFormProps> = ({ onSubmit, defaultValues = {} }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* First Name */}
        <div>
          <label htmlFor="firstName" className="form-label">First Name</label>
          <input
            id="firstName"
            type="text"
            className="form-input"
            {...register('firstName', { required: 'First name is required' })}
          />
          {errors.firstName && (
            <p className="form-error">{errors.firstName.message as string}</p>
          )}
        </div>

        {/* Last Name */}
        <div>
          <label htmlFor="lastName" className="form-label">Last Name</label>
          <input
            id="lastName"
            type="text"
            className="form-input"
            {...register('lastName', { required: 'Last name is required' })}
          />
          {errors.lastName && (
            <p className="form-error">{errors.lastName.message as string}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="form-label">Email</label>
          <input
            id="email"
            type="email"
            className="form-input"
            {...register('email', { 
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address'
              }
            })}
          />
          {errors.email && (
            <p className="form-error">{errors.email.message as string}</p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="phone" className="form-label">Phone</label>
          <input
            id="phone"
            type="tel"
            className="form-input"
            {...register('phone', { 
              required: 'Phone number is required',
              pattern: {
                value: /^[0-9+\-\s()]*$/,
                message: 'Invalid phone number'
              }
            })}
          />
          {errors.phone && (
            <p className="form-error">{errors.phone.message as string}</p>
          )}
        </div>

        {/* Location */}
        <div>
          <label htmlFor="location" className="form-label">Location</label>
          <input
            id="location"
            type="text"
            className="form-input"
            placeholder="City, State, Country"
            {...register('location', { required: 'Location is required' })}
          />
          {errors.location && (
            <p className="form-error">{errors.location.message as string}</p>
          )}
        </div>

        {/* LinkedIn (Optional) */}
        <div>
          <label htmlFor="linkedin" className="form-label">
            LinkedIn <span className="text-secondary-500 text-xs">(Optional)</span>
          </label>
          <input
            id="linkedin"
            type="url"
            className="form-input"
            placeholder="https://linkedin.com/in/yourprofile"
            {...register('linkedin', {
              pattern: {
                value: /^https?:\/\/(www\.)?linkedin\.com\/in\/[\w-]+\/?$/,
                message: 'Invalid LinkedIn URL'
              }
            })}
          />
          {errors.linkedin && (
            <p className="form-error">{errors.linkedin.message as string}</p>
          )}
        </div>

        {/* Website (Optional) */}
        <div>
          <label htmlFor="website" className="form-label">
            Website <span className="text-secondary-500 text-xs">(Optional)</span>
          </label>
          <input
            id="website"
            type="url"
            className="form-input"
            placeholder="https://yourwebsite.com"
            {...register('website', {
              pattern: {
                value: /^https?:\/\/(www\.)?[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+\/?.*$/,
                message: 'Invalid website URL'
              }
            })}
          />
          {errors.website && (
            <p className="form-error">{errors.website.message as string}</p>
          )}
        </div>

        {/* Professional Title */}
        <div>
          <label htmlFor="title" className="form-label">Professional Title</label>
          <input
            id="title"
            type="text"
            className="form-input"
            placeholder="e.g. Software Engineer, Marketing Specialist"
            {...register('title', { required: 'Professional title is required' })}
          />
          {errors.title && (
            <p className="form-error">{errors.title.message as string}</p>
          )}
        </div>
      </div>

      <div className="pt-4">
        <button type="submit" className="btn btn-primary w-full md:w-auto">
          Save & Continue
        </button>
      </div>
    </form>
  );
};

export default PersonalInfoForm;
