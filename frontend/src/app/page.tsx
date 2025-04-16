'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { ChevronRight, FileText, Award, BarChart, Clock, LogIn, UserPlus, Check, ArrowRight, Star, Briefcase } from 'lucide-react';
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
                <span className="font-bold text-blue-600 dark:text-blue-400">Don't miss another opportunity!</span> Our AI-powered platform instantly transforms your resume into an interview-winning document that <span className="underline">beats even the toughest ATS systems</span> – giving you a 4X higher chance of landing interviews.
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
                    Start Landing Interviews Today
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
              <span className="font-semibold text-blue-600 dark:text-blue-400">Already trusted by 10,000+ job seekers</span> who went from frustration to interviews in record time using our advanced AI technology and expert resume insights.
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
                  boxShadow: "0 15px 30px -10px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                  y: -5 
                }}
                animate={{ 
                  scale: activeFeature === index ? 1.05 : 1,
                  boxShadow: activeFeature === index ? "0 15px 30px -10px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)" : "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  y: activeFeature === index ? -5 : 0
                }}
                className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md transition-all duration-300 border border-gray-100 dark:border-gray-700"
              >
                <motion.div 
                  animate={{ 
                    scale: activeFeature === index ? [1, 1.2, 1] : 1,
                  }}
                  transition={{ duration: 0.5 }}
                  className="mb-4 text-blue-600 dark:text-blue-400"
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
              <span className="font-bold text-purple-600 dark:text-purple-400">In just 10 minutes</span>, you can have an interview-ready resume that puts you ahead of 95% of other applicants.
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            {[
              {
                step: 1,
                title: "Create an Account",
                description: "Sign up in 30 seconds. No credit card required to start transforming your job search.",
                icon: <UserPlus className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              },
              {
                step: 2,
                title: "Build or Upload Your Resume",
                description: "Use our AI-powered builder to create a stunning resume or instantly analyze your existing one.",
                icon: <FileText className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              },
              {
                step: 3,
                title: "Get Your Personalized Analysis",
                description: "Our AI analyzes your resume against job descriptions and provides tailored recommendations to boost your chances.",
                icon: <BarChart className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              },
              {
                step: 4,
                title: "Apply and Land Interviews",
                description: "Apply to jobs with your optimized resume and watch as interview invitations start flooding your inbox.",
                icon: <Briefcase className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50, y: 20 }}
                whileInView={{ opacity: 1, x: 0, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ 
                  duration: 0.7,
                  delay: index * 0.2,
                  type: "spring",
                  stiffness: 50
                }}
                className="mb-12 relative"
              >
                {/* Connecting Line */}
                {index < 3 && (
                  <motion.div 
                    initial={{ height: 0 }}
                    whileInView={{ height: "100%" }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: (index + 1) * 0.2 }}
                    className="absolute left-7 top-16 w-1 bg-gradient-to-b from-blue-500 to-purple-500 z-0"
                    style={{ 
                      height: "calc(100% - 32px)"
                    }}
                  />
                )}

                <div className="flex gap-6">
                  {/* Step Number Circle */}
                  <div className="relative z-10">
                    <motion.div
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ 
                        type: "spring", 
                        stiffness: 300, 
                        delay: index * 0.3
                      }}
                      className="w-14 h-14 bg-blue-600 dark:bg-blue-500 rounded-full flex items-center justify-center text-xl font-bold text-white shadow-lg"
                    >
                      {item.step}
                    </motion.div>
                  </div>

                  {/* Content Card */}
                  <motion.div
                    whileHover={{ 
                      y: -5, 
                      boxShadow: "0 15px 30px -10px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)" 
                    }}
                    className={`flex-1 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 ${
                      index % 2 === 0 ? 'rounded-tl-none' : 'rounded-tr-none'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="bg-blue-100 dark:bg-blue-900/30 rounded-full p-3 mt-1">
                        {item.icon}
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold mb-3 dark:text-white">{item.title}</h3>
                        <p className="text-gray-600 dark:text-gray-300">{item.description}</p>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 1 }}
            className="text-center mt-10"
          >
            <Link href="/signup" className="inline-flex items-center bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-8 rounded-lg font-medium hover:shadow-lg transition-all duration-300">
              Get Started Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
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
              Stop Getting Rejected by ATS Systems!
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-xl mb-8"
            >
              <span className="font-bold">75% of resumes never reach human eyes.</span> Don't be part of that statistic! Join thousands who've transformed their job search with ResumeAI—many landing interviews within 48 hours of applying.
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
                Start Your Success Story Now
                <ChevronRight className="ml-2 h-5 w-5" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4 dark:text-white">Success Stories</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Join thousands of job seekers who've transformed their careers with our platform.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Michael Torres",
                position: "Software Engineer",
                company: "Tech Solutions Inc.",
                image: "/testimonial1.jpg",
                text: "After 2 months of job searching with no luck, I used this platform to optimize my resume. Within 2 weeks, I had 5 interview requests from top companies. I just accepted an offer with a 35% salary increase!"
              },
              {
                name: "Sarah Johnson",
                position: "Marketing Director",
                company: "Creative Agency",
                image: "/testimonial2.jpg",
                text: "My resume was stuck in ATS limbo for months. After using the AI analysis and following the recommendations, I landed 3 interviews in one week! This tool is a game-changer for serious job seekers."
              },
              {
                name: "David Chen",
                position: "Financial Analyst",
                company: "Global Investments",
                image: "/testimonial3.jpg",
                text: "The job match feature helped me discover opportunities I wouldn't have found otherwise. My optimized resume matched 93% with my dream job posting, and I got called for an interview the next day!"
              }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ 
                  y: -5,
                  boxShadow: "0 15px 30px -10px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                  borderColor: "rgba(209, 213, 219, 1)"
                }}
                className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md flex flex-col h-full relative border border-gray-100 dark:border-gray-700"
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full mr-3 flex-shrink-0 overflow-hidden">
                    {testimonial.image && (
                      <Image
                        src={testimonial.image}
                        alt={testimonial.name}
                        width={48}
                        height={48}
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold dark:text-white">{testimonial.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {testimonial.position} at {testimonial.company}
                    </p>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-300 flex-grow">{testimonial.text}</p>
                <div className="mt-4 text-yellow-500 flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} fill="currentColor" size={18} />
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mt-12"
          >
            <Link href="/signup" className="inline-block bg-blue-600 hover:bg-blue-700 text-white py-3 px-8 rounded-lg font-medium text-lg transition-colors duration-300">
              Join Our Success Stories
            </Link>
          </motion.div>
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

