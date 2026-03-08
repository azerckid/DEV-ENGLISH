/**
 * Seed script: dev-english initial word data
 * Run: npx tsx scripts/seed.ts
 */
import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { words, wordExamples, wordMorphemes, wordDerivatives } from "../lib/db-schema";

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN,
});
const db = drizzle(client);

const now = Math.floor(Date.now() / 1000);

const SEED_WORDS = [
  {
    word: "deprecate",
    pronunciation: "/ˈdeprəkeɪt/",
    partOfSpeech: "verb",
    koreanMeaning: "더 이상 사용하지 않도록 권고하다",
    examples: [
      {
        sentence: "This API has been deprecated and will be removed in the next major version.",
        translation: "이 API는 더 이상 사용이 권고되지 않으며 다음 메이저 버전에서 제거될 예정입니다.",
        sourceName: "React Docs",
        sourceUrl: "https://react.dev/reference/react",
      },
    ],
    morphemes: [
      { morpheme: "de-", type: "prefix", meaning: "반대, 제거", order: 1 },
      { morpheme: "prec", type: "root", meaning: "가치 (price)", order: 2 },
      { morpheme: "-ate", type: "suffix", meaning: "동사화", order: 3 },
    ],
    derivatives: [
      { root: "deprecate", derivativeWord: "deprecated", derivativeMeaning: "더 이상 사용되지 않는 (형용사)" },
      { root: "deprecate", derivativeWord: "deprecation", derivativeMeaning: "더 이상 사용하지 않도록 권고하는 행위 (명사)" },
    ],
  },
  {
    word: "hydration",
    pronunciation: "/haɪˈdreɪʃən/",
    partOfSpeech: "noun",
    koreanMeaning: "서버에서 렌더링된 HTML에 JavaScript를 연결하는 과정",
    examples: [
      {
        sentence: "Hydration is the process of attaching event listeners to the server-rendered HTML.",
        translation: "하이드레이션은 서버에서 렌더링된 HTML에 이벤트 리스너를 연결하는 과정입니다.",
        sourceName: "Next.js Docs",
        sourceUrl: "https://nextjs.org/docs/app/building-your-application/rendering",
      },
    ],
    morphemes: [
      { morpheme: "hydr-", type: "root", meaning: "물 (water)", order: 1 },
      { morpheme: "-ation", type: "suffix", meaning: "과정, 상태를 나타내는 명사", order: 2 },
    ],
    derivatives: [
      { root: "hydration", derivativeWord: "hydrate", derivativeMeaning: "수화시키다 / 하이드레이션하다 (동사)" },
      { root: "hydration", derivativeWord: "dehydration", derivativeMeaning: "탈수 / 하이드레이션 해제 (명사)" },
    ],
  },
  {
    word: "memoize",
    pronunciation: "/ˈmeməˌmaɪz/",
    partOfSpeech: "verb",
    koreanMeaning: "함수의 결과를 캐싱하여 동일 입력 시 재계산하지 않도록 하다",
    examples: [
      {
        sentence: "You can memoize expensive computations with useMemo to avoid re-rendering.",
        translation: "useMemo를 사용해 비용이 큰 연산을 메모이제이션하여 불필요한 리렌더링을 방지할 수 있습니다.",
        sourceName: "React Docs",
        sourceUrl: "https://react.dev/reference/react/useMemo",
      },
    ],
    morphemes: [
      { morpheme: "memo", type: "root", meaning: "기억 (memory)", order: 1 },
      { morpheme: "-ize", type: "suffix", meaning: "동사화", order: 2 },
    ],
    derivatives: [
      { root: "memoize", derivativeWord: "memoization", derivativeMeaning: "메모이제이션 기법 (명사)" },
      { root: "memoize", derivativeWord: "memoized", derivativeMeaning: "메모이제이션된 (형용사)" },
    ],
  },
  {
    word: "reconciliation",
    pronunciation: "/ˌrekənsɪliˈeɪʃən/",
    partOfSpeech: "noun",
    koreanMeaning: "가상 DOM과 실제 DOM을 비교해 최소 변경사항을 반영하는 과정",
    examples: [
      {
        sentence: "React's reconciliation algorithm determines the minimum number of operations needed to update the DOM.",
        translation: "React의 재조정 알고리즘은 DOM을 업데이트하는 데 필요한 최소 연산 수를 결정합니다.",
        sourceName: "React Docs",
        sourceUrl: "https://react.dev/learn/preserving-and-resetting-state",
      },
    ],
    morphemes: [
      { morpheme: "re-", type: "prefix", meaning: "다시", order: 1 },
      { morpheme: "concili", type: "root", meaning: "화해, 합의", order: 2 },
      { morpheme: "-ation", type: "suffix", meaning: "과정, 상태를 나타내는 명사", order: 3 },
    ],
    derivatives: [
      { root: "reconciliation", derivativeWord: "reconcile", derivativeMeaning: "조화시키다, 재조정하다 (동사)" },
    ],
  },
  {
    word: "idempotent",
    pronunciation: "/aɪˈdempətənt/",
    partOfSpeech: "adjective",
    koreanMeaning: "같은 연산을 여러 번 수행해도 결과가 동일한",
    examples: [
      {
        sentence: "GET requests should be idempotent — calling them multiple times should not change the server state.",
        translation: "GET 요청은 멱등성을 가져야 합니다. 여러 번 호출해도 서버 상태가 변경되어서는 안 됩니다.",
        sourceName: "MDN Web Docs",
        sourceUrl: "https://developer.mozilla.org/en-US/docs/Glossary/Idempotent",
      },
    ],
    morphemes: [
      { morpheme: "idem", type: "root", meaning: "같은 것 (same)", order: 1 },
      { morpheme: "potent", type: "root", meaning: "힘, 효력 (power)", order: 2 },
    ],
    derivatives: [
      { root: "idempotent", derivativeWord: "idempotency", derivativeMeaning: "멱등성 (명사)" },
    ],
  },
  {
    word: "propagate",
    pronunciation: "/ˈprɒpəɡeɪt/",
    partOfSpeech: "verb",
    koreanMeaning: "이벤트나 상태가 상위 또는 하위 컴포넌트로 전달되다",
    examples: [
      {
        sentence: "By default, events propagate up the component tree unless you call stopPropagation().",
        translation: "기본적으로 이벤트는 stopPropagation()을 호출하지 않는 한 컴포넌트 트리 위로 전파됩니다.",
        sourceName: "React Docs",
        sourceUrl: "https://react.dev/learn/responding-to-events",
      },
    ],
    morphemes: [
      { morpheme: "pro-", type: "prefix", meaning: "앞으로", order: 1 },
      { morpheme: "pag", type: "root", meaning: "고정하다, 퍼뜨리다", order: 2 },
      { morpheme: "-ate", type: "suffix", meaning: "동사화", order: 3 },
    ],
    derivatives: [
      { root: "propagate", derivativeWord: "propagation", derivativeMeaning: "전파, 확산 (명사)" },
      { root: "propagate", derivativeWord: "propagator", derivativeMeaning: "전파자, 전달자 (명사)" },
    ],
  },
  {
    word: "serialize",
    pronunciation: "/ˈsɪəriəlaɪz/",
    partOfSpeech: "verb",
    koreanMeaning: "데이터를 전송 가능한 문자열 형식으로 변환하다",
    examples: [
      {
        sentence: "Server Components can serialize data and pass it as props to Client Components.",
        translation: "서버 컴포넌트는 데이터를 직렬화하여 클라이언트 컴포넌트에 props로 전달할 수 있습니다.",
        sourceName: "Next.js Docs",
        sourceUrl: "https://nextjs.org/docs/app/building-your-application/rendering/server-components",
      },
    ],
    morphemes: [
      { morpheme: "serial", type: "root", meaning: "연속된, 순서 있는", order: 1 },
      { morpheme: "-ize", type: "suffix", meaning: "동사화", order: 2 },
    ],
    derivatives: [
      { root: "serialize", derivativeWord: "serialization", derivativeMeaning: "직렬화 (명사)" },
      { root: "serialize", derivativeWord: "deserialize", derivativeMeaning: "역직렬화하다 (동사)" },
    ],
  },
  {
    word: "coerce",
    pronunciation: "/kəʊˈɜːs/",
    partOfSpeech: "verb",
    koreanMeaning: "값을 강제로 특정 타입으로 변환하다",
    examples: [
      {
        sentence: "TypeScript does not coerce types implicitly — you must explicitly cast when needed.",
        translation: "TypeScript는 암묵적으로 타입을 강제 변환하지 않습니다. 필요할 때 명시적으로 캐스팅해야 합니다.",
        sourceName: "TypeScript Handbook",
        sourceUrl: "https://www.typescriptlang.org/docs/handbook/2/types-from-types.html",
      },
    ],
    morphemes: [
      { morpheme: "co-", type: "prefix", meaning: "함께, 강제로", order: 1 },
      { morpheme: "erce", type: "root", meaning: "봉쇄하다, 강제하다", order: 2 },
    ],
    derivatives: [
      { root: "coerce", derivativeWord: "coercion", derivativeMeaning: "강제 변환, 강제 (명사)" },
      { root: "coerce", derivativeWord: "coercive", derivativeMeaning: "강제적인 (형용사)" },
    ],
  },
  {
    word: "infer",
    pronunciation: "/ɪnˈfɜːr/",
    partOfSpeech: "verb",
    koreanMeaning: "코드로부터 타입을 자동으로 추론하다",
    examples: [
      {
        sentence: "TypeScript can infer the return type of a function from its implementation.",
        translation: "TypeScript는 함수 구현부로부터 반환 타입을 자동으로 추론할 수 있습니다.",
        sourceName: "TypeScript Handbook",
        sourceUrl: "https://www.typescriptlang.org/docs/handbook/type-inference.html",
      },
    ],
    morphemes: [
      { morpheme: "in-", type: "prefix", meaning: "안으로, ~에 근거하여", order: 1 },
      { morpheme: "fer", type: "root", meaning: "나르다, 가져오다 (carry)", order: 2 },
    ],
    derivatives: [
      { root: "infer", derivativeWord: "inference", derivativeMeaning: "추론, 타입 추론 (명사)" },
      { root: "infer", derivativeWord: "inferred", derivativeMeaning: "추론된 (형용사)" },
    ],
  },
  {
    word: "abstract",
    pronunciation: "/ˈæbstrækt/",
    partOfSpeech: "verb",
    koreanMeaning: "복잡한 구현을 숨기고 단순한 인터페이스를 제공하다",
    examples: [
      {
        sentence: "Custom hooks let you abstract stateful logic away from the component.",
        translation: "커스텀 훅을 사용하면 컴포넌트에서 상태 로직을 추상화하여 분리할 수 있습니다.",
        sourceName: "React Docs",
        sourceUrl: "https://react.dev/learn/reusing-logic-with-custom-hooks",
      },
    ],
    morphemes: [
      { morpheme: "ab-", type: "prefix", meaning: "떨어져, 분리하여", order: 1 },
      { morpheme: "tract", type: "root", meaning: "끌어당기다 (draw)", order: 2 },
    ],
    derivatives: [
      { root: "abstract", derivativeWord: "abstraction", derivativeMeaning: "추상화 (명사)" },
      { root: "abstract", derivativeWord: "abstract", derivativeMeaning: "추상적인 (형용사)" },
    ],
  },
  {
    word: "mutation",
    pronunciation: "/mjuːˈteɪʃən/",
    partOfSpeech: "noun",
    koreanMeaning: "데이터를 직접 변경하는 행위",
    examples: [
      {
        sentence: "Avoid direct mutation of state; use setState or a state management library instead.",
        translation: "상태를 직접 변경하는 것을 피하고, setState나 상태 관리 라이브러리를 사용하세요.",
        sourceName: "React Docs",
        sourceUrl: "https://react.dev/learn/updating-objects-in-state",
      },
    ],
    morphemes: [
      { morpheme: "mut", type: "root", meaning: "변하다 (change)", order: 1 },
      { morpheme: "-ation", type: "suffix", meaning: "과정, 상태를 나타내는 명사", order: 2 },
    ],
    derivatives: [
      { root: "mutation", derivativeWord: "mutate", derivativeMeaning: "변이시키다, 변경하다 (동사)" },
      { root: "mutation", derivativeWord: "immutable", derivativeMeaning: "불변의 (형용사)" },
    ],
  },
  {
    word: "orchestrate",
    pronunciation: "/ˈɔːrkɪstreɪt/",
    partOfSpeech: "verb",
    koreanMeaning: "여러 서비스나 작업을 조율하여 하나의 흐름으로 제어하다",
    examples: [
      {
        sentence: "Docker Compose orchestrates multiple containers to work together as a single application.",
        translation: "Docker Compose는 여러 컨테이너가 하나의 애플리케이션으로 함께 동작하도록 조율합니다.",
        sourceName: "Docker Docs",
        sourceUrl: "https://docs.docker.com/compose/",
      },
    ],
    morphemes: [
      { morpheme: "orchestr", type: "root", meaning: "오케스트라, 조화로운 연주", order: 1 },
      { morpheme: "-ate", type: "suffix", meaning: "동사화", order: 2 },
    ],
    derivatives: [
      { root: "orchestrate", derivativeWord: "orchestration", derivativeMeaning: "오케스트레이션, 조율 (명사)" },
      { root: "orchestrate", derivativeWord: "orchestrator", derivativeMeaning: "조율자 (명사)" },
    ],
  },
  {
    word: "delegate",
    pronunciation: "/ˈdelɪɡeɪt/",
    partOfSpeech: "verb",
    koreanMeaning: "권한이나 처리를 다른 대상에게 위임하다",
    examples: [
      {
        sentence: "Event delegation allows you to attach a single listener to a parent element instead of each child.",
        translation: "이벤트 위임을 사용하면 각 자식 요소 대신 부모 요소 하나에 리스너를 연결할 수 있습니다.",
        sourceName: "MDN Web Docs",
        sourceUrl: "https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Building_blocks/Events",
      },
    ],
    morphemes: [
      { morpheme: "de-", type: "prefix", meaning: "아래로, 분리하여", order: 1 },
      { morpheme: "leg", type: "root", meaning: "법, 보내다 (law/send)", order: 2 },
      { morpheme: "-ate", type: "suffix", meaning: "동사화", order: 3 },
    ],
    derivatives: [
      { root: "delegate", derivativeWord: "delegation", derivativeMeaning: "위임, 대표단 (명사)" },
      { root: "delegate", derivativeWord: "delegated", derivativeMeaning: "위임된 (형용사)" },
    ],
  },
  {
    word: "scaffold",
    pronunciation: "/ˈskæfəʊld/",
    partOfSpeech: "verb",
    koreanMeaning: "프로젝트의 기본 구조와 파일을 자동으로 생성하다",
    examples: [
      {
        sentence: "You can scaffold a new Next.js project by running create-next-app.",
        translation: "create-next-app을 실행하여 새 Next.js 프로젝트의 기본 구조를 자동으로 생성할 수 있습니다.",
        sourceName: "Next.js Docs",
        sourceUrl: "https://nextjs.org/docs/app/getting-started/installation",
      },
    ],
    morphemes: [
      { morpheme: "scaffold", type: "root", meaning: "비계, 임시 구조물", order: 1 },
    ],
    derivatives: [
      { root: "scaffold", derivativeWord: "scaffolding", derivativeMeaning: "스캐폴딩, 프로젝트 구조 생성 (명사)" },
    ],
  },
  {
    word: "traverse",
    pronunciation: "/trəˈvɜːrs/",
    partOfSpeech: "verb",
    koreanMeaning: "트리나 그래프 구조를 순서대로 방문하며 탐색하다",
    examples: [
      {
        sentence: "React traverses the component tree during rendering to determine what to display.",
        translation: "React는 렌더링 중 무엇을 표시할지 결정하기 위해 컴포넌트 트리를 순회합니다.",
        sourceName: "React Docs",
        sourceUrl: "https://react.dev/learn/render-and-commit",
      },
    ],
    morphemes: [
      { morpheme: "trans-", type: "prefix", meaning: "가로질러, 건너서", order: 1 },
      { morpheme: "vers", type: "root", meaning: "돌다, 방향 (turn)", order: 2 },
    ],
    derivatives: [
      { root: "traverse", derivativeWord: "traversal", derivativeMeaning: "순회, 탐색 (명사)" },
    ],
  },
  {
    word: "emit",
    pronunciation: "/ɪˈmɪt/",
    partOfSpeech: "verb",
    koreanMeaning: "이벤트를 발생시키거나 출력을 내보내다",
    examples: [
      {
        sentence: "The EventEmitter emits an event when the data stream is complete.",
        translation: "EventEmitter는 데이터 스트림이 완료되면 이벤트를 발생시킵니다.",
        sourceName: "Node.js Docs",
        sourceUrl: "https://nodejs.org/en/docs/guides/event-loop-timers-and-nexttick",
      },
    ],
    morphemes: [
      { morpheme: "e-", type: "prefix", meaning: "밖으로 (out)", order: 1 },
      { morpheme: "mit", type: "root", meaning: "보내다 (send)", order: 2 },
    ],
    derivatives: [
      { root: "emit", derivativeWord: "emission", derivativeMeaning: "방출, 발신 (명사)" },
      { root: "emit", derivativeWord: "emitter", derivativeMeaning: "발신자, 이벤트 에미터 (명사)" },
    ],
  },
  {
    word: "concatenate",
    pronunciation: "/kənˈkætɪneɪt/",
    partOfSpeech: "verb",
    koreanMeaning: "두 개 이상의 문자열이나 배열을 하나로 이어붙이다",
    examples: [
      {
        sentence: "Use the spread operator or concat() to concatenate arrays without mutating the original.",
        translation: "스프레드 연산자나 concat()을 사용해 원본을 변경하지 않고 배열을 이어붙이세요.",
        sourceName: "MDN Web Docs",
        sourceUrl: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/concat",
      },
    ],
    morphemes: [
      { morpheme: "con-", type: "prefix", meaning: "함께", order: 1 },
      { morpheme: "caten", type: "root", meaning: "사슬 (chain)", order: 2 },
      { morpheme: "-ate", type: "suffix", meaning: "동사화", order: 3 },
    ],
    derivatives: [
      { root: "concatenate", derivativeWord: "concatenation", derivativeMeaning: "연결, 연쇄 (명사)" },
    ],
  },
  {
    word: "encapsulate",
    pronunciation: "/ɪnˈkæpsjuleɪt/",
    partOfSpeech: "verb",
    koreanMeaning: "데이터와 로직을 하나의 단위로 묶어 외부에서 직접 접근하지 못하게 하다",
    examples: [
      {
        sentence: "Custom hooks encapsulate stateful logic so it can be reused across components.",
        translation: "커스텀 훅은 상태 로직을 캡슐화하여 여러 컴포넌트에서 재사용할 수 있게 합니다.",
        sourceName: "React Docs",
        sourceUrl: "https://react.dev/learn/reusing-logic-with-custom-hooks",
      },
    ],
    morphemes: [
      { morpheme: "en-", type: "prefix", meaning: "안에 넣다", order: 1 },
      { morpheme: "capsul", type: "root", meaning: "캡슐, 작은 용기", order: 2 },
      { morpheme: "-ate", type: "suffix", meaning: "동사화", order: 3 },
    ],
    derivatives: [
      { root: "encapsulate", derivativeWord: "encapsulation", derivativeMeaning: "캡슐화 (명사)" },
    ],
  },
  {
    word: "iterate",
    pronunciation: "/ˈɪtəreɪt/",
    partOfSpeech: "verb",
    koreanMeaning: "컬렉션의 각 항목을 순서대로 처리하다 / 반복하여 개선하다",
    examples: [
      {
        sentence: "You can iterate over an array with forEach, map, or a for...of loop.",
        translation: "forEach, map 또는 for...of 루프로 배열을 반복 처리할 수 있습니다.",
        sourceName: "MDN Web Docs",
        sourceUrl: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach",
      },
    ],
    morphemes: [
      { morpheme: "iter", type: "root", meaning: "다시 가다, 반복 (again)", order: 1 },
      { morpheme: "-ate", type: "suffix", meaning: "동사화", order: 2 },
    ],
    derivatives: [
      { root: "iterate", derivativeWord: "iteration", derivativeMeaning: "반복, 이터레이션 (명사)" },
      { root: "iterate", derivativeWord: "iterator", derivativeMeaning: "이터레이터, 반복자 (명사)" },
    ],
  },
  {
    word: "intercept",
    pronunciation: "/ˌɪntəˈsept/",
    partOfSpeech: "verb",
    koreanMeaning: "요청이나 응답의 중간에서 가로채어 처리하다",
    examples: [
      {
        sentence: "Axios interceptors let you intercept requests or responses before they are handled.",
        translation: "Axios 인터셉터를 사용하면 요청이나 응답이 처리되기 전에 중간에서 가로챌 수 있습니다.",
        sourceName: "Axios Docs",
        sourceUrl: "https://axios-http.com/docs/interceptors",
      },
    ],
    morphemes: [
      { morpheme: "inter-", type: "prefix", meaning: "사이에, 중간에", order: 1 },
      { morpheme: "cept", type: "root", meaning: "잡다, 받다 (take)", order: 2 },
    ],
    derivatives: [
      { root: "intercept", derivativeWord: "interceptor", derivativeMeaning: "인터셉터, 중간 처리자 (명사)" },
      { root: "intercept", derivativeWord: "interception", derivativeMeaning: "가로채기 (명사)" },
    ],
  },
];

async function seed() {
  console.log(`Seeding ${SEED_WORDS.length} words...`);

  for (const data of SEED_WORDS) {
    // Insert word
    const [inserted] = await db
      .insert(words)
      .values({
        word: data.word,
        pronunciation: data.pronunciation,
        partOfSpeech: data.partOfSpeech,
        koreanMeaning: data.koreanMeaning,
        createdAt: now,
        status: "approved",
      })
      .onConflictDoNothing()
      .returning({ id: words.id });

    if (!inserted) {
      console.log(`  SKIP (already exists): ${data.word}`);
      continue;
    }

    const wordId = inserted.id;

    // Examples
    if (data.examples.length > 0) {
      await db.insert(wordExamples).values(
        data.examples.map((e) => ({ wordId, ...e }))
      );
    }

    // Morphemes
    if (data.morphemes.length > 0) {
      await db.insert(wordMorphemes).values(
        data.morphemes.map((m) => ({ wordId, ...m }))
      );
    }

    // Derivatives
    if (data.derivatives.length > 0) {
      await db.insert(wordDerivatives).values(
        data.derivatives.map((d) => ({ wordId, ...d }))
      );
    }

    console.log(`  OK: ${data.word}`);
  }

  console.log("Done!");
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
