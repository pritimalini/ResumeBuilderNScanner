from fastapi import APIRouter, Depends, HTTPException, status
from typing import List, Optional
import os
import json
from pydantic import BaseModel
import logging

# Set up logging
logger = logging.getLogger(__name__)

router = APIRouter()

class LLMProvider(BaseModel):
    id: str
    name: str
    description: str
    api_key_required: bool
    models: List[str]
    icon: Optional[str] = None
    is_default: Optional[bool] = False

class LLMSettings(BaseModel):
    provider: str
    model: str
    api_key: Optional[str] = None
    temperature: float = 0.7
    max_tokens: int = 2000

class LLMSettingsResponse(BaseModel):
    current_settings: LLMSettings
    available_providers: List[LLMProvider]

class APIKeyValidation(BaseModel):
    provider: str
    api_key: str

# Available LLM providers
AVAILABLE_PROVIDERS = [
    LLMProvider(
        id="openai",
        name="OpenAI",
        description="Industry-leading AI models for text generation and analysis",
        api_key_required=True,
        models=["gpt-4", "gpt-3.5-turbo", "gpt-4-turbo"],
        is_default=True
    ),
    LLMProvider(
        id="anthropic",
        name="Anthropic",
        description="Claude models known for thoughtful, harmless, and honest AI interactions",
        api_key_required=True,
        models=["claude-3-opus", "claude-3-sonnet", "claude-3-haiku", "claude-2"]
    ),
    LLMProvider(
        id="google",
        name="Google AI",
        description="Gemini models offering strong reasoning and multimodal capabilities",
        api_key_required=True,
        models=["gemini-pro", "gemini-pro-vision"]
    ),
    LLMProvider(
        id="local",
        name="Local Model",
        description="Run your own models locally for enhanced privacy",
        api_key_required=False,
        models=["llama-3-8b", "llama-3-70b", "mistral-7b"]
    )
]

def get_settings_file_path(user_id: str) -> str:
    """Get the file path for a user's settings file"""
    # In a production app, this would likely be stored in a database
    # Here we'll just use a simple file-based approach for demonstration
    os.makedirs("data/user_settings", exist_ok=True)
    return f"data/user_settings/{user_id}_settings.json"

@router.get("/")
async def get_settings():
    """Get user's LLM settings"""
    try:
        # In a real app, you would get the user ID from authentication
        # Here we'll use a default user ID for demonstration
        user_id = "default_user"
        settings_path = get_settings_file_path(user_id)
        
        if not os.path.exists(settings_path):
            # Return default settings if no settings file exists
            return {
                "provider": "openai",
                "model": "gpt-4",
                "temperature": 0.7,
                "max_tokens": 2000,
                # Do not return the actual API key for security
                "api_key_set": False
            }
        
        with open(settings_path, "r") as f:
            settings = json.load(f)
            
        # Do not return the actual API key for security
        api_key_set = bool(settings.get("api_key"))
        settings_response = {
            "provider": settings.get("provider", "openai"),
            "model": settings.get("model", "gpt-4"),
            "temperature": settings.get("temperature", 0.7),
            "max_tokens": settings.get("max_tokens", 2000),
            "api_key_set": api_key_set
        }
        
        return settings_response
        
    except Exception as e:
        logger.error(f"Error retrieving settings: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve settings"
        )

@router.post("/")
async def save_settings(settings: LLMSettings):
    """Save user's LLM settings"""
    try:
        # In a real app, you would get the user ID from authentication
        # Here we'll use a default user ID for demonstration
        user_id = "default_user"
        settings_path = get_settings_file_path(user_id)
        
        # If an API key is not provided but settings exist, keep the existing API key
        if not settings.api_key and os.path.exists(settings_path):
            try:
                with open(settings_path, "r") as f:
                    existing_settings = json.load(f)
                    if existing_settings.get("api_key") and settings.provider == existing_settings.get("provider"):
                        settings.api_key = existing_settings.get("api_key")
            except:
                # If there's an error reading the file, just continue with no API key
                pass
        
        settings_dict = settings.dict()
        
        with open(settings_path, "w") as f:
            json.dump(settings_dict, f)
        
        # Update environment variables for the current session
        if settings.api_key:
            if settings.provider == "openai":
                os.environ["OPENAI_API_KEY"] = settings.api_key
            elif settings.provider == "anthropic":
                os.environ["ANTHROPIC_API_KEY"] = settings.api_key
            elif settings.provider == "google":
                os.environ["GOOGLE_API_KEY"] = settings.api_key
        
        return {"status": "success", "message": "Settings saved successfully"}
        
    except Exception as e:
        logger.error(f"Error saving settings: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to save settings"
        )

@router.post("/validate-api-key")
async def validate_api_key(validation: APIKeyValidation):
    """Validate an API key for a specific provider"""
    try:
        valid = False
        
        if validation.provider == "openai":
            # Test OpenAI API key
            try:
                # Just check if the key starts with "sk-" for demo purposes
                # In a real app, you would make an actual API call
                if validation.api_key.startswith("sk-"):
                    valid = True
            except:
                valid = False
                
        elif validation.provider == "anthropic":
            # Test Anthropic API key format
            try:
                # Just check if the key follows Anthropic's format for demo purposes
                if validation.api_key.startswith("sk-ant-"):
                    valid = True
            except:
                valid = False
                
        elif validation.provider == "google":
            # Test Google API key format
            if validation.api_key.startswith("AIza"):
                valid = True
            else:
                valid = False
                
        return {"valid": valid}
        
    except Exception as e:
        logger.error(f"Error validating API key: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to validate API key"
        )

@router.get("/llm-providers")
async def get_llm_providers():
    """Get available LLM providers"""
    return {"providers": AVAILABLE_PROVIDERS}
