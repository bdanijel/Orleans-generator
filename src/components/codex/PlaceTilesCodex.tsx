import { useState } from 'react';
import { Language, PlaceCategory, FollowerType, GameExpansion } from '../../types/orleans';
import { PLACE_TILES_DATA } from '../../data/rulesData';
import { FollowerBadge, DevStarIcon, CoinIcon, BrocadeIcon, TechCogIcon } from '../common/Icons';
import { Search, Filter, Sparkles, BookOpen, Layers, Info, CheckCircle2 } from 'lucide-react';

interface PlaceTilesCodexProps {
  language: Language;
}

export function PlaceTilesCodex({ language }: PlaceTilesCodexProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedExpansion, setSelectedExpansion] = useState<'all' | GameExpansion>('all');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'I' | 'II'>('all');
  const [selectedType, setSelectedType] = useState<'all' | 'goods' | 'coins' | 'development' | 'special' | 'movement'>('all');
  const [selectedWorker, setSelectedWorker] = useState<string>('all');

  const filteredTiles = PLACE_TILES_DATA.filter(tile => {
    // Search
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = 
      tile.nameSr.toLowerCase().includes(searchLower) ||
      tile.nameEn.toLowerCase().includes(searchLower) ||
      tile.originalName.toLowerCase().includes(searchLower) ||
      tile.effectSr.toLowerCase().includes(searchLower) ||
      tile.effectEn.toLowerCase().includes(searchLower);

    // Expansion
    const matchesExpansion = selectedExpansion === 'all' || tile.expansion === selectedExpansion;

    // Category
    const matchesCategory = selectedCategory === 'all' || tile.category === selectedCategory;

    // Type
    const matchesType = selectedType === 'all' || tile.type === selectedType;

    // Worker
    const matchesWorker = selectedWorker === 'all' || 
      (selectedWorker === 'any' && tile.anyWorker) ||
      tile.workersNeeded.includes(selectedWorker as FollowerType);

    return matchesSearch && matchesExpansion && matchesCategory && matchesType && matchesWorker;
  });

  return (
    <div className="space-y-8">
      {/* Header & Search / Filters */}
      <div className="bg-stone-900/90 border border-stone-800 rounded-xl p-6 shadow-xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-stone-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-500 uppercase tracking-wider mb-1">
              <BookOpen className="w-4 h-4" />
              {language === 'sr' ? 'Katalog Zgrada i Mesta (Ortskarten)' : 'Place Tiles Codex'}
            </div>
            <h2 className="text-2xl font-bold text-stone-100 font-display">
              {language === 'sr' ? 'Sve Zgrade: Osnovna Igra + Ekspanzije' : 'All Place Tiles: Base Game + Expansions'}
            </h2>
            <p className="text-sm text-stone-400 mt-0.5">
              {language === 'sr' 
                ? 'Kompletan katalog zgrada iz osnovne igre, Trade & Intrigue (Brasserie, Merchant House, Sheep Farm) i Invasion (Well, Tavern, Depot, Market Stand...).' 
                : 'Complete encyclopedia of Place Tiles including Trade & Intrigue and Invasion expansions.'}
            </p>
          </div>

          <div className="text-xs font-mono px-3 py-1.5 bg-stone-950 border border-stone-800 rounded-lg text-amber-400">
            {filteredTiles.length} / {PLACE_TILES_DATA.length} {language === 'sr' ? 'zgrada' : 'buildings'}
          </div>
        </div>

        {/* Expansion Selection Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          <span className="text-xs text-stone-400 font-semibold shrink-0 mr-1">{language === 'sr' ? 'Edicija:' : 'Edition:'}</span>
          {[
            { id: 'all', labelSr: 'Sve zgrade', labelEn: 'All Editions' },
            { id: 'base', labelSr: '⚜️ Osnovna (20)', labelEn: 'Base Game (20)' },
            { id: 'trade_intrigue', labelSr: '📜 Trade & Intrigue (3)', labelEn: 'Trade & Intrigue (3)' },
            { id: 'invasion', labelSr: '⚔️ Invasion (7)', labelEn: 'Invasion (7)' }
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

        {/* Filter Controls */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-4">
          {/* Search Box */}
          <div className="md:col-span-4 relative">
            <Search className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              inputMode="search"
              placeholder={language === 'sr' ? 'Pretraži zgrade, nemačko ime, efekat...' : 'Search place tiles, German name, effect...'}
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

          {/* Category Tabs */}
          <div className="md:col-span-3 flex items-center p-1 bg-stone-950 border border-stone-800 rounded-xl">
            {(['all', 'I', 'II'] as const).map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition cursor-pointer min-h-[38px] ${
                  selectedCategory === cat
                    ? 'bg-amber-600 text-stone-950 shadow-md font-black'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                {cat === 'all' ? (language === 'sr' ? 'Sve' : 'All') : `Kat. ${cat}`}
              </button>
            ))}
          </div>

          {/* Type Filter */}
          <div className="md:col-span-5 flex items-center gap-1.5 overflow-x-auto p-1 bg-stone-950 border border-stone-800 rounded-xl no-scrollbar">
            {[
              { id: 'all', nameSr: 'Sve vrste', nameEn: 'All types' },
              { id: 'goods', nameSr: 'Roba', nameEn: 'Goods' },
              { id: 'coins', nameSr: 'Novac', nameEn: 'Coins' },
              { id: 'development', nameSr: 'Razvoj', nameEn: 'Development' },
              { id: 'special', nameSr: 'Specijalno', nameEn: 'Special' },
              { id: 'movement', nameSr: 'Kretanje', nameEn: 'Movement' },
            ].map(t => (
              <button
                key={t.id}
                onClick={() => setSelectedType(t.id as any)}
                className={`px-3 py-2 text-xs font-semibold rounded-lg whitespace-nowrap transition cursor-pointer min-h-[38px] flex items-center ${
                  selectedType === t.id
                    ? 'bg-stone-800 text-amber-400 border border-amber-500/40 font-bold'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                {language === 'sr' ? t.nameSr : t.nameEn}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid of Place Tiles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTiles.map(tile => {
          return (
            <div
              key={tile.id}
              className="bg-stone-900/90 border border-stone-800 hover:border-amber-600/50 rounded-xl p-5 shadow-lg transition-all flex flex-col justify-between space-y-4"
            >
              <div>
                {/* Header: Name, Original German Name, Expansion & Category */}
                <div className="flex items-start justify-between gap-2 pb-3 border-b border-stone-800">
                  <div>
                    <h3 className="font-bold font-display text-lg text-stone-100">
                      {language === 'sr' ? tile.nameSr : tile.nameEn}
                    </h3>
                    <div className="text-xs text-stone-400 italic">
                      {tile.originalName}
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1">
                    <span className="px-2 py-0.5 rounded bg-stone-950 border border-stone-700 text-amber-400 font-mono font-bold text-xs">
                      Kat. {tile.category}
                    </span>
                    <span className="text-[10px] text-stone-400 font-mono">
                      {tile.expansion === 'trade_intrigue' ? 'Trade & Intrigue' : tile.expansion === 'invasion' ? 'Invasion' : 'Base'}
                    </span>
                  </div>
                </div>

                {/* Worker Requirements */}
                <div className="mt-3.5 space-y-1.5">
                  <div className="text-[11px] uppercase font-bold text-stone-400 tracking-wider">
                    {language === 'sr' ? 'Potrebni pratioci za aktivaciju:' : 'Required Followers to Activate:'}
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {tile.anyWorker ? (
                      <div className="inline-flex items-center gap-1 px-2 py-1 rounded bg-amber-950/60 border border-amber-700/60 text-amber-300 text-xs font-medium">
                        <span>✨</span>
                        <span>{language === 'sr' ? 'Bilo koji pratilac' : 'Any Character Tile'}</span>
                      </div>
                    ) : (
                      tile.workersNeeded.map((w, idx) => (
                        <FollowerBadge key={idx} type={w} size={26} showLabel language={language} />
                      ))
                    )}
                  </div>
                </div>

                {/* Effect Text */}
                <div className="mt-4 p-3.5 bg-stone-950/80 border border-stone-800/80 rounded-lg">
                  <div className="text-xs text-stone-200 leading-relaxed">
                    {language === 'sr' ? tile.effectSr : tile.effectEn}
                  </div>
                </div>
              </div>

              {/* Type Badge */}
              <div className="pt-2 border-t border-stone-800/60 flex items-center justify-between text-xs text-stone-500 font-mono">
                <span>{tile.type.toUpperCase()}</span>
                <span>{tile.expansion.toUpperCase()}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
