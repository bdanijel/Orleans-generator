import { useState } from 'react';
import { Language, EventDefinition, GameExpansion, EventSeverity } from '../../types/orleans';
import { EVENTS_DATA, TORTURE_OPTIONS } from '../../data/rulesData';
import { HourglassIcon, CoinIcon, FleurDeLisIcon } from '../common/Icons';
import { 
  Search, 
  Filter, 
  Hourglass, 
  Skull, 
  AlertTriangle, 
  Sparkles, 
  ShieldAlert, 
  Coins, 
  RotateCcw,
  BookOpen,
  Info,
  Dice5
} from 'lucide-react';

interface EventsCodexProps {
  language: Language;
}

export function EventsCodex({ language }: EventsCodexProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedExpansion, setSelectedExpansion] = useState<'all' | GameExpansion>('all');
  const [selectedSeverity, setSelectedSeverity] = useState<'all' | EventSeverity>('all');
  const [showTortureModal, setShowTortureModal] = useState(false);
  const [randomDrawnEvent, setRandomDrawnEvent] = useState<EventDefinition | null>(null);

  const filteredEvents = EVENTS_DATA.filter(event => {
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = 
      event.nameSr.toLowerCase().includes(searchLower) ||
      event.nameEn.toLowerCase().includes(searchLower) ||
      event.originalName.toLowerCase().includes(searchLower) ||
      event.descriptionSr.toLowerCase().includes(searchLower) ||
      event.descriptionEn.toLowerCase().includes(searchLower) ||
      (event.scenarioOrPile && event.scenarioOrPile.toLowerCase().includes(searchLower));

    const matchesExpansion = selectedExpansion === 'all' || event.expansion === selectedExpansion;
    const matchesSeverity = selectedSeverity === 'all' || event.severity === selectedSeverity;

    return matchesSearch && matchesExpansion && matchesSeverity;
  });

  const handleDrawRandomEvent = () => {
    const pool = filteredEvents.length > 0 ? filteredEvents : EVENTS_DATA;
    const random = pool[Math.floor(Math.random() * pool.length)];
    setRandomDrawnEvent(random);
  };

  const getSeverityBadge = (severity: EventSeverity) => {
    switch (severity) {
      case 'positive':
        return {
          labelSr: 'Priliv / Bonus',
          labelEn: 'Positive / Bonus',
          bg: 'bg-emerald-950/80 border-emerald-700 text-emerald-300'
        };
      case 'negative':
        return {
          labelSr: 'Gubitak / Kazna',
          labelEn: 'Hazard / Loss',
          bg: 'bg-rose-950/80 border-rose-700 text-rose-300'
        };
      case 'payment':
        return {
          labelSr: 'Porez / Plaćanje',
          labelEn: 'Taxes / Dues',
          bg: 'bg-amber-950/80 border-amber-700 text-amber-300'
        };
      case 'restriction':
        return {
          labelSr: 'Zabrana akcija',
          labelEn: 'Action Restriction',
          bg: 'bg-purple-950/80 border-purple-700 text-purple-300'
        };
      case 'special':
      default:
        return {
          labelSr: 'Posebno pravilo',
          labelEn: 'Special Rule',
          bg: 'bg-blue-950/80 border-blue-700 text-blue-300'
        };
    }
  };

  return (
    <div className="space-y-8">
      {/* Header & Search Bar */}
      <div className="bg-stone-900/90 border border-stone-800 rounded-xl p-6 shadow-xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-stone-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-500 uppercase tracking-wider mb-1">
              <Hourglass className="w-4 h-4" />
              {language === 'sr' ? 'Katalog i Enciklopedija Događaja' : 'Events Codex & Encyclopedia'}
            </div>
            <h2 className="text-2xl font-bold text-stone-100 font-display">
              {language === 'sr' ? 'Svi Događaji: Osnovna Igra + Obe Ekspanzije' : 'All Events: Base Game + Expansions'}
            </h2>
            <p className="text-sm text-stone-400 mt-0.5">
              {language === 'sr' 
                ? 'Brza pretraga po originalnom nemačkom nazivu (npr. Bücherbrand, Ablass, Bauernaufstand), srpskom i engleskom nazivu i objašnjenjima.' 
                : 'Fast lookup by original German title, English/Serbian name, and detailed rule consequences.'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDrawRandomEvent}
              className="px-3.5 py-2.5 bg-amber-600 hover:bg-amber-500 active:bg-amber-700 text-stone-950 text-xs font-bold rounded-xl flex items-center gap-1.5 transition cursor-pointer shadow-md min-h-[42px]"
            >
              <Dice5 className="w-4 h-4" />
              <span>{language === 'sr' ? 'Nasumičan Događaj' : 'Draw Random'}</span>
            </button>

            <button
              onClick={() => setShowTortureModal(true)}
              className="px-3.5 py-2.5 bg-rose-950/80 hover:bg-rose-900 active:bg-rose-950 text-rose-300 text-xs font-semibold rounded-xl border border-rose-800/60 flex items-center gap-1.5 transition cursor-pointer min-h-[42px]"
            >
              <Skull className="w-4 h-4" />
              <span>{language === 'sr' ? 'Mučenje (Torture)' : 'Torture Rules'}</span>
            </button>
          </div>
        </div>

        {/* Expansion Selection Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          <span className="text-xs text-stone-400 font-semibold shrink-0 mr-1">{language === 'sr' ? 'Izvor:' : 'Source:'}</span>
          {[
            { id: 'all', labelSr: 'Svi događaji', labelEn: 'All Events' },
            { id: 'base', labelSr: '⚜️ Osnovna (6)', labelEn: 'Base Game (6)' },
            { id: 'trade_intrigue', labelSr: '📜 Trade & Intrigue (34)', labelEn: 'Trade & Intrigue (34)' },
            { id: 'invasion', labelSr: '⚔️ Invasion (31+)', labelEn: 'Invasion (31+)' }
          ].map(exp => (
            <button
              key={exp.id}
              onClick={() => setSelectedExpansion(exp.id as any)}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap min-h-[40px] flex items-center ${
                selectedExpansion === exp.id
                  ? 'bg-amber-600 text-stone-950 font-black shadow-md'
                  : 'bg-stone-950 text-stone-300 hover:text-stone-100 border border-stone-800'
              }`}
            >
              {language === 'sr' ? exp.labelSr : exp.labelEn}
            </button>
          ))}
        </div>

        {/* Filter Controls & Search */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-4">
          {/* Search Box */}
          <div className="md:col-span-5 relative">
            <Search className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              inputMode="search"
              placeholder={language === 'sr' ? 'Pretraži: Ablass, Pest, kuga, porez...' : 'Search: Ablass, Pest, plague, tax...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-9 py-2.5 bg-stone-950 border border-stone-800 focus:border-amber-500 rounded-xl text-base text-stone-100 placeholder:text-stone-500 min-h-[44px]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-200 text-xs w-6 h-6 flex items-center justify-center rounded-full bg-stone-900 border border-stone-750 cursor-pointer"
                aria-label="Obriši pretragu"
              >
                ✕
              </button>
            )}
          </div>

          {/* Severity / Type Filter */}
          <div className="md:col-span-7 flex items-center gap-1.5 overflow-x-auto p-1 bg-stone-950 border border-stone-800 rounded-xl no-scrollbar">
            {[
              { id: 'all', nameSr: 'Sve vrste', nameEn: 'All Types' },
              { id: 'positive', nameSr: 'Priliv / Bonus', nameEn: 'Positive' },
              { id: 'negative', nameSr: 'Gubitak / Kazna', nameEn: 'Hazards' },
              { id: 'payment', nameSr: 'Porezi & Nameti', nameEn: 'Taxes' },
              { id: 'restriction', nameSr: 'Zabrane', nameEn: 'Restrictions' },
              { id: 'special', nameSr: 'Specijalno', nameEn: 'Special' },
            ].map(sev => (
              <button
                key={sev.id}
                onClick={() => setSelectedSeverity(sev.id as any)}
                className={`px-3 py-2 text-xs font-semibold rounded-lg whitespace-nowrap transition cursor-pointer min-h-[38px] flex items-center ${
                  selectedSeverity === sev.id
                    ? 'bg-stone-800 text-amber-400 border border-amber-500/40 font-bold'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                {language === 'sr' ? sev.nameSr : sev.nameEn}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* RANDOM DRAW SPOTLIGHT CARD (IF ACTIVE) */}
      {randomDrawnEvent && (
        <div className="p-6 bg-gradient-to-r from-amber-950/60 via-stone-900 to-amber-950/60 border-2 border-amber-500 rounded-2xl shadow-2xl relative space-y-4">
          <button
            onClick={() => setRandomDrawnEvent(null)}
            className="absolute top-4 right-4 text-stone-400 hover:text-stone-100 text-xs bg-stone-950 px-2 py-1 rounded border border-stone-700 cursor-pointer"
          >
            ✕ Zatvori
          </button>

          <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
            <Dice5 className="w-4 h-4" />
            <span>{language === 'sr' ? 'Nasumično Izvučeni Događaj:' : 'Randomly Drawn Event:'}</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-800">
            <div>
              <h3 className="text-2xl font-black font-display text-stone-100">
                {language === 'sr' ? randomDrawnEvent.nameSr : randomDrawnEvent.nameEn}
              </h3>
              <div className="text-sm font-semibold text-amber-400 italic">
                Original: {randomDrawnEvent.originalName}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 text-xs font-bold rounded-lg border ${getSeverityBadge(randomDrawnEvent.severity).bg}`}>
                {language === 'sr' ? getSeverityBadge(randomDrawnEvent.severity).labelSr : getSeverityBadge(randomDrawnEvent.severity).labelEn}
              </span>
              <span className="px-2.5 py-1 text-xs font-mono bg-stone-950 border border-stone-800 rounded-lg text-stone-300">
                {language === 'sr' ? randomDrawnEvent.phaseNameSr : randomDrawnEvent.phaseNameEn}
              </span>
            </div>
          </div>

          <p className="text-sm text-stone-200 leading-relaxed font-sans">
            {language === 'sr' ? randomDrawnEvent.descriptionSr : randomDrawnEvent.descriptionEn}
          </p>
        </div>
      )}

      {/* EVENTS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.map(event => {
          const badge = getSeverityBadge(event.severity);
          return (
            <div
              key={event.id}
              className="bg-stone-900/90 border border-stone-800 hover:border-amber-600/50 rounded-xl p-5 shadow-lg transition-all flex flex-col justify-between space-y-4"
            >
              <div>
                {/* Card Header: Names and Severity */}
                <div className="flex items-start justify-between gap-2 pb-3 border-b border-stone-800">
                  <div>
                    <h3 className="font-bold font-display text-lg text-stone-100">
                      {language === 'sr' ? event.nameSr : event.nameEn}
                    </h3>
                    <div className="text-xs font-semibold text-amber-400 italic">
                      {event.originalName}
                    </div>
                  </div>

                  <span className={`px-2 py-0.5 text-[11px] font-bold rounded border shrink-0 ${badge.bg}`}>
                    {language === 'sr' ? badge.labelSr : badge.labelEn}
                  </span>
                </div>

                {/* Subheader: Phase & Pile Origin */}
                <div className="mt-3 flex items-center justify-between text-xs text-stone-400 font-mono">
                  <span className="px-2 py-0.5 rounded bg-stone-950 border border-stone-800 text-stone-300">
                    {language === 'sr' ? event.phaseNameSr : event.phaseNameEn}
                  </span>
                  {event.scenarioOrPile && (
                    <span className="text-[11px] text-amber-500/90 font-medium">
                      {event.scenarioOrPile}
                    </span>
                  )}
                </div>

                {/* Effect Text */}
                <div className="mt-3.5 p-3.5 bg-stone-950/90 border border-stone-800 rounded-lg">
                  <div className="text-xs text-stone-200 leading-relaxed">
                    {language === 'sr' ? event.descriptionSr : event.descriptionEn}
                  </div>
                </div>
              </div>

              {/* Expansion Source Tag */}
              <div className="pt-2 border-t border-stone-800/60 flex items-center justify-between text-[11px] text-stone-500 font-mono">
                <span>
                  {event.expansion === 'trade_intrigue' ? 'Trade & Intrigue' : event.expansion === 'invasion' ? 'Invasion Expansion' : 'Base Game'}
                </span>
                <span className="uppercase">{event.severity}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* TORTURE RULES MODAL */}
      {showTortureModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-stone-900 border border-stone-800 rounded-2xl max-w-2xl w-full p-6 space-y-5 shadow-2xl max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-stone-800">
              <h3 className="text-xl font-bold font-display text-rose-400 flex items-center gap-2">
                <Skull className="w-5 h-5" />
                {language === 'sr' ? 'Pravila Mučenja (Torture / Bankrot)' : 'Torture Rules & Hierarchy'}
              </h3>
              <button
                onClick={() => setShowTortureModal(false)}
                className="text-stone-400 hover:text-stone-200 text-sm font-bold px-2 py-1 bg-stone-800 rounded cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-sm text-stone-300 leading-relaxed">
              {language === 'sr'
                ? 'Kada god morate platiti novčić ili hranu (npr. u Popisu, Žetvi, Porezu) a nemate dovoljno, morate pretrpeti Mučenje. Za svaki nedostajući novčić, morate trajno odbaciti jednu stavku sa spiska:'
                : 'Whenever you must pay coins or food and cannot do so, you undergo Torture. For every missing coin, discard one item permanently:'}
            </p>

            <div className="space-y-2.5">
              {TORTURE_OPTIONS.map((opt, idx) => (
                <div key={opt.id} className="p-3 bg-stone-950 border border-stone-800 rounded-xl flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-rose-950 text-rose-300 border border-rose-800 font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <div>
                    <div className="text-sm font-bold text-stone-200">
                      {language === 'sr' ? opt.nameSr : opt.nameEn}
                    </div>
                    <div className="text-xs text-stone-400 mt-0.5">
                      {language === 'sr' ? opt.descSr : opt.descEn}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 bg-amber-950/30 border border-amber-800/40 rounded-xl text-xs text-amber-300">
              📌 <strong>{language === 'sr' ? 'Napomena:' : 'Note:'}</strong> {language === 'sr' ? 'Sve izgubljene stvari se trajno uklanjaju iz igre. Jedino se Razvojni poeni mogu ponovo osvojiti tokom partije.' : 'All discarded items are removed from game. Only Development Points can be re-gained.'}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
