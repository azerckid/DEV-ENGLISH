import React from 'react';
import { useApiSettings, type AiProvider } from '../hooks/useApiSettings';

interface ApiSettingsProps {
  readonly className?: string;
}

const PROVIDERS: Array<{ id: AiProvider; label: string; desc: string; icon: string; iconColor: string }> = [
  {
    id: 'claude',
    label: 'Claude API',
    desc: '어원 분석에 최적화된 언어 모델',
    icon: 'bolt',
    iconColor: 'text-orange-600',
  },
  {
    id: 'openai',
    label: 'OpenAI API',
    desc: '범용 고성능 언어 모델',
    icon: 'auto_awesome',
    iconColor: 'text-emerald-600',
  },
];

export const ApiSettings: React.FC<ApiSettingsProps> = ({ className = '' }) => {
  const { provider, apiKey, showKey, isSaved, setProvider, setApiKey, toggleShowKey, save, deleteKey } =
    useApiSettings();

  const providerLabel = PROVIDERS.find((p) => p.id === provider)?.label ?? 'Claude API';

  return (
    <main className={`flex-1 flex flex-col items-center py-12 px-4 ${className}`}>
      <div className="w-full max-w-[500px] flex flex-col gap-8">
        {/* Header */}
        <div className="flex flex-col gap-2 text-center md:text-left">
          <h1 className="text-slate-900 dark:text-white text-3xl font-black leading-tight tracking-tight">
            AI API 설정
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-base">
            어원 분석 생성에 사용할 AI를 선택하고 API Key를 입력하세요.
          </p>
        </div>

        {/* Provider Selection */}
        <div className="grid grid-cols-2 gap-4">
          {PROVIDERS.map((p) => {
            const isSelected = provider === p.id;
            return (
              <button
                key={p.id}
                onClick={() => setProvider(p.id)}
                className={`flex flex-col gap-4 p-4 rounded-xl border-2 text-left transition-all ${
                  isSelected
                    ? 'border-primary bg-primary/5 dark:bg-primary/10 ring-2 ring-primary/20'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="size-10 rounded-lg bg-white dark:bg-slate-800 flex items-center justify-center shadow-sm">
                    <span className={`material-symbols-outlined ${p.iconColor}`}>{p.icon}</span>
                  </div>
                  {isSelected && (
                    <span className="material-symbols-outlined text-primary text-xl">check_circle</span>
                  )}
                </div>
                <div>
                  <p className="text-slate-900 dark:text-white text-base font-bold">{p.label}</p>
                  <p className="text-slate-500 dark:text-slate-400 text-xs mt-1 leading-snug">{p.desc}</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* API Key Section */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <label
              htmlFor="api-key-input"
              className="text-slate-900 dark:text-white text-sm font-bold"
            >
              {providerLabel} Key
            </label>
            {isSaved && (
              <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-[11px] font-bold">
                <span className="size-1.5 rounded-full bg-emerald-500" />
                설정됨
              </span>
            )}
          </div>

          <div className="relative">
            <input
              id="api-key-input"
              type={showKey ? 'text' : 'password'}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder={provider === 'claude' ? 'sk-ant-...' : 'sk-...'}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg py-3 px-4 text-slate-700 dark:text-slate-300 font-mono text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
            />
            <button
              onClick={toggleShowKey}
              aria-label={showKey ? '키 숨기기' : '키 보기'}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <span className="material-symbols-outlined text-xl">
                {showKey ? 'visibility_off' : 'visibility'}
              </span>
            </button>
          </div>

          {/* Security Notice */}
          <div className="bg-primary/5 dark:bg-primary/10 border border-primary/10 rounded-lg p-4 flex gap-3 items-start">
            <span className="material-symbols-outlined text-primary text-xl flex-shrink-0">lock</span>
            <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
              API Key는 이 기기의 브라우저에만 저장되며, 서버로 전송되지 않습니다. 브라우저 캐시를
              삭제하면 키도 함께 삭제됩니다.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3 pt-4">
          <button
            onClick={save}
            className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-xl">save</span>
            저장
          </button>
          {isSaved && (
            <button
              onClick={deleteKey}
              className="w-full bg-transparent hover:bg-red-50 dark:hover:bg-red-950/20 text-red-500 border border-red-200 dark:border-red-900/30 font-semibold py-3 rounded-xl transition-all flex items-center justify-center gap-2 text-sm"
            >
              <span className="material-symbols-outlined text-lg">delete</span>
              API Key 삭제
            </button>
          )}
        </div>
      </div>
    </main>
  );
};

export default ApiSettings;
