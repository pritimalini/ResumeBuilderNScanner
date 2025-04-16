import os
import uuid
import logging
from typing import Dict, Any, List
from datetime import datetime
import json

from app.core.config import settings
from app.agents.job_agent import JobDescriptionAgent

logger = logging.getLogger(__name__)

class JobProcessor:
    """Service for processing job descriptions"""
    
    async def process(self, job_description: str) -> Dict[str, Any]:
        """
        Process a job description
        
        Args:
            job_description: The job description text
            
        Returns:
            Dict[str, Any]: The processed job data
        """
        try:
            # Generate a unique ID for this job
            job_id = str(uuid.uuid4())
            
            # Create a directory for storing job data
            jobs_dir = os.path.join(settings.UPLOAD_DIR, "jobs")
            os.makedirs(jobs_dir, exist_ok=True)
            
            # Initialize job description agent
            job_agent = JobDescriptionAgent()
            
            # Process the job description
            processed_data = await job_agent.process_job_description(job_description)
            
            # Add metadata
            processed_data["job_id"] = job_id
            processed_data["timestamp"] = datetime.now().isoformat()
            processed_data["raw_description"] = job_description
            
            # Save the processed data
            job_file_path = os.path.join(jobs_dir, f"{job_id}.json")
            with open(job_file_path, 'w') as f:
                json.dump(processed_data, f, indent=2)
            
            return processed_data
            
        except Exception as e:
            logger.error(f"Error processing job description: {str(e)}")
            raise
    
    async def get_job_by_id(self, job_id: str) -> Dict[str, Any]:
        """
        Retrieve a processed job by ID
        
        Args:
            job_id: The job ID
            
        Returns:
            Dict[str, Any]: The job data
        """
        try:
            job_file_path = os.path.join(settings.UPLOAD_DIR, "jobs", f"{job_id}.json")
            
            if not os.path.exists(job_file_path):
                logger.error(f"Job with ID {job_id} not found")
                raise FileNotFoundError(f"Job with ID {job_id} not found")
            
            with open(job_file_path, 'r') as f:
                job_data = json.load(f)
            
            return job_data
            
        except Exception as e:
            logger.error(f"Error retrieving job: {str(e)}")
            raise
