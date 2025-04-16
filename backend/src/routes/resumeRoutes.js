const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const Resume = require('../models/Resume');
const multer = require('multer');
const path = require('path');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../../uploads/resumes'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: function (req, file, cb) {
    const filetypes = /pdf|doc|docx/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only PDF, DOC, and DOCX files are allowed!'));
    }
  }
});

// @desc    Get all user's resumes
// @route   GET /api/resumes
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const resumes = await Resume.findAll({
      where: { userId: req.user.id },
      order: [['updatedAt', 'DESC']]
    });
    
    res.json(resumes);
  } catch (error) {
    console.error('Error fetching resumes:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @desc    Get a single resume
// @route   GET /api/resumes/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const resume = await Resume.findOne({
      where: { 
        id: req.params.id,
        userId: req.user.id
      }
    });
    
    if (resume) {
      res.json(resume);
    } else {
      res.status(404).json({ message: 'Resume not found' });
    }
  } catch (error) {
    console.error('Error fetching resume:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @desc    Create a new resume
// @route   POST /api/resumes
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { title, content, templateId } = req.body;
    
    if (!title || !content) {
      return res.status(400).json({ message: 'Please provide title and content' });
    }
    
    const resume = await Resume.create({
      title,
      content,
      templateId,
      userId: req.user.id
    });
    
    res.status(201).json(resume);
  } catch (error) {
    console.error('Error creating resume:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @desc    Upload a resume file
// @route   POST /api/resumes/upload
// @access  Private
router.post('/upload', protect, upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a file' });
    }
    
    // Create a basic resume record with file info
    const resume = await Resume.create({
      title: req.body.title || path.basename(req.file.originalname, path.extname(req.file.originalname)),
      content: {}, // Empty content initially
      filePath: req.file.path,
      userId: req.user.id
    });
    
    res.status(201).json({
      message: 'File uploaded successfully',
      resume
    });
  } catch (error) {
    console.error('Error uploading resume:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @desc    Update a resume
// @route   PUT /api/resumes/:id
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    const { title, content, templateId } = req.body;
    
    const resume = await Resume.findOne({
      where: { 
        id: req.params.id,
        userId: req.user.id
      }
    });
    
    if (resume) {
      resume.title = title || resume.title;
      resume.content = content || resume.content;
      if (templateId) resume.templateId = templateId;
      
      const updatedResume = await resume.save();
      res.json(updatedResume);
    } else {
      res.status(404).json({ message: 'Resume not found' });
    }
  } catch (error) {
    console.error('Error updating resume:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @desc    Delete a resume
// @route   DELETE /api/resumes/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const resume = await Resume.findOne({
      where: { 
        id: req.params.id,
        userId: req.user.id
      }
    });
    
    if (resume) {
      await resume.destroy();
      res.json({ message: 'Resume removed' });
    } else {
      res.status(404).json({ message: 'Resume not found' });
    }
  } catch (error) {
    console.error('Error deleting resume:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router; 