export type WordStatus = 'verified' | 'unreviewed';
export type PartOfSpeech = 'noun' | 'verb' | 'adjective' | 'adverb';

export interface Word {
  readonly id: number;
  readonly word: string;
  readonly pronunciation: string;
  readonly partOfSpeech: PartOfSpeech;
  readonly koreanMeaning: string;
  readonly status: WordStatus;
  readonly sources: string[];
}

export const SOURCES = ['React Docs', 'Next.js Docs', 'MDN', 'TypeScript Docs'] as const;
export type Source = (typeof SOURCES)[number];

export const words: Word[] = [
  {
    id: 1,
    word: 'destructure',
    pronunciation: '/dɪˈstrʌktʃər/',
    partOfSpeech: 'verb',
    koreanMeaning: '구조 분해하다',
    status: 'verified',
    sources: ['React Docs'],
  },
  {
    id: 2,
    word: 'hydration',
    pronunciation: '/haɪˈdreɪʃən/',
    partOfSpeech: 'noun',
    koreanMeaning: '수화 (서버→클라이언트 상태 동기화)',
    status: 'verified',
    sources: ['Next.js Docs'],
  },
  {
    id: 3,
    word: 'memoize',
    pronunciation: "/ˈmɛmoʊˌaɪz/",
    partOfSpeech: 'verb',
    koreanMeaning: '메모이제이션하다',
    status: 'unreviewed',
    sources: ['MDN'],
  },
  {
    id: 4,
    word: 'reconciliation',
    pronunciation: '/ˌrɛkənsɪliˈeɪʃən/',
    partOfSpeech: 'noun',
    koreanMeaning: '재조정 (가상 DOM 비교)',
    status: 'verified',
    sources: ['React Docs'],
  },
  {
    id: 5,
    word: 'middleware',
    pronunciation: "/ˈmɪdəlˌwɛər/",
    partOfSpeech: 'noun',
    koreanMeaning: '미들웨어',
    status: 'unreviewed',
    sources: ['Next.js Docs'],
  },
  {
    id: 6,
    word: 'idempotent',
    pronunciation: '/ˌaɪdəmˈpoʊtənt/',
    partOfSpeech: 'adjective',
    koreanMeaning: '멱등성의',
    status: 'verified',
    sources: ['MDN'],
  },
  {
    id: 7,
    word: 'immutable',
    pronunciation: '/ɪˈmjuːtəbl/',
    partOfSpeech: 'adjective',
    koreanMeaning: '불변의',
    status: 'verified',
    sources: ['React Docs', 'MDN'],
  },
  {
    id: 8,
    word: 'coercion',
    pronunciation: '/koʊˈɜːrʒən/',
    partOfSpeech: 'noun',
    koreanMeaning: '타입 강제 변환',
    status: 'unreviewed',
    sources: ['MDN'],
  },
];

export interface WordExample {
  readonly id: number;
  readonly sentence: string;
  readonly translation: string;
  readonly sourceName: string;
  readonly sourceUrl?: string;
}

export type MorphemeType = 'prefix' | 'root' | 'suffix';

export interface WordMorpheme {
  readonly id: number;
  readonly morpheme: string;
  readonly type: MorphemeType;
  readonly meaning: string;
  readonly order: number;
}

export interface WordDerivative {
  readonly id: number;
  readonly root: string;
  readonly derivativeWord: string;
  readonly derivativeMeaning: string;
}

export interface WordDetail extends Word {
  readonly examples: WordExample[];
  readonly morphemes: WordMorpheme[];
  readonly derivatives: WordDerivative[];
}

export const wordDetails: WordDetail[] = [
  {
    id: 1,
    word: 'destructure',
    pronunciation: '/dɪˈstrʌktʃər/',
    partOfSpeech: 'verb',
    koreanMeaning: '구조 분해하다',
    status: 'verified',
    sources: ['React Docs'],
    examples: [
      {
        id: 1,
        sentence: 'You can <mark>destructure</mark> props directly in the function parameter.',
        translation: '함수 매개변수에서 직접 props를 구조 분해할 수 있습니다.',
        sourceName: 'React Docs',
        sourceUrl: 'https://react.dev/learn/passing-props-to-a-component',
      },
    ],
    morphemes: [
      { id: 1, morpheme: 'de-', type: 'prefix', meaning: '제거, 분리', order: 1 },
      { id: 2, morpheme: 'struct', type: 'root', meaning: '쌓다, 구조', order: 2 },
      { id: 3, morpheme: '-ure', type: 'suffix', meaning: '명사/동사화', order: 3 },
    ],
    derivatives: [
      { id: 1, root: 'struct', derivativeWord: 'structure', derivativeMeaning: '구조, 건축물, 체계' },
      { id: 2, root: 'struct', derivativeWord: 'construct', derivativeMeaning: '구성하다, 건설하다' },
      { id: 3, root: 'struct', derivativeWord: 'reconstruct', derivativeMeaning: '재구성하다, 복원하다' },
      { id: 4, root: 'struct', derivativeWord: 'infrastructure', derivativeMeaning: '기반 시설, 인프라' },
    ],
  },
];

export interface DrillItem {
  readonly wordId: number;
  readonly word: string;
  readonly sentence: string;
  readonly answer: string;
  readonly sourceName: string;
  readonly hint?: string;
}

export const drillItems: DrillItem[] = [
  {
    wordId: 1,
    word: 'destructure',
    sentence: 'You can ___ props directly in the function parameter to access values.',
    answer: 'destructure',
    sourceName: 'React Docs',
    hint: 'In JavaScript, extracting properties from an object is called ____ing.',
  },
  {
    wordId: 2,
    word: 'hydration',
    sentence: 'The process of ___ attaches React event listeners to server-rendered HTML.',
    answer: 'hydration',
    sourceName: 'Next.js Docs',
    hint: 'Think of making a dry sponge absorb water.',
  },
  {
    wordId: 4,
    word: 'reconciliation',
    sentence: 'React uses a ___ algorithm to determine what has changed in the virtual DOM.',
    answer: 'reconciliation',
    sourceName: 'React Docs',
    hint: 'This process compares the old and new virtual DOM trees.',
  },
];

export type VocabularySource = 'manual' | 'wrong_answer';

export interface MyVocabularyItem {
  readonly id: number;
  readonly wordId: number;
  readonly word: string;
  readonly koreanMeaning: string;
  readonly source: VocabularySource;
  readonly addedAt: string;
}

export const myVocabularyItems: MyVocabularyItem[] = [
  { id: 1, wordId: 1, word: 'destructure', koreanMeaning: '구조를 분해하다, 비구조화', source: 'manual', addedAt: '2026-03-07' },
  { id: 2, wordId: 4, word: 'reconciliation', koreanMeaning: '재조정 (가상 DOM 비교)', source: 'wrong_answer', addedAt: '2026-03-08' },
  { id: 3, wordId: 2, word: 'hydration', koreanMeaning: '수화 (서버→클라이언트 상태 동기화)', source: 'wrong_answer', addedAt: '2026-03-08' },
  { id: 4, wordId: 3, word: 'memoize', koreanMeaning: '메모이제이션하다', source: 'manual', addedAt: '2026-03-08' },
];

export const NAV_LINKS = [
  { label: '드릴 모드', href: '/drill' },
  { label: '플래시카드', href: '/flashcard' },
  { label: '내 단어장', href: '/my-vocabulary' },
  { label: '기여하기', href: '/contribute' },
  { label: '설정', href: '/settings' },
] as const;
