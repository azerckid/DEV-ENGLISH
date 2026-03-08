import { useState, useCallback } from 'react';

export type AiProvider = 'claude' | 'openai';

const STORAGE_KEY_PROVIDER = 'dev_english_ai_provider';
const STORAGE_KEY_API_KEY = 'dev_english_api_key';

function loadFromStorage(): { provider: AiProvider; apiKey: string } {
  try {
    const provider = (localStorage.getItem(STORAGE_KEY_PROVIDER) as AiProvider) ?? 'claude';
    const apiKey = localStorage.getItem(STORAGE_KEY_API_KEY) ?? '';
    return { provider, apiKey };
  } catch {
    return { provider: 'claude', apiKey: '' };
  }
}

export interface UseApiSettingsReturn {
  provider: AiProvider;
  apiKey: string;
  showKey: boolean;
  isSaved: boolean;
  setProvider: (p: AiProvider) => void;
  setApiKey: (k: string) => void;
  toggleShowKey: () => void;
  save: () => void;
  deleteKey: () => void;
}

export function useApiSettings(): UseApiSettingsReturn {
  const initial = loadFromStorage();
  const [provider, setProvider] = useState<AiProvider>(initial.provider);
  const [apiKey, setApiKey] = useState(initial.apiKey);
  const [showKey, setShowKey] = useState(false);
  const [isSaved, setIsSaved] = useState(initial.apiKey !== '');

  const save = useCallback(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PROVIDER, provider);
      localStorage.setItem(STORAGE_KEY_API_KEY, apiKey);
      setIsSaved(true);
    } catch {
      // localStorage unavailable — silently ignore
    }
  }, [provider, apiKey]);

  const deleteKey = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY_API_KEY);
      setApiKey('');
      setIsSaved(false);
    } catch {
      // localStorage unavailable
    }
  }, []);

  return {
    provider,
    apiKey,
    showKey,
    isSaved,
    setProvider,
    setApiKey,
    toggleShowKey: () => setShowKey((s) => !s),
    save,
    deleteKey,
  };
}
