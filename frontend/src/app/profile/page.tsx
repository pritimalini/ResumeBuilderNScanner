'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { 
  User, 
  FileText, 
  Edit, 
  Trash2, 
  Share2, 
  Download, 
  Settings, 
  LogOut,
  Eye,
  BarChart3,
  PlusCircle,
  Clock
} from 'lucide-react';
import Link from 'next/link';
import resumeService, { Resume } from '@/services/resumeService';

export default function ProfilePage() {
  const router = useRouter();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'resumes' | 'settings'>('resumes');
  const [showConfirmDelete, setShowConfirmDelete] = useState<string | null>(null);

  // Mock user data
  const user = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    avatarUrl: 'https://i.pravatar.cc/150?img=68',
    joinDate: new Date('2023-10-01'),
  };

  useEffect(() => {
    const fetchResumes = async () => {
      try {
        setIsLoading(true);
        const resumesData = await resumeService.getUserResumes();
        setResumes(resumesData);
        setIsLoading(false);
      } catch (err) {
        setError('Failed to load resumes. Please try again later.');
        setIsLoading(false);
      }
    };

    fetchResumes();
  }, []);

  const handleDeleteResume = async (id: string) => {
    try {
      await resumeService.deleteResume(id);
      setResumes(resumes.filter(resume => resume.id !== id));
      setShowConfirmDelete(null);
    } catch (err) {
      setError('Failed to delete resume. Please try again later.');
    }
  };

  const handleLogout = () => {
    // In a real app, this would clear auth tokens/state
    alert('In a real app, this would log you out');
    router.push('/login');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="md:col-span-1"
        >
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm sticky top-24">
            <div className="flex flex-col items-center mb-6">
              <img 
                src={user.avatarUrl} 
                alt={user.name}
                className="w-24 h-24 rounded-full object-cover mb-4"
              />
              <h2 className="text-xl font-semibold">{user.name}</h2>
              <p className="text-gray-500">{user.email}</p>
            </div>
            
            <div className="border-t border-b border-gray-200 py-4 my-4">
              <button
                onClick={() => setActiveTab('resumes')}
                className={`flex items-center w-full px-4 py-2 rounded-md mb-2 ${
                  activeTab === 'resumes' 
                    ? 'bg-blue-50 text-blue-600' 
                    : 'hover:bg-gray-100'
                }`}
              >
                <FileText size={18} className="mr-3" />
                My Resumes
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`flex items-center w-full px-4 py-2 rounded-md ${
                  activeTab === 'settings' 
                    ? 'bg-blue-50 text-blue-600' 
                    : 'hover:bg-gray-100'
                }`}
              >
                <Settings size={18} className="mr-3" />
                Account Settings
              </button>
            </div>
            
            <button
              onClick={handleLogout}
              className="flex items-center w-full text-red-600 px-4 py-2 rounded-md hover:bg-red-50"
            >
              <LogOut size={18} className="mr-3" />
              Logout
            </button>
          </div>
        </motion.div>
        
        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="md:col-span-3"
        >
          {activeTab === 'resumes' && (
            <>
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">My Resumes</h1>
                <Link
                  href="/resume-builder"
                  className="inline-flex items-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  <PlusCircle size={18} className="mr-2" />
                  Create New Resume
                </Link>
              </div>
              
              {isLoading ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : error ? (
                <div className="text-center py-12">
                  <p className="text-red-500">{error}</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Try Again
                  </button>
                </div>
              ) : resumes.length === 0 ? (
                <div className="text-center py-12 bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
                  <FileText size={48} className="mx-auto text-gray-400 mb-4" />
                  <h2 className="text-xl font-semibold mb-2">No Resumes Yet</h2>
                  <p className="text-gray-600 mb-6">
                    Create your first resume to get started on your job search journey.
                  </p>
                  <Link
                    href="/resume-builder"
                    className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700"
                  >
                    <PlusCircle size={18} className="mr-2" />
                    Create New Resume
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6">
                  {resumes.map((resume) => (
                    <motion.div
                      key={resume.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h2 className="text-xl font-semibold mb-1">{resume.title}</h2>
                          <div className="flex items-center text-gray-500 mb-4">
                            <Clock size={14} className="mr-1" />
                            <span className="text-sm">
                              Last updated {new Date(resume.updated_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        
                        {resume.atsScore !== null && (
                          <div className="flex items-center bg-blue-50 px-3 py-1 rounded-full">
                            <BarChart3 size={16} className="text-blue-500 mr-1" />
                            <span className="text-blue-700 font-medium">ATS Score: {resume.atsScore}</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex flex-wrap gap-3 mt-4">
                        <Link href={`/resume-builder/${resume.id}`}>
                          <span className="inline-flex items-center px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                            <Edit size={14} className="mr-1" />
                            Edit
                          </span>
                        </Link>
                        <Link href={`/score/${resume.id}`}>
                          <span className="inline-flex items-center px-3 py-1.5 bg-green-600 text-white rounded-md hover:bg-green-700">
                            <BarChart3 size={14} className="mr-1" />
                            View Analysis
                          </span>
                        </Link>
                        <button className="inline-flex items-center px-3 py-1.5 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200">
                          <Eye size={14} className="mr-1" />
                          Preview
                        </button>
                        <button className="inline-flex items-center px-3 py-1.5 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200">
                          <Download size={14} className="mr-1" />
                          Download
                        </button>
                        <button className="inline-flex items-center px-3 py-1.5 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200">
                          <Share2 size={14} className="mr-1" />
                          Share
                        </button>
                        <button 
                          onClick={() => setShowConfirmDelete(resume.id)}
                          className="inline-flex items-center px-3 py-1.5 bg-red-100 text-red-700 rounded-md hover:bg-red-200"
                        >
                          <Trash2 size={14} className="mr-1" />
                          Delete
                        </button>
                      </div>
                      
                      {showConfirmDelete === resume.id && (
                        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                          <p className="text-red-700 mb-2">Are you sure you want to delete this resume?</p>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleDeleteResume(resume.id)}
                              className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700"
                            >
                              Yes, Delete
                            </button>
                            <button
                              onClick={() => setShowConfirmDelete(null)}
                              className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </>
          )}

          {activeTab === 'settings' && (
            <>
              <h1 className="text-2xl font-bold mb-6">Account Settings</h1>
              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <form>
                  <div className="mb-6">
                    <h2 className="text-lg font-semibold mb-4">Personal Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="name" className="block text-gray-700 mb-1">Full Name</label>
                        <input
                          type="text"
                          id="name"
                          defaultValue={user.name}
                          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-gray-700 mb-1">Email Address</label>
                        <input
                          type="email"
                          id="email"
                          defaultValue={user.email}
                          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h2 className="text-lg font-semibold mb-4">Change Password</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="currentPassword" className="block text-gray-700 mb-1">Current Password</label>
                        <input
                          type="password"
                          id="currentPassword"
                          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label htmlFor="newPassword" className="block text-gray-700 mb-1">New Password</label>
                        <input
                          type="password"
                          id="newPassword"
                          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h2 className="text-lg font-semibold mb-4">Profile Picture</h2>
                    <div className="flex items-center">
                      <img 
                        src={user.avatarUrl} 
                        alt={user.name}
                        className="w-16 h-16 rounded-full object-cover mr-4"
                      />
                      <button
                        type="button"
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                      >
                        Change Picture
                      </button>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h2 className="text-lg font-semibold mb-4">Notification Preferences</h2>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="emailNotifications"
                          defaultChecked
                          className="mr-2"
                        />
                        <label htmlFor="emailNotifications">Receive email notifications</label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="jobAlerts"
                          defaultChecked
                          className="mr-2"
                        />
                        <label htmlFor="jobAlerts">Job match alerts</label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="marketingEmails"
                          className="mr-2"
                        />
                        <label htmlFor="marketingEmails">Marketing and promotional emails</label>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <button
                      type="button"
                      className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
} 