'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { ChevronRight, FileText, Award, BarChart, Clock, LogIn, UserPlus, Check, ArrowRight } from 'lucide-react';
import { ThemeToggle } from './components/ThemeToggle';

export default function Home() {
  const [activeFeature, setActiveFeature] = useState(0);
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);
  
  // Cycle through features automatically
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 4);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: <FileText className="h-10 w-10 text-blue-600 dark:text-blue-400" />,
      title: 'ATS Analysis',
      description: 'Our AI analyzes your resume against job descriptions to ensure ATS compatibility.'
    },
    {
      icon: <BarChart className="h-10 w-10 text-blue-600 dark:text-blue-400" />,
      title: 'Resume Scoring',
      description: 'Get detailed scoring and feedback on how your resume performs against ATS systems.'
    },
    {
      icon: <Award className="h-10 w-10 text-blue-600 dark:text-blue-400" />,
      title: 'Modern Templates',
      description: 'Choose from a collection of professional, ATS-friendly resume templates.'
    },
    {
      icon: <Clock className="h-10 w-10 text-blue-600 dark:text-blue-400" />,
      title: 'Time Saving',
      description: 'Build professional, optimized resumes in minutes instead of hours.'
    }
  ];

  return (
    <div className="w-full overflow-hidden dark:bg-gray-950 dark:text-white">
      {/* Top Bar with Auth Buttons */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="fixed w-full top-0 bg-white dark:bg-gray-900 shadow-sm z-50 py-4 px-8"
      >
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <motion.span 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
            >
              Resume<motion.span 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: "spring", stiffness: 500 }}
                className="text-blue-500"
              >
                AI
              </motion.span>
            </motion.span>
          </div>
          <div className="flex space-x-4 items-center">
            <ThemeToggle />
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link 
                href="/login" 
                className="px-5 py-2 flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium rounded-lg border border-blue-600 dark:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
              >
                <LogIn className="h-4 w-4 mr-2" />
                Login
              </Link>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link 
                href="/signup" 
                className="px-5 py-2 flex items-center text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-md font-medium rounded-lg transition-all"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Sign Up
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Hero Section */}
      <section className="relative min-h-[100vh] flex items-center pt-20">
        <motion.div 
          style={{ opacity, scale }}
          className="absolute inset-0 -z-10 bg-gradient-to-b from-blue-50 to-white dark:from-blue-950/30 dark:to-gray-950"
        ></motion.div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.h1 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.2 }}
                className="text-5xl font-extrabold leading-tight mb-6"
              >
                <motion.span 
                  initial={{ backgroundPosition: "200% 0%" }}
                  animate={{ backgroundPosition: "0% 0%" }}
                  transition={{ duration: 1.5 }}
                  className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600"
                >
                  Build ATS-Optimized Resumes
                </motion.span>
                <br />
                <motion.span
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.8 }}
                  className="dark:text-white"
                >
                  That Land Interviews
                </motion.span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-lg"
              >
                Our AI-powered platform analyzes your resume against job descriptions, 
                scores its ATS compatibility, and helps you build optimized resumes that 
                get past applicant tracking systems.
              </motion.p>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <motion.div
                  whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.5)" }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link 
                    href="/signup" 
                    className="inline-flex items-center justify-center px-6 py-3 rounded-lg font-medium bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg hover:shadow-xl transition-all"
                  >
                    Get Started Now
                    <ChevronRight className="ml-2 h-5 w-5" />
                  </Link>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link 
                    href="/login" 
                    className="inline-flex items-center justify-center px-6 py-3 rounded-lg font-medium border border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all"
                  >
                    Sign In
                  </Link>
                </motion.div>
              </motion.div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9, rotateY: -10 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              transition={{ duration: 1, delay: 0.3, type: "spring" }}
              className="relative lg:h-[500px] flex justify-center"
            >
              <motion.div 
                animate={{ 
                  y: [0, -10, 0],
                }}
                transition={{ 
                  repeat: Infinity,
                  duration: 3,
                  ease: "easeInOut"
                }}
                className="relative w-full max-w-lg"
              >
                <motion.div 
                  animate={{ 
                    scale: [1, 1.1, 1],
                    opacity: [0.6, 0.8, 0.6]
                  }}
                  transition={{ 
                    repeat: Infinity,
                    duration: 5,
                  }}
                  className="absolute top-0 -left-4 w-72 h-72 bg-purple-100 dark:bg-purple-900/30 rounded-full mix-blend-multiply filter blur-xl opacity-60"
                ></motion.div>
                <motion.div 
                  animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [0.6, 0.8, 0.6]
                  }}
                  transition={{ 
                    repeat: Infinity,
                    duration: 7,
                    delay: 1
                  }}
                  className="absolute top-0 -right-4 w-72 h-72 bg-blue-100 dark:bg-blue-900/30 rounded-full mix-blend-multiply filter blur-xl opacity-60"
                ></motion.div>
                <motion.div 
                  animate={{ 
                    scale: [1, 1.1, 1],
                    opacity: [0.6, 0.8, 0.6]
                  }}
                  transition={{ 
                    repeat: Infinity,
                    duration: 6,
                    delay: 2
                  }}
                  className="absolute -bottom-8 left-20 w-72 h-72 bg-indigo-100 dark:bg-indigo-900/30 rounded-full mix-blend-multiply filter blur-xl opacity-60"
                ></motion.div>
                <motion.div 
                  whileHover={{ scale: 1.03, rotate: 1 }}
                  className="relative"
                >
                  <Image
                    src="/resume-mockup.png"
                    alt="Resume Mockup"
                    width={500}
                    height={600}
                    className="rounded-lg shadow-xl dark:shadow-blue-500/5"
                  />
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-3xl font-bold mb-4 dark:text-white"
            >
              Why Choose Our Resume Builder?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
            >
              Our platform combines AI technology with expert knowledge to help you 
              create resumes that stand out and get through ATS systems.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ 
                  scale: 1.05, 
                  boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
                  y: -5 
                }}
                animate={{ 
                  scale: activeFeature === index ? 1.05 : 1,
                  boxShadow: activeFeature === index ? "0 10px 25px -5px rgba(0, 0, 0, 0.1)" : "none",
                  y: activeFeature === index ? -5 : 0
                }}
                className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md transition-all duration-300"
              >
                <motion.div 
                  animate={{ 
                    scale: activeFeature === index ? [1, 1.2, 1] : 1,
                  }}
                  transition={{ duration: 0.5 }}
                  className="mb-4"
                >
                  {feature.icon}
                </motion.div>
                <h3 className="text-xl font-semibold mb-2 dark:text-white">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-gray-50 dark:bg-gray-950">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold mb-4 dark:text-white">How It Works</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Getting started with ResumeAI is simple. Follow these steps to create an optimized resume.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: 1,
                title: "Create an Account",
                description: "Sign up for a free account to unlock all our resume building and analysis tools."
              },
              {
                step: 2,
                title: "Build or Upload Your Resume",
                description: "Use our intuitive builder to create a resume from scratch or upload an existing one."
              },
              {
                step: 3,
                title: "Get Your Analysis & Optimize",
                description: "Receive detailed feedback and make improvements to increase your chances of getting interviews."
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
                className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md relative overflow-hidden"
              >
                <motion.div 
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ type: "spring", stiffness: 300, delay: 0.3 + index * 0.2 }}
                  className="absolute top-0 right-0 bg-blue-600 text-white w-12 h-12 flex items-center justify-center text-xl font-bold"
                >
                  {item.step}
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.5 + index * 0.2 }}
                >
                  <motion.div
                    whileHover={{ rotate: 5 }}
                    className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-6 mt-4"
                  >
                    <Check className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                  </motion.div>
                  <h3 className="text-xl font-semibold mb-4 dark:text-white">{item.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300">{item.description}</p>
                </motion.div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="flex justify-center mt-12"
          >
            <motion.div
              whileHover={{ scale: 1.05, x: 10 }}
              className="flex items-center text-blue-600 dark:text-blue-400 font-medium cursor-pointer"
            >
              <span>Learn more about our process</span>
              <ArrowRight className="ml-2 h-5 w-5" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto"
          >
            <motion.h2 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-3xl font-bold mb-6"
            >
              Ready to Land Your Dream Job?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-xl mb-8"
            >
              Join thousands of job seekers who've improved their job search results with ResumeAI.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              whileHover={{ scale: 1.05, boxShadow: "0 15px 30px -5px rgba(0, 0, 0, 0.3)" }}
              whileTap={{ scale: 0.95 }}
              className="inline-block"
            >
              <Link 
                href="/signup" 
                className="inline-flex items-center justify-center px-8 py-4 rounded-lg font-medium bg-white text-blue-600 shadow-lg hover:shadow-xl transition-all"
              >
                Create Your Free Account
                <ChevronRight className="ml-2 h-5 w-5" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold mb-16 text-center dark:text-white"
          >
            What Our Users Say
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                quote: "This platform helped me optimize my resume for ATS and I landed 3 interviews in my first week of applying!",
                author: "Sarah Johnson",
                title: "Software Engineer"
              },
              {
                quote: "The resume analysis showed me exactly what was missing from my resume. The templates are modern and professional.",
                author: "Michael Lee",
                title: "Marketing Manager"
              },
              {
                quote: "I was struggling to get interviews until I used this platform. Now my resume gets past ATS systems every time.",
                author: "Jessica Chen",
                title: "Data Analyst"
              }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30, rotateY: 30 }}
                whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: index * 0.15 }}
                whileHover={{ scale: 1.03, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
                className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md"
              >
                <motion.div 
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.15 }}
                  className="mb-4"
                >
                  {[...Array(5)].map((_, i) => (
                    <motion.span 
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.2, delay: 0.5 + index * 0.1 + i * 0.1 }}
                      key={i} 
                      className="text-yellow-400"
                    >
                      ★
                    </motion.span>
                  ))}
                </motion.div>
                <p className="text-gray-600 dark:text-gray-300 mb-6 italic">"{testimonial.quote}"</p>
                <div>
                  <p className="font-semibold dark:text-white">{testimonial.author}</p>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">{testimonial.title}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-gray-950 text-white py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="text-xl font-bold mb-4">ResumeAI</h3>
              <p className="text-gray-400">
                Build and analyze ATS-optimized resumes with our AI-powered platform.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <h4 className="text-lg font-semibold mb-4">Features</h4>
              <ul className="space-y-2">
                <li><span className="text-gray-400 hover:text-white transition-colors">Resume Analysis</span></li>
                <li><span className="text-gray-400 hover:text-white transition-colors">Resume Builder</span></li>
                <li><span className="text-gray-400 hover:text-white transition-colors">Resume Templates</span></li>
                <li><span className="text-gray-400 hover:text-white transition-colors">ATS Scoring</span></li>
              </ul>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h4 className="text-lg font-semibold mb-4">Resources</h4>
              <ul className="space-y-2">
                <li><span className="text-gray-400 hover:text-white transition-colors">Blog</span></li>
                <li><span className="text-gray-400 hover:text-white transition-colors">Support</span></li>
                <li><span className="text-gray-400 hover:text-white transition-colors">FAQ</span></li>
              </ul>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h4 className="text-lg font-semibold mb-4">Connect</h4>
              <ul className="space-y-2">
                <li><span className="text-gray-400 hover:text-white transition-colors">Contact Us</span></li>
                <li><span className="text-gray-400 hover:text-white transition-colors">Twitter</span></li>
                <li><span className="text-gray-400 hover:text-white transition-colors">LinkedIn</span></li>
              </ul>
            </motion.div>
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400"
          >
            <p>© {new Date().getFullYear()} ResumeAI. All rights reserved.</p>
          </motion.div>
        </div>
      </footer>
    </div>
  );
}

