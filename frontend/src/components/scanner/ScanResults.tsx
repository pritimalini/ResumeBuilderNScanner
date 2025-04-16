import React from 'react';
import { Doughnut, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

interface ScanResultsProps {
  results: any;
  resumeName: string;
  jobTitle: string;
}

const ScanResults: React.FC<ScanResultsProps> = ({ results, resumeName, jobTitle }) => {
  // Overall score data for doughnut chart
  const scoreData = {
    labels: ['Score', 'Remaining'],
    datasets: [
      {
        data: [results.overall_score, 100 - results.overall_score],
        backgroundColor: [
          getScoreColor(results.overall_score),
          '#e2e8f0',
        ],
        borderColor: [
          getScoreColor(results.overall_score),
          '#e2e8f0',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Section scores data for bar chart
  const sectionScoresData = {
    labels: results.section_scores.map((section: any) => formatSectionName(section.section)),
    datasets: [
      {
        label: 'Score',
        data: results.section_scores.map((section: any) => section.score),
        backgroundColor: results.section_scores.map((section: any) => 
          getScoreColor((section.score / section.max_score) * 100)
        ),
        borderWidth: 1,
      },
    ],
  };

  // Function to get color based on score
  function getScoreColor(score: number): string {
    if (score >= 80) return '#22c55e'; // Green
    if (score >= 60) return '#f59e0b'; // Yellow/Orange
    return '#ef4444'; // Red
  }

  // Function to format section name
  function formatSectionName(section: string): string {
    return section
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  // Function to get score rating text
  function getScoreRating(score: number): string {
    if (score >= 80) return 'Excellent';
    if (score >= 70) return 'Good';
    if (score >= 60) return 'Fair';
    if (score >= 50) return 'Needs Improvement';
    return 'Poor';
  }

  return (
    <div className="space-y-8">
      {/* Overall Score Card */}
      <div className="card">
        <div className="flex flex-col md:flex-row items-center">
          <div className="w-full md:w-1/3 flex justify-center mb-6 md:mb-0">
            <div className="w-48 h-48">
              <Doughnut 
                data={scoreData} 
                options={{
                  cutout: '80%',
                  plugins: {
                    legend: {
                      display: false,
                    },
                    tooltip: {
                      enabled: false,
                    },
                  },
                }}
              />
              <div className="relative">
                <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center" style={{ marginTop: '-120px' }}>
                  <div className="text-center">
                    <div className="text-4xl font-bold">{Math.round(results.overall_score)}</div>
                    <div className="text-sm text-gray-500">ATS Score</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="w-full md:w-2/3 md:pl-8">
            <h2 className="text-2xl font-bold mb-2">ATS Compatibility Score</h2>
            <p className="text-lg mb-4">
              <span className="font-medium">{resumeName}</span> for <span className="font-medium">{jobTitle}</span>
            </p>
            
            <div className="mb-4">
              <div className="text-lg font-medium">
                Rating: <span className={`font-bold ${getScoreRating(results.overall_score).toLowerCase() === 'excellent' || getScoreRating(results.overall_score).toLowerCase() === 'good' ? 'text-success-700' : getScoreRating(results.overall_score).toLowerCase() === 'fair' ? 'text-warning-700' : 'text-danger-700'}`}>
                  {getScoreRating(results.overall_score)}
                </span>
              </div>
              <p className="text-gray-600">
                {results.overall_score >= 80 
                  ? 'Your resume is well-optimized for ATS systems and has a high chance of passing through to the hiring manager.' 
                  : results.overall_score >= 60 
                    ? 'Your resume has a decent chance of passing ATS systems, but there is room for improvement.' 
                    : 'Your resume needs significant improvements to effectively pass through ATS systems.'}
              </p>
            </div>
            
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="text-lg font-bold">{results.content_match_score.toFixed(1)}/40</div>
                <div className="text-sm text-gray-600">Content Match</div>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="text-lg font-bold">{results.format_compatibility_score.toFixed(1)}/25</div>
                <div className="text-sm text-gray-600">Format</div>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="text-lg font-bold">{results.section_evaluation_score.toFixed(1)}/35</div>
                <div className="text-sm text-gray-600">Sections</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section Scores */}
      <div className="card">
        <h2 className="text-xl font-bold mb-4">Section Scores</h2>
        <div className="h-80">
          <Bar 
            data={sectionScoresData} 
            options={{
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                y: {
                  beginAtZero: true,
                  max: 15,
                },
              },
              plugins: {
                legend: {
                  display: false,
                },
                tooltip: {
                  callbacks: {
                    label: function(context) {
                      const section = results.section_scores[context.dataIndex];
                      return `Score: ${section.score.toFixed(1)}/${section.max_score}`;
                    }
                  }
                }
              },
            }}
          />
        </div>
        
        <div className="mt-6 grid md:grid-cols-2 gap-6">
          {results.section_scores.map((section: any, index: number) => (
            <div key={index} className="border rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium">{formatSectionName(section.section)}</h3>
                <div className="text-sm font-medium">
                  {section.score.toFixed(1)}/{section.max_score} points
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-3">{section.feedback}</p>
              
              {section.keywords_found.length > 0 || section.keywords_missing.length > 0 ? (
                <div className="mt-2 text-sm">
                  {section.keywords_found.length > 0 && (
                    <div className="mb-2">
                      <div className="font-medium text-success-700 flex items-center">
                        <FaCheckCircle className="mr-1" /> Keywords Found:
                      </div>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {section.keywords_found.map((keyword: string, i: number) => (
                          <span key={i} className="bg-success-50 text-success-700 px-2 py-1 rounded text-xs">
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {section.keywords_missing.length > 0 && (
                    <div>
                      <div className="font-medium text-danger-700 flex items-center">
                        <FaTimesCircle className="mr-1" /> Keywords Missing:
                      </div>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {section.keywords_missing.map((keyword: string, i: number) => (
                          <span key={i} className="bg-danger-50 text-danger-700 px-2 py-1 rounded text-xs">
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </div>

      {/* Keyword Matches */}
      <div className="card">
        <h2 className="text-xl font-bold mb-4">Keyword Analysis</h2>
        <p className="text-gray-600 mb-4">
          ATS systems scan for specific keywords from the job description. Here's how your resume matches up:
        </p>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Keyword
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Found
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Importance
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Section
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {results.keyword_matches.map((match: any, index: number) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {match.keyword}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {match.found ? (
                      <span className="text-success-700 flex items-center">
                        <FaCheckCircle className="mr-1" /> Yes
                      </span>
                    ) : (
                      <span className="text-danger-700 flex items-center">
                        <FaTimesCircle className="mr-1" /> No
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-primary-600 h-2.5 rounded-full" 
                        style={{ width: `${match.importance * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-xs">{Math.round(match.importance * 100)}%</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {match.found && match.section ? formatSectionName(match.section) : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ScanResults;
