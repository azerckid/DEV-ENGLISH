import React from 'react';
import { NavBar } from './src/components/NavBar';
import { VocabularyList } from './src/components/VocabularyList';

const App: React.FC = () => {
  return (
    <div className="flex h-full min-h-screen flex-col bg-slate-50 dark:bg-slate-950 font-display text-slate-900 dark:text-slate-100">
      <NavBar isLoggedIn={false} />
      <VocabularyList />
      <footer className="mt-auto py-10 border-t border-slate-200 dark:border-slate-800 text-center">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          © 2026 DEV-ENGLISH. Built for developers by developers.
        </p>
      </footer>
    </div>
  );
};

export default App;
