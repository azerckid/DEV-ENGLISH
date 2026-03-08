import React from 'react';
import { useContribute } from '../hooks/useContribute';

interface ContributePageProps {
  readonly className?: string;
}

const STEP_LABELS = ['텍스트 입력', '단어 선택', 'AI 분석', '기여 완료'];

const StepIndicator: React.FC<{ current: number; total: number }> = ({ current, total }) => (
  <div className="flex flex-col gap-2 min-w-[240px]">
    <div className="flex justify-between items-center text-sm font-semibold">
      <span className="text-primary">전체 진행률</span>
      <span className="text-slate-900 dark:text-white">
        {Math.round(((current - 1) / (total - 1)) * 100)}%
      </span>
    </div>
    <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
      <div
        className="h-full bg-primary transition-all duration-500"
        style={{ width: `${Math.round(((current - 1) / (total - 1)) * 100)}%` }}
      />
    </div>
  </div>
);

export const ContributePage: React.FC<ContributePageProps> = ({ className = '' }) => {
  const {
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
  } = useContribute();

  const selectedCount = extractedWords.filter((w) => w.selected).length;

  return (
    <main className={`flex flex-1 justify-center py-8 px-4 lg:px-10 ${className}`}>
      <div className="max-w-[1200px] flex-1 flex flex-col gap-6">
        {/* Breadcrumb + Progress */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
            <a href="/" className="hover:text-primary">Home</a>
            <span className="material-symbols-outlined text-xs">chevron_right</span>
            <span className="text-slate-900 dark:text-slate-200">Word Contribution</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="flex flex-col gap-2">
              <h1 className="text-slate-900 dark:text-white text-3xl font-extrabold tracking-tight">
                Step {step} / 4 — {STEP_LABELS[step - 1]}
              </h1>
              <p className="text-slate-500 dark:text-slate-400 text-base">
                {step === 1 && '공식 문서에서 복사한 텍스트를 붙여 넣으세요.'}
                {step === 2 && '기술 문서에서 추출된 주요 단어를 검토하고 선택해 주세요.'}
                {step === 3 && 'AI가 생성한 어원 분석 결과를 확인하세요.'}
                {step === 4 && '기여가 완료되었습니다!'}
              </p>
            </div>
            <StepIndicator current={step} total={4} />
          </div>
        </div>

        {/* Step 1: Text Input */}
        {step === 1 && (
          <div className="flex flex-col gap-6">
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Reference URL (선택)
                </label>
                <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2">
                  <span className="material-symbols-outlined text-slate-400 text-sm">link</span>
                  <input
                    type="url"
                    value={sourceUrl}
                    onChange={(e) => setSourceUrl(e.target.value)}
                    placeholder="https://react.dev/reference/..."
                    className="flex-1 bg-transparent text-sm text-slate-700 dark:text-slate-300 outline-none placeholder:text-slate-400"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Content <span className="text-red-400">*</span>
                </label>
                <textarea
                  value={sourceText}
                  onChange={(e) => setSourceText(e.target.value)}
                  placeholder="공식 문서에서 복사한 텍스트를 여기에 붙여 넣으세요..."
                  rows={10}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-4 text-sm text-slate-700 dark:text-slate-300 leading-relaxed outline-none focus:ring-2 focus:ring-primary resize-none placeholder:text-slate-400"
                />
              </div>
              <button
                onClick={extract}
                disabled={!sourceText.trim() || isExtracting}
                className="self-end px-8 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
              >
                {isExtracting ? (
                  <>
                    <span className="material-symbols-outlined animate-spin text-xl">progress_activity</span>
                    추출 중...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-xl">auto_fix_high</span>
                    단어 추출
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Word Selection */}
        {step === 2 && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Source Context */}
            <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <span className="material-symbols-outlined text-primary text-xl">description</span>
                <h3 className="text-slate-900 dark:text-white font-bold text-lg">Source Context</h3>
              </div>
              {sourceUrl && (
                <div className="mb-3 flex items-center gap-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-slate-400">
                  <span className="material-symbols-outlined text-sm">link</span>
                  <span className="text-sm truncate">{sourceUrl}</span>
                </div>
              )}
              <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-4 text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-h-[400px] overflow-y-auto">
                {sourceText}
              </div>
            </div>

            {/* Right: Extraction List */}
            <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col">
              <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-xl">auto_fix_high</span>
                  <h3 className="text-slate-900 dark:text-white font-bold text-lg">
                    추출된 기술 단어 ({extractedWords.filter((w) => w.isNew).length}개 감지)
                  </h3>
                </div>
                <button onClick={selectAll} className="text-primary text-sm font-semibold hover:underline">
                  모두 선택
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-2">
                <div className="flex flex-col gap-1">
                  {extractedWords.map((w) =>
                    w.isNew ? (
                      <label
                        key={w.word}
                        className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-4">
                          <input
                            type="checkbox"
                            checked={w.selected}
                            onChange={() => toggleWord(w.word)}
                            className="w-5 h-5 rounded border-slate-300 text-primary focus:ring-primary"
                          />
                          <span className="font-mono text-base font-semibold text-slate-800 dark:text-slate-200">
                            {w.word}
                          </span>
                        </div>
                        <span className="bg-primary/10 text-primary text-xs font-bold px-2 py-1 rounded">
                          새 단어
                        </span>
                      </label>
                    ) : (
                      <div
                        key={w.word}
                        className="flex items-center justify-between p-3 rounded-lg bg-slate-50/50 dark:bg-slate-950/30 opacity-60"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-5 h-5 flex items-center justify-center text-slate-400">
                            <span className="material-symbols-outlined text-base">close</span>
                          </div>
                          <span className="font-mono text-base font-medium text-slate-500 line-through">
                            {w.word}
                          </span>
                        </div>
                        <span className="bg-slate-200 dark:bg-slate-700 text-slate-500 text-xs font-bold px-2 py-1 rounded">
                          이미 등록됨
                        </span>
                      </div>
                    )
                  )}
                </div>
              </div>
              <div className="p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/30 flex items-center justify-between">
                <span className="text-sm text-slate-500 dark:text-slate-400">
                  {selectedCount}개 선택됨
                </span>
                <button
                  onClick={generateEtymology}
                  disabled={selectedCount === 0 || isGenerating}
                  className="px-6 py-2.5 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                >
                  {isGenerating ? (
                    <>
                      <span className="material-symbols-outlined animate-spin text-lg">progress_activity</span>
                      분석 중...
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-lg">psychology</span>
                      AI 어원 분석 생성
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: AI Preview */}
        {step === 3 && (
          <div className="flex flex-col gap-6">
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-6">
                <span className="material-symbols-outlined text-primary text-xl">psychology</span>
                <h3 className="text-slate-900 dark:text-white font-bold text-lg">AI 어원 분석 결과</h3>
                <span className="ml-auto text-xs text-slate-400">(수정 불가 — 검수 후 확정)</span>
              </div>
              <div className="space-y-4">
                {extractedWords
                  .filter((w) => w.selected)
                  .map((w) => (
                    <div
                      key={w.word}
                      className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-700"
                    >
                      <p className="font-mono font-bold text-slate-900 dark:text-white mb-1">
                        {w.word}
                      </p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        어원 분석이 AI에 의해 생성되었으며 검수 대기 중입니다.
                      </p>
                    </div>
                  ))}
              </div>
              <div className="mt-8 flex flex-col md:flex-row gap-4">
                <button
                  onClick={submit}
                  disabled={isSubmitting}
                  className="px-8 py-4 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <span className="material-symbols-outlined animate-spin">progress_activity</span>
                      기여 중...
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined">upload</span>
                      DB에 기여
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Complete */}
        {step === 4 && isComplete && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <span className="material-symbols-outlined text-6xl text-primary mb-4 block">
              check_circle
            </span>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              {selectedCount}개 단어가 미검수 상태로 등록되었습니다
            </h2>
            <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-md">
              단어는 검수 후 공식 단어장에 추가됩니다. 기여해 주셔서 감사합니다!
            </p>
            <div className="flex gap-4">
              <a
                href="/"
                className="px-8 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-all"
              >
                홈으로
              </a>
              <button
                onClick={reset}
                className="px-8 py-3 border-2 border-slate-200 dark:border-slate-700 font-bold rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all text-slate-700 dark:text-slate-300"
              >
                다시 기여하기
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default ContributePage;
