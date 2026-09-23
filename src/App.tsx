import { useState, useEffect } from 'react';
import { Language } from './types/orleans';
import { Navbar } from './components/layout/Navbar';
import { SetupGuide } from './components/setup/SetupGuide';
import { ScoringCalculator } from './components/scoring/ScoringCalculator';
import { EventsCodex } from './components/events/EventsCodex';
import { PlaceTilesCodex } from './components/codex/PlaceTilesCodex';
import { RulesReference } from './components/rules/RulesReference';
import { FleurDeLisIcon } from './components/common/Icons';

export function App() {
  const [currentTab, setCurrentTab] = useState<'setup' | 'scoring' | 'events' | 'codex' | 'rules'>('setup');
  const [language, setLanguage] = useState<Language>(() => {
    return (localStorage.getItem('orleans_language') as Language) || 'sr';
  });

  useEffect(() => {
    localStorage.setItem('orleans_language', language);
  }, [language]);

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col font-sans selection:bg-amber-600 selection:text-stone-950">
      {/* Navbar */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        language={language}
        setLanguage={setLanguage}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-8 pb-28 md:pb-8">
        {currentTab === 'setup' && <SetupGuide language={language} />}
        {currentTab === 'scoring' && <ScoringCalculator language={language} />}
        {currentTab === 'events' && <EventsCodex language={language} />}
        {currentTab === 'codex' && <PlaceTilesCodex language={language} />}
        {currentTab === 'rules' && <RulesReference language={language} />}
      </main>

      {/* Footer */}
      <footer className="border-t border-stone-900 bg-stone-950/80 py-6 mb-16 md:mb-0 text-center text-xs text-stone-500 space-y-2 px-4">
        <div className="flex items-center justify-center gap-2 text-stone-400">
          <FleurDeLisIcon size={16} />
          <span>Orléans Companion • Šta igramo?</span>
        </div>
        <p className="max-w-md mx-auto text-stone-600 text-[11px]">
          Optimizovano za mobilne telefone, tablete i računare. Podržava Osnovnu igru, Trade &amp; Intrigue i Invasion.
        </p>
      </footer>
    </div>
  );
}

export default App;
