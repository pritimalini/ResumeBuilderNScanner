'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, RefreshCw, Key, Bot, Settings2, CheckCircle, AlertCircle, Info } from 'lucide-react';

type LLMProvider = {
  id: string;
  name: string;
  description: string;
  apiKeyRequired: boolean;
  models: string[];
  icon?: string;
  isDefault?: boolean;
};

export default function SettingsPage() {
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState('');
  
  const [selectedProvider, setSelectedProvider] = useState('openai');
  const [selectedModel, setSelectedModel] = useState('gpt-4');
  const [apiKey, setApiKey] = useState('');
  const [apiKeyValid, setApiKeyValid] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [modelTemperature, setModelTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(2000);

  // List of available LLM providers
  const providers: LLMProvider[] = [
    {
      id: 'openai',
      name: 'OpenAI',
      description: 'Industry-leading AI models for text generation and analysis',
      apiKeyRequired: true,
      models: ['gpt-4', 'gpt-3.5-turbo', 'gpt-4-turbo'],
      isDefault: true
    },
    {
      id: 'anthropic',
      name: 'Anthropic',
      description: 'Claude models known for thoughtful, harmless, and honest AI interactions',
      apiKeyRequired: true,
      models: ['claude-3-opus', 'claude-3-sonnet', 'claude-3-haiku', 'claude-2']
    },
    {
      id: 'google',
      name: 'Google AI',
      description: 'Gemini models offering strong reasoning and multimodal capabilities',
      apiKeyRequired: true,
      models: ['gemini-pro', 'gemini-pro-vision']
    },
    {
      id: 'local',
      name: 'Local Model',
      description: 'Run your own models locally for enhanced privacy',
      apiKeyRequired: false,
      models: ['llama-3-8b', 'llama-3-70b', 'mistral-7b']
    }
  ];

  // Find the current provider
  const currentProvider = providers.find(p => p.id === selectedProvider) || providers[0];

  // Load settings from backend on component mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        // In a real app, you would fetch settings from your API
        // const response = await fetch('/api/settings');
        // const data = await response.json();
        
        // Simulate API response
        const data = {
          provider: 'openai',
          model: 'gpt-4',
          apiKey: '••••••••••••••••••••••',
          temperature: 0.7,
          maxTokens: 2000,
        };
        
        setSelectedProvider(data.provider);
        setSelectedModel(data.model);
        
        // Don't actually set the API key from response for security
        // Just mark it as valid if it exists
        if (data.apiKey) {
          setApiKeyValid(true);
        }
        
        setModelTemperature(data.temperature);
        setMaxTokens(data.maxTokens);
      } catch (error) {
        console.error('Error fetching settings:', error);
      }
    };
    
    fetchSettings();
  }, []);
  
  // Validate API key function (simulated)
  const validateApiKey = async () => {
    if (!apiKey.trim()) {
      setApiKeyValid(false);
      return;
    }
    
    try {
      // In a real app, you would validate with your API
      // const response = await fetch('/api/validate-api-key', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ provider: selectedProvider, apiKey })
      // });
      // const data = await response.json();
      // setApiKeyValid(data.valid);
      
      // Simulate API validation
      await new Promise(resolve => setTimeout(resolve, 1000));
      setApiKeyValid(true);
    } catch (error) {
      console.error('Error validating API key:', error);
      setApiKeyValid(false);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (currentProvider.apiKeyRequired && !apiKeyValid && !apiKey) {
      setSaveError('Please enter and validate your API key.');
      return;
    }
    
    setSaving(true);
    setSaveSuccess(false);
    setSaveError('');
    
    try {
      // In a real app, you would save with your API
      // const response = await fetch('/api/settings', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     provider: selectedProvider,
      //     model: selectedModel,
      //     apiKey: apiKey || undefined,
      //     temperature: modelTemperature,
      //     maxTokens
      //   })
      // });
      
      // if (!response.ok) throw new Error('Failed to save settings');
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSaveSuccess(true);
      
      // Clear displayed API key for security
      setApiKey('');
      setShowApiKey(false);
    } catch (error) {
      console.error('Error saving settings:', error);
      setSaveError('Failed to save settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-purple-50 pt-24 pb-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto"
        >
          <div className="text-center mb-10">
            <h1 className="text-4xl font-extrabold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
              AI Settings
            </h1>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Configure your AI providers and models to customize how your resume is analyzed and improved
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-4 px-6">
              <h2 className="text-white text-xl font-bold flex items-center">
                <Settings2 className="w-5 h-5 mr-2" />
                LLM Configuration
              </h2>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8">
              {/* Provider Selection */}
              <div className="mb-8">
                <label className="block text-gray-700 font-medium mb-2">AI Provider</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {providers.map((provider) => (
                    <div 
                      key={provider.id}
                      className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${
                        selectedProvider === provider.id 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-200 hover:border-blue-300'
                      }`}
                      onClick={() => {
                        setSelectedProvider(provider.id);
                        // Reset API key validation when changing providers
                        if (provider.id !== selectedProvider) {
                          setApiKeyValid(false);
                        }
                        // Set first model in the list as default
                        if (provider.models.length > 0) {
                          setSelectedModel(provider.models[0]);
                        }
                      }}
                    >
                      <div className="flex items-center">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          selectedProvider === provider.id 
                            ? 'bg-blue-500 text-white' 
                            : 'bg-gray-100 text-gray-500'
                        }`}>
                          <Bot className="w-5 h-5" />
                        </div>
                        <div className="ml-3">
                          <h3 className="font-medium">{provider.name}</h3>
                          <p className="text-xs text-gray-600">{provider.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Model Selection */}
              <div className="mb-8">
                <label htmlFor="model" className="block text-gray-700 font-medium mb-2">
                  Model
                </label>
                <select
                  id="model"
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {currentProvider.models.map((model) => (
                    <option key={model} value={model}>
                      {model}
                    </option>
                  ))}
                </select>
                <p className="mt-2 text-sm text-gray-500 flex items-center">
                  <Info className="w-4 h-4 mr-1" />
                  Different models have different capabilities and costs
                </p>
              </div>

              {/* API Key (if required) */}
              {currentProvider.apiKeyRequired && (
                <div className="mb-8">
                  <label htmlFor="apiKey" className="block text-gray-700 font-medium mb-2">
                    API Key {apiKeyValid && <span className="text-green-500 text-sm">(Validated)</span>}
                  </label>
                  <div className="relative">
                    <input
                      id="apiKey"
                      type={showApiKey ? "text" : "password"}
                      value={apiKey}
                      onChange={(e) => {
                        setApiKey(e.target.value);
                        setApiKeyValid(false);
                      }}
                      placeholder={apiKeyValid ? "API key is saved and valid" : `Enter your ${currentProvider.name} API key`}
                      className={`w-full px-4 py-3 pr-24 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        apiKeyValid ? 'border-green-500 bg-green-50' : 'border-gray-300'
                      }`}
                    />
                    {apiKey && (
                      <button
                        type="button"
                        onClick={() => setShowApiKey(!showApiKey)}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 px-2 py-1 text-sm"
                      >
                        {showApiKey ? 'Hide' : 'Show'}
                      </button>
                    )}
                  </div>
                  <div className="flex justify-between mt-2">
                    <p className="text-sm text-gray-500 flex items-center">
                      <Key className="w-4 h-4 mr-1" />
                      Your API key is stored securely and never shared
                    </p>
                    {!apiKeyValid && (
                      <button
                        type="button"
                        onClick={validateApiKey}
                        disabled={!apiKey.trim()}
                        className="text-sm text-blue-600 hover:text-blue-800"
                      >
                        Validate Key
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Advanced Settings */}
              <div className="mb-8 p-6 bg-gray-50 rounded-xl">
                <h3 className="font-medium text-gray-800 mb-4">Advanced Settings</h3>
                
                <div className="mb-4">
                  <label htmlFor="temperature" className="block text-gray-700 text-sm mb-1">
                    Temperature: {modelTemperature}
                  </label>
                  <div className="flex items-center">
                    <span className="text-xs text-gray-500 mr-2">0</span>
                    <input
                      id="temperature"
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={modelTemperature}
                      onChange={(e) => setModelTemperature(parseFloat(e.target.value))}
                      className="w-full"
                    />
                    <span className="text-xs text-gray-500 ml-2">1</span>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Lower values produce more deterministic outputs, higher values more creative ones
                  </p>
                </div>
                
                <div>
                  <label htmlFor="maxTokens" className="block text-gray-700 text-sm mb-1">
                    Max Tokens: {maxTokens}
                  </label>
                  <input
                    id="maxTokens"
                    type="number"
                    value={maxTokens}
                    onChange={(e) => setMaxTokens(parseInt(e.target.value))}
                    min="100"
                    max="8000"
                    step="100"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Controls the maximum length of AI-generated text
                  </p>
                </div>
              </div>

              {/* Status Messages */}
              {saveSuccess && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100 rounded-xl p-4 mb-6"
                >
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    <span className="text-green-700 font-medium">Settings saved successfully!</span>
                  </div>
                </motion.div>
              )}
              
              {saveError && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-50 border border-red-100 text-red-600 rounded-xl p-4 mb-6"
                >
                  <div className="flex items-center">
                    <AlertCircle className="h-5 w-5 mr-2" />
                    <span>{saveError}</span>
                  </div>
                </motion.div>
              )}

              {/* Submit Button */}
              <div className="flex justify-end">
                <motion.button
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={saving}
                  className={`px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-md transition-all flex items-center ${
                    saving ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {saving ? (
                    <>
                      <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5 mr-2" />
                      Save Settings
                    </>
                  )}
                </motion.button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 