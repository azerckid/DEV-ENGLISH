import { useState, useCallback } from 'react';
import { words, drillItems } from '../data/mockData';

export interface FlashcardItem {
  readonly wordId: number;
  readonly word: string;
  readonly koreanMeaning: string;
  readonly exampleSentence: string;
  readonly sourceName: string;
}

export interface UseFlashcardReturn {
  currentIndex: number;
  currentCard: FlashcardItem | undefined;
  totalCards: number;
  isFlipped: boolean;
  isFinished: boolean;
  correctCount: number;
  wrongCount: number;
  flip: () => void;
  markCorrect: () => void;
  markWrong: () => void;
  restart: () => void;
}

function buildFlashcards(): FlashcardItem[] {
  return drillItems.map((item) => {
    const word = words.find((w) => w.id === item.wordId);
    return {
      wordId: item.wordId,
      word: item.word,
      koreanMeaning: word?.koreanMeaning ?? '',
      exampleSentence: item.sentence,
      sourceName: item.sourceName,
    };
  });
}

const flashcards = buildFlashcards();

export function useFlashcard(): UseFlashcardReturn {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);

  const currentCard = flashcards[currentIndex];
  const totalCards = flashcards.length;

  const flip = useCallback(() => setIsFlipped((f) => !f), []);

  const advance = useCallback(() => {
    if (currentIndex + 1 >= totalCards) {
      setIsFinished(true);
    } else {
      setCurrentIndex((i) => i + 1);
      setIsFlipped(false);
    }
  }, [currentIndex, totalCards]);

  const markCorrect = useCallback(() => {
    if (!isFlipped) return;
    setCorrectCount((c) => c + 1);
    advance();
  }, [isFlipped, advance]);

  const markWrong = useCallback(() => {
    if (!isFlipped) return;
    setWrongCount((c) => c + 1);
    advance();
  }, [isFlipped, advance]);

  const restart = useCallback(() => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setIsFinished(false);
    setCorrectCount(0);
    setWrongCount(0);
  }, []);

  return {
    currentIndex,
    currentCard,
    totalCards,
    isFlipped,
    isFinished,
    correctCount,
    wrongCount,
    flip,
    markCorrect,
    markWrong,
    restart,
  };
}
