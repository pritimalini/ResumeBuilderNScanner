import logging
import os
from typing import Dict, Any, List, Optional, Union
from dotenv import load_dotenv
from crewai import Crew, Agent, Task

# LangChain imports
from langchain.llms.base import LLM
from langchain.chat_models.base import BaseChatModel
from langchain_openai import OpenAI, ChatOpenAI

# Import Groq integration
try:
    from langchain_groq import ChatGroq
    GROQ_AVAILABLE = True
except ImportError:
    logger.warning("Groq integration not available. Install with 'pip install langchain-groq'")
    GROQ_AVAILABLE = False

# Import Google Gemini integration
try:
    from langchain_google_genai import ChatGoogleGenerativeAI
    GEMINI_AVAILABLE = True
except ImportError:
    logger.warning("Google Gemini integration not available. Install with 'pip install langchain-google-genai'")
    GEMINI_AVAILABLE = False

# Load environment variables
load_dotenv()

logger = logging.getLogger(__name__)

class AgentOrchestrator:
    """Orchestrator for the CrewAI multi-agent system"""
    
    def __init__(self):
        # Get LLM configuration from environment variables
        provider = os.getenv("LLM_PROVIDER", "openai").lower()
        model = os.getenv("LLM_MODEL", "gpt-4-turbo")
        temperature = float(os.getenv("LLM_TEMPERATURE", "0.2"))
        
        # Initialize the language model based on the provider
        self.llm = self._initialize_llm(provider, model, temperature)
        
        logger.info(f"Initialized LLM with provider: {provider}, model: {model}")
        
        # Initialize agents
        self.agents = {
            "parser": self._create_parser_agent(),
            "keyword": self._create_keyword_agent(),
            "job": self._create_job_agent(),
            "matching": self._create_matching_agent(),
            "scoring": self._create_scoring_agent(),
            "recommendation": self._create_recommendation_agent(),
            "builder": self._create_builder_agent()
        }
        
    def _initialize_llm(self, provider: str, model: str, temperature: float) -> Union[LLM, BaseChatModel]:
        """Initialize the language model based on the provider"""
        # For development without an API key, use a mock LLM
        if provider == "mock" or provider == "development":
            from langchain.llms.fake import FakeListLLM
            return FakeListLLM(responses=["This is a development mode response."])
        
        # OpenAI (default provider)
        if provider == "openai":
            api_key = os.getenv("OPENAI_API_KEY")
            if not api_key or api_key == "your_openai_api_key_here":
                logger.warning("No OpenAI API key provided. Using a mock LLM for development.")
                from langchain.llms.fake import FakeListLLM
                return FakeListLLM(responses=["This is a development mode response."])
            
            if "gpt-4" in model or "gpt-3.5" in model:
                return ChatOpenAI(
                    openai_api_key=api_key,
                    model_name=model,
                    temperature=temperature
                )
            else:
                return OpenAI(
                    openai_api_key=api_key,
                    model_name=model,
                    temperature=temperature
                )
        
        # Groq
        elif provider == "groq":
            if not GROQ_AVAILABLE:
                logger.warning("Groq integration not available. Falling back to mock LLM.")
                from langchain.llms.fake import FakeListLLM
                return FakeListLLM(responses=["Groq integration not available."])
            
            api_key = os.getenv("GROQ_API_KEY")
            if not api_key or api_key == "your_groq_api_key_here":
                logger.warning("No Groq API key provided. Using a mock LLM for development.")
                from langchain.llms.fake import FakeListLLM
                return FakeListLLM(responses=["This is a development mode response."])
            
            # Default to llama2-70b-4096 if no model specified
            groq_model = model if model else "llama2-70b-4096"
            return ChatGroq(
                groq_api_key=api_key,
                model_name=groq_model,
                temperature=temperature
            )
        
        # Google Gemini
        elif provider == "gemini" or provider == "google":
            if not GEMINI_AVAILABLE:
                logger.warning("Google Gemini integration not available. Falling back to mock LLM.")
                from langchain.llms.fake import FakeListLLM
                return FakeListLLM(responses=["Google Gemini integration not available."])
            
            api_key = os.getenv("GOOGLE_API_KEY")
            if not api_key or api_key == "your_google_api_key_here":
                logger.warning("No Google API key provided. Using a mock LLM for development.")
                from langchain.llms.fake import FakeListLLM
                return FakeListLLM(responses=["This is a development mode response."])
            
            # Default to gemini-pro if no model specified
            gemini_model = model if model else "gemini-pro"
            return ChatGoogleGenerativeAI(
                google_api_key=api_key,
                model=gemini_model,
                temperature=temperature
            )
        
        # Fallback to mock LLM for unsupported providers
        else:
            logger.warning(f"Unsupported LLM provider: {provider}. Using a mock LLM.")
            from langchain.llms.fake import FakeListLLM
            return FakeListLLM(responses=[f"Unsupported LLM provider: {provider}"])
    
    def _create_parser_agent(self) -> Agent:
        """Create the resume parser agent"""
        return Agent(
            role="Resume Parser",
            goal="Extract and structure all relevant information from resumes",
            backstory="""You are an expert at parsing and understanding resume documents.
            You can extract structured information from various resume formats and ensure
            all important details are captured accurately.""",
            verbose=True,
            llm=self.llm
        )
    
    def _create_keyword_agent(self) -> Agent:
        """Create the keyword analyst agent"""
        return Agent(
            role="Keyword Analyst",
            goal="Identify and analyze important keywords in resumes and job descriptions",
            backstory="""You are a specialist in keyword analysis for resumes and job descriptions.
            You understand industry-specific terminology and can identify the most relevant
            keywords that will help a resume pass through ATS systems.""",
            verbose=True,
            llm=self.llm
        )
    
    def _create_job_agent(self) -> Agent:
        """Create the job description agent"""
        return Agent(
            role="Job Description Analyst",
            goal="Analyze job descriptions to extract requirements and expectations",
            backstory="""You are an expert at analyzing job descriptions and identifying
            the key requirements, qualifications, and expectations. You can distinguish
            between essential and preferred qualifications.""",
            verbose=True,
            llm=self.llm
        )
    
    def _create_matching_agent(self) -> Agent:
        """Create the matching algorithm agent"""
        return Agent(
            role="Matching Algorithm Specialist",
            goal="Compare resumes against job descriptions to identify matches and gaps",
            backstory="""You are a specialist in comparing resume content against job requirements.
            You can identify where a candidate's qualifications match the job requirements
            and where there are gaps that need to be addressed.""",
            verbose=True,
            llm=self.llm
        )
    
    def _create_scoring_agent(self) -> Agent:
        """Create the scoring system agent"""
        return Agent(
            role="ATS Scoring Expert",
            goal="Calculate accurate ATS compatibility scores for resumes",
            backstory="""You are an expert in how ATS systems evaluate resumes. You can
            analyze a resume and provide an accurate score of how well it will perform
            in automated screening systems, with detailed breakdowns by category.""",
            verbose=True,
            llm=self.llm
        )
    
    def _create_recommendation_agent(self) -> Agent:
        """Create the recommendation agent"""
        return Agent(
            role="Resume Optimization Consultant",
            goal="Provide actionable recommendations to improve resume ATS scores",
            backstory="""You are a consultant specializing in resume optimization for ATS systems.
            You can provide specific, actionable recommendations to improve a resume's
            performance in automated screening systems.""",
            verbose=True,
            llm=self.llm
        )
    
    def _create_builder_agent(self) -> Agent:
        """Create the resume builder agent"""
        return Agent(
            role="Resume Builder",
            goal="Create professional, ATS-optimized resumes from scratch",
            backstory="""You are an expert resume writer who specializes in creating
            professional, ATS-optimized resumes. You know how to structure content,
            highlight relevant experience, and format resumes to perform well in
            automated screening systems.""",
            verbose=True,
            llm=self.llm
        )
    
    async def process_resume(self, resume_path: str) -> Dict[str, Any]:
        """
        Process a resume using the multi-agent system
        
        Args:
            resume_path: Path to the resume file
            
        Returns:
            Dict[str, Any]: The processed resume data
        """
        try:
            # Create tasks for resume processing
            parse_task = Task(
                description=f"Parse the resume at {resume_path} and extract all relevant information",
                agent=self.agents["parser"],
                expected_output="Structured JSON representation of the resume content"
            )
            
            keyword_task = Task(
                description="Analyze the parsed resume to identify and categorize keywords",
                agent=self.agents["keyword"],
                expected_output="List of keywords categorized by type and importance",
                context=[parse_task]
            )
            
            # Create the crew
            crew = Crew(
                agents=[self.agents["parser"], self.agents["keyword"]],
                tasks=[parse_task, keyword_task],
                verbose=True
            )
            
            # Run the crew
            result = crew.kickoff()
            
            # Process and return the result
            return self._process_crew_result(result)
            
        except Exception as e:
            logger.error(f"Error in agent orchestration: {str(e)}")
            raise
    
    async def process_job_description(self, job_description: str) -> Dict[str, Any]:
        """
        Process a job description using the multi-agent system
        
        Args:
            job_description: The job description text
            
        Returns:
            Dict[str, Any]: The processed job data
        """
        try:
            # Create tasks for job description processing
            job_task = Task(
                description=f"Analyze the job description and extract requirements and expectations",
                agent=self.agents["job"],
                expected_output="Structured representation of job requirements and expectations"
            )
            
            keyword_task = Task(
                description="Identify and categorize important keywords in the job description",
                agent=self.agents["keyword"],
                expected_output="List of keywords categorized by importance",
                context=[job_task]
            )
            
            # Create the crew
            crew = Crew(
                agents=[self.agents["job"], self.agents["keyword"]],
                tasks=[job_task, keyword_task],
                verbose=True
            )
            
            # Run the crew
            result = crew.kickoff()
            
            # Process and return the result
            return self._process_crew_result(result)
            
        except Exception as e:
            logger.error(f"Error in agent orchestration: {str(e)}")
            raise
    
    async def compare_resume_to_job(self, resume_data: Dict[str, Any], job_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Compare a resume to a job description
        
        Args:
            resume_data: The processed resume data
            job_data: The processed job data
            
        Returns:
            Dict[str, Any]: The comparison results
        """
        try:
            # Create tasks for comparison
            matching_task = Task(
                description="Compare the resume against the job description to identify matches and gaps",
                agent=self.agents["matching"],
                expected_output="Detailed comparison of resume qualifications against job requirements"
            )
            
            scoring_task = Task(
                description="Calculate an ATS compatibility score for the resume based on the comparison",
                agent=self.agents["scoring"],
                expected_output="ATS compatibility score with detailed breakdown",
                context=[matching_task]
            )
            
            recommendation_task = Task(
                description="Provide recommendations to improve the resume's ATS compatibility",
                agent=self.agents["recommendation"],
                expected_output="List of actionable recommendations to improve the resume",
                context=[matching_task, scoring_task]
            )
            
            # Create the crew
            crew = Crew(
                agents=[self.agents["matching"], self.agents["scoring"], self.agents["recommendation"]],
                tasks=[matching_task, scoring_task, recommendation_task],
                verbose=True
            )
            
            # Run the crew
            result = crew.kickoff()
            
            # Process and return the result
            return self._process_crew_result(result)
            
        except Exception as e:
            logger.error(f"Error in agent orchestration: {str(e)}")
            raise
    
    async def build_resume(self, resume_data: Dict[str, Any], job_description: str = None) -> Dict[str, Any]:
        """
        Build a new ATS-optimized resume
        
        Args:
            resume_data: The resume builder data
            job_description: Optional job description to target
            
        Returns:
            Dict[str, Any]: The generated resume
        """
        try:
            # Create tasks for resume building
            job_task = None
            if job_description:
                job_task = Task(
                    description="Analyze the target job description to identify key requirements",
                    agent=self.agents["job"],
                    expected_output="List of key requirements and keywords from the job description"
                )
            
            build_task = Task(
                description="Create an ATS-optimized resume based on the provided information",
                agent=self.agents["builder"],
                expected_output="Complete resume content in multiple formats",
                context=[job_task] if job_task else []
            )
            
            scoring_task = Task(
                description="Evaluate the ATS compatibility of the generated resume",
                agent=self.agents["scoring"],
                expected_output="ATS compatibility score with detailed breakdown",
                context=[build_task]
            )
            
            # Create the crew
            agents = [self.agents["builder"], self.agents["scoring"]]
            tasks = [build_task, scoring_task]
            
            if job_task:
                agents.append(self.agents["job"])
                tasks.append(job_task)
            
            crew = Crew(
                agents=agents,
                tasks=tasks,
                verbose=True
            )
            
            # Run the crew
            result = crew.kickoff()
            
            # Process and return the result
            return self._process_crew_result(result)
            
        except Exception as e:
            logger.error(f"Error in agent orchestration: {str(e)}")
            raise
    
    def _process_crew_result(self, result: str) -> Dict[str, Any]:
        """
        Process the result from the crew
        
        Args:
            result: The raw result from the crew
            
        Returns:
            Dict[str, Any]: The processed result
        """
        # In a real implementation, this would parse the result from the crew
        # and convert it to the expected format
        # For now, we'll return a placeholder
        
        # Placeholder for demonstration purposes
        return {
            "success": True,
            "result": result
        }
