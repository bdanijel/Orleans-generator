import React from 'react';
import { Language } from '../../types/orleans';
import { FleurDeLisIcon } from '../common/Icons';
import { 
  Globe, 
  Compass, 
  Trophy, 
  Hourglass, 
  Building2, 
  BookOpen, 
  Gamepad2
} from 'lucide-react';

interface NavbarProps {
  currentTab: 'setup' | 'scoring' | 'events' | 'codex' | 'rules';
  setCurrentTab: (tab: 'setup' | 'scoring' | 'events' | 'codex' | 'rules') => void;
  language: Language;
  setLanguage: (lang: Language) => void;
}

export function Navbar({ currentTab, setCurrentTab, language, setLanguage }: NavbarProps) {
  const navLinks = [
    { 
      id: 'setup' as const, 
      labelSr: 'Setup', 
      labelEn: 'Setup', 
      shortSr: 'Setup',
      shortEn: 'Setup',
      icon: Compass 
    },
    { 
      id: 'scoring' as const, 
      labelSr: 'Bodovanje', 
      labelEn: 'Scoring', 
      shortSr: 'Bodovi',
      shortEn: 'Scores',
      icon: Trophy 
    },
    { 
      id: 'events' as const, 
      labelSr: 'Katalog Događaja', 
      labelEn: 'Events Codex', 
      shortSr: 'Događaji',
      shortEn: 'Events',
      icon: Hourglass 
    },
    { 
      id: 'codex' as const, 
      labelSr: 'Zgrade', 
      labelEn: 'Place Tiles', 
      shortSr: 'Zgrade',
      shortEn: 'Tiles',
      icon: Building2 
    },
    { 
      id: 'rules' as const, 
      labelSr: 'Pravilnik', 
      labelEn: 'Rules FAQ', 
      shortSr: 'Pravila',
      shortEn: 'Rules',
      icon: BookOpen 
    },
  ];

  return (
    <>
      {/* Top Header Bar for Desktop & Mobile */}
      <header className="sticky top-0 z-40 bg-stone-950/95 backdrop-blur-md border-b border-stone-850 shadow-md">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-2 sm:gap-4">
          {/* Brand & 'Šta igramo?' App Context */}
          <button 
            onClick={() => setCurrentTab('setup')}
            className="flex items-center gap-2 text-left text-stone-100 hover:text-amber-400 transition cursor-pointer shrink-0 py-1"
          >
            <div className="text-amber-500 shrink-0">
              <FleurDeLisIcon size={24} />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-base sm:text-lg font-bold font-display tracking-tight text-stone-100">
                  Orléans
                </span>
                <span className="text-[11px] font-sans font-medium text-stone-400 hidden sm:inline">
                  Companion
                </span>
              </div>
              <div className="flex items-center gap-1 text-[10px] text-amber-500/90 font-medium tracking-wide">
                <Gamepad2 className="w-2.5 h-2.5 text-amber-500" />
                <span>Šta igramo?</span>
              </div>
            </div>
          </button>

          {/* Desktop & Tablet Navigation (>= md) */}
          <nav className="hidden md:flex items-center gap-5 lg:gap-7 text-xs lg:text-sm font-semibold text-stone-400">
            {navLinks.map((link) => {
              const isActive = currentTab === link.id;
              const Icon = link.icon;
              return (
                <button
                  key={link.id}
                  onClick={() => setCurrentTab(link.id)}
                  className={`py-2 px-1 flex items-center gap-1.5 transition-colors whitespace-nowrap cursor-pointer relative ${
                    isActive
                      ? 'text-amber-400 font-bold'
                      : 'hover:text-stone-200'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-stone-500'}`} />
                  <span>{language === 'sr' ? link.labelSr : link.labelEn}</span>
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500 rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action: Language Switcher */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setLanguage(language === 'sr' ? 'en' : 'sr')}
              className="px-2.5 py-1.5 sm:px-3 sm:py-1.5 bg-stone-900 hover:bg-stone-850 active:bg-stone-800 text-stone-200 text-xs font-bold rounded-lg border border-stone-800 flex items-center gap-1.5 transition cursor-pointer min-h-[38px] sm:min-h-[36px]"
              title="Promeni jezik / Switch Language"
            >
              <Globe className="w-3.5 h-3.5 text-amber-500" />
              <span className="font-mono">{language.toUpperCase()}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Fixed Bottom Navigation Bar for Mobile (< md) */}
      <nav 
        aria-label="Mobilna navigacija"
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-stone-950/95 backdrop-blur-lg border-t border-stone-800/90 shadow-2xl pb-safe"
      >
        <div className="grid grid-cols-5 h-15 items-center px-1">
          {navLinks.map((link) => {
            const isActive = currentTab === link.id;
            const Icon = link.icon;
            return (
              <button
                key={link.id}
                onClick={() => {
                  setCurrentTab(link.id);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`flex flex-col items-center justify-center h-full min-h-[44px] py-1 transition-colors cursor-pointer select-none active:scale-95 ${
                  isActive
                    ? 'text-amber-400 font-bold'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                <div className={`p-1 rounded-lg transition-transform ${isActive ? 'bg-amber-500/15' : ''}`}>
                  <Icon className={`w-5 h-5 ${isActive ? 'text-amber-400 stroke-[2.25]' : 'text-stone-400 stroke-[1.75]'}`} />
                </div>
                <span className={`text-[10px] tracking-tight mt-0.5 ${isActive ? 'text-amber-400 font-bold' : 'text-stone-400'}`}>
                  {language === 'sr' ? link.shortSr : link.shortEn}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
}
