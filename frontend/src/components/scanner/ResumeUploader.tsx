import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { FaFileUpload, FaFilePdf, FaFileWord, FaFileAlt } from 'react-icons/fa';
import { useTheme } from '@/context/ThemeContext';

interface ResumeUploaderProps {
  onUpload: (file: File) => void;
}

const ResumeUploader: React.FC<ResumeUploaderProps> = ({ onUpload }) => {
  const { theme } = useTheme();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setSelectedFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt'],
    },
    maxFiles: 1,
    multiple: false,
  });

  const handleUpload = () => {
    if (selectedFile) {
      onUpload(selectedFile);
    }
  };

  // Function to get file icon based on type
  const getFileIcon = (file: File) => {
    const fileType = file.type;
    
    if (fileType === 'application/pdf') {
      return <FaFilePdf className="h-12 w-12 text-red-500" />;
    } else if (fileType === 'application/msword' || fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      return <FaFileWord className="h-12 w-12 text-blue-500" />;
    } else {
      return <FaFileAlt className="h-12 w-12 text-gray-500" />;
    }
  };

  return (
    <div className={`card ${theme === 'dark' ? 'bg-gray-800 border-gray-700 text-white' : ''}`}>
      <h2 className="text-2xl font-semibold mb-6">Upload Your Resume</h2>
      
      <div 
        {...getRootProps()} 
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive 
            ? theme === 'dark' 
              ? 'border-purple-500 bg-purple-900/20' 
              : 'border-primary-500 bg-primary-50' 
            : theme === 'dark' 
              ? 'border-gray-600 hover:border-purple-400 hover:bg-gray-700/50' 
              : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'
        }`}
      >
        <input {...getInputProps()} />
        
        {selectedFile ? (
          <div className="flex flex-col items-center">
            {getFileIcon(selectedFile)}
            <p className="mt-4 font-medium">{selectedFile.name}</p>
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} mt-1`}>
              {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
            </p>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedFile(null);
              }}
              className="mt-4 text-sm text-red-600 hover:text-red-800"
            >
              Remove
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <FaFileUpload className={`h-12 w-12 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`} />
            <p className="mt-4 text-lg font-medium">
              {isDragActive ? 'Drop your resume here' : 'Drag & drop your resume here'}
            </p>
            <p className={`mt-2 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              or click to browse files
            </p>
            <p className={`mt-4 text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
              Supported formats: PDF, DOCX, DOC, TXT
            </p>
          </div>
        )}
      </div>
      
      <div className="mt-6">
        <button
          onClick={handleUpload}
          disabled={!selectedFile}
          className={`btn w-full ${theme === 'dark' ? 'bg-purple-700 hover:bg-purple-800 text-white' : 'btn-primary'} ${!selectedFile ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          Upload and Continue
        </button>
      </div>
      
      <div className={`mt-6 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
        <h3 className={`font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-2`}>Tips for best results:</h3>
        <ul className="list-disc pl-5 space-y-1">
          <li>Use a clean, simple resume format</li>
          <li>Ensure your resume is up-to-date</li>
          <li>PDF format typically works best with ATS systems</li>
          <li>Make sure your file is less than 5MB</li>
        </ul>
      </div>
    </div>
  );
};

export default ResumeUploader;
