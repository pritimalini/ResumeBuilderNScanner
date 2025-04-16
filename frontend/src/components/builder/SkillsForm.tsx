import React, { useState } from 'react';
import { FaPlus, FaTrash, FaEdit } from 'react-icons/fa';
import { Skill } from '@/types';

interface SkillsFormProps {
  onSubmit: (data: Skill[]) => void;
  defaultValues?: Skill[];
}

const SkillsForm: React.FC<SkillsFormProps> = ({ onSubmit, defaultValues = [] }) => {
  const [skills, setSkills] = useState<Skill[]>(defaultValues);
  const [newSkill, setNewSkill] = useState<string>('');
  const [newSkillLevel, setNewSkillLevel] = useState<string>('Intermediate');
  const [newSkillCategory, setNewSkillCategory] = useState<string>('');
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [currentIndex, setCurrentIndex] = useState<number>(-1);

  const skillLevels = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];
  
  const commonCategories = [
    'Programming Languages',
    'Frameworks & Libraries',
    'Databases',
    'Cloud Services',
    'Tools & Software',
    'Soft Skills',
    'Languages',
    'Design',
    'Marketing',
    'Management',
    'Other'
  ];

  const handleAddSkill = () => {
    if (newSkill.trim()) {
      const skill: Skill = {
        id: isEditing ? skills[currentIndex].id : Date.now().toString(),
        name: newSkill.trim(),
        level: newSkillLevel as 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert',
        category: newSkillCategory.trim() || undefined
      };

      if (isEditing) {
        const updatedSkills = [...skills];
        updatedSkills[currentIndex] = skill;
        setSkills(updatedSkills);
      } else {
        setSkills([...skills, skill]);
      }

      // Reset form
      setNewSkill('');
      setNewSkillLevel('Intermediate');
      setNewSkillCategory('');
      setIsEditing(false);
      setCurrentIndex(-1);
    }
  };

  const handleEditSkill = (index: number) => {
    const skill = skills[index];
    setNewSkill(skill.name);
    setNewSkillLevel(skill.level || 'Intermediate');
    setNewSkillCategory(skill.category || '');
    setIsEditing(true);
    setCurrentIndex(index);
  };

  const handleDeleteSkill = (index: number) => {
    const updatedSkills = [...skills];
    updatedSkills.splice(index, 1);
    setSkills(updatedSkills);
  };

  const handleSaveAll = () => {
    onSubmit(skills);
  };

  // Group skills by category
  const groupedSkills: { [key: string]: Skill[] } = {};
  skills.forEach(skill => {
    const category = skill.category || 'Other';
    if (!groupedSkills[category]) {
      groupedSkills[category] = [];
    }
    groupedSkills[category].push(skill);
  });

  return (
    <div className="space-y-8">
      {/* Add/Edit skill form */}
      <div className="card">
        <h3 className="text-lg font-medium mb-4">
          {isEditing ? 'Edit Skill' : 'Add Skills'}
        </h3>
        
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Skill Name */}
            <div>
              <label htmlFor="skillName" className="form-label">Skill Name</label>
              <input
                id="skillName"
                type="text"
                className="form-input"
                placeholder="e.g. JavaScript, Project Management, Photoshop"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
              />
            </div>

            {/* Skill Level */}
            <div>
              <label htmlFor="skillLevel" className="form-label">Proficiency Level</label>
              <select
                id="skillLevel"
                className="form-input"
                value={newSkillLevel}
                onChange={(e) => setNewSkillLevel(e.target.value)}
              >
                {skillLevels.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>

            {/* Skill Category */}
            <div className="md:col-span-2">
              <label htmlFor="skillCategory" className="form-label">
                Category <span className="text-secondary-500 text-xs">(Optional)</span>
              </label>
              <div className="relative">
                <input
                  id="skillCategory"
                  type="text"
                  className="form-input"
                  placeholder="e.g. Programming Languages, Soft Skills"
                  value={newSkillCategory}
                  onChange={(e) => setNewSkillCategory(e.target.value)}
                  list="skill-categories"
                />
                <datalist id="skill-categories">
                  {commonCategories.map(category => (
                    <option key={category} value={category} />
                  ))}
                </datalist>
              </div>
              <p className="text-xs text-secondary-500 mt-1">
                Categorizing skills helps organize your resume better.
              </p>
            </div>
          </div>

          <div className="flex justify-between pt-4">
            <button
              type="button"
              onClick={() => {
                setNewSkill('');
                setNewSkillLevel('Intermediate');
                setNewSkillCategory('');
                setIsEditing(false);
              }}
              className="btn btn-outline"
            >
              Cancel
            </button>
            <button 
              type="button" 
              onClick={handleAddSkill}
              disabled={!newSkill.trim()}
              className="btn btn-primary"
            >
              {isEditing ? 'Update Skill' : 'Add Skill'}
            </button>
          </div>
        </div>
      </div>

      {/* List of existing skills */}
      {Object.keys(groupedSkills).length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-medium mb-4">Your Skills</h3>
          
          {Object.entries(groupedSkills).map(([category, categorySkills]) => (
            <div key={category} className="mb-6">
              <h4 className="text-md font-medium mb-2 text-secondary-700">{category}</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {categorySkills.map((skill, index) => {
                  // Find the original index in the full skills array
                  const originalIndex = skills.findIndex(s => s.id === skill.id);
                  
                  return (
                    <div key={skill.id} className="flex justify-between items-center bg-secondary-50 p-3 rounded">
                      <div>
                        <span className="font-medium">{skill.name}</span>
                        {skill.level && (
                          <span className="ml-2 text-xs px-2 py-1 bg-secondary-200 text-secondary-800 rounded-full">
                            {skill.level}
                          </span>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        <button 
                          type="button"
                          onClick={() => handleEditSkill(originalIndex)}
                          className="p-1 text-secondary-600 hover:text-primary-600"
                        >
                          <FaEdit size={14} />
                        </button>
                        <button 
                          type="button"
                          onClick={() => handleDeleteSkill(originalIndex)}
                          className="p-1 text-secondary-600 hover:text-danger-600"
                        >
                          <FaTrash size={14} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Continue button */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleSaveAll}
          className="btn btn-success"
          disabled={skills.length === 0}
        >
          Save & Continue
        </button>
      </div>
    </div>
  );
};

export default SkillsForm;
