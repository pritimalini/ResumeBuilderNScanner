const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const User = require('./User');

const Resume = sequelize.define('Resume', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  content: {
    type: DataTypes.JSONB, // Store resume content as JSON (personal info, education, experience, skills, etc.)
    allowNull: false
  },
  filePath: {
    type: DataTypes.STRING,
    allowNull: true // Path to uploaded PDF file if any
  },
  parsedData: {
    type: DataTypes.JSONB,
    allowNull: true // Data extracted from parsing the resume
  },
  templateId: {
    type: DataTypes.STRING,
    allowNull: true // Which template was used
  },
  atsScore: {
    type: DataTypes.INTEGER,
    allowNull: true // ATS compatibility score
  },
  analysisResults: {
    type: DataTypes.JSONB,
    allowNull: true // Analysis results
  },
  isPublic: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  timestamps: true
});

// Define associations
// This creates userId in Resume model
Resume.belongsTo(User, {
  foreignKey: 'userId',
  onDelete: 'CASCADE'
});

// This creates a virtual method User.getResumes()
User.hasMany(Resume, {
  foreignKey: 'userId'
});

module.exports = Resume; 