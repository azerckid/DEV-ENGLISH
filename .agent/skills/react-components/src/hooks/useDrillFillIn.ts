import { useState, useCallback } from 'react';
import { drillItems } from '../data/mockData';

export type DrillAnswerState = 'unanswered' | 'correct' | 'incorrect';

export interface UseDrillFillInReturn {
  currentIndex: number;
  currentItem: (typeof drillItems)[0] | undefined;
  totalItems: number;
  answer: string;
  answerState: DrillAnswerState;
  isFinished: boolean;
  correctCount: number;
  wrongCount: number;
  setAnswer: (v: string) => void;
  submit: () => void;
  next: () => void;
  restart: () => void;
}

export function useDrillFillIn(): UseDrillFillInReturn {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [answerState, setAnswerState] = useState<DrillAnswerState>('unanswered');
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const currentItem = drillItems[currentIndex];
  const totalItems = drillItems.length;

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
    submit,
    next,
    restart,
  };
}
