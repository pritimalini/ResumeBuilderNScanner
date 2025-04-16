from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
import os
import logging
from typing import List, Dict, Any, Optional
import json
from dotenv import load_dotenv, set_key

# Initialize router
router = APIRouter()
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

# Models
class LLMProvider(BaseModel):
    id: str
    name: str
    description: str
    models: List[Dict[str, str]]
    requires_api_key: bool = True

class LLMSettings(BaseModel):
    provider: str
    model: str
    temperature: float
    api_key: Optional[str] = None

class LLMSettingsResponse(BaseModel):
    current_settings: LLMSettings
    available_providers: List[LLMProvider]

# Available LLM providers
AVAILABLE_PROVIDERS = [
    LLMProvider(
        id="openai",
        name="OpenAI",
        description="GPT-4 and GPT-3.5 models from OpenAI",
        models=[
            {"id": "gpt-4-turbo", "name": "GPT-4 Turbo"},
            {"id": "gpt-4", "name": "GPT-4"},
            {"id": "gpt-3.5-turbo", "name": "GPT-3.5 Turbo"}
        ],
        requires_api_key=True
    ),
    LLMProvider(
        id="groq",
        name="Groq",
        description="Ultra-fast inference for LLaMA, Mixtral and other models",
        models=[
            {"id": "llama2-70b-4096", "name": "LLaMA 2 70B"},
            {"id": "mixtral-8x7b-32768", "name": "Mixtral 8x7B"},
            {"id": "gemma-7b-it", "name": "Gemma 7B"}
        ],
        requires_api_key=True
    ),
    LLMProvider(
        id="gemini",
        name="Google Gemini",
        description="Google's latest AI models",
        models=[
            {"id": "gemini-pro", "name": "Gemini Pro"},
            {"id": "gemini-pro-vision", "name": "Gemini Pro Vision"}
        ],
        requires_api_key=True
    ),
    LLMProvider(
        id="development",
        name="Development Mode",
        description="Mock LLM for development and testing",
        models=[
            {"id": "mock", "name": "Mock LLM"}
        ],
        requires_api_key=False
    )
]

@router.get("/llm-settings", response_model=LLMSettingsResponse)
async def get_llm_settings():
    """
    Get current LLM settings and available providers
    """
    try:
        # Get current settings from environment variables
        provider = os.getenv("LLM_PROVIDER", "openai")
        model = os.getenv("LLM_MODEL", "gpt-4-turbo")
        temperature = float(os.getenv("LLM_TEMPERATURE", "0.2"))
        
        # Get API key for the current provider
        api_key = None
        if provider == "openai":
            api_key = os.getenv("OPENAI_API_KEY")
        elif provider == "groq":
            api_key = os.getenv("GROQ_API_KEY")
        elif provider == "gemini" or provider == "google":
            api_key = os.getenv("GOOGLE_API_KEY")
        
        # Mask API key for security
        if api_key and api_key != "your_openai_api_key_here" and api_key != "your_groq_api_key_here" and api_key != "your_google_api_key_here":
            api_key = "********" + api_key[-4:]
        
        current_settings = LLMSettings(
            provider=provider,
            model=model,
            temperature=temperature,
            api_key=api_key
        )
        
        return LLMSettingsResponse(
            current_settings=current_settings,
            available_providers=AVAILABLE_PROVIDERS
        )
    except Exception as e:
        logger.error(f"Error getting LLM settings: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error getting LLM settings: {str(e)}")

@router.post("/llm-settings", response_model=LLMSettings)
async def update_llm_settings(settings: LLMSettings):
    """
    Update LLM settings
    """
    try:
        # Validate provider
        valid_providers = [p.id for p in AVAILABLE_PROVIDERS]
        if settings.provider not in valid_providers:
            raise HTTPException(status_code=400, detail=f"Invalid provider. Must be one of: {', '.join(valid_providers)}")
        
        # Get the .env file path
        env_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), ".env")
        
        # Update provider and model settings
        set_key(env_path, "LLM_PROVIDER", settings.provider)
        set_key(env_path, "LLM_MODEL", settings.model)
        set_key(env_path, "LLM_TEMPERATURE", str(settings.temperature))
        
        # Update API key if provided
        if settings.api_key and settings.api_key != "********" and not settings.api_key.startswith("********"):
            if settings.provider == "openai":
                set_key(env_path, "OPENAI_API_KEY", settings.api_key)
            elif settings.provider == "groq":
                set_key(env_path, "GROQ_API_KEY", settings.api_key)
            elif settings.provider == "gemini" or settings.provider == "google":
                set_key(env_path, "GOOGLE_API_KEY", settings.api_key)
        
        # Return updated settings (mask API key)
        if settings.api_key and not settings.api_key.startswith("********"):
            settings.api_key = "********" + settings.api_key[-4:] if len(settings.api_key) > 4 else "********"
        
        return settings
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating LLM settings: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error updating LLM settings: {str(e)}")
