import { integer, sqliteTable, text, unique } from "drizzle-orm/sqlite-core";

// ---------------------------------------------------------------------------
// Better Auth tables — managed by Better Auth Drizzle adapter
// ---------------------------------------------------------------------------

export const user = sqliteTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: integer("email_verified", { mode: "boolean" }).notNull(),
  image: text("image"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const session = sqliteTable("session", {
  id: text("id").primaryKey(),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  token: text("token").notNull().unique(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const account = sqliteTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  expiresAt: integer("expires_at", { mode: "timestamp" }),
  password: text("password"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const verification = sqliteTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

// ---------------------------------------------------------------------------
// words — 단어 기본 정보
// ---------------------------------------------------------------------------

export const words = sqliteTable("words", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  word: text("word").notNull().unique(),
  pronunciation: text("pronunciation"),
  partOfSpeech: text("part_of_speech").notNull(),
  koreanMeaning: text("korean_meaning").notNull(),
  createdAt: integer("created_at").notNull(),
  status: text("status").notNull().default("unreviewed"), // 'verified' | 'unreviewed'
  contributedBy: text("contributed_by").references(() => user.id),
  aiSource: text("ai_source"), // 'claude' | 'openai' | null
});

// ---------------------------------------------------------------------------
// word_examples — 공식 문서 크롤링 예문
// ---------------------------------------------------------------------------

export const wordExamples = sqliteTable("word_examples", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  wordId: integer("word_id")
    .notNull()
    .references(() => words.id, { onDelete: "cascade" }),
  sentence: text("sentence").notNull(),
  translation: text("translation").notNull(),
  sourceName: text("source_name").notNull(),
  sourceUrl: text("source_url"),
});

// ---------------------------------------------------------------------------
// word_morphemes — 어근/접두사/접미사 분해
// ---------------------------------------------------------------------------

export const wordMorphemes = sqliteTable("word_morphemes", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  wordId: integer("word_id")
    .notNull()
    .references(() => words.id, { onDelete: "cascade" }),
  morpheme: text("morpheme").notNull(),
  type: text("type").notNull(), // 'prefix' | 'root' | 'suffix'
  meaning: text("meaning").notNull(),
  order: integer("order").notNull(),
});

// ---------------------------------------------------------------------------
// word_derivatives — 동일 어원 파생어
// ---------------------------------------------------------------------------

export const wordDerivatives = sqliteTable("word_derivatives", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  wordId: integer("word_id")
    .notNull()
    .references(() => words.id, { onDelete: "cascade" }),
  root: text("root").notNull(),
  derivativeWord: text("derivative_word").notNull(),
  derivativeMeaning: text("derivative_meaning").notNull(),
});

// ---------------------------------------------------------------------------
// user_vocabulary — 개인 단어장
// ---------------------------------------------------------------------------

export const userVocabulary = sqliteTable(
  "user_vocabulary",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    wordId: integer("word_id")
      .notNull()
      .references(() => words.id, { onDelete: "cascade" }),
    source: text("source").notNull(), // 'manual' | 'wrong_answer'
    addedAt: integer("added_at").notNull(),
  },
  (table) => ({
    uniq: unique().on(table.userId, table.wordId),
  })
);
