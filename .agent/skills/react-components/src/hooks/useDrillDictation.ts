import { useState, useCallback } from 'react';
import { drillItems } from '../data/mockData';

export type DictationAnswerState = 'unanswered' | 'correct' | 'incorrect';

export interface UseDrillDictationReturn {
  currentIndex: number;
  currentItem: (typeof drillItems)[0] | undefined;
  totalItems: number;
  answer: string;
  answerState: DictationAnswerState;
  isFinished: boolean;
  correctCount: number;
  wrongCount: number;
  setAnswer: (v: string) => void;
  speakWord: () => void;
  submit: () => void;
  next: () => void;
  restart: () => void;
}

export function useDrillDictation(): UseDrillDictationReturn {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [answerState, setAnswerState] = useState<DictationAnswerState>('unanswered');
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const currentItem = drillItems[currentIndex];
  const totalItems = drillItems.length;

  const speakWord = useCallback(() => {
    if (!currentItem) return;
    const utterance = new SpeechSynthesisUtterance(currentItem.word);
    utterance.lang = 'en-US';
    utterance.rate = 0.85;
    window.speechSynthesis.speak(utterance);
  }, [currentItem]);

  const submit = useCallback(() => {
    if (!currentItem || answerState !== 'unanswered') return;
    const isCorrect = answer.trim().toLowerCase() === currentItem.answer.toLowerCase();
    setAnswerState(isCorrect ? 'correct' : 'incorrect');
    if (isCorrect) setCorrectCount((c) => c + 1);
    else setWrongCount((c) => c + 1);
  }, [answer, answerState, currentItem]);

  const next = useCallback(() => {
    if (currentIndex + 1 >= totalItems) {
      setIsFinished(true);
    } else {
      setCurrentIndex((i) => i + 1);
      setAnswer('');
      setAnswerState('unanswered');
    }
  }, [currentIndex, totalItems]);

  const restart = useCallback(() => {
    setCurrentIndex(0);
    setAnswer('');
    setAnswerState('unanswered');
    setCorrectCount(0);
    setWrongCount(0);
    setIsFinished(false);
  }, []);

  return {
    currentIndex,
    currentItem,
    totalItems,
    answer,
    answerState,
    isFinished,
    correctCount,
    wrongCount,
    setAnswer,
    speakWord,
    submit,
    next,
    restart,
  };
}
