from fastapi import APIRouter, Depends, HTTPException, status
from typing import Optional
import os
from pydantic import BaseModel
import logging
from ..auth.dependencies import get_current_user

# Set up logging
logger = logging.getLogger(__name__)

router = APIRouter()

class LLMSettings(BaseModel):
    provider: str
    model: str
    api_key: Optional[str] = None
    temperature: float = 0.7
    max_tokens: int = 2000

class APIKeyValidation(BaseModel):
    provider: str
    api_key: str

def get_settings_file_path(user_id: str) -> str:
    """Get the file path for a user's settings file"""
    # In a production app, this would likely be stored in a database
    # Here we'll just use a simple file-based approach for demonstration
    os.makedirs("data/user_settings", exist_ok=True)
    return f"data/user_settings/{user_id}_settings.json"

@router.get("/settings")
async def get_settings(current_user = Depends(get_current_user)):
    """Get user's LLM settings"""
    try:
        import json
        
        user_id = current_user["id"]
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

@router.post("/settings")
async def save_settings(settings: LLMSettings, current_user = Depends(get_current_user)):
    """Save user's LLM settings"""
    try:
        import json
        
        user_id = current_user["id"]
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
async def validate_api_key(validation: APIKeyValidation, current_user = Depends(get_current_user)):
    """Validate an API key for a specific provider"""
    try:
        valid = False
        
        if validation.provider == "openai":
            # Test OpenAI API key
            import openai
            openai.api_key = validation.api_key
            try:
                # Perform a small, cheap API call to verify the key works
                openai.models.list()
                valid = True
            except:
                valid = False
                
        elif validation.provider == "anthropic":
            # Test Anthropic API key
            try:
                import anthropic
                client = anthropic.Anthropic(api_key=validation.api_key)
                # Just create a client - we'll assume the key format is valid
                # In a real app you might make a small API call
                valid = True 
            except:
                valid = False
                
        elif validation.provider == "google":
            # Test Google API key format (simplified check)
            if validation.api_key.startswith("AIza"):
                # This is a simplified check - in a real app you'd make an actual API call
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