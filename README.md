# Resume ATS Optimizer

A comprehensive system for scoring resumes against job descriptions and building ATS-optimized resumes from scratch.

## Features

- Resume scoring against job descriptions
- ATS optimization recommendations
- Resume builder with templates
- Multi-agent processing using CrewAI
- Modern, responsive UI

## System Architecture

The system consists of:
- FastAPI backend for processing logic and API endpoints
- Next.js frontend for user interaction
- Multi-agent coordination using CrewAI
- Docker containerization for deployment

## Getting Started

### Prerequisites

- Python 3.12+
- Node.js 18+
- Docker and Docker Compose (for containerized deployment)

### Installation

1. Clone the repository
2. Set up the backend:
   ```
   cd backend
   pip install -r requirements.txt
   python main.py
   ```
3. Set up the frontend:
   ```
   cd frontend
   npm install
   npm run dev
   ```

### Docker Deployment

```
docker-compose up -d
```

## License

MIT
