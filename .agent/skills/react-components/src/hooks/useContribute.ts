import { useState, useCallback } from 'react';

export type ContributeStep = 1 | 2 | 3 | 4;

export interface ExtractedWord {
  word: string;
  isNew: boolean;
  selected: boolean;
}

export interface UseContributeReturn {
  step: ContributeStep;
  sourceUrl: string;
  sourceText: string;
  extractedWords: ExtractedWord[];
  isExtracting: boolean;
  isGenerating: boolean;
  isSubmitting: boolean;
  isComplete: boolean;
  setSourceUrl: (v: string) => void;
  setSourceText: (v: string) => void;
  extract: () => void;
  toggleWord: (word: string) => void;
  selectAll: () => void;
  generateEtymology: () => void;
  submit: () => void;
  reset: () => void;
}

const MOCK_EXTRACTED: ExtractedWord[] = [
  { word: 'useCallback', isNew: true, selected: true },
  { word: 'memoized', isNew: true, selected: true },
  { word: 'callback', isNew: true, selected: true },
  { word: 'reference', isNew: true, selected: true },
  { word: 'equality', isNew: true, selected: true },
  { word: 'optimized', isNew: false, selected: false },
];

export function useContribute(): UseContributeReturn {
  const [step, setStep] = useState<ContributeStep>(1);
  const [sourceUrl, setSourceUrl] = useState('');
  const [sourceText, setSourceText] = useState('');
  const [extractedWords, setExtractedWords] = useState<ExtractedWord[]>([]);
  const [isExtracting, setIsExtracting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const extract = useCallback(() => {
    if (!sourceText.trim()) return;
    setIsExtracting(true);
    setTimeout(() => {
      setExtractedWords(MOCK_EXTRACTED);
      setIsExtracting(false);
      setStep(2);
    }, 800);
  }, [sourceText]);

  const toggleWord = useCallback((word: string) => {
    setExtractedWords((prev) =>
      prev.map((w) => (w.word === word && w.isNew ? { ...w, selected: !w.selected } : w))
    );
  }, []);

  const selectAll = useCallback(() => {
    setExtractedWords((prev) => prev.map((w) => (w.isNew ? { ...w, selected: true } : w)));
  }, []);

  const generateEtymology = useCallback(() => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setStep(3);
    }, 1200);
  }, []);

  const submit = useCallback(() => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsComplete(true);
      setStep(4);
    }, 800);
  }, []);

  const reset = useCallback(() => {
    setStep(1);
    setSourceUrl('');
    setSourceText('');
    setExtractedWords([]);
    setIsComplete(false);
  }, []);

  return {
    step,
    sourceUrl,
    sourceText,
    extractedWords,
    isExtracting,
    isGenerating,
    isSubmitting,
    isComplete,
    setSourceUrl,
    setSourceText,
    extract,
    toggleWord,
    selectAll,
    generateEtymology,
    submit,
    reset,
  };
}
