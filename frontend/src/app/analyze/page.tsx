'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react';

export default function AnalyzePage() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      setUploadSuccess(false);
      setUploadError('');
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt']
    },
    maxFiles: 1
  });

  const handleUpload = async () => {
    if (!file) {
      setUploadError('Please select a file first');
      return;
    }

    try {
      setUploading(true);
      setUploadError('');
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real app, you would upload the file to your API here
      // const formData = new FormData();
      // formData.append('file', file);
      // const response = await fetch('/api/analyze-resume', {
      //   method: 'POST',
      //   body: formData,
      // });
      
      // if (!response.ok) {
      //   throw new Error('Failed to upload resume');
      // }
      
      setUploadSuccess(true);
    } catch (error) {
      setUploadError('Failed to upload resume. Please try again.');
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white pt-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto"
        >
          <h1 className="text-3xl font-bold mb-2">Analyze Your Resume</h1>
          <p className="text-gray-600 mb-8">
            Upload your resume to get an ATS compatibility score and personalized feedback
          </p>

          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 mb-6 text-center cursor-pointer transition-colors ${
                isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'
              }`}
            >
              <input {...getInputProps()} />
              <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              {isDragActive ? (
                <p className="text-blue-600 font-medium">Drop your resume here</p>
              ) : (
                <div>
                  <p className="text-gray-700 font-medium mb-2">
                    Drag & drop your resume here, or click to browse
                  </p>
                  <p className="text-gray-500 text-sm">
                    Supported formats: PDF, DOCX, DOC, TXT
                  </p>
                </div>
              )}
            </div>

            {file && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center bg-blue-50 rounded-lg p-4 mb-6"
              >
                <FileText className="h-6 w-6 text-blue-600 mr-3" />
                <div className="flex-1 truncate mr-4">
                  <p className="font-medium">{file.name}</p>
                  <p className="text-sm text-gray-500">
                    {(file.size / 1024).toFixed(2)} KB
                  </p>
                </div>
                <button
                  onClick={() => setFile(null)}
                  className="text-gray-500 hover:text-red-500 text-sm"
                >
                  Remove
                </button>
              </motion.div>
            )}

            {uploadError && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center bg-red-50 text-red-600 rounded-lg p-4 mb-6"
              >
                <AlertCircle className="h-5 w-5 mr-2" />
                {uploadError}
              </motion.div>
            )}

            {uploadSuccess && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center bg-green-50 text-green-600 rounded-lg p-4 mb-6"
              >
                <CheckCircle className="h-5 w-5 mr-2" />
                Resume uploaded successfully! Analyzing your resume...
              </motion.div>
            )}

            <button
              onClick={handleUpload}
              disabled={!file || uploading}
              className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-all ${
                !file || uploading
                  ? 'bg-blue-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg'
              }`}
            >
              {uploading ? 'Uploading...' : 'Analyze Resume'}
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-xl font-bold mb-4">Why Analyze Your Resume?</h2>
            
            <div className="space-y-4">
              <div className="flex">
                <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                  <span className="text-blue-600 font-medium text-sm">1</span>
                </div>
                <div>
                  <h3 className="font-semibold">ATS Compatibility Check</h3>
                  <p className="text-gray-600">
                    Get a score showing how well your resume will perform with Applicant Tracking Systems.
                  </p>
                </div>
              </div>
              
              <div className="flex">
                <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                  <span className="text-blue-600 font-medium text-sm">2</span>
                </div>
                <div>
                  <h3 className="font-semibold">Keyword Analysis</h3>
                  <p className="text-gray-600">
                    Identify missing keywords that are important for your target roles.
                  </p>
                </div>
              </div>
              
              <div className="flex">
                <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                  <span className="text-blue-600 font-medium text-sm">3</span>
                </div>
                <div>
                  <h3 className="font-semibold">Personalized Recommendations</h3>
                  <p className="text-gray-600">
                    Get actionable suggestions to improve your resume and increase your chances of getting interviews.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 