import { useState, useEffect } from 'react';
import { Language, PlayerScore, GoodType, GameExpansion, GameMode, CoopInvasionState } from '../../types/orleans';
import { 
  GOODS_DATA, 
  COOP_INVASION_GOALS, 
  CHARACTER_OBJECTIVES_DATA, 
  DUEL_OBJECTIVES_DATA 
} from '../../data/rulesData';
import { 
  BrocadeIcon, 
  WoolIcon, 
  WineIcon, 
  CheeseIcon, 
  GrainIcon, 
  CoinIcon, 
  CitizenIcon, 
  TradingStationIcon, 
  DevStarIcon,
  FleurDeLisIcon
} from '../common/Icons';
import { 
  Trophy, 
  Plus, 
  Minus,
  Trash2, 
  RotateCcw, 
  Copy, 
  Check, 
  Award, 
  Sparkles, 
  ShieldAlert, 
  ShieldCheck, 
  Building2, 
  Package, 
  Swords, 
  Layers, 
  Users,
  ChevronDown
} from 'lucide-react';

interface ScoringCalculatorProps {
  language: Language;
}

const PLAYER_COLORS: Array<{ id: 'blue' | 'red' | 'yellow' | 'green' | 'black'; nameSr: string; nameEn: string; bg: string; border: string; text: string; dot: string }> = [
  { id: 'blue', nameSr: 'Plavi', nameEn: 'Blue', bg: 'bg-blue-950/80', border: 'border-blue-600', text: 'text-blue-400', dot: 'bg-blue-500' },
  { id: 'red', nameSr: 'Crveni', nameEn: 'Red', bg: 'bg-red-950/80', border: 'border-red-600', text: 'text-red-400', dot: 'bg-red-500' },
  { id: 'yellow', nameSr: 'Žuti', nameEn: 'Yellow', bg: 'bg-amber-950/80', border: 'border-amber-500', text: 'text-amber-400', dot: 'bg-amber-400' },
  { id: 'green', nameSr: 'Zeleni', nameEn: 'Green', bg: 'bg-emerald-950/80', border: 'border-emerald-600', text: 'text-emerald-400', dot: 'bg-emerald-500' },
  { id: 'black', nameSr: 'Crni', nameEn: 'Black', bg: 'bg-stone-950', border: 'border-stone-600', text: 'text-stone-300', dot: 'bg-stone-500' }
];

// Touch-friendly stepper for mobile & tablet thumb interaction
function TouchStepper({
  value,
  onChange,
  min = 0,
  max = 999,
  step = 1,
  quickSteps
}: {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
  quickSteps?: number[];
}) {
  return (
    <div className="flex items-center gap-1.5 select-none">
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - step))}
        className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-stone-900 hover:bg-stone-850 active:bg-stone-800 border border-stone-800 text-stone-200 font-bold text-lg flex items-center justify-center cursor-pointer transition active:scale-95 shrink-0"
        aria-label="Smanji vrednost"
      >
        <Minus className="w-4 h-4" />
      </button>

      <input
        type="number"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Math.min(max, Math.max(min, parseInt(e.target.value) || 0)))}
        className="w-14 sm:w-16 h-10 sm:h-11 text-center bg-stone-900 border border-stone-800 rounded-xl text-stone-100 font-mono font-bold text-base focus:border-amber-500 focus:outline-none"
      />

      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + step))}
        className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-stone-900 hover:bg-stone-850 active:bg-stone-800 border border-stone-800 text-stone-200 font-bold text-lg flex items-center justify-center cursor-pointer transition active:scale-95 shrink-0"
        aria-label="Povećaj vrednost"
      >
        <Plus className="w-4 h-4" />
      </button>

      {quickSteps?.map((qs) => (
        <button
          key={qs}
          type="button"
          onClick={() => onChange(Math.min(max, value + qs))}
          className="h-10 sm:h-11 px-2.5 rounded-xl bg-stone-900/80 hover:bg-stone-850 active:bg-stone-800 border border-stone-800 text-amber-400 font-mono text-xs font-bold transition active:scale-95 cursor-pointer"
        >
          +{qs}
        </button>
      ))}
    </div>
  );
}

export function ScoringCalculator({ language }: ScoringCalculatorProps) {
  const [selectedExpansion, setSelectedExpansion] = useState<GameExpansion>('base');
  const [selectedMode, setSelectedMode] = useState<GameMode>('base');
  const [activeTab, setActiveTab] = useState<'scores' | 'coop' | 'duel' | 'solo'>('scores');
  const [focusedPlayerId, setFocusedPlayerId] = useState<string>('all');

  const [players, setPlayers] = useState<PlayerScore[]>(() => {
    const saved = localStorage.getItem('orleans_calc_players_v2');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return [
      {
        id: 'p1',
        name: 'Igrač 1',
        color: 'blue',
        coins: 10,
        brocade: 1,
        wool: 2,
        wine: 2,
        cheese: 3,
        grain: 2,
        tradingStations: 5,
        citizenTiles: 3,
        developmentStatus: 4,
        developmentTrackPosition: 18,
        hasMostTradingStationsBonus: false,
        ordersVP: 0,
        merchantHouseGoodsCount: 0,
        completedStructuresVP: 0,
        hasDepotCompleteSets: 0,
        duelObjectivesCompleted: 0
      },
      {
        id: 'p2',
        name: 'Igrač 2',
        color: 'red',
        coins: 14,
        brocade: 2,
        wool: 1,
        wine: 3,
        cheese: 1,
        grain: 4,
        tradingStations: 6,
        citizenTiles: 2,
        developmentStatus: 3,
        developmentTrackPosition: 14,
        hasMostTradingStationsBonus: true,
        ordersVP: 0,
        merchantHouseGoodsCount: 0,
        completedStructuresVP: 0,
        hasDepotCompleteSets: 0,
        duelObjectivesCompleted: 0
      }
    ];
  });

  // Cooperative Invasion Mode State
  const [coopState, setCoopState] = useState<CoopInvasionState>(() => ({
    playerCount: 4,
    cityWallsKnightsPlaced: 10,
    citizenTilesCollected: 9,
    cityTreasuryCoins: 50,
    warehouseGrain: 12,
    warehouseCheese: 6,
    warehouseWine: 6,
    fortifiedTowersBuilt: 11,
    characterCardsCompleted: {
      char_1: false,
      char_2: false,
      char_3: false,
      char_4: false
    }
  }));

  // Solo scenario state
  const [soloDignitaryCitizens, setSoloDignitaryCitizens] = useState<number>(6);

  const [copied, setCopied] = useState(false);

  useEffect(() => {
    localStorage.setItem('orleans_calc_players_v2', JSON.stringify(players));
  }, [players]);

  const updatePlayerField = <K extends keyof PlayerScore>(id: string, field: K, value: PlayerScore[K]) => {
    setPlayers(prev => prev.map(p => {
      if (p.id !== id) return p;
      return { ...p, [field]: value };
    }));
  };

  const calculateGoodsVP = (p: PlayerScore): number => {
    return (
      p.brocade * GOODS_DATA.brocade.vp +
      p.wool * GOODS_DATA.wool.vp +
      p.wine * GOODS_DATA.wine.vp +
      p.cheese * GOODS_DATA.cheese.vp +
      p.grain * GOODS_DATA.grain.vp
    );
  };

  const calculatePlayerTotalVP = (p: PlayerScore): number => {
    const coinsVP = p.coins;
    const goodsVP = calculateGoodsVP(p);
    const effectiveCitizens = p.citizenTiles + (p.hasMostTradingStationsBonus ? 1 : 0);
    const devMultiplier = p.developmentStatus;
    const devVP = (p.tradingStations + effectiveCitizens) * devMultiplier;

    let expansionVP = 0;
    if (selectedExpansion === 'trade_intrigue') {
      expansionVP += (p.ordersVP || 0);
      expansionVP += (p.merchantHouseGoodsCount || 0) * 4;
    }

    if (selectedMode === 'invasion_prosperity') {
      expansionVP += (p.completedStructuresVP || 0);
      expansionVP += (p.hasDepotCompleteSets || 0) * 5;
    }

    return coinsVP + goodsVP + devVP + expansionVP;
  };

  const rankedPlayers = [...players].sort((a, b) => {
    const totalA = calculatePlayerTotalVP(a);
    const totalB = calculatePlayerTotalVP(b);
    if (totalB !== totalA) return totalB - totalA;
    if (b.developmentTrackPosition !== a.developmentTrackPosition) {
      return b.developmentTrackPosition - a.developmentTrackPosition;
    }
    return calculateGoodsVP(b) - calculateGoodsVP(a);
  });

  const addPlayer = () => {
    const maxPlayers = selectedExpansion === 'invasion' ? 5 : 4;
    if (players.length >= maxPlayers) return;

    const availableColors: Array<'blue' | 'red' | 'yellow' | 'green' | 'black'> = ['blue', 'red', 'yellow', 'green', 'black'];
    const usedColors = players.map(p => p.color);
    const nextColor = availableColors.find(c => !usedColors.includes(c)) || 'black';

    const newPlayer: PlayerScore = {
      id: `p_${Date.now()}`,
      name: `${language === 'sr' ? 'Igrač' : 'Player'} ${players.length + 1}`,
      color: nextColor,
      coins: 5,
      brocade: 0,
      wool: 0,
      wine: 0,
      cheese: 0,
      grain: 0,
      tradingStations: 0,
      citizenTiles: 0,
      developmentStatus: 1,
      developmentTrackPosition: 0,
      hasMostTradingStationsBonus: false,
      ordersVP: 0,
      merchantHouseGoodsCount: 0,
      completedStructuresVP: 0,
      hasDepotCompleteSets: 0,
      duelObjectivesCompleted: 0
    };
    setPlayers([...players, newPlayer]);
  };

  const removePlayer = (id: string) => {
    if (players.length <= 1) return;
    setPlayers(players.filter(p => p.id !== id));
    if (focusedPlayerId === id) setFocusedPlayerId('all');
  };

  const handleReset = () => {
    if (window.confirm(language === 'sr' ? 'Resetovati sve poene na početne vrednosti?' : 'Reset all player scores to default?')) {
      setPlayers(prev => prev.map(p => ({
        ...p,
        coins: 5,
        brocade: 0,
        wool: 0,
        wine: 0,
        cheese: 0,
        grain: 0,
        tradingStations: 0,
        citizenTiles: 0,
        developmentStatus: 1,
        developmentTrackPosition: 0,
        hasMostTradingStationsBonus: false,
        ordersVP: 0,
        merchantHouseGoodsCount: 0,
        completedStructuresVP: 0,
        hasDepotCompleteSets: 0,
        duelObjectivesCompleted: 0
      })));
    }
  };

  const copyResults = () => {
    let text = `⚜️ ORLÉANS BODOVANJE ⚜️\n`;
    text += `Mod: ${selectedMode}\n`;
    text += `---------------------------------\n`;
    rankedPlayers.forEach((p, idx) => {
      const total = calculatePlayerTotalVP(p);
      text += `${idx + 1}. ${p.name} (${p.color.toUpperCase()}): ${total} VP\n`;
      text += `   • Novac: ${p.coins} VP | Roba: ${calculateGoodsVP(p)} VP\n`;
      text += `   • Ispostave & Građani: ${(p.tradingStations + p.citizenTiles + (p.hasMostTradingStationsBonus ? 1 : 0))} × ${p.developmentStatus} = ${(p.tradingStations + p.citizenTiles + (p.hasMostTradingStationsBonus ? 1 : 0)) * p.developmentStatus} VP\n`;
      if (p.ordersVP) text += `   • Narudžbine (Orders): +${p.ordersVP} VP\n`;
      if (p.completedStructuresVP) text += `   • Građevine (Structures): +${p.completedStructuresVP} VP\n`;
      if (p.hasDepotCompleteSets) text += `   • Skladište (Depot): +${p.hasDepotCompleteSets * 5} VP\n`;
    });
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // Co-op Evaluation
  const coopGoals = {
    knights: coopState.cityWallsKnightsPlaced >= COOP_INVASION_GOALS.cityWallsKnights[coopState.playerCount],
    citizens: coopState.citizenTilesCollected >= COOP_INVASION_GOALS.citizenTiles[coopState.playerCount],
    treasury: coopState.cityTreasuryCoins >= COOP_INVASION_GOALS.cityTreasuryCoins[coopState.playerCount],
    warehouse: (
      coopState.warehouseGrain >= COOP_INVASION_GOALS.warehouseGrain[coopState.playerCount] &&
      coopState.warehouseCheese >= COOP_INVASION_GOALS.warehouseCheese[coopState.playerCount] &&
      coopState.warehouseWine >= COOP_INVASION_GOALS.warehouseWine[coopState.playerCount]
    ),
    towers: coopState.fortifiedTowersBuilt >= COOP_INVASION_GOALS.fortifiedTowersTotal,
    characters: Object.values(coopState.characterCardsCompleted).every(v => v === true)
  };

  const isCoopVictory = Object.values(coopGoals).every(v => v === true);

  // Filter visible players based on mobile focus
  const visiblePlayers = focusedPlayerId === 'all' 
    ? players 
    : players.filter(p => p.id === focusedPlayerId);

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Top Banner & Mode Selection */}
      <div className="bg-stone-900/95 border border-stone-800 rounded-2xl p-4 sm:p-6 shadow-xl space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-stone-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-500 uppercase tracking-wider mb-1">
              <Trophy className="w-4 h-4" />
              {language === 'sr' ? 'Kalkulator Bodovanja' : 'Scoring Calculator'}
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-stone-100 font-display">
              {language === 'sr' ? 'Obračun Pobedničkih Poena (VP)' : 'Victory Points Calculation'}
            </h2>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-stone-950 border border-stone-800 rounded-xl">
            <button
              onClick={() => {
                setSelectedExpansion('base');
                setSelectedMode('base');
                setActiveTab('scores');
              }}
              className={`px-3 py-2 rounded-lg text-xs font-bold transition cursor-pointer min-h-[40px] ${
                selectedExpansion === 'base' ? 'bg-amber-600 text-stone-950 font-black shadow-md' : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              ⚜️ {language === 'sr' ? 'Osnovna Igra' : 'Base Game'}
            </button>

            <button
              onClick={() => {
                setSelectedExpansion('trade_intrigue');
                setSelectedMode('trade_orders');
                setActiveTab('scores');
              }}
              className={`px-3 py-2 rounded-lg text-xs font-bold transition cursor-pointer min-h-[40px] ${
                selectedExpansion === 'trade_intrigue' ? 'bg-amber-600 text-stone-950 font-black shadow-md' : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              📜 Trade &amp; Intrigue
            </button>

            <button
              onClick={() => {
                setSelectedExpansion('invasion');
                setSelectedMode('invasion_prosperity');
                setActiveTab('scores');
              }}
              className={`px-3 py-2 rounded-lg text-xs font-bold transition cursor-pointer min-h-[40px] ${
                selectedExpansion === 'invasion' ? 'bg-amber-600 text-stone-950 font-black shadow-md' : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              ⚔️ Invasion
            </button>
          </div>
        </div>

        {/* Sub-modes for Invasion */}
        {selectedExpansion === 'invasion' && (
          <div className="flex flex-wrap items-center gap-2 pt-1 pb-1">
            <button
              onClick={() => {
                setSelectedMode('invasion_prosperity');
                setActiveTab('scores');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer min-h-[38px] ${
                selectedMode === 'invasion_prosperity' ? 'bg-amber-600 text-stone-950 font-bold' : 'bg-stone-800 text-stone-300'
              }`}
            >
              🏛️ Prosperity
            </button>

            <button
              onClick={() => {
                setSelectedMode('invasion_coop');
                setActiveTab('coop');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer min-h-[38px] ${
                selectedMode === 'invasion_coop' ? 'bg-amber-600 text-stone-950 font-bold' : 'bg-stone-800 text-stone-300'
              }`}
            >
              🛡️ Invasion Odbrana Grada (Koop)
            </button>

            <button
              onClick={() => {
                setSelectedMode('invasion_duel');
                setActiveTab('duel');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer min-h-[38px] ${
                selectedMode === 'invasion_duel' ? 'bg-amber-600 text-stone-950 font-bold' : 'bg-stone-800 text-stone-300'
              }`}
            >
              ⚔️ The Duel (Dvoboj)
            </button>

            <button
              onClick={() => {
                setSelectedMode('invasion_solo_dignitary');
                setActiveTab('solo');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer min-h-[38px] ${
                selectedMode.startsWith('invasion_solo') ? 'bg-amber-600 text-stone-950 font-bold' : 'bg-stone-800 text-stone-300'
              }`}
            >
              👤 Solo Scenariji
            </button>
          </div>
        )}

        {/* Action Controls: Add Player, Reset, Copy */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-stone-800">
          <div className="flex items-center gap-2">
            {activeTab !== 'coop' && activeTab !== 'duel' && activeTab !== 'solo' && (
              <button
                onClick={addPlayer}
                disabled={players.length >= (selectedExpansion === 'invasion' ? 5 : 4)}
                className="px-3.5 py-2 bg-stone-800 hover:bg-stone-750 active:bg-stone-700 disabled:opacity-40 text-stone-200 text-xs font-bold rounded-xl border border-stone-700 flex items-center gap-1.5 transition cursor-pointer min-h-[42px]"
              >
                <Plus className="w-4 h-4 text-amber-500" />
                <span>{language === 'sr' ? 'Dodaj igrača' : 'Add Player'}</span>
              </button>
            )}

            <button
              onClick={handleReset}
              className="p-2.5 bg-stone-800 hover:bg-stone-750 active:bg-stone-700 text-stone-400 hover:text-stone-200 rounded-xl border border-stone-700 transition cursor-pointer min-h-[42px] min-w-[42px] flex items-center justify-center"
              title={language === 'sr' ? 'Resetuj poene' : 'Reset Scores'}
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={copyResults}
            className="px-4 py-2 bg-stone-800 hover:bg-stone-750 active:bg-stone-700 text-amber-400 text-xs font-bold rounded-xl border border-amber-600/40 flex items-center gap-2 transition cursor-pointer min-h-[42px]"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? (language === 'sr' ? 'Kopirano!' : 'Copied!') : (language === 'sr' ? 'Kopiraj pregled' : 'Copy Summary')}</span>
          </button>
        </div>
      </div>

      {/* MOBILE / TABLET QUICK PLAYER SWITCHER */}
      {selectedMode !== 'invasion_coop' && players.length > 1 && (
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider shrink-0 mr-1 hidden sm:inline">
            {language === 'sr' ? 'Prikaz:' : 'View:'}
          </span>
          <button
            onClick={() => setFocusedPlayerId('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap min-h-[38px] ${
              focusedPlayerId === 'all'
                ? 'bg-amber-600 text-stone-950 font-black shadow-md'
                : 'bg-stone-900 border border-stone-800 text-stone-400 hover:text-stone-200'
            }`}
          >
            {language === 'sr' ? '👥 Svi Igrači' : '👥 All Players'}
          </button>

          {players.map((p) => {
            const colorObj = PLAYER_COLORS.find(c => c.id === p.color);
            const isFocused = focusedPlayerId === p.id;
            return (
              <button
                key={p.id}
                onClick={() => setFocusedPlayerId(p.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap min-h-[38px] ${
                  isFocused
                    ? 'bg-amber-600 text-stone-950 font-black shadow-md'
                    : 'bg-stone-900 border border-stone-800 text-stone-300 hover:text-stone-100'
                }`}
              >
                <span className={`w-2.5 h-2.5 rounded-full ${colorObj?.dot || 'bg-amber-500'}`} />
                <span>{p.name}</span>
                <span className={`font-mono text-[11px] ${isFocused ? 'text-stone-950 font-black' : 'text-amber-400'}`}>
                  ({calculatePlayerTotalVP(p)})
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* COOPERATIVE INVASION EVALUATOR TAB */}
      {selectedMode === 'invasion_coop' && (
        <div className="bg-stone-900/95 border border-stone-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-6">
          <div className={`p-5 sm:p-6 rounded-2xl border text-center space-y-2 ${
            isCoopVictory 
              ? 'bg-emerald-950/40 border-emerald-600 text-emerald-200 shadow-xl shadow-emerald-950/50' 
              : 'bg-stone-950/80 border-stone-800 text-stone-300'
          }`}>
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-stone-900 border border-stone-700 mb-1">
              {isCoopVictory ? <ShieldCheck className="w-7 h-7 text-emerald-400" /> : <ShieldAlert className="w-7 h-7 text-amber-500" />}
            </div>
            <h3 className="text-xl sm:text-2xl font-bold font-display">
              {isCoopVictory 
                ? (language === 'sr' ? '🎉 POBEDA! Grad Orlean je uspešno odbranjen!' : '🎉 VICTORY! Orléans has been defended!')
                : (language === 'sr' ? '⚔️ Odbrana u toku: Ispunite sve ciljeve pre kraja poslednje runde' : '⚔️ Defense in Progress: Complete all objectives')}
            </h3>
            <p className="text-xs text-stone-400 max-w-xl mx-auto">
              {language === 'sr'
                ? 'U kooperativnom modu svi igrači pobeđuju zajedno ako su ispunjeni SVIH 5 Zajedničkih ciljeva I SVI Lični ciljevi karaktera!'
                : 'In co-op mode, all players win together if ALL 5 Common Objectives AND all Personal Objectives are met!'}
            </p>
          </div>

          {/* 5 Common Objectives */}
          <div className="space-y-4">
            <h4 className="text-base sm:text-lg font-bold font-display text-amber-400 flex items-center gap-2">
              <Layers className="w-5 h-5" />
              {language === 'sr' ? '5 Zajedničkih Ciljeva Odbrane Grada:' : '5 Common City Defense Objectives:'}
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {/* Objective 1: City Walls */}
              <div className={`p-4 rounded-xl border ${coopGoals.knights ? 'bg-emerald-950/30 border-emerald-700/60' : 'bg-stone-950 border-stone-800'}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-stone-100 text-sm">1. Gradske zidine (Vitezovi)</span>
                  {coopGoals.knights && <Check className="w-4 h-4 text-emerald-400" />}
                </div>
                <div className="text-xs text-stone-400 mb-2">
                  Potrebno: <strong>{COOP_INVASION_GOALS.cityWallsKnights[coopState.playerCount]}</strong> Vitezova
                </div>
                <TouchStepper
                  value={coopState.cityWallsKnightsPlaced}
                  onChange={(v) => setCoopState({ ...coopState, cityWallsKnightsPlaced: v })}
                  min={0}
                  max={20}
                />
              </div>

              {/* Objective 2: Citizen Tiles */}
              <div className={`p-4 rounded-xl border ${coopGoals.citizens ? 'bg-emerald-950/30 border-emerald-700/60' : 'bg-stone-950 border-stone-800'}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-stone-100 text-sm">2. Žetoni Građana</span>
                  {coopGoals.citizens && <Check className="w-4 h-4 text-emerald-400" />}
                </div>
                <div className="text-xs text-stone-400 mb-2">
                  Potrebno: <strong>{COOP_INVASION_GOALS.citizenTiles[coopState.playerCount]}</strong> Građana
                </div>
                <TouchStepper
                  value={coopState.citizenTilesCollected}
                  onChange={(v) => setCoopState({ ...coopState, citizenTilesCollected: v })}
                  min={0}
                  max={15}
                />
              </div>

              {/* Objective 3: City Treasury */}
              <div className={`p-4 rounded-xl border ${coopGoals.treasury ? 'bg-emerald-950/30 border-emerald-700/60' : 'bg-stone-950 border-stone-800'}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-stone-100 text-sm">3. Gradska riznica (Novac)</span>
                  {coopGoals.treasury && <Check className="w-4 h-4 text-emerald-400" />}
                </div>
                <div className="text-xs text-stone-400 mb-2">
                  Potrebno: <strong>{COOP_INVASION_GOALS.cityTreasuryCoins[coopState.playerCount]}</strong> Novčića
                </div>
                <TouchStepper
                  value={coopState.cityTreasuryCoins}
                  onChange={(v) => setCoopState({ ...coopState, cityTreasuryCoins: v })}
                  min={0}
                  max={100}
                  quickSteps={[5, 10]}
                />
              </div>

              {/* Objective 4: Warehouse Goods */}
              <div className={`p-4 rounded-xl border ${coopGoals.warehouse ? 'bg-emerald-950/30 border-emerald-700/60' : 'bg-stone-950 border-stone-800'}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-stone-100 text-sm">4. Magacin Robe</span>
                  {coopGoals.warehouse && <Check className="w-4 h-4 text-emerald-400" />}
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span>Žito ({COOP_INVASION_GOALS.warehouseGrain[coopState.playerCount]}):</span>
                    <TouchStepper
                      value={coopState.warehouseGrain}
                      onChange={(v) => setCoopState({ ...coopState, warehouseGrain: v })}
                      min={0}
                      max={24}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Sir ({COOP_INVASION_GOALS.warehouseCheese[coopState.playerCount]}):</span>
                    <TouchStepper
                      value={coopState.warehouseCheese}
                      onChange={(v) => setCoopState({ ...coopState, warehouseCheese: v })}
                      min={0}
                      max={21}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Vino ({COOP_INVASION_GOALS.warehouseWine[coopState.playerCount]}):</span>
                    <TouchStepper
                      value={coopState.warehouseWine}
                      onChange={(v) => setCoopState({ ...coopState, warehouseWine: v })}
                      min={0}
                      max={18}
                    />
                  </div>
                </div>
              </div>

              {/* Objective 5: Fortified Towers */}
              <div className={`p-4 rounded-xl border ${coopGoals.towers ? 'bg-emerald-950/30 border-emerald-700/60' : 'bg-stone-950 border-stone-800'}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-stone-100 text-sm">5. Utvrđene Kule</span>
                  {coopGoals.towers && <Check className="w-4 h-4 text-emerald-400" />}
                </div>
                <div className="text-xs text-stone-400 mb-2">
                  Potrebno: <strong>{COOP_INVASION_GOALS.fortifiedTowersTotal}</strong> Kula ukupno
                </div>
                <TouchStepper
                  value={coopState.fortifiedTowersBuilt}
                  onChange={(v) => setCoopState({ ...coopState, fortifiedTowersBuilt: v })}
                  min={0}
                  max={13}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MAIN STANDARD / EXPANSION COMPETITIVE SCORING */}
      {selectedMode !== 'invasion_coop' && (
        <div className="space-y-6">
          {/* Winner Banner */}
          {rankedPlayers.length > 0 && (
            <div className="p-4 sm:p-6 bg-gradient-to-r from-amber-950/40 via-stone-900 to-amber-950/40 border border-amber-500/40 rounded-2xl shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3.5 text-center sm:text-left">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0 shadow-inner">
                  <Trophy className="w-7 h-7 sm:w-8 sm:h-8" />
                </div>
                <div>
                  <div className="text-[10px] sm:text-xs uppercase font-bold text-amber-500 tracking-wider">
                    {language === 'sr' ? 'Trenutni Pobednik' : 'Current Winner'}
                  </div>
                  <div className="text-xl sm:text-2xl font-black font-display text-stone-100">
                    {rankedPlayers[0].name}
                  </div>
                  <div className="text-xs text-stone-400 font-mono">
                    {calculatePlayerTotalVP(rankedPlayers[0])} VP
                  </div>
                </div>
              </div>

              {/* Ranks list */}
              <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto max-w-full pb-1">
                {rankedPlayers.map((p, idx) => (
                  <button
                    key={p.id}
                    onClick={() => setFocusedPlayerId(p.id)}
                    className="text-center px-3 py-1.5 bg-stone-950/80 border border-stone-800 rounded-xl hover:border-amber-500/50 transition cursor-pointer shrink-0"
                  >
                    <div className="text-[10px] text-stone-400 font-bold">#{idx + 1}</div>
                    <div className="text-xs font-bold text-stone-200">{p.name}</div>
                    <div className="text-xs font-mono font-bold text-amber-400">{calculatePlayerTotalVP(p)} VP</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Player Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
            {visiblePlayers.map(player => {
              const totalVP = calculatePlayerTotalVP(player);
              const goodsVP = calculateGoodsVP(player);
              const effectiveCitizens = player.citizenTiles + (player.hasMostTradingStationsBonus ? 1 : 0);
              const devVP = (player.tradingStations + effectiveCitizens) * player.developmentStatus;
              const colorObj = PLAYER_COLORS.find(c => c.id === player.color);

              return (
                <div
                  key={player.id}
                  className="bg-stone-900/90 border border-stone-800 hover:border-stone-700 rounded-2xl p-4 sm:p-6 shadow-xl space-y-5 flex flex-col justify-between"
                >
                  <div className="space-y-5">
                    {/* Header: Name, Color, Total Score */}
                    <div className="flex items-center justify-between gap-3 pb-3 border-b border-stone-800">
                      <div className="flex items-center gap-2.5">
                        <span className={`w-4 h-4 rounded-full shrink-0 ${colorObj?.dot || 'bg-amber-400'}`} />
                        <input
                          type="text"
                          value={player.name}
                          onChange={(e) => updatePlayerField(player.id, 'name', e.target.value)}
                          className="font-bold font-display text-lg text-stone-100 bg-transparent border-b border-transparent hover:border-stone-700 focus:border-amber-500 px-1 py-0.5 max-w-[160px] sm:max-w-none"
                        />
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <span className="text-2xl sm:text-3xl font-black font-mono text-amber-400">{totalVP}</span>
                          <span className="text-xs text-stone-400 ml-1">VP</span>
                        </div>

                        {players.length > 1 && (
                          <button
                            onClick={() => removePlayer(player.id)}
                            className="p-2 text-stone-600 hover:text-rose-400 transition cursor-pointer min-h-[38px] min-w-[38px] flex items-center justify-center"
                            title="Ukloni igrača"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Section 1: Development Status (Direct Touch Chips 1-6) */}
                    <div className="p-3.5 bg-stone-950 border border-stone-800 rounded-xl space-y-2">
                      <div className="flex items-center justify-between text-xs font-semibold text-amber-400">
                        <div className="flex items-center gap-1.5">
                          <DevStarIcon size={16} />
                          <span>{language === 'sr' ? 'Nivo Razvoja (Množilac):' : 'Development Status:'}</span>
                        </div>
                        <span className="font-mono font-bold text-amber-400">×{player.developmentStatus}</span>
                      </div>

                      <div className="grid grid-cols-6 gap-1.5 sm:gap-2">
                        {[1, 2, 3, 4, 5, 6].map(num => {
                          const isSelected = player.developmentStatus === num;
                          return (
                            <button
                              key={num}
                              type="button"
                              onClick={() => updatePlayerField(player.id, 'developmentStatus', num)}
                              className={`h-11 sm:h-12 rounded-xl flex flex-col items-center justify-center cursor-pointer transition active:scale-95 ${
                                isSelected
                                  ? 'bg-amber-600 text-stone-950 font-black shadow-lg shadow-amber-900/30 ring-2 ring-amber-400'
                                  : 'bg-stone-900 hover:bg-stone-850 text-stone-300 border border-stone-800'
                              }`}
                            >
                              <span className="text-xs text-amber-300">★</span>
                              <span className="text-sm font-bold font-mono leading-none">{num}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Section 2: Coins (Novčići) */}
                    <div className="p-3.5 bg-stone-950 border border-stone-800 rounded-xl space-y-2">
                      <div className="flex items-center justify-between text-xs font-semibold text-amber-400">
                        <div className="flex items-center gap-1.5">
                          <CoinIcon size={16} />
                          <span>{language === 'sr' ? 'Novčići (1 novčić = 1 VP)' : 'Coins (1 coin = 1 VP)'}</span>
                        </div>
                        <span className="font-mono text-stone-300 font-bold">{player.coins} VP</span>
                      </div>

                      <TouchStepper
                        value={player.coins}
                        onChange={(v) => updatePlayerField(player.id, 'coins', v)}
                        min={0}
                        max={999}
                        quickSteps={[5, 10]}
                      />
                    </div>

                    {/* Section 3: Trading Stations & Citizens (Ispostave & Građani) */}
                    <div className="p-3.5 sm:p-4 bg-stone-950 border border-stone-800 rounded-xl space-y-3.5">
                      <div className="flex items-center justify-between text-xs font-bold text-amber-500 uppercase tracking-wider">
                        <span>{language === 'sr' ? 'Trgovačke ispostave & Građani' : 'Stations & Citizens'}</span>
                        <span className="font-mono text-stone-300 text-xs sm:text-sm">
                          ({player.tradingStations} + {effectiveCitizens}) × {player.developmentStatus} = <strong className="text-amber-400">{devVP} VP</strong>
                        </span>
                      </div>

                      <div className="space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <label className="text-xs text-stone-300">
                            {selectedMode === 'invasion_prosperity' ? 'Ispostave u gradovima (max 10):' : 'Trgovačke ispostave (max 10):'}
                          </label>
                          <TouchStepper
                            value={player.tradingStations}
                            onChange={(v) => updatePlayerField(player.id, 'tradingStations', v)}
                            min={0}
                            max={10}
                          />
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-stone-850">
                          <label className="text-xs text-stone-300">
                            {language === 'sr' ? 'Žetoni Građana:' : 'Citizen Tiles:'}
                          </label>
                          <TouchStepper
                            value={player.citizenTiles}
                            onChange={(v) => updatePlayerField(player.id, 'citizenTiles', v)}
                            min={0}
                            max={14}
                          />
                        </div>
                      </div>

                      {/* Most Trading Stations Toggle */}
                      <label className="flex items-center gap-2.5 pt-2 border-t border-stone-850 text-xs text-stone-300 cursor-pointer min-h-[38px] select-none">
                        <input
                          type="checkbox"
                          checked={player.hasMostTradingStationsBonus}
                          onChange={(e) => updatePlayerField(player.id, 'hasMostTradingStationsBonus', e.target.checked)}
                          className="w-4 h-4 rounded border-stone-700 text-amber-500 focus:ring-amber-500"
                        />
                        <span>{language === 'sr' ? 'Bonus Građanin za najviše izgrađenih trgovačkih ispostava (+1)' : 'Most Trading Stations Citizen Bonus (+1)'}</span>
                      </label>
                    </div>

                    {/* Section 4: Goods (Roba sa poenima) */}
                    <div className="p-3.5 sm:p-4 bg-stone-950 border border-stone-800 rounded-xl space-y-3">
                      <div className="flex items-center justify-between text-xs font-bold text-amber-500 uppercase tracking-wider">
                        <span>{language === 'sr' ? 'Roba (Brokat, Vuna, Vino, Sir, Žito)' : 'Goods VP'}</span>
                        <span className="font-mono text-stone-300 text-xs sm:text-sm">
                          Ukupno roba: <strong className="text-amber-400">{goodsVP} VP</strong>
                        </span>
                      </div>

                      <div className="space-y-2">
                        {/* Brocade 5 */}
                        <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-stone-900/60 border border-stone-850">
                          <div className="flex items-center gap-2">
                            <BrocadeIcon size={22} />
                            <div>
                              <span className="text-xs font-bold text-red-400">Brokat</span>
                              <span className="text-[10px] text-stone-400 ml-1.5">(5 VP)</span>
                            </div>
                          </div>
                          <TouchStepper
                            value={player.brocade}
                            onChange={(v) => updatePlayerField(player.id, 'brocade', v)}
                            min={0}
                            max={24}
                          />
                        </div>

                        {/* Wool 4 */}
                        <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-stone-900/60 border border-stone-850">
                          <div className="flex items-center gap-2">
                            <WoolIcon size={22} />
                            <div>
                              <span className="text-xs font-bold text-sky-400">Vuna</span>
                              <span className="text-[10px] text-stone-400 ml-1.5">(4 VP)</span>
                            </div>
                          </div>
                          <TouchStepper
                            value={player.wool}
                            onChange={(v) => updatePlayerField(player.id, 'wool', v)}
                            min={0}
                            max={24}
                          />
                        </div>

                        {/* Wine 3 */}
                        <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-stone-900/60 border border-stone-850">
                          <div className="flex items-center gap-2">
                            <WineIcon size={22} />
                            <div>
                              <span className="text-xs font-bold text-purple-400">Vino</span>
                              <span className="text-[10px] text-stone-400 ml-1.5">(3 VP)</span>
                            </div>
                          </div>
                          <TouchStepper
                            value={player.wine}
                            onChange={(v) => updatePlayerField(player.id, 'wine', v)}
                            min={0}
                            max={24}
                          />
                        </div>

                        {/* Cheese 2 */}
                        <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-stone-900/60 border border-stone-850">
                          <div className="flex items-center gap-2">
                            <CheeseIcon size={22} />
                            <div>
                              <span className="text-xs font-bold text-amber-400">Sir</span>
                              <span className="text-[10px] text-stone-400 ml-1.5">(2 VP)</span>
                            </div>
                          </div>
                          <TouchStepper
                            value={player.cheese}
                            onChange={(v) => updatePlayerField(player.id, 'cheese', v)}
                            min={0}
                            max={24}
                          />
                        </div>

                        {/* Grain 1 */}
                        <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-stone-900/60 border border-stone-850">
                          <div className="flex items-center gap-2">
                            <GrainIcon size={22} />
                            <div>
                              <span className="text-xs font-bold text-stone-300">Žito</span>
                              <span className="text-[10px] text-stone-400 ml-1.5">(1 VP)</span>
                            </div>
                          </div>
                          <TouchStepper
                            value={player.grain}
                            onChange={(v) => updatePlayerField(player.id, 'grain', v)}
                            min={0}
                            max={30}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Section 5: Expansion Specific Inputs */}
                    {selectedExpansion === 'trade_intrigue' && (
                      <div className="p-3.5 sm:p-4 bg-stone-950 border border-amber-900/40 rounded-xl space-y-3">
                        <div className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                          📜 Trade &amp; Intrigue Dodatni Poeni
                        </div>
                        <div className="space-y-3">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <label className="text-xs text-stone-400">
                              Narudžbine (Orders) VP:
                            </label>
                            <TouchStepper
                              value={player.ordersVP || 0}
                              onChange={(v) => updatePlayerField(player.id, 'ordersVP', v)}
                              min={0}
                              max={100}
                              quickSteps={[5]}
                            />
                          </div>
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-stone-850">
                            <label className="text-xs text-stone-400">
                              Kuća trgovca (većine × 4 VP):
                            </label>
                            <TouchStepper
                              value={player.merchantHouseGoodsCount || 0}
                              onChange={(v) => updatePlayerField(player.id, 'merchantHouseGoodsCount', v)}
                              min={0}
                              max={5}
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {selectedMode === 'invasion_prosperity' && (
                      <div className="p-3.5 sm:p-4 bg-stone-950 border border-amber-900/40 rounded-xl space-y-3">
                        <div className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                          🏛️ Prosperity Dodatni Poeni
                        </div>
                        <div className="space-y-3">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <label className="text-xs text-stone-400">
                              Završene Građevine (Structures VP):
                            </label>
                            <TouchStepper
                              value={player.completedStructuresVP || 0}
                              onChange={(v) => updatePlayerField(player.id, 'completedStructuresVP', v)}
                              min={0}
                              max={100}
                              quickSteps={[5]}
                            />
                          </div>
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-stone-850">
                            <label className="text-xs text-stone-400">
                              Skladište (Depot setovi × 5 VP):
                            </label>
                            <TouchStepper
                              value={player.hasDepotCompleteSets || 0}
                              onChange={(v) => updatePlayerField(player.id, 'hasDepotCompleteSets', v)}
                              min={0}
                              max={10}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
