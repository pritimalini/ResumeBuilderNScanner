const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const User = require('./User');
const Resume = require('./Resume');

const Analysis = sequelize.define('Analysis', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  jobTitle: {
    type: DataTypes.STRING,
    allowNull: false
  },
  jobDescription: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  company: {
    type: DataTypes.STRING,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('pending', 'processing', 'completed', 'failed'),
    defaultValue: 'pending'
  },
  results: {
    type: DataTypes.JSONB,
    allowNull: true // Analysis results
  },
  overallScore: {
    type: DataTypes.INTEGER,
    allowNull: true // Overall score
  },
  keywords: {
    type: DataTypes.JSONB,
    allowNull: true // Keywords found/missing
  },
  suggestions: {
    type: DataTypes.JSONB,
    allowNull: true // Improvement suggestions
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  completedAt: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  timestamps: true
});

// Define associations
Analysis.belongsTo(User, {
  foreignKey: 'userId',
  onDelete: 'CASCADE'
});

Analysis.belongsTo(Resume, {
  foreignKey: 'resumeId',
  onDelete: 'CASCADE'
});

// User can have many analysis jobs
User.hasMany(Analysis, {
  foreignKey: 'userId'
});

// A resume can have many analysis jobs
Resume.hasMany(Analysis, {
  foreignKey: 'resumeId'
});

module.exports = Analysis; 