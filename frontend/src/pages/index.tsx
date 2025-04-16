import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FaFileAlt, FaUserEdit, FaChartLine, FaRocket, FaCheck, FaArrowRight, FaLightbulb, FaChartBar } from 'react-icons/fa';
import { RiRobot2Fill, RiFileTextLine, RiMedalLine, RiShieldStarLine, RiRocketLine } from 'react-icons/ri';
import { HiOutlineDocumentSearch, HiOutlineChartBar, HiOutlineLightBulb } from 'react-icons/hi';
import { useTheme } from '../context/ThemeContext';

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

const fadeInRight = {
  hidden: { opacity: 0, x: -20 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

const fadeInLeft = {
  hidden: { opacity: 0, x: 20 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3
    }
  }
};

const pulseAnimation = {
  scale: [1, 1.05, 1],
  transition: { duration: 2, repeat: Infinity }
};

const floatAnimation = {
  y: [0, -10, 0],
  transition: { duration: 3, repeat: Infinity, ease: "easeInOut" }
};

export default function Home() {
  const { theme } = useTheme();
  return (
    <>
      <Head>
        <title>Resume ATS Optimizer - Boost Your Job Application Success</title>
        <meta name="description" content="Optimize your resume for Applicant Tracking Systems (ATS) and increase your chances of landing interviews with our AI-powered tools." />
      </Head>

      <div className="space-y-16">
        {/* Hero Section */}
        <motion.section 
          className={`relative overflow-hidden rounded-3xl shadow-xl ${theme === 'light' 
            ? 'bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700' 
            : 'bg-gradient-to-br from-gray-800 via-purple-800 to-indigo-900'}`}
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
        >
          {/* Background decorative elements */}
          <div className="absolute inset-0 overflow-hidden">
            <svg className="absolute top-0 left-0 w-full h-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" preserveAspectRatio="none">
              <path fill="rgba(255,255,255,0.05)" fillOpacity="1" d="M0,192L48,176C96,160,192,128,288,128C384,128,480,160,576,186.7C672,213,768,235,864,224C960,213,1056,171,1152,165.3C1248,160,1344,192,1392,208L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
            </svg>
            
            <motion.div 
              className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-white opacity-5 blur-3xl"
              animate={{ 
                scale: [1, 1.2, 1],
                x: [0, 20, 0],
                y: [0, -20, 0]
              }}
              transition={{ duration: 15, repeat: Infinity, repeatType: "reverse" }}
            />
            <motion.div 
              className="absolute top-1/2 right-0 w-80 h-80 rounded-full bg-white opacity-5 blur-3xl"
              animate={{ 
                scale: [1, 1.1, 1],
                x: [0, -20, 0],
                y: [0, 20, 0]
              }}
              transition={{ duration: 12, repeat: Infinity, repeatType: "reverse" }}
            />
          </div>
          
          <div className="relative py-16 px-6 sm:px-8 lg:px-12 max-w-7xl mx-auto">
            <div className="lg:flex lg:items-center lg:gap-16">
              {/* Left content */}
              <motion.div 
                className="text-center lg:text-left lg:w-1/2 z-10"
                variants={staggerContainer}
              >
                <motion.div variants={fadeInUp}>
                  <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-white/10 backdrop-blur-sm mb-6 shadow-lg border border-white/20">
                    <RiRobot2Fill className="mr-2 text-indigo-200" /> AI-Powered Resume Optimization
                  </span>
                </motion.div>
                
                <motion.h1 
                  className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl mb-8 text-white"
                  variants={fadeInUp}
                >
                  <span className="block">Get More Interviews</span>
                  <span className="block text-indigo-200 mt-2">With ATS-Optimized Resumes</span>
                </motion.h1>
                
                <motion.p 
                  className="mt-8 text-xl max-w-2xl mx-auto lg:mx-0 text-indigo-100 leading-relaxed"
                  variants={fadeInUp}
                >
                  75% of resumes are rejected by ATS before a human sees them. Our AI tools ensure your resume passes through and stands out to recruiters.
                </motion.p>
                
                <motion.div 
                  className="mt-12 flex flex-wrap gap-4 justify-center lg:justify-start"
                  variants={fadeInUp}
                >
                  <Link 
                    href="/scanner" 
                    className="bg-white text-indigo-700 hover:bg-indigo-50 shadow-lg hover:shadow-xl px-8 py-4 text-base font-medium rounded-xl transition-all duration-300 hover:-translate-y-1 flex items-center"
                  >
                    <HiOutlineDocumentSearch className="mr-2 text-xl" /> Score Your Resume
                  </Link>
                  <Link 
                    href="/builder" 
                    className="bg-transparent border-white border-2 text-white hover:bg-white/10 px-8 py-4 text-base font-medium rounded-xl transition-all duration-300 hover:-translate-y-1 flex items-center"
                  >
                    <FaUserEdit className="mr-2" /> Build New Resume
                  </Link>
                </motion.div>
              </motion.div>
              
              {/* Right content - Resume Mockup */}
              <motion.div 
                className="hidden lg:block lg:w-1/2 mt-16 lg:mt-0"
                variants={fadeInLeft}
              >
                <div className="relative">
                  {/* Main resume mockup */}
                  <motion.div 
                    className="relative z-10 bg-white/10 backdrop-blur-md p-5 rounded-2xl shadow-2xl border border-white/20"
                    animate={floatAnimation}
                  >
                    <div className="bg-white/95 backdrop-blur-sm rounded-xl overflow-hidden shadow-inner">
                      {/* Browser-like header */}
                      <div className="h-8 bg-gray-100 flex items-center px-4 border-b">
                        <div className="flex space-x-2">
                          <div className="w-3 h-3 rounded-full bg-red-400"></div>
                          <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                          <div className="w-3 h-3 rounded-full bg-green-400"></div>
                        </div>
                      </div>
                      
                      {/* Resume content */}
                      <div className="p-6">
                        <div className="space-y-4">
                          <div className="h-8 bg-indigo-100 rounded-lg w-3/4"></div>
                          <div className="space-y-2">
                            <div className="h-4 bg-gray-200 rounded w-full"></div>
                            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                            <div className="h-4 bg-gray-200 rounded w-4/6"></div>
                          </div>
                          <div className="h-8 bg-indigo-100 rounded-lg w-2/4"></div>
                          <div className="space-y-2">
                            <div className="h-4 bg-gray-200 rounded w-full"></div>
                            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                            <div className="h-4 bg-gray-200 rounded w-4/6"></div>
                          </div>
                          <div className="h-8 bg-indigo-100 rounded-lg w-3/4"></div>
                          <div className="space-y-2">
                            <div className="h-4 bg-gray-200 rounded w-full"></div>
                            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                  
                  {/* Decorative elements */}
                  <motion.div 
                    className="absolute -top-8 -right-8 bg-green-500 rounded-xl p-4 shadow-lg z-20 text-white"
                    animate={pulseAnimation}
                  >
                    <FaCheck className="text-2xl" />
                  </motion.div>
                  
                  <motion.div 
                    className="absolute -bottom-6 -left-6 bg-indigo-500 rounded-xl p-4 shadow-lg z-20 text-white"
                    animate={pulseAnimation}
                    transition={{ delay: 0.5 }}
                  >
                    <RiRocketLine className="text-2xl" />
                  </motion.div>
                  
                  <motion.div 
                    className="absolute top-1/3 -left-12 bg-white rounded-xl p-4 shadow-lg z-20 text-indigo-500"
                    animate={pulseAnimation}
                    transition={{ delay: 1 }}
                  >
                    <FaChartLine className="text-2xl" />
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Features Section */}
        <motion.section
          className={`py-16 relative overflow-hidden rounded-3xl shadow-lg ${theme === 'light' 
            ? 'bg-gradient-to-br from-indigo-50 to-violet-50' 
            : 'bg-gradient-to-br from-gray-900 to-indigo-950'}`}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          {/* Background decorative elements */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-20 -right-20 w-80 h-80 rounded-full bg-indigo-200 opacity-30 blur-3xl"></div>
            <div className="absolute -bottom-40 -left-20 w-96 h-96 rounded-full bg-violet-200 opacity-30 blur-3xl"></div>
          </div>

          <div className="container mx-auto px-6 relative z-10">
            <motion.div 
              className="text-center max-w-3xl mx-auto mb-16"
              variants={fadeInUp}
            >
              <span className={`inline-block font-semibold text-sm px-4 py-2 rounded-full mb-4 shadow-sm ${theme === 'light' 
                ? 'bg-indigo-100 text-indigo-800' 
                : 'bg-indigo-900/50 text-indigo-300 border border-indigo-700/30'}`}>Powerful Features</span>
              <h2 className={`text-3xl md:text-4xl font-bold mt-2 mb-6 ${theme === 'light' ? 'text-indigo-900' : 'text-white'}`}>Supercharge Your Job Search</h2>
              <p className={`text-lg leading-relaxed ${theme === 'light' ? 'text-indigo-700/70' : 'text-indigo-200/80'}`}>Our AI-powered tools analyze your resume against industry standards and job descriptions to maximize your chances of landing interviews.</p>
            </motion.div>
            
            <div className="grid md:grid-cols-3 gap-8 mb-16">
              {/* Feature 1 */}
              <motion.div 
                className={`rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 group ${theme === 'light' 
                  ? 'bg-white border border-indigo-50 hover:border-indigo-100' 
                  : 'bg-gray-800/80 border border-gray-700 hover:border-indigo-800'}`}
                variants={fadeInUp}
                whileHover={{ y: -5 }}
              >
                <div className={`rounded-xl w-16 h-16 flex items-center justify-center mb-6 transition-all duration-300 ${theme === 'light'
                  ? 'bg-indigo-100 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white'
                  : 'bg-indigo-900/50 text-indigo-300 group-hover:bg-indigo-700 group-hover:text-white'}`}>
                  <HiOutlineDocumentSearch className="text-3xl" />
                </div>
                <h3 className={`text-xl font-bold mb-3 ${theme === 'light' ? 'text-indigo-900' : 'text-white'}`}>Resume Scanner</h3>
                <p className={`${theme === 'light' ? 'text-indigo-700/70' : 'text-indigo-300/80'}`}>Instantly analyze your resume against ATS algorithms and get a detailed score with improvement suggestions.</p>
              </motion.div>
              
              {/* Feature 2 */}
              <motion.div 
                className={`rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 group ${theme === 'light' 
                  ? 'bg-white border border-indigo-50 hover:border-indigo-100' 
                  : 'bg-gray-800/80 border border-gray-700 hover:border-indigo-800'}`}
                variants={fadeInUp}
                whileHover={{ y: -5 }}
              >
                <div className={`rounded-xl w-16 h-16 flex items-center justify-center mb-6 transition-all duration-300 ${theme === 'light'
                  ? 'bg-indigo-100 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white'
                  : 'bg-indigo-900/50 text-indigo-300 group-hover:bg-indigo-700 group-hover:text-white'}`}>
                  <FaUserEdit className="text-3xl" />
                </div>
                <h3 className="text-xl font-bold text-indigo-900 mb-3">Resume Builder</h3>
                <p className="text-indigo-700/70">Create professional, ATS-optimized resumes with our intuitive builder. Choose from modern templates designed to pass ATS systems.</p>
              </motion.div>
              
              {/* Feature 3 */}
              <motion.div 
                className={`rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 group ${theme === 'light' 
                  ? 'bg-white border border-indigo-50 hover:border-indigo-100' 
                  : 'bg-gray-800/80 border border-gray-700 hover:border-indigo-800'}`}
                variants={fadeInUp}
                whileHover={{ y: -5 }}
              >
                <div className={`rounded-xl w-16 h-16 flex items-center justify-center mb-6 transition-all duration-300 ${theme === 'light'
                  ? 'bg-indigo-100 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white'
                  : 'bg-indigo-900/50 text-indigo-300 group-hover:bg-indigo-700 group-hover:text-white'}`}>
                  <HiOutlineLightBulb className="text-3xl" />
                </div>
                <h3 className="text-xl font-bold text-indigo-900 mb-3">Optimization Tips</h3>
                <p className="text-indigo-700/70">Get expert advice on resume keywords, formatting, and content to ensure your resume stands out to both ATS systems and human recruiters.</p>
              </motion.div>
            </div>
            
            {/* Additional feature callout */}
            <motion.div 
              className="bg-gradient-to-r from-primary-600 to-accent-600 rounded-2xl p-8 shadow-xl text-white mt-16"
              variants={fadeInUp}
              whileInView={{ y: [20, 0], opacity: [0, 1] }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex flex-col md:flex-row items-center justify-between">
                <div className="mb-6 md:mb-0 md:mr-8">
                  <h3 className="text-2xl font-bold mb-3">Ready to stand out from the competition?</h3>
                  <p className="text-primary-100">Our AI-powered tools help you create a resume that gets past ATS filters and impresses recruiters.</p>
                </div>
                <Link 
                  href="/scanner" 
                  className="btn bg-white text-primary-700 hover:bg-primary-50 shadow-lg hover:shadow-xl px-8 py-4 text-base font-medium rounded-xl whitespace-nowrap flex-shrink-0 transform transition-all duration-300 hover:-translate-y-1"
                >
                  Try It Free
                </Link>
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* Stats Section */}
        <motion.section 
          className="py-20 bg-secondary-50 rounded-3xl"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <span className={`inline-block font-semibold text-sm px-4 py-2 rounded-full mb-4 ${theme === 'light' 
                ? 'bg-indigo-100 text-indigo-800' 
                : 'bg-indigo-900/50 text-indigo-300 border border-indigo-700/30'}`}>The Numbers</span>
              <h2 className={`text-3xl md:text-4xl font-bold mt-2 mb-6 ${theme === 'light' ? 'text-indigo-900' : 'text-white'}`}>Resume Statistics</h2>
              <p className={`text-lg max-w-3xl mx-auto ${theme === 'light' ? 'text-indigo-700/70' : 'text-indigo-200/80'}`}>Understanding the numbers behind the hiring process can help you improve your chances of landing interviews.</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <motion.div 
                className={`rounded-2xl p-8 shadow-lg text-center ${theme === 'light' ? 'bg-white' : 'bg-gray-800/80 border border-gray-700'}`}
                variants={fadeInUp}
                whileHover={{ y: -5 }}
              >
                <div className={`text-5xl font-bold mb-4 ${theme === 'light' ? 'text-indigo-600' : 'text-indigo-400'}`}>75%</div>
                <p className={`${theme === 'light' ? 'text-indigo-700' : 'text-indigo-200'}`}>of resumes are rejected by ATS before a human sees them</p>
              </motion.div>
              
              <motion.div 
                className="bg-white rounded-2xl p-8 shadow-lg text-center"
                variants={fadeInUp}
                whileHover={{ y: -5 }}
                transition={{ delay: 0.1 }}
              >
                <div className="text-5xl font-bold text-accent-600 mb-4">60%</div>
                <p className="text-secondary-700">increase in interview chances with an ATS-optimized resume</p>
              </motion.div>
              
              <motion.div 
                className="bg-white rounded-2xl p-8 shadow-lg text-center"
                variants={fadeInUp}
                whileHover={{ y: -5 }}
                transition={{ delay: 0.2 }}
              >
                <div className="text-5xl font-bold text-primary-600 mb-4">24s</div>
                <p className="text-secondary-700">average time recruiters spend reviewing a resume</p>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Statistics Section */}
        <motion.section 
          className="py-24"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
        >
          <div className={`relative overflow-hidden rounded-3xl text-white ${theme === 'light' 
            ? 'bg-gradient-to-r from-indigo-600 to-violet-600' 
            : 'bg-gradient-to-r from-indigo-900 to-purple-900 border border-indigo-700/30'}`}>
            {/* Background decorative elements */}
            <div className="absolute inset-0 overflow-hidden opacity-10">
              <div className="absolute -right-40 -top-40 w-80 h-80 rounded-full bg-white blur-3xl"></div>
              <div className="absolute -left-20 bottom-0 w-60 h-60 rounded-full bg-white blur-3xl"></div>
            </div>
            
            <div className="relative py-16 px-6 sm:px-8 lg:px-12 max-w-4xl mx-auto text-center">
              <motion.h2 
                className="text-3xl md:text-4xl font-bold mb-6"
                variants={fadeInUp}
              >
                Ready to Optimize Your Resume?
              </motion.h2>
              <motion.p 
                className="text-xl text-primary-50 mb-10 max-w-3xl mx-auto"
                variants={fadeInUp}
              >
                Don't let your resume get lost in the ATS black hole. Start optimizing today and increase your chances of landing your dream job.
              </motion.p>
              <motion.div 
                className="flex flex-wrap justify-center gap-5"
                variants={fadeInUp}
              >
                <Link 
                  href="/scanner" 
                  className="btn bg-white text-primary-700 hover:bg-primary-50 shadow-lg hover:shadow-xl px-8 py-4 text-base font-medium rounded-xl transform transition-all duration-300 hover:-translate-y-1"
                >
                  Score Your Resume
                </Link>
                <Link 
                  href="/builder" 
                  className="btn btn-outline bg-transparent border-white border-2 text-white hover:bg-white/10 px-8 py-4 text-base font-medium rounded-xl transform transition-all duration-300 hover:-translate-y-1"
                >
                  Build New Resume
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* CTA Section */}
        <motion.section 
          className="py-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <div className={`relative overflow-hidden rounded-3xl text-white ${theme === 'light' 
            ? 'bg-gradient-to-r from-indigo-600 to-violet-600' 
            : 'bg-gradient-to-r from-indigo-900 to-purple-900 border border-indigo-700/30'}`}>
            {/* Background decorative elements */}
            <div className="absolute inset-0 overflow-hidden opacity-10">
              <div className="absolute -right-40 -top-40 w-80 h-80 rounded-full bg-white blur-3xl"></div>
              <div className="absolute -left-20 bottom-0 w-60 h-60 rounded-full bg-white blur-3xl"></div>
            </div>
            
            <div className="relative py-16 px-6 sm:px-8 lg:px-12 max-w-4xl mx-auto text-center">
              <motion.h2 
                className="text-3xl md:text-4xl font-bold mb-6"
                variants={fadeInUp}
              >
                Ready to Optimize Your Resume?
              </motion.h2>
              <motion.p 
                className="text-xl text-primary-50 mb-10 max-w-3xl mx-auto"
                variants={fadeInUp}
              >
                Don't let your resume get lost in the ATS black hole. Start optimizing today and increase your chances of landing your dream job.
              </motion.p>
              <motion.div 
                className="flex flex-wrap justify-center gap-5"
                variants={fadeInUp}
              >
                <Link 
                  href="/scanner" 
                  className="btn bg-white text-primary-700 hover:bg-primary-50 shadow-lg hover:shadow-xl px-8 py-4 text-base font-medium rounded-xl transform transition-all duration-300 hover:-translate-y-1"
                >
                  Score Your Resume
                </Link>
                <Link 
                  href="/builder" 
                  className="btn btn-outline bg-transparent border-white border-2 text-white hover:bg-white/10 px-8 py-4 text-base font-medium rounded-xl transform transition-all duration-300 hover:-translate-y-1"
                >
                  Build New Resume
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.section>
      </div>
    </>
  );
}
