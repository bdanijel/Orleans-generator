import React from 'react';
import { Language } from '../../types/orleans';
import { FleurDeLisIcon } from '../common/Icons';
import { Globe, Github } from 'lucide-react';

interface NavbarProps {
  currentTab: 'setup' | 'scoring' | 'events' | 'codex' | 'rules';
  setCurrentTab: (tab: 'setup' | 'scoring' | 'events' | 'codex' | 'rules') => void;
  language: Language;
  setLanguage: (lang: Language) => void;
}

export function Navbar({ currentTab, setCurrentTab, language, setLanguage }: NavbarProps) {
  const navLinks = [
    { id: 'setup', labelSr: 'Setup', labelEn: 'Setup' },
    { id: 'scoring', labelSr: 'Bodovanje', labelEn: 'Scoring' },
    { id: 'events', labelSr: 'Katalog Događaja', labelEn: 'Events' },
    { id: 'codex', labelSr: 'Zgrade', labelEn: 'Place Tiles' },
    { id: 'rules', labelSr: 'Pravilnik', labelEn: 'Rules' },
  ] as const;

  return (
    <header className="sticky top-0 z-40 bg-stone-950/95 backdrop-blur-md border-b border-stone-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Single text element wordmark */}
        <button 
          onClick={() => setCurrentTab('setup')}
          className="flex items-center gap-2.5 text-left text-stone-100 hover:text-amber-400 transition cursor-pointer shrink-0"
        >
          <div className="text-amber-500">
            <FleurDeLisIcon size={26} />
          </div>
          <span className="text-lg font-bold font-display tracking-tight text-stone-100">
            Orléans Companion
          </span>
        </button>

        {/* Zone 2: 4-6 clean text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-xs sm:text-sm font-semibold text-stone-400">
          {navLinks.map((link) => {
            const isActive = currentTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => setCurrentTab(link.id)}
                className={`py-1 transition-colors whitespace-nowrap cursor-pointer relative ${
                  isActive
                    ? 'text-amber-400 font-bold'
                    : 'hover:text-stone-200'
                }`}
              >
                {language === 'sr' ? link.labelSr : link.labelEn}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500 rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setLanguage(language === 'sr' ? 'en' : 'sr')}
            className="px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-stone-200 text-xs font-bold rounded-lg border border-stone-800 flex items-center gap-1.5 transition cursor-pointer"
            title="Promeni jezik / Switch Language"
          >
            <Globe className="w-3.5 h-3.5 text-amber-500" />
            <span className="font-mono">{language.toUpperCase()}</span>
          </button>

          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 text-stone-400 hover:text-stone-100 transition hidden sm:flex"
            title="GitHub Open Source Project"
          >
            <Github className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Mobile Sub-Navigation */}
      <div className="md:hidden flex items-center justify-around border-t border-stone-900 bg-stone-950 px-2 py-2 overflow-x-auto">
        {navLinks.map((link) => {
          const isActive = currentTab === link.id;
          return (
            <button
              key={link.id}
              onClick={() => setCurrentTab(link.id)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-stone-800 text-amber-400 border border-amber-600/30'
                  : 'text-stone-400'
              }`}
            >
              {language === 'sr' ? link.labelSr : link.labelEn}
            </button>
          );
        })}
      </div>
    </header>
  );
}
