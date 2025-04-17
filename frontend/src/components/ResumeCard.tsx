'use client';

import React from 'react';
import Link from 'next/link';
import { FileText, Edit, BarChart2, Trash2, MoreHorizontal } from 'lucide-react';
import { formatDate, getRelativeTimeString } from '../utils/dateUtils';
import { Resume } from '../services/resumeService';

interface ResumeCardProps {
  resume: Resume;
  onDelete?: (id: string) => void;
}

export default function ResumeCard({ resume, onDelete }: ResumeCardProps) {
  const [showOptions, setShowOptions] = React.useState(false);

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onDelete) {
      if (window.confirm('Are you sure you want to delete this resume?')) {
        onDelete(resume.id);
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow duration-300">
      <div className="p-5">
        <div className="flex justify-between items-start">
          <div className="flex items-center">
            <div className="bg-blue-100 p-2.5 rounded-lg mr-3">
              <FileText className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900 line-clamp-1">{resume.title}</h3>
              <p className="text-xs text-gray-500 mt-1">
                Updated {getRelativeTimeString(resume.updated_at)}
              </p>
            </div>
          </div>
          <div className="relative">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowOptions(!showOptions);
              }}
              className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="More options"
            >
              <MoreHorizontal className="h-5 w-5 text-gray-500" />
            </button>
            
            {showOptions && (
              <div 
                className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-100"
                onMouseLeave={() => setShowOptions(false)}
              >
                <div className="py-1">
                  <Link 
                    href={`/build?resumeId=${resume.id}`}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <Edit className="h-4 w-4 mr-2 text-gray-500" />
                    Edit Resume
                  </Link>
                  <Link
                    href={`/analyze?resumeId=${resume.id}`}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <BarChart2 className="h-4 w-4 mr-2 text-gray-500" />
                    Analyze for ATS
                  </Link>
                  <button
                    onClick={handleDelete}
                    className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  >
                    <Trash2 className="h-4 w-4 mr-2 text-red-500" />
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="border-t border-gray-100 px-5 py-3 bg-gray-50 flex justify-between items-center">
        <div className="text-xs text-gray-500">
          {formatDate(resume.created_at)}
        </div>
        <div className="flex space-x-2">
          <Link 
            href={`/score?resumeId=${resume.id}`}
            className="text-xs px-3 py-1 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition-colors"
          >
            View Score
          </Link>
          <Link 
            href={`/job-matches?resumeId=${resume.id}`}
            className="text-xs px-3 py-1 bg-purple-50 text-purple-600 rounded-full hover:bg-purple-100 transition-colors"
          >
            Match Jobs
          </Link>
        </div>
      </div>
    </div>
  );
} 