# Resume Builder and Scanner

A modern application for creating professional resumes, analyzing them for ATS compatibility, and matching them with job listings.

## Features

- **Resume Builder**: Create professional resumes with customizable templates
- **Resume Analysis**: Analyze resumes for ATS compatibility and receive detailed feedback
- **Job Matching**: Match resumes with job listings to find the best opportunities
- **Skills Management**: Track and showcase skills with rating functionality
- **Job Search**: Browse and search job listings from various sources

## Technologies Used

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS, Framer Motion
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL (via Supabase)
- **AI Integration**: OpenAI's GPT-4 for resume analysis and job matching
- **File Processing**: PDF parsing, DOCX processing
- **Authentication**: Supabase Auth (planned)

## Prerequisites

- Node.js 16.x or higher
- npm or yarn
- Supabase account (for database)
- OpenAI API key (for AI features)

## Getting Started

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/resume-builder-scanner.git
   cd resume-builder-scanner
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` and add your API keys and configuration values.

4. Set up the database:
   - Create a Supabase project
   - Run the SQL from `backend/db/schema.sql` in the Supabase SQL editor

### Development

Start the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Project Structure

```
├── frontend/
│   ├── src/
│   │   ├── app/                 # Next.js App Router
│   │   │   ├── components/          # React components
│   │   │   ├── services/            # API services
│   │   │   ├── utils/               # Utility functions
│   │   │   └── styles/              # Global styles
│   │   └── public/                  # Static assets
│   ├── backend/
│   │   ├── api/                     # API handlers
│   │   │   ├── analyze-resume.js    # Resume analysis handler
│   │   │   ├── job-matches.js        # Job matches handler
│   │   │   └── jobs.js             # Jobs handler
│   │   ├── db/                      # Database scripts and schemas
│   │   └── utils/                   # Backend utilities
│   ├── package.json
│   └── README.md
```

## API Endpoints

### Resume Analysis
- `POST /api/analyze-resume`: Analyzes a resume file for ATS compatibility
- `GET /api/resume-analyses/:id`: Retrieves analysis results for a specific resume

### Job Matching
- `POST /api/match-resume-with-jobs`: Matches a resume with job listings
- `GET /api/job-matches/:resumeId`: Retrieves job matches for a specific resume

### Jobs
- `GET /api/jobs`: Retrieves job listings
- `GET /api/jobs/:id`: Retrieves details for a specific job

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- OpenAI for their powerful API used for resume analysis
- Supabase for database and authentication
- The open-source community for various libraries used in this project
