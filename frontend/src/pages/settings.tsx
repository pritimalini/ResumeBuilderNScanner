import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { FaCog, FaInfoCircle, FaKey, FaSun, FaMoon } from 'react-icons/fa';
import LoadingOverlay from '@/components/common/LoadingOverlay';
import api from '@/services/api';
import { useTheme } from '@/context/ThemeContext';

interface LLMProvider {
  id: string;
  name: string;
  description: string;
  models: { id: string; name: string }[];
  requires_api_key: boolean;
}

interface LLMSettings {
  provider: string;
  model: string;
  temperature: number;
  api_key?: string;
}

const Settings: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [providers, setProviders] = useState<LLMProvider[]>([]);
  const [settings, setSettings] = useState<LLMSettings>({
    provider: 'openai',
    model: 'gpt-4-turbo',
    temperature: 0.2,
    api_key: '',
  });
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [showApiKey, setShowApiKey] = useState<boolean>(false);

  // Fetch current settings
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setIsLoading(true);
        const response = await api.get('/settings/llm-settings');
        setProviders(response.data.available_providers);
        setSettings(response.data.current_settings);
      } catch (error) {
        console.error('Error fetching LLM settings:', error);
        toast.error('Failed to load LLM settings. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, []);

  // Get models for the selected provider
  const getModelsForProvider = () => {
    const provider = providers.find(p => p.id === settings.provider);
    return provider ? provider.models : [];
  };

  // Check if the selected provider requires an API key
  const providerRequiresApiKey = () => {
    const provider = providers.find(p => p.id === settings.provider);
    return provider ? provider.requires_api_key : true;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsSaving(true);
      
      // Validate settings
      if (!settings.provider || !settings.model) {
        toast.error('Please select a provider and model.');
        return;
      }
      
      // Check if API key is required but not provided
      if (providerRequiresApiKey() && !settings.api_key && !settings.api_key?.startsWith('********')) {
        toast.error('Please provide an API key for the selected provider.');
        return;
      }
      
      // Save settings
      const response = await api.post('/settings/llm-settings', settings);
      
      // Update settings with response
      setSettings(response.data);
      
      toast.success('LLM settings saved successfully!');
    } catch (error) {
      console.error('Error saving LLM settings:', error);
      toast.error('Failed to save LLM settings. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'provider') {
      // When provider changes, update the model to the first available model
      const provider = providers.find(p => p.id === value);
      const firstModel = provider?.models[0]?.id || '';
      
      setSettings({
        ...settings,
        provider: value,
        model: firstModel,
      });
    } else if (name === 'temperature') {
      // Handle temperature as a number
      setSettings({
        ...settings,
        [name]: parseFloat(value),
      });
    } else {
      // Handle other fields
      setSettings({
        ...settings,
        [name]: value,
      });
    }
  };

  return (
    <>
      <Head>
        <title>Settings - Resume ATS Optimizer</title>
        <meta name="description" content="Configure your Resume ATS Optimizer settings" />
      </Head>

      <div className={`space-y-8 ${theme === 'dark' ? 'text-white' : ''}`}>
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Settings</h1>
          <p className="text-secondary-600">
            Configure your Resume ATS Optimizer settings and preferences
          </p>
        </div>

        {/* Settings Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={`relative ${theme === 'dark' ? 'text-white' : ''}`}
        >
          {(isLoading || isSaving) && <LoadingOverlay />}
          
          <div className={`card ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : ''}`}>
            <div className="flex items-center mb-6">
              <FaCog className="text-primary-600 text-xl mr-3" />
              <h2 className="text-2xl font-semibold">LLM Configuration</h2>
            </div>
            
            {/* Theme Settings */}
            <div className="mb-8 pb-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <FaSun className="mr-2 text-yellow-500" />
                <span>Appearance</span>
              </h3>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Theme Mode</p>
                  <p className="text-sm text-secondary-500 dark:text-gray-400">Choose between light and dark theme</p>
                </div>
                
                <button
                  type="button"
                  onClick={toggleTheme}
                  className={`flex items-center justify-center w-12 h-6 rounded-full p-1 ${theme === 'dark' ? 'bg-purple-700' : 'bg-gray-300'}`}
                  aria-label="Toggle theme"
                >
                  <motion.div
                    className="bg-white w-4 h-4 rounded-full shadow-md"
                    animate={{ x: theme === 'dark' ? 24 : 0 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                  <FaSun className={`absolute left-2 text-yellow-500 text-xs ${theme === 'dark' ? 'opacity-0' : 'opacity-100'}`} />
                  <FaMoon className={`absolute right-2 text-purple-300 text-xs ${theme === 'dark' ? 'opacity-100' : 'opacity-0'}`} />
                </button>
              </div>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Provider Selection */}
              <div>
                <label htmlFor="provider" className="form-label">LLM Provider</label>
                <select
                  id="provider"
                  name="provider"
                  value={settings.provider}
                  onChange={handleChange}
                  className="form-input"
                  disabled={isSaving}
                >
                  {providers.map(provider => (
                    <option key={provider.id} value={provider.id}>
                      {provider.name}
                    </option>
                  ))}
                </select>
                
                {/* Provider Description */}
                {settings.provider && (
                  <div className="mt-2 text-sm text-secondary-600">
                    {providers.find(p => p.id === settings.provider)?.description}
                  </div>
                )}
              </div>
              
              {/* Model Selection */}
              <div>
                <label htmlFor="model" className="form-label">Model</label>
                <select
                  id="model"
                  name="model"
                  value={settings.model}
                  onChange={handleChange}
                  className="form-input"
                  disabled={isSaving}
                >
                  {getModelsForProvider().map(model => (
                    <option key={model.id} value={model.id}>
                      {model.name}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Temperature */}
              <div>
                <label htmlFor="temperature" className="form-label">
                  Temperature
                  <span className="ml-2 text-sm text-secondary-500">
                    (Controls randomness: 0 = deterministic, 1 = creative)
                  </span>
                </label>
                <div className="flex items-center space-x-4">
                  <input
                    type="range"
                    id="temperature"
                    name="temperature"
                    min="0"
                    max="1"
                    step="0.1"
                    value={settings.temperature}
                    onChange={handleChange}
                    className="w-full"
                    disabled={isSaving}
                  />
                  <span className="text-secondary-700 w-10 text-center">
                    {settings.temperature.toFixed(1)}
                  </span>
                </div>
              </div>
              
              {/* API Key */}
              {providerRequiresApiKey() && (
                <div>
                  <label htmlFor="api_key" className="form-label">
                    API Key
                    <span className="ml-2 text-sm text-secondary-500">
                      (Required for {providers.find(p => p.id === settings.provider)?.name})
                    </span>
                  </label>
                  <div className="relative">
                    <input
                      type={showApiKey ? "text" : "password"}
                      id="api_key"
                      name="api_key"
                      value={settings.api_key || ''}
                      onChange={handleChange}
                      className="form-input pr-10"
                      placeholder={`Enter your ${providers.find(p => p.id === settings.provider)?.name} API key`}
                      disabled={isSaving}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-secondary-500 hover:text-secondary-700"
                      onClick={() => setShowApiKey(!showApiKey)}
                    >
                      <FaKey />
                    </button>
                  </div>
                  <p className="mt-1 text-xs text-secondary-500">
                    Your API key is stored securely on your server and is never shared.
                  </p>
                </div>
              )}
              
              {/* Info Box */}
              <div className={`${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-primary-50 border-primary-100'} border rounded-md p-4 flex`}>
                <FaInfoCircle className="text-primary-600 mt-1 mr-3 flex-shrink-0" />
                <div className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-secondary-700'}`}>
                  <p className="font-medium mb-1">About Language Models</p>
                  <p>
                    The Resume ATS Optimizer uses language models to analyze resumes and job descriptions.
                    Different providers offer different models with varying capabilities and costs.
                  </p>
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li>OpenAI offers powerful models like GPT-4 and GPT-3.5</li>
                    <li>Groq provides ultra-fast inference for models like LLaMA and Mixtral</li>
                    <li>Google Gemini offers state-of-the-art models from Google</li>
                    <li>Development mode uses a mock LLM for testing without an API key</li>
                  </ul>
                </div>
              </div>
              
              {/* Submit Button */}
              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isSaving}
                >
                  Save Settings
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default Settings;
