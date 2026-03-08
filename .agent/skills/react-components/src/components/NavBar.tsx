import React from 'react';
import { NAV_LINKS } from '../data/mockData';

interface NavBarProps {
  readonly isLoggedIn?: boolean;
}

export const NavBar: React.FC<NavBarProps> = ({ isLoggedIn = false }) => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md px-6 md:px-10 py-3">
      <div className="max-w-[1200px] mx-auto flex items-center justify-between">
        <a href="/" className="flex items-center gap-3">
          <div className="size-8 bg-primary rounded-lg flex items-center justify-center text-white">
            <span className="material-symbols-outlined text-xl">terminal</span>
          </div>
          <span className="font-mono text-xl font-bold tracking-tight text-primary">
            DEV-ENGLISH
          </span>
        </a>

        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.filter(
            (link) => link.label !== '내 단어장' || isLoggedIn
          ).map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="px-4 py-2 text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors text-slate-700 dark:text-slate-300"
            >
              {link.label}
            </a>
          ))}
          <button
            aria-label="사용자 메뉴"
            className="ml-4 flex size-10 cursor-pointer items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 hover:ring-2 ring-primary/50 transition-all"
          >
            <span className="material-symbols-outlined text-slate-600 dark:text-slate-400">
              person
            </span>
          </button>
        </nav>
      </div>
    </header>
  );
};

export default NavBar;
