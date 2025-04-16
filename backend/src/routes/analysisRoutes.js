const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const Analysis = require('../models/Analysis');
const Resume = require('../models/Resume');

// @desc    Submit a resume for analysis
// @route   POST /api/analysis
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { resumeId, jobTitle, jobDescription, company } = req.body;

    // Validate required fields
    if (!resumeId || !jobTitle || !jobDescription) {
      return res.status(400).json({ 
        message: 'Please provide resumeId, jobTitle, and jobDescription' 
      });
    }

    // Check if resume exists and belongs to user
    const resume = await Resume.findOne({
      where: { 
        id: resumeId,
        userId: req.user.id
      }
    });

    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    // Create analysis job
    const analysis = await Analysis.create({
      resumeId,
      jobTitle,
      jobDescription,
      company: company || null,
      status: 'pending',
      userId: req.user.id
    });

    // In a real implementation, you would now queue this job for processing
    // For demo purposes, we'll simulate processing asynchronously
    setTimeout(async () => {
      try {
        // Update status to processing
        analysis.status = 'processing';
        await analysis.save();

        // Simulate analysis taking place (in a real app this would be a more complex operation)
        setTimeout(async () => {
          try {
            // Generate mock analysis results
            const mockResults = generateMockAnalysis(resume.content, jobTitle, jobDescription);
            
            // Update analysis with results
            analysis.status = 'completed';
            analysis.results = mockResults;
            analysis.overallScore = mockResults.overallScore;
            analysis.keywords = mockResults.keywordMatches;
            analysis.suggestions = mockResults.recommendations;
            analysis.completedAt = new Date();
            
            await analysis.save();

            // Update resume with score
            resume.atsScore = mockResults.overallScore;
            resume.analysisResults = mockResults;
            await resume.save();
          } catch (error) {
            console.error('Error completing analysis:', error);
            analysis.status = 'failed';
            await analysis.save();
          }
        }, 5000); // Simulate 5 seconds of processing
      } catch (error) {
        console.error('Error processing analysis:', error);
      }
    }, 1000); // Start processing after 1 second

    res.status(201).json({
      id: analysis.id,
      status: analysis.status,
      message: 'Analysis job submitted successfully'
    });
  } catch (error) {
    console.error('Error submitting analysis job:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @desc    Get all analyses for a user
// @route   GET /api/analysis
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const analyses = await Analysis.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']],
      include: [{
        model: Resume,
        attributes: ['id', 'title']
      }]
    });

    res.json(analyses);
  } catch (error) {
    console.error('Error fetching analyses:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @desc    Get a single analysis
// @route   GET /api/analysis/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const analysis = await Analysis.findOne({
      where: { 
        id: req.params.id,
        userId: req.user.id
      },
      include: [{
        model: Resume,
        attributes: ['id', 'title', 'content']
      }]
    });

    if (analysis) {
      res.json(analysis);
    } else {
      res.status(404).json({ message: 'Analysis not found' });
    }
  } catch (error) {
    console.error('Error fetching analysis:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @desc    Delete an analysis
// @route   DELETE /api/analysis/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const analysis = await Analysis.findOne({
      where: { 
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (analysis) {
      await analysis.destroy();
      res.json({ message: 'Analysis removed' });
    } else {
      res.status(404).json({ message: 'Analysis not found' });
    }
  } catch (error) {
    console.error('Error deleting analysis:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Helper function to generate mock analysis results
// In a real app, this would be replaced with an actual ATS analysis algorithm
function generateMockAnalysis(resumeContent, jobTitle, jobDescription) {
  // Extract keywords from job description (in a real app, this would be more sophisticated)
  const keywords = jobDescription
    .toLowerCase()
    .split(/\W+/)
    .filter(word => word.length > 3)
    .filter((word, index, self) => self.indexOf(word) === index)
    .slice(0, 15);

  // Generate random score between 60-95
  const overallScore = Math.floor(Math.random() * 36) + 60;

  // Generate section scores
  const sectionScores = {
    contact: Math.floor(Math.random() * 31) + 70,
    summary: Math.floor(Math.random() * 31) + 70,
    experience: Math.floor(Math.random() * 31) + 70,
    education: Math.floor(Math.random() * 31) + 70,
    skills: Math.floor(Math.random() * 31) + 70
  };

  // Generate keyword matches
  const keywordMatches = keywords.map(keyword => ({
    keyword,
    found: Math.random() > 0.3, // 70% chance keyword is found
    importance: Math.random() > 0.5 ? 'high' : 'medium',
    context: `Related to ${jobTitle} position`
  }));

  // Generate recommendations
  const recommendations = [
    {
      section: 'summary',
      recommendation: 'Make your professional summary more specific to the job description',
      impact: 'high',
      difficulty: 'medium'
    },
    {
      section: 'experience',
      recommendation: 'Use more action verbs and quantify your achievements',
      impact: 'high',
      difficulty: 'medium'
    },
    {
      section: 'skills',
      recommendation: 'Add more technical skills mentioned in the job description',
      impact: 'medium',
      difficulty: 'easy'
    },
    {
      section: 'format',
      recommendation: 'Use a cleaner, ATS-friendly format',
      impact: 'medium',
      difficulty: 'easy'
    }
  ];

  return {
    resumeId: resumeContent.id,
    jobId: `job-${Date.now()}`,
    overallScore,
    breakdowns: {
      contentMatch: Math.floor(Math.random() * 31) + 70,
      formatCompatibility: Math.floor(Math.random() * 31) + 70,
      sectionEvaluation: Math.floor(Math.random() * 31) + 70
    },
    sectionScores,
    keywordMatches,
    recommendations
  };
}

module.exports = router; 