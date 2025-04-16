import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaFileAlt, FaUserEdit, FaChartLine, FaRocket, FaCheck, FaArrowRight } from 'react-icons/fa';
import { RiRobot2Fill, RiFileTextLine, RiMedalLine } from 'react-icons/ri';

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
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

export default function Home() {
  return (
    <>
      <Head>
        <title>Resume ATS Optimizer - Boost Your Job Application Success</title>
        <meta name="description" content="Optimize your resume for Applicant Tracking Systems (ATS) and increase your chances of landing interviews with our AI-powered tools." />
      </Head>

      <div className="space-y-20">
        {/* Hero Section */}
        <motion.section 
          className="relative overflow-hidden rounded-3xl shadow-2xl"
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
        >
          {/* Background gradient and decorative elements */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary-600 via-primary-700 to-primary-800 overflow-hidden">
            {/* Animated background elements */}
            <motion.div 
              className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-white opacity-10 blur-3xl"
              animate={{ 
                scale: [1, 1.2, 1],
                x: [0, 20, 0],
                y: [0, -20, 0]
              }}
              transition={{ duration: 15, repeat: Infinity, repeatType: "reverse" }}
            />
            <motion.div 
              className="absolute top-1/2 right-0 w-80 h-80 rounded-full bg-white opacity-10 blur-3xl"
              animate={{ 
                scale: [1, 1.1, 1],
                x: [0, -20, 0],
                y: [0, 20, 0]
              }}
              transition={{ duration: 12, repeat: Infinity, repeatType: "reverse" }}
            />
            <motion.div 
              className="absolute bottom-0 left-1/3 w-60 h-60 rounded-full bg-white opacity-10 blur-3xl"
              animate={{ 
                scale: [1, 1.3, 1],
                x: [0, 30, 0],
                y: [0, 30, 0]
              }}
              transition={{ duration: 18, repeat: Infinity, repeatType: "reverse" }}
            />
          </div>
          
          <div className="relative py-20 px-6 sm:px-8 lg:px-12 max-w-7xl mx-auto">
            <div className="lg:flex lg:items-center lg:gap-16">
              {/* Left content */}
              <motion.div 
                className="text-center lg:text-left lg:w-1/2 z-10"
                variants={staggerContainer}
              >
                <motion.div variants={fadeInUp}>
                  <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-white bg-opacity-20 backdrop-blur-sm mb-6 shadow-lg">
                    <RiRobot2Fill className="mr-2 text-accent-300" /> AI-Powered Resume Optimization
                  </span>
                </motion.div>
                
                <motion.h1 
                  className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl mb-8 text-white"
                  variants={fadeInUp}
                >
                  <span className="block">Get More Interviews</span>
                  <span className="block text-primary-200 mt-2">With ATS-Optimized Resumes</span>
                </motion.h1>
                
                <motion.p 
                  className="mt-8 text-xl max-w-2xl mx-auto lg:mx-0 text-primary-50 leading-relaxed"
                  variants={fadeInUp}
                >
                  75% of resumes are rejected by ATS before a human sees them. Our AI tools ensure your resume passes through and stands out to recruiters.
                </motion.p>
                
                <motion.div 
                  className="mt-12 flex flex-wrap justify-center lg:justify-start gap-5"
                  variants={fadeInUp}
                >
                  <Link 
                    href="/scanner" 
                    className="btn btn-accent px-8 py-4 text-base font-medium rounded-xl flex items-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                  >
                    Score Your Resume <FaArrowRight className="ml-3" />
                  </Link>
                  <Link 
                    href="/builder" 
                    className="btn btn-outline bg-white/10 backdrop-blur-sm border-white border-2 text-white hover:bg-white/20 px-8 py-4 text-base font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                  >
                    Build New Resume
                  </Link>
                </motion.div>
                
                {/* Trust indicators */}
                <motion.div 
                  className="mt-12 pt-8 border-t border-white/20 flex flex-wrap justify-center lg:justify-start gap-8 text-white/70"
                  variants={fadeInUp}
                >
                  <div className="flex items-center">
                    <div className="mr-3 text-accent-300"><FaCheck /></div>
                    <span>No sign-up required</span>
                  </div>
                  <div className="flex items-center">
                    <div className="mr-3 text-accent-300"><FaCheck /></div>
                    <span>Instant results</span>
                  </div>
                  <div className="flex items-center">
                    <div className="mr-3 text-accent-300"><FaCheck /></div>
                    <span>AI-powered analysis</span>
                  </div>
                </motion.div>
              </motion.div>
              
              {/* Right image */}
              <motion.div 
                className="hidden lg:block lg:w-1/2 mt-10 lg:mt-0"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                <motion.div 
                  className="relative mx-auto w-full max-w-md"
                  animate={pulseAnimation}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-400 to-accent-400 rounded-2xl blur-xl opacity-50 transform -rotate-6"></div>
                  <div className="relative shadow-2xl rounded-2xl overflow-hidden border-4 border-white/20 backdrop-blur">
                    <img 
                      src="/images/resume-preview.png" 
                      alt="Resume Preview" 
                      className="w-full h-auto"
                      onError={(e) => {
                        // Fallback if image doesn't exist
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Features Section */}
        <motion.section 
          className="py-24 relative overflow-hidden"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
        >
          {/* Background decorative elements */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-20 -right-20 w-80 h-80 rounded-full bg-primary-100 opacity-60 blur-3xl"></div>
            <div className="absolute -bottom-40 -left-20 w-96 h-96 rounded-full bg-accent-100 opacity-60 blur-3xl"></div>
          </div>

          <div className="container mx-auto px-6 relative z-10">
            <motion.div 
              className="text-center max-w-3xl mx-auto mb-20"
              variants={fadeInUp}
            >
              <span className="inline-block bg-primary-100 text-primary-800 font-semibold text-sm px-4 py-2 rounded-full mb-4">Simple Process</span>
              <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-6 text-secondary-900">How It Works</h2>
              <p className="text-secondary-600 text-lg leading-relaxed">Our AI-powered platform makes it easy to optimize your resume for Applicant Tracking Systems in just a few simple steps.</p>
            </motion.div>
            
            <div className="grid md:grid-cols-3 gap-10 mb-16">
              {/* Step 1 */}
              <motion.div 
                className="card group hover:border-primary-500 border-2 border-transparent transition-all duration-300 hover:shadow-xl hover:-translate-y-2"
                variants={fadeInUp}
                whileHover={{ scale: 1.02 }}
              >
                <div className="relative mb-8">
                  <div className="absolute -top-12 -left-12 w-24 h-24 bg-primary-50 rounded-full opacity-70"></div>
                  <div className="w-16 h-16 rounded-2xl bg-primary-100 text-primary-600 flex items-center justify-center text-2xl font-bold mb-6 shadow-md relative">
                    1
                  </div>
                  <h3 className="text-xl font-bold text-secondary-900">Upload Your Resume</h3>
                </div>
                <p className="text-secondary-600 mb-6">Upload your existing resume in PDF, DOCX, or TXT format. Our system will analyze it against ATS requirements.</p>
                <div className="mt-auto pt-4 border-t border-secondary-100 flex justify-between items-center">
                  <span className="text-sm font-medium text-primary-600">Get Started</span>
                  <div className="w-10 h-10 rounded-full bg-primary-50 text-primary-600 flex items-center justify-center group-hover:bg-primary-100 transition-colors">
                    <FaFileAlt className="text-lg" />
                  </div>
                </div>
              </motion.div>
              
              {/* Step 2 */}
              <motion.div 
                className="card group hover:border-primary-500 border-2 border-transparent transition-all duration-300 hover:shadow-xl hover:-translate-y-2"
                variants={fadeInUp}
                whileHover={{ scale: 1.02 }}
                transition={{ delay: 0.1 }}
              >
                <div className="relative mb-8">
                  <div className="absolute -top-12 -left-12 w-24 h-24 bg-accent-50 rounded-full opacity-70"></div>
                  <div className="w-16 h-16 rounded-2xl bg-accent-100 text-accent-600 flex items-center justify-center text-2xl font-bold mb-6 shadow-md relative">
                    2
                  </div>
                  <h3 className="text-xl font-bold text-secondary-900">Get ATS Score</h3>
                </div>
                <p className="text-secondary-600 mb-6">Receive a detailed ATS compatibility score along with specific recommendations for improvement.</p>
                <div className="mt-auto pt-4 border-t border-secondary-100 flex justify-between items-center">
                  <span className="text-sm font-medium text-accent-600">View Demo</span>
                  <div className="w-10 h-10 rounded-full bg-accent-50 text-accent-600 flex items-center justify-center group-hover:bg-accent-100 transition-colors">
                    <FaChartLine className="text-lg" />
                  </div>
                </div>
              </motion.div>
              
              {/* Step 3 */}
              <motion.div 
                className="card group hover:border-primary-500 border-2 border-transparent transition-all duration-300 hover:shadow-xl hover:-translate-y-2"
                variants={fadeInUp}
                whileHover={{ scale: 1.02 }}
                transition={{ delay: 0.2 }}
              >
                <div className="relative mb-8">
                  <div className="absolute -top-12 -left-12 w-24 h-24 bg-primary-50 rounded-full opacity-70"></div>
                  <div className="w-16 h-16 rounded-2xl bg-primary-100 text-primary-600 flex items-center justify-center text-2xl font-bold mb-6 shadow-md relative">
                    3
                  </div>
                  <h3 className="text-xl font-bold text-secondary-900">Optimize & Download</h3>
                </div>
                <p className="text-secondary-600 mb-6">Implement the suggested changes or use our AI-powered editor to automatically optimize your resume.</p>
                <div className="mt-auto pt-4 border-t border-secondary-100 flex justify-between items-center">
                  <span className="text-sm font-medium text-primary-600">Learn More</span>
                  <div className="w-10 h-10 rounded-full bg-primary-50 text-primary-600 flex items-center justify-center group-hover:bg-primary-100 transition-colors">
                    <FaRocket className="text-lg" />
                  </div>
                </div>
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
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-secondary-900">Why ATS Optimization Matters</h2>
              <p className="text-secondary-600 text-lg max-w-3xl mx-auto">Understanding the numbers behind the hiring process can help you improve your chances of landing interviews.</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <motion.div 
                className="bg-white rounded-2xl p-8 shadow-lg text-center"
                variants={fadeInUp}
                whileHover={{ y: -5 }}
              >
                <div className="text-5xl font-bold text-primary-600 mb-4">75%</div>
                <p className="text-secondary-700">of resumes are rejected by ATS before a human sees them</p>
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

        {/* CTA Section */}
        <motion.section 
          className="py-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary-600 to-accent-600 text-white">
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
