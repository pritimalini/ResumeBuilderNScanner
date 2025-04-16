import React from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaInfoCircle, FaExclamationTriangle, FaTimesCircle } from 'react-icons/fa';

const OptimizationTips: React.FC = () => {
  return (
    <>
      <Head>
        <title>Resume ATS Optimization Tips</title>
        <meta name="description" content="Learn how to optimize your resume for Applicant Tracking Systems (ATS) with these expert tips and best practices." />
      </Head>

      <div className="space-y-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Resume ATS Optimization Tips</h1>
          <p className="text-secondary-600">
            Learn how to optimize your resume for Applicant Tracking Systems (ATS) with these expert tips and best practices.
          </p>
        </div>

        {/* Introduction */}
        <motion.div 
          className="card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-xl font-semibold mb-4">Understanding ATS Systems</h2>
          <p className="mb-4">
            Applicant Tracking Systems (ATS) are software applications that help employers manage the recruitment process. They scan, sort, and rank resumes based on keywords, formatting, and other criteria.
          </p>
          <p>
            According to recent studies, over 75% of resumes are rejected by ATS before they ever reach a human recruiter. Following these optimization tips will help ensure your resume makes it through the ATS filters and into the hands of hiring managers.
          </p>
        </motion.div>

        {/* Formatting Tips */}
        <motion.div 
          className="card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="flex items-start mb-4">
            <FaCheckCircle className="text-success-500 text-xl mt-1 mr-3 flex-shrink-0" />
            <div>
              <h2 className="text-xl font-semibold">Formatting Best Practices</h2>
              <p className="text-secondary-600">Keep your resume format clean and ATS-friendly</p>
            </div>
          </div>
          
          <ul className="space-y-4 ml-9">
            <li className="flex items-start">
              <span className="w-5 h-5 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-xs mr-3 flex-shrink-0 mt-0.5">1</span>
              <div>
                <h3 className="font-medium">Use a simple, clean layout</h3>
                <p className="text-sm text-secondary-600">
                  Avoid complex designs, tables, headers/footers, text boxes, and columns. ATS systems often struggle with these elements.
                </p>
              </div>
            </li>
            <li className="flex items-start">
              <span className="w-5 h-5 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-xs mr-3 flex-shrink-0 mt-0.5">2</span>
              <div>
                <h3 className="font-medium">Stick to standard section headings</h3>
                <p className="text-sm text-secondary-600">
                  Use conventional section titles like "Experience," "Education," and "Skills" instead of creative alternatives.
                </p>
              </div>
            </li>
            <li className="flex items-start">
              <span className="w-5 h-5 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-xs mr-3 flex-shrink-0 mt-0.5">3</span>
              <div>
                <h3 className="font-medium">Use standard fonts</h3>
                <p className="text-sm text-secondary-600">
                  Stick to common fonts like Arial, Calibri, or Times New Roman. Avoid decorative or uncommon fonts.
                </p>
              </div>
            </li>
            <li className="flex items-start">
              <span className="w-5 h-5 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-xs mr-3 flex-shrink-0 mt-0.5">4</span>
              <div>
                <h3 className="font-medium">Save in the right format</h3>
                <p className="text-sm text-secondary-600">
                  Submit your resume as a .docx or .pdf file. These formats are most compatible with ATS systems.
                </p>
              </div>
            </li>
            <li className="flex items-start">
              <span className="w-5 h-5 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-xs mr-3 flex-shrink-0 mt-0.5">5</span>
              <div>
                <h3 className="font-medium">Use standard bullet points</h3>
                <p className="text-sm text-secondary-600">
                  Stick to standard bullet points (•) rather than custom symbols or emojis.
                </p>
              </div>
            </li>
          </ul>
        </motion.div>

        {/* Keyword Tips */}
        <motion.div 
          className="card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex items-start mb-4">
            <FaCheckCircle className="text-success-500 text-xl mt-1 mr-3 flex-shrink-0" />
            <div>
              <h2 className="text-xl font-semibold">Keyword Optimization</h2>
              <p className="text-secondary-600">Include relevant keywords to increase your match rate</p>
            </div>
          </div>
          
          <ul className="space-y-4 ml-9">
            <li className="flex items-start">
              <span className="w-5 h-5 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-xs mr-3 flex-shrink-0 mt-0.5">1</span>
              <div>
                <h3 className="font-medium">Match keywords from the job description</h3>
                <p className="text-sm text-secondary-600">
                  Carefully analyze the job posting and include relevant keywords, especially those mentioned multiple times.
                </p>
              </div>
            </li>
            <li className="flex items-start">
              <span className="w-5 h-5 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-xs mr-3 flex-shrink-0 mt-0.5">2</span>
              <div>
                <h3 className="font-medium">Use both acronyms and spelled-out terms</h3>
                <p className="text-sm text-secondary-600">
                  Include both versions (e.g., "Search Engine Optimization (SEO)") to ensure the ATS recognizes them.
                </p>
              </div>
            </li>
            <li className="flex items-start">
              <span className="w-5 h-5 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-xs mr-3 flex-shrink-0 mt-0.5">3</span>
              <div>
                <h3 className="font-medium">Include a dedicated skills section</h3>
                <p className="text-sm text-secondary-600">
                  Create a clear skills section that lists your technical and soft skills relevant to the position.
                </p>
              </div>
            </li>
            <li className="flex items-start">
              <span className="w-5 h-5 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-xs mr-3 flex-shrink-0 mt-0.5">4</span>
              <div>
                <h3 className="font-medium">Use natural keyword placement</h3>
                <p className="text-sm text-secondary-600">
                  Integrate keywords naturally throughout your resume, not just in one section. Avoid "keyword stuffing."
                </p>
              </div>
            </li>
          </ul>
        </motion.div>

        {/* Content Tips */}
        <motion.div 
          className="card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="flex items-start mb-4">
            <FaCheckCircle className="text-success-500 text-xl mt-1 mr-3 flex-shrink-0" />
            <div>
              <h2 className="text-xl font-semibold">Content Optimization</h2>
              <p className="text-secondary-600">Structure your content for maximum impact</p>
            </div>
          </div>
          
          <ul className="space-y-4 ml-9">
            <li className="flex items-start">
              <span className="w-5 h-5 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-xs mr-3 flex-shrink-0 mt-0.5">1</span>
              <div>
                <h3 className="font-medium">Use strong action verbs</h3>
                <p className="text-sm text-secondary-600">
                  Begin bullet points with action verbs like "Achieved," "Implemented," "Developed," or "Led."
                </p>
              </div>
            </li>
            <li className="flex items-start">
              <span className="w-5 h-5 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-xs mr-3 flex-shrink-0 mt-0.5">2</span>
              <div>
                <h3 className="font-medium">Include quantifiable achievements</h3>
                <p className="text-sm text-secondary-600">
                  Use numbers and percentages to demonstrate your impact (e.g., "Increased sales by 25%").
                </p>
              </div>
            </li>
            <li className="flex items-start">
              <span className="w-5 h-5 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-xs mr-3 flex-shrink-0 mt-0.5">3</span>
              <div>
                <h3 className="font-medium">Keep bullet points concise</h3>
                <p className="text-sm text-secondary-600">
                  Aim for 1-2 lines per bullet point. Be clear and direct in your language.
                </p>
              </div>
            </li>
            <li className="flex items-start">
              <span className="w-5 h-5 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-xs mr-3 flex-shrink-0 mt-0.5">4</span>
              <div>
                <h3 className="font-medium">Tailor your professional summary</h3>
                <p className="text-sm text-secondary-600">
                  Customize your summary for each job application, highlighting relevant skills and experience.
                </p>
              </div>
            </li>
          </ul>
        </motion.div>

        {/* Common Mistakes */}
        <motion.div 
          className="card bg-danger-50 border border-danger-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="flex items-start mb-4">
            <FaExclamationTriangle className="text-danger-500 text-xl mt-1 mr-3 flex-shrink-0" />
            <div>
              <h2 className="text-xl font-semibold">Common ATS Mistakes to Avoid</h2>
              <p className="text-secondary-600">These mistakes can cause your resume to be rejected by ATS</p>
            </div>
          </div>
          
          <ul className="space-y-3 ml-9">
            <li className="flex items-start">
              <FaTimesCircle className="text-danger-500 mr-2 mt-0.5 flex-shrink-0" />
              <span className="text-sm">Using images, graphics, or icons that contain important information</span>
            </li>
            <li className="flex items-start">
              <FaTimesCircle className="text-danger-500 mr-2 mt-0.5 flex-shrink-0" />
              <span className="text-sm">Placing contact information in headers or footers</span>
            </li>
            <li className="flex items-start">
              <FaTimesCircle className="text-danger-500 mr-2 mt-0.5 flex-shrink-0" />
              <span className="text-sm">Using tables or columns to organize information</span>
            </li>
            <li className="flex items-start">
              <FaTimesCircle className="text-danger-500 mr-2 mt-0.5 flex-shrink-0" />
              <span className="text-sm">Submitting resumes in non-standard file formats (like .pages or .jpg)</span>
            </li>
            <li className="flex items-start">
              <FaTimesCircle className="text-danger-500 mr-2 mt-0.5 flex-shrink-0" />
              <span className="text-sm">Using creative or non-standard section headings</span>
            </li>
            <li className="flex items-start">
              <FaTimesCircle className="text-danger-500 mr-2 mt-0.5 flex-shrink-0" />
              <span className="text-sm">Excessive use of special characters or unusual fonts</span>
            </li>
            <li className="flex items-start">
              <FaTimesCircle className="text-danger-500 mr-2 mt-0.5 flex-shrink-0" />
              <span className="text-sm">Keyword stuffing (unnaturally forcing keywords into your resume)</span>
            </li>
          </ul>
        </motion.div>

        {/* Final Tips */}
        <motion.div 
          className="card bg-primary-50 border border-primary-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <div className="flex items-start mb-4">
            <FaInfoCircle className="text-primary-500 text-xl mt-1 mr-3 flex-shrink-0" />
            <div>
              <h2 className="text-xl font-semibold">Pro Tips</h2>
              <p className="text-secondary-600">Advanced strategies for ATS optimization</p>
            </div>
          </div>
          
          <ul className="space-y-3 ml-9">
            <li className="flex items-start">
              <div className="w-6 h-6 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-xs mr-2 flex-shrink-0">✓</div>
              <div>
                <span className="font-medium">Customize for each application</span>
                <p className="text-sm text-secondary-600">Tailor your resume for each job application to match the specific requirements.</p>
              </div>
            </li>
            <li className="flex items-start">
              <div className="w-6 h-6 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-xs mr-2 flex-shrink-0">✓</div>
              <div>
                <span className="font-medium">Use industry-standard job titles</span>
                <p className="text-sm text-secondary-600">If your current title is unique to your company, consider using a more standard equivalent.</p>
              </div>
            </li>
            <li className="flex items-start">
              <div className="w-6 h-6 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-xs mr-2 flex-shrink-0">✓</div>
              <div>
                <span className="font-medium">Include a LinkedIn profile</span>
                <p className="text-sm text-secondary-600">Add your LinkedIn URL to your contact information for additional credibility.</p>
              </div>
            </li>
            <li className="flex items-start">
              <div className="w-6 h-6 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-xs mr-2 flex-shrink-0">✓</div>
              <div>
                <span className="font-medium">Test your resume</span>
                <p className="text-sm text-secondary-600">Use our Resume Scanner to test your resume against specific job descriptions.</p>
              </div>
            </li>
          </ul>
        </motion.div>
      </div>
    </>
  );
};

export default OptimizationTips;
