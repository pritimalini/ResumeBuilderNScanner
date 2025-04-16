'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { resumeService } from '../../services/api';
import { motion } from 'framer-motion';
import { 
  Plus, 
  FileText, 
  Upload, 
  BarChart,
  Search,
  ChevronRight,
  Calendar,
  Clock,
  Trash2,
  Briefcase
} from 'lucide-react';
import Link from 'next/link';

export default function Dashboard() {
  const router = useRouter();
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Redirect if not authenticated
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    // Fetch user's resumes
    const fetchResumes = async () => {
      try {
        const response = await resumeService.getAllResumes();
        setResumes(response.data);
      } catch (err) {
        console.error('Error fetching resumes:', err);
        setError('Failed to load your resumes. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchResumes();
    }
  }, [isAuthenticated]);

  // If still checking authentication, show loading
  if (authLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // If not authenticated, the useEffect will redirect

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          Welcome back, {user?.name || 'User'}! Manage your resumes and track your progress.
        </p>
      </motion.div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg p-6 shadow-md"
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold mb-2">Create Resume</h2>
              <p className="text-blue-100">Start building a new resume from scratch</p>
            </div>
            <div className="bg-white bg-opacity-20 p-3 rounded-full">
              <Plus className="h-6 w-6" />
            </div>
          </div>
          <div className="mt-4">
            <Link 
              href="/build"
              className="inline-flex items-center text-sm font-medium text-white hover:text-blue-100"
            >
              Get Started
              <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
          className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg p-6 shadow-md"
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold mb-2">Upload Resume</h2>
              <p className="text-purple-100">Upload an existing resume file</p>
            </div>
            <div className="bg-white bg-opacity-20 p-3 rounded-full">
              <Upload className="h-6 w-6" />
            </div>
          </div>
          <div className="mt-4">
            <Link 
              href="/analyze"
              className="inline-flex items-center text-sm font-medium text-white hover:text-purple-100"
            >
              Upload Now
              <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
          className="bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-lg p-6 shadow-md"
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold mb-2">Analyze Resume</h2>
              <p className="text-green-100">Test against ATS for a job posting</p>
            </div>
            <div className="bg-white bg-opacity-20 p-3 rounded-full">
              <Search className="h-6 w-6" />
            </div>
          </div>
          <div className="mt-4">
            <Link 
              href="/analyze"
              className="inline-flex items-center text-sm font-medium text-white hover:text-green-100"
            >
              Start Analysis
              <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
          className="bg-gradient-to-r from-orange-600 to-yellow-600 text-white rounded-lg p-6 shadow-md"
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold mb-2">Job Matches</h2>
              <p className="text-orange-100">Find jobs matching your resume</p>
            </div>
            <div className="bg-white bg-opacity-20 p-3 rounded-full">
              <Briefcase className="h-6 w-6" />
            </div>
          </div>
          <div className="mt-4">
            <Link 
              href="/job-matches"
              className="inline-flex items-center text-sm font-medium text-white hover:text-orange-100"
            >
              View Matches
              <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Resume List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">My Resumes</h2>
          <Link 
            href="/build"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors inline-flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Resume
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 dark:bg-red-900/30 p-4 rounded-md text-red-600 dark:text-red-400">
            {error}
          </div>
        ) : resumes.length === 0 ? (
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-8 text-center">
            <FileText className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No resumes yet</h3>
            <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-6">
              Create your first resume to get started on your job search journey.
            </p>
            <Link 
              href="/build"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors inline-flex items-center"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create New Resume
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Title
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Last Updated
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    ATS Score
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {resumes.map((resume: any) => (
                  <tr key={resume.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-lg">
                          <FileText className="h-5 w-5" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {resume.title}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {resume.content?.personal?.jobTitle || 'No job title'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(resume.updatedAt).toLocaleDateString()}
                        <Clock className="h-4 w-4 ml-2 mr-1" />
                        {new Date(resume.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {resume.atsScore ? (
                        <div className="flex items-center">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            resume.atsScore >= 80
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                              : resume.atsScore >= 60
                              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                          }`}>
                            {resume.atsScore}%
                          </span>
                          <div className="ml-2">
                            <BarChart className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                          </div>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-500 dark:text-gray-400">Not analyzed</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex space-x-3">
                        <Link href={`/build/${resume.id}`} className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
                          Edit
                        </Link>
                        <Link href={`/preview/${resume.id}`} className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300">
                          Preview
                        </Link>
                        <button className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 flex items-center">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Recent Activity</h2>
        <div className="space-y-4">
          {[
            { action: 'Created resume', date: '2 days ago', title: 'Software Developer Resume' },
            { action: 'Analyzed resume', date: 'Yesterday', title: 'Software Developer Resume', score: 85 },
            { action: 'Updated resume', date: 'Today', title: 'Software Developer Resume' },
          ].map((activity, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex items-center p-4 border border-gray-100 dark:border-gray-700 rounded-lg"
            >
              <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full">
                {activity.action.includes('Created') && <Plus className="h-5 w-5" />}
                {activity.action.includes('Analyzed') && <BarChart className="h-5 w-5" />}
                {activity.action.includes('Updated') && <FileText className="h-5 w-5" />}
              </div>
              <div className="ml-4">
                <div className="text-sm font-medium text-gray-900 dark:text-white">{activity.action}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {activity.title}
                  {activity.score && (
                    <span className="ml-2 px-2 py-0.5 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs rounded-full">
                      {activity.score}% ATS Score
                    </span>
                  )}
                </div>
              </div>
              <div className="ml-auto text-sm text-gray-500 dark:text-gray-400">{activity.date}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
} 