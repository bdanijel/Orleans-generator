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
  FleurDeLisIcon,
  TechCogIcon
} from '../common/Icons';
import { 
  Trophy, 
  Plus, 
  Trash2, 
  RotateCcw, 
  Copy, 
  Check, 
  Award, 
  Sparkles, 
  BarChart3, 
  History,
  ShieldAlert,
  ShieldCheck,
  Building2,
  Package,
  Swords,
  Layers,
  HelpCircle
} from 'lucide-react';

interface ScoringCalculatorProps {
  language: Language;
}

const PLAYER_COLORS: Array<{ id: 'blue' | 'red' | 'yellow' | 'green' | 'black'; nameSr: string; nameEn: string; bg: string; border: string; text: string }> = [
  { id: 'blue', nameSr: 'Plavi', nameEn: 'Blue', bg: 'bg-blue-950/80', border: 'border-blue-600', text: 'text-blue-400' },
  { id: 'red', nameSr: 'Crveni', nameEn: 'Red', bg: 'bg-red-950/80', border: 'border-red-600', text: 'text-red-400' },
  { id: 'yellow', nameSr: 'Žuti', nameEn: 'Yellow', bg: 'bg-amber-950/80', border: 'border-amber-500', text: 'text-amber-400' },
  { id: 'green', nameSr: 'Zeleni', nameEn: 'Green', bg: 'bg-emerald-950/80', border: 'border-emerald-600', text: 'text-emerald-400' },
  { id: 'black', nameSr: 'Crni / Sivi (5. igrač)', nameEn: 'Black (5th player)', bg: 'bg-stone-950', border: 'border-stone-600', text: 'text-stone-300' }
];

export function ScoringCalculator({ language }: ScoringCalculatorProps) {
  const [selectedExpansion, setSelectedExpansion] = useState<GameExpansion>('base');
  const [selectedMode, setSelectedMode] = useState<GameMode>('base');

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
    fortifiedTowersBuilt: 13,
    characterCardsCompleted: {
      librarian: true,
      councilman: true,
      general: true,
      fisherman: true
    }
  }));

  // Solo Scenario states
  const [soloDignitaryCitizens, setSoloDignitaryCitizens] = useState<number>(8);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'scores' | 'breakdown' | 'coop' | 'duel' | 'solo'>('scores');

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('orleans_calc_players_v2', JSON.stringify(players));
  }, [players]);

  // Calculation helpers
  const calculateGoodsVP = (player: PlayerScore) => {
    return (
      player.brocade * GOODS_DATA.brocade.vp +
      player.wool * GOODS_DATA.wool.vp +
      player.wine * GOODS_DATA.wine.vp +
      player.cheese * GOODS_DATA.cheese.vp +
      player.grain * GOODS_DATA.grain.vp
    );
  };

  const calculatePlayerTotalVP = (player: PlayerScore) => {
    const coinsVP = player.coins;
    const goodsVP = calculateGoodsVP(player);
    
    // In Prosperity, only stations in towns count (not structures on routes)
    const effectiveCitizens = player.citizenTiles + (player.hasMostTradingStationsBonus ? 1 : 0);
    const stationsAndCitizensVP = (player.tradingStations + effectiveCitizens) * player.developmentStatus;
    
    // Trade & Intrigue Additions
    const ordersVP = player.ordersVP || 0;
    const merchantHouseVP = (player.merchantHouseGoodsCount || 0) * 4;

    // Invasion: Prosperity additions
    const structuresVP = player.completedStructuresVP || 0;
    const depotVP = (player.hasDepotCompleteSets || 0) * 5;

    return coinsVP + goodsVP + stationsAndCitizensVP + ordersVP + merchantHouseVP + structuresVP + depotVP;
  };

  // Ranking & tie-breaking
  const rankedPlayers = [...players].sort((a, b) => {
    const totalA = calculatePlayerTotalVP(a);
    const totalB = calculatePlayerTotalVP(b);
    if (totalB !== totalA) {
      return totalB - totalA;
    }
    // Tie-breaker: Development Track Position
    return b.developmentTrackPosition - a.developmentTrackPosition;
  });

  const updatePlayerField = (id: string, field: keyof PlayerScore, value: any) => {
    setPlayers(prev => prev.map(p => {
      if (p.id === id) {
        return { ...p, [field]: value };
      }
      return p;
    }));
  };

  const addPlayer = () => {
    const maxPlayers = selectedExpansion === 'invasion' ? 5 : 4;
    if (players.length >= maxPlayers) return;
    const availableColor = PLAYER_COLORS.find(c => !players.some(p => p.color === c.id)) || PLAYER_COLORS[players.length % PLAYER_COLORS.length];
    
    const newPlayer: PlayerScore = {
      id: `p_${Date.now()}`,
      name: `Igrač ${players.length + 1}`,
      color: availableColor.id,
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
  };

  const handleReset = () => {
    if (window.confirm(language === 'sr' ? 'Resetovati sve poene na nulu?' : 'Reset all player scores to default?')) {
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

  // Copy results summary
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

  return (
    <div className="space-y-8">
      {/* Mode Selector */}
      <div className="bg-stone-900/95 border border-stone-800 rounded-xl p-6 shadow-xl space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-stone-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-500 uppercase tracking-wider mb-1">
              <Trophy className="w-4 h-4" />
              {language === 'sr' ? 'Kalkulator Bodovanja i Ishoda' : 'Scoring & Outcome Calculator'}
            </div>
            <h2 className="text-2xl font-bold text-stone-100 font-display">
              {language === 'sr' ? 'Obračun Pobedničkih Poena (VP)' : 'Victory Points Calculation'}
            </h2>
          </div>

          {/* Mode Switcher */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => {
                setSelectedExpansion('base');
                setSelectedMode('base');
                setActiveTab('scores');
              }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                selectedExpansion === 'base' ? 'bg-amber-600 text-stone-950 font-extrabold' : 'bg-stone-950 text-stone-400'
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
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                selectedExpansion === 'trade_intrigue' ? 'bg-amber-600 text-stone-950 font-extrabold' : 'bg-stone-950 text-stone-400'
              }`}
            >
              📜 Trade & Intrigue
            </button>

            <button
              onClick={() => {
                setSelectedExpansion('invasion');
                setSelectedMode('invasion_prosperity');
                setActiveTab('scores');
              }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                selectedExpansion === 'invasion' ? 'bg-amber-600 text-stone-950 font-extrabold' : 'bg-stone-950 text-stone-400'
              }`}
            >
              ⚔️ Invasion Ekspanzija
            </button>
          </div>
        </div>

        {/* Sub-modes for Invasion */}
        {selectedExpansion === 'invasion' && (
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 pb-2">
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => {
                  setSelectedMode('invasion_prosperity');
                  setActiveTab('scores');
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                  selectedMode === 'invasion_prosperity' ? 'bg-amber-600 text-stone-950 font-bold' : 'bg-stone-800 text-stone-300'
                }`}
              >
                🏛️ Prosperity (Blagostanje)
              </button>

              <button
                onClick={() => {
                  setSelectedMode('invasion_coop');
                  setActiveTab('coop');
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
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
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                  selectedMode === 'invasion_duel' ? 'bg-amber-600 text-stone-950 font-bold' : 'bg-stone-800 text-stone-300'
                }`}
              >
                ⚔️ The Duel (Dvoboj za 2)
              </button>

              <button
                onClick={() => {
                  setSelectedMode('invasion_solo_dignitary');
                  setActiveTab('solo');
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                  selectedMode.startsWith('invasion_solo') ? 'bg-amber-600 text-stone-950 font-bold' : 'bg-stone-800 text-stone-300'
                }`}
              >
                👤 Solo Scenariji
              </button>
            </div>
          </div>
        )}

        {/* Action Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-stone-800">
          <div className="flex items-center gap-2">
            {activeTab !== 'coop' && activeTab !== 'duel' && activeTab !== 'solo' && (
              <button
                onClick={addPlayer}
                disabled={players.length >= (selectedExpansion === 'invasion' ? 5 : 4)}
                className="px-3.5 py-2 bg-stone-800 hover:bg-stone-700 disabled:opacity-40 text-stone-200 text-xs font-bold rounded-lg border border-stone-700 flex items-center gap-1.5 transition cursor-pointer"
              >
                <Plus className="w-4 h-4 text-amber-500" />
                <span>{language === 'sr' ? 'Dodaj igrača' : 'Add Player'}</span>
              </button>
            )}

            <button
              onClick={handleReset}
              className="p-2 bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-stone-200 rounded-lg border border-stone-700 transition cursor-pointer"
              title={language === 'sr' ? 'Resetuj poene' : 'Reset Scores'}
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={copyResults}
            className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-amber-400 text-xs font-bold rounded-lg border border-amber-600/40 flex items-center gap-2 transition cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? (language === 'sr' ? 'Kopirano!' : 'Copied!') : (language === 'sr' ? 'Kopiraj pregled' : 'Copy Summary')}</span>
          </button>
        </div>
      </div>

      {/* COOPERATIVE INVASION EVALUATOR TAB */}
      {selectedMode === 'invasion_coop' && (
        <div className="bg-stone-900/95 border border-stone-800 rounded-xl p-6 shadow-xl space-y-8">
          <div className={`p-6 rounded-2xl border text-center space-y-2 ${
            isCoopVictory 
              ? 'bg-emerald-950/40 border-emerald-600 text-emerald-200 shadow-xl shadow-emerald-950/50' 
              : 'bg-stone-950/80 border-stone-800 text-stone-300'
          }`}>
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-stone-900 border border-stone-700 mb-1">
              {isCoopVictory ? <ShieldCheck className="w-7 h-7 text-emerald-400" /> : <ShieldAlert className="w-7 h-7 text-amber-500" />}
            </div>
            <h3 className="text-2xl font-bold font-display">
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
            <h4 className="text-lg font-bold font-display text-amber-400 flex items-center gap-2">
              <Layers className="w-5 h-5" />
              {language === 'sr' ? '5 Zajedničkih Ciljeva Odbrane Grada:' : '5 Common City Defense Objectives:'}
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Objective 1: City Walls */}
              <div className={`p-4 rounded-xl border ${coopGoals.knights ? 'bg-emerald-950/30 border-emerald-700/60' : 'bg-stone-950 border-stone-800'}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-stone-100 text-sm">1. Gradske zidine (Vitezovi)</span>
                  {coopGoals.knights && <Check className="w-4 h-4 text-emerald-400" />}
                </div>
                <div className="text-xs text-stone-400 mb-3">
                  Potrebno: <strong>{COOP_INVASION_GOALS.cityWallsKnights[coopState.playerCount]}</strong> Vitezova
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    max="20"
                    value={coopState.cityWallsKnightsPlaced}
                    onChange={(e) => setCoopState({ ...coopState, cityWallsKnightsPlaced: parseInt(e.target.value) || 0 })}
                    className="w-20 px-2 py-1 bg-stone-900 border border-stone-700 rounded text-amber-400 font-mono font-bold"
                  />
                  <span className="text-xs text-stone-400">/ {COOP_INVASION_GOALS.cityWallsKnights[coopState.playerCount]} postavljenih</span>
                </div>
              </div>

              {/* Objective 2: Citizen Tiles */}
              <div className={`p-4 rounded-xl border ${coopGoals.citizens ? 'bg-emerald-950/30 border-emerald-700/60' : 'bg-stone-950 border-stone-800'}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-stone-100 text-sm">2. Žetoni Građana</span>
                  {coopGoals.citizens && <Check className="w-4 h-4 text-emerald-400" />}
                </div>
                <div className="text-xs text-stone-400 mb-3">
                  Potrebno: <strong>{COOP_INVASION_GOALS.citizenTiles[coopState.playerCount]}</strong> Građana
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    max="15"
                    value={coopState.citizenTilesCollected}
                    onChange={(e) => setCoopState({ ...coopState, citizenTilesCollected: parseInt(e.target.value) || 0 })}
                    className="w-20 px-2 py-1 bg-stone-900 border border-stone-700 rounded text-amber-400 font-mono font-bold"
                  />
                  <span className="text-xs text-stone-400">/ {COOP_INVASION_GOALS.citizenTiles[coopState.playerCount]} sakupljenih</span>
                </div>
              </div>

              {/* Objective 3: City Treasury */}
              <div className={`p-4 rounded-xl border ${coopGoals.treasury ? 'bg-emerald-950/30 border-emerald-700/60' : 'bg-stone-950 border-stone-800'}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-stone-100 text-sm">3. Gradska riznica (Novac)</span>
                  {coopGoals.treasury && <Check className="w-4 h-4 text-emerald-400" />}
                </div>
                <div className="text-xs text-stone-400 mb-3">
                  Potrebno: <strong>{COOP_INVASION_GOALS.cityTreasuryCoins[coopState.playerCount]}</strong> Novčića
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={coopState.cityTreasuryCoins}
                    onChange={(e) => setCoopState({ ...coopState, cityTreasuryCoins: parseInt(e.target.value) || 0 })}
                    className="w-20 px-2 py-1 bg-stone-900 border border-stone-700 rounded text-amber-400 font-mono font-bold"
                  />
                  <span className="text-xs text-stone-400">/ {COOP_INVASION_GOALS.cityTreasuryCoins[coopState.playerCount]} u riznici</span>
                </div>
              </div>

              {/* Objective 4: Warehouse Goods */}
              <div className={`p-4 rounded-xl border ${coopGoals.warehouse ? 'bg-emerald-950/30 border-emerald-700/60' : 'bg-stone-950 border-stone-800'}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-stone-100 text-sm">4. Magacin Robe (Warehouse)</span>
                  {coopGoals.warehouse && <Check className="w-4 h-4 text-emerald-400" />}
                </div>
                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span>Žito ({COOP_INVASION_GOALS.warehouseGrain[coopState.playerCount]}):</span>
                    <input
                      type="number"
                      value={coopState.warehouseGrain}
                      onChange={(e) => setCoopState({ ...coopState, warehouseGrain: parseInt(e.target.value) || 0 })}
                      className="w-16 px-1.5 py-0.5 bg-stone-900 border border-stone-700 rounded font-mono"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Sir ({COOP_INVASION_GOALS.warehouseCheese[coopState.playerCount]}):</span>
                    <input
                      type="number"
                      value={coopState.warehouseCheese}
                      onChange={(e) => setCoopState({ ...coopState, warehouseCheese: parseInt(e.target.value) || 0 })}
                      className="w-16 px-1.5 py-0.5 bg-stone-900 border border-stone-700 rounded font-mono"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Vino ({COOP_INVASION_GOALS.warehouseWine[coopState.playerCount]}):</span>
                    <input
                      type="number"
                      value={coopState.warehouseWine}
                      onChange={(e) => setCoopState({ ...coopState, warehouseWine: parseInt(e.target.value) || 0 })}
                      className="w-16 px-1.5 py-0.5 bg-stone-900 border border-stone-700 rounded font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Objective 5: Fortified Towers */}
              <div className={`p-4 rounded-xl border ${coopGoals.towers ? 'bg-emerald-950/30 border-emerald-700/60' : 'bg-stone-950 border-stone-800'}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-stone-100 text-sm">5. Utvrđene Kule na ivici mape</span>
                  {coopGoals.towers && <Check className="w-4 h-4 text-emerald-400" />}
                </div>
                <div className="text-xs text-stone-400 mb-3">
                  Potrebno: <strong>{COOP_INVASION_GOALS.fortifiedTowersTotal}</strong> Kula ukupno
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    max="13"
                    value={coopState.fortifiedTowersBuilt}
                    onChange={(e) => setCoopState({ ...coopState, fortifiedTowersBuilt: parseInt(e.target.value) || 0 })}
                    className="w-20 px-2 py-1 bg-stone-900 border border-stone-700 rounded text-amber-400 font-mono font-bold"
                  />
                  <span className="text-xs text-stone-400">/ 13 izgrađenih</span>
                </div>
              </div>
            </div>
          </div>

          {/* Personal Objectives Checklist */}
          <div className="space-y-4 pt-4 border-t border-stone-800">
            <h4 className="text-lg font-bold font-display text-amber-400 flex items-center gap-2">
              <Award className="w-5 h-5" />
              {language === 'sr' ? 'Lični Ciljevi Igrača (Character Cards):' : 'Personal Character Objectives:'}
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {CHARACTER_OBJECTIVES_DATA.map(char => {
                const isComplete = coopState.characterCardsCompleted[char.id] || false;
                return (
                  <div
                    key={char.id}
                    onClick={() => setCoopState({
                      ...coopState,
                      characterCardsCompleted: {
                        ...coopState.characterCardsCompleted,
                        [char.id]: !isComplete
                      }
                    })}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      isComplete ? 'bg-emerald-950/30 border-emerald-700/60' : 'bg-stone-950 border-stone-800 hover:border-stone-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-bold text-stone-100 text-sm">{char.nameSr}</span>
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                        isComplete ? 'bg-emerald-600 text-stone-950 font-bold' : 'border border-stone-600'
                      }`}>
                        {isComplete ? '✓' : ''}
                      </span>
                    </div>
                    <p className="text-xs text-stone-400 leading-relaxed whitespace-pre-line">
                      {char.descSr}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* DUEL EVALUATOR TAB */}
      {selectedMode === 'invasion_duel' && (
        <div className="bg-stone-900/95 border border-stone-800 rounded-xl p-6 shadow-xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-stone-800">
            <div>
              <h3 className="text-xl font-bold font-display text-stone-100">
                {language === 'sr' ? 'Trgovački Dvoboj za 2 Igrača (The Duel)' : 'The Duel 2-Player Competition'}
              </h3>
              <p className="text-xs text-stone-400">
                {language === 'sr' ? 'Ko prvi ispuni sva 4 cilja pobeđuje. Ako oba igrača završe u istoj rundi, odlučuje najviše VP u robi!' : 'First player to complete all 4 objectives wins!'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {players.slice(0, 2).map((player, pIdx) => {
              const goodsVP = calculateGoodsVP(player);
              return (
                <div key={player.id} className="p-5 bg-stone-950 border border-stone-800 rounded-xl space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-lg text-amber-400">{player.name}</span>
                    <span className="font-mono text-sm px-2.5 py-0.5 rounded bg-stone-900 text-stone-300">
                      {player.duelObjectivesCompleted} / 4 cilja
                    </span>
                  </div>

                  <div className="space-y-2">
                    {DUEL_OBJECTIVES_DATA.map((obj) => {
                      const isCompleted = (player.duelObjectivesCompleted >= obj.num);
                      return (
                        <div
                          key={obj.id}
                          onClick={() => {
                            const newCount = player.duelObjectivesCompleted === obj.num ? obj.num - 1 : obj.num;
                            updatePlayerField(player.id, 'duelObjectivesCompleted', newCount);
                          }}
                          className={`p-3 rounded-lg border text-xs cursor-pointer transition flex items-start gap-2.5 ${
                            isCompleted ? 'bg-emerald-950/40 border-emerald-700/60 text-emerald-200' : 'bg-stone-900 border-stone-800 text-stone-300'
                          }`}
                        >
                          <span className={`w-4 h-4 rounded mt-0.5 flex items-center justify-center font-bold text-[10px] ${
                            isCompleted ? 'bg-emerald-600 text-stone-950' : 'border border-stone-600'
                          }`}>
                            {isCompleted ? '✓' : ''}
                          </span>
                          <div>
                            <div className="font-bold">{obj.titleSr}</div>
                            <div className="text-[11px] text-stone-400 mt-0.5">{obj.descSr}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="pt-2 border-t border-stone-800 flex items-center justify-between text-xs text-stone-400">
                    <span>Roba tie-breaker: <strong>{goodsVP} VP</strong></span>
                    <span>Novčići tie-breaker: <strong>{player.coins} VP</strong></span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SOLO SCENARIOS EVALUATOR TAB */}
      {selectedMode.startsWith('invasion_solo') && (
        <div className="bg-stone-900/95 border border-stone-800 rounded-xl p-6 shadow-xl space-y-6">
          <h3 className="text-xl font-bold font-display text-amber-400">
            {language === 'sr' ? 'Evaluacija Solo Scenarija (Invasion)' : 'Solo Scenarios Evaluation'}
          </h3>

          <div className="flex flex-wrap gap-2 pb-4 border-b border-stone-800">
            <button
              onClick={() => setSelectedMode('invasion_solo_dignitary')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                selectedMode === 'invasion_solo_dignitary' ? 'bg-amber-600 text-stone-950 font-bold' : 'bg-stone-800 text-stone-300'
              }`}
            >
              👑 Velikodostojnik (The Dignitary)
            </button>
          </div>

          {selectedMode === 'invasion_solo_dignitary' && (
            <div className="p-5 bg-stone-950 border border-stone-800 rounded-xl space-y-4">
              <h4 className="font-bold text-stone-100 text-sm">Cilj: Sakupite najmanje 8 žetona Građana (ili 7 na lakšem nivou) tokom 16 rundi</h4>
              <div className="flex items-center gap-4">
                <span className="text-xs text-stone-300">Broj sakupljenih građana:</span>
                <input
                  type="number"
                  value={soloDignitaryCitizens}
                  onChange={(e) => setSoloDignitaryCitizens(parseInt(e.target.value) || 0)}
                  className="w-20 px-3 py-1.5 bg-stone-900 border border-stone-700 rounded-lg text-amber-400 font-mono font-bold text-lg"
                />
              </div>
              <div className={`p-4 rounded-xl border font-bold text-sm ${
                soloDignitaryCitizens >= 8 
                  ? 'bg-emerald-950/40 border-emerald-600 text-emerald-300' 
                  : soloDignitaryCitizens >= 7 
                  ? 'bg-amber-950/40 border-amber-600 text-amber-300' 
                  : 'bg-rose-950/40 border-rose-800 text-rose-300'
              }`}>
                {soloDignitaryCitizens >= 8 ? '🎉 POBEDA! (Standardni / Teški nivo)' : soloDignitaryCitizens >= 7 ? '✨ POBEDA na lakšem nivou (7 građana)' : '❌ Poraz - potrebno je najmanje 8 (ili 7) građana.'}
              </div>
            </div>
          )}
        </div>
      )}

      {/* MAIN STANDARD / EXPANSION COMPETITIVE SCORING TABLE */}
      {selectedMode !== 'invasion_coop' && (
        <div className="space-y-6">
          {/* Winner Banner */}
          {rankedPlayers.length > 0 && (
            <div className="p-6 bg-gradient-to-r from-amber-950/40 via-stone-900 to-amber-950/40 border border-amber-500/40 rounded-2xl shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4 text-center sm:text-left">
                <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0 shadow-inner">
                  <Trophy className="w-8 h-8" />
                </div>
                <div>
                  <div className="text-xs uppercase font-bold text-amber-500 tracking-wider">
                    {language === 'sr' ? 'Trenutni Pobednik' : 'Current Winner'}
                  </div>
                  <div className="text-2xl font-black font-display text-stone-100">
                    {rankedPlayers[0].name}
                  </div>
                  <div className="text-xs text-stone-400">
                    {calculatePlayerTotalVP(rankedPlayers[0])} VP
                  </div>
                </div>
              </div>

              {/* Ranks list */}
              <div className="flex items-center gap-3">
                {rankedPlayers.map((p, idx) => (
                  <div key={p.id} className="text-center px-3 py-1.5 bg-stone-950/80 border border-stone-800 rounded-lg">
                    <div className="text-[10px] text-stone-500 font-bold">#{idx + 1}</div>
                    <div className="text-xs font-bold text-stone-200">{p.name}</div>
                    <div className="text-xs font-mono text-amber-400">{calculatePlayerTotalVP(p)} VP</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Player Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {players.map(player => {
              const totalVP = calculatePlayerTotalVP(player);
              const goodsVP = calculateGoodsVP(player);
              const effectiveCitizens = player.citizenTiles + (player.hasMostTradingStationsBonus ? 1 : 0);
              const devVP = (player.tradingStations + effectiveCitizens) * player.developmentStatus;

              return (
                <div
                  key={player.id}
                  className="bg-stone-900/90 border border-stone-800 hover:border-stone-700 rounded-2xl p-6 shadow-xl space-y-6 flex flex-col justify-between"
                >
                  <div className="space-y-6">
                    {/* Header: Name, Color, Total Score */}
                    <div className="flex items-center justify-between gap-3 pb-4 border-b border-stone-800">
                      <div className="flex items-center gap-3">
                        <span className={`w-4 h-4 rounded-full ${
                          player.color === 'blue' ? 'bg-blue-500' :
                          player.color === 'red' ? 'bg-red-500' :
                          player.color === 'yellow' ? 'bg-amber-400' :
                          player.color === 'green' ? 'bg-emerald-500' : 'bg-stone-500'
                        }`} />
                        <input
                          type="text"
                          value={player.name}
                          onChange={(e) => updatePlayerField(player.id, 'name', e.target.value)}
                          className="font-bold font-display text-lg text-stone-100 bg-transparent border-b border-transparent hover:border-stone-700 focus:border-amber-500 px-1 py-0.5"
                        />
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <span className="text-2xl font-black font-mono text-amber-400">{totalVP}</span>
                          <span className="text-xs text-stone-400 ml-1">VP</span>
                        </div>

                        {players.length > 1 && (
                          <button
                            onClick={() => removePlayer(player.id)}
                            className="p-1.5 text-stone-600 hover:text-rose-400 transition cursor-pointer"
                            title="Ukloni igrača"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Section 1: Coins & Development Status */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {/* Coins */}
                      <div className="p-3 bg-stone-950 border border-stone-800 rounded-xl space-y-1">
                        <div className="flex items-center gap-1.5 text-xs text-amber-400 font-semibold">
                          <CoinIcon size={16} />
                          <span>{language === 'sr' ? 'Novčići' : 'Coins'}</span>
                        </div>
                        <input
                          type="number"
                          min="0"
                          value={player.coins}
                          onChange={(e) => updatePlayerField(player.id, 'coins', Math.max(0, parseInt(e.target.value) || 0))}
                          className="w-full px-2 py-1 bg-stone-900 border border-stone-800 rounded text-stone-100 font-mono font-bold text-sm"
                        />
                      </div>

                      {/* Development Status */}
                      <div className="p-3 bg-stone-950 border border-stone-800 rounded-xl space-y-1">
                        <div className="flex items-center gap-1.5 text-xs text-amber-400 font-semibold">
                          <DevStarIcon size={16} />
                          <span>{language === 'sr' ? 'Nivo Razvoja' : 'Dev Status'}</span>
                        </div>
                        <select
                          value={player.developmentStatus}
                          onChange={(e) => updatePlayerField(player.id, 'developmentStatus', parseInt(e.target.value))}
                          className="w-full px-2 py-1 bg-stone-900 border border-stone-800 rounded text-stone-100 font-mono font-bold text-sm cursor-pointer"
                        >
                          {[1, 2, 3, 4, 5, 6].map(num => (
                            <option key={num} value={num}>★ {num} (x{num})</option>
                          ))}
                        </select>
                      </div>

                      {/* Tie-breaker Development Track Position */}
                      <div className="p-3 bg-stone-950 border border-stone-800 rounded-xl space-y-1">
                        <div className="text-[11px] text-stone-400 font-semibold">
                          {language === 'sr' ? 'Polje na stazi (Tie)' : 'Track Position'}
                        </div>
                        <input
                          type="number"
                          min="0"
                          max="30"
                          value={player.developmentTrackPosition}
                          onChange={(e) => updatePlayerField(player.id, 'developmentTrackPosition', Math.max(0, parseInt(e.target.value) || 0))}
                          className="w-full px-2 py-1 bg-stone-900 border border-stone-800 rounded text-stone-100 font-mono font-bold text-sm"
                        />
                      </div>
                    </div>

                    {/* Section 2: Trading Stations & Citizens */}
                    <div className="p-4 bg-stone-950 border border-stone-800 rounded-xl space-y-3">
                      <div className="flex items-center justify-between text-xs font-bold text-amber-500 uppercase tracking-wider">
                        <span>{language === 'sr' ? 'Trgovačke ispostave & Građani' : 'Stations & Citizens'}</span>
                        <span className="font-mono text-stone-300">
                          ({player.tradingStations} + {effectiveCitizens}) × {player.developmentStatus} = {devVP} VP
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs text-stone-400 block mb-1">
                            {selectedMode === 'invasion_prosperity' ? 'Ispostave u gradovima (max 10):' : 'Trgovačke ispostave na mapi (max 10):'}
                          </label>
                          <input
                            type="number"
                            min="0"
                            max="10"
                            value={player.tradingStations}
                            onChange={(e) => updatePlayerField(player.id, 'tradingStations', Math.max(0, parseInt(e.target.value) || 0))}
                            className="w-full px-2 py-1 bg-stone-900 border border-stone-800 rounded text-stone-100 font-mono font-bold text-sm"
                          />
                        </div>

                        <div>
                          <label className="text-xs text-stone-400 block mb-1">
                            {language === 'sr' ? 'Žetoni Građana:' : 'Citizen Tiles:'}
                          </label>
                          <input
                            type="number"
                            min="0"
                            max="14"
                            value={player.citizenTiles}
                            onChange={(e) => updatePlayerField(player.id, 'citizenTiles', Math.max(0, parseInt(e.target.value) || 0))}
                            className="w-full px-2 py-1 bg-stone-900 border border-stone-800 rounded text-stone-100 font-mono font-bold text-sm"
                          />
                        </div>
                      </div>

                      {/* Most Trading Stations Toggle */}
                      <label className="flex items-center gap-2 pt-1 text-xs text-stone-300 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={player.hasMostTradingStationsBonus}
                          onChange={(e) => updatePlayerField(player.id, 'hasMostTradingStationsBonus', e.target.checked)}
                          className="rounded border-stone-700 text-amber-500 focus:ring-amber-500"
                        />
                        <span>{language === 'sr' ? 'Bonus Građanin za najviše izgrađenih trgovačkih ispostava' : 'Most Trading Stations Citizen Bonus (+1)'}</span>
                      </label>
                    </div>

                    {/* Section 3: Goods Multipliers */}
                    <div className="p-4 bg-stone-950 border border-stone-800 rounded-xl space-y-3">
                      <div className="flex items-center justify-between text-xs font-bold text-amber-500 uppercase tracking-wider">
                        <span>{language === 'sr' ? 'Roba (Goods)' : 'Goods VP'}</span>
                        <span className="font-mono text-stone-300">{goodsVP} VP</span>
                      </div>

                      <div className="grid grid-cols-5 gap-2">
                        {/* Brocade 5 VP */}
                        <div className="text-center space-y-1">
                          <span className="text-[10px] text-red-400 font-bold block">Brokat (5)</span>
                          <input
                            type="number"
                            min="0"
                            value={player.brocade}
                            onChange={(e) => updatePlayerField(player.id, 'brocade', Math.max(0, parseInt(e.target.value) || 0))}
                            className="w-full text-center py-1 bg-stone-900 border border-stone-800 rounded text-stone-100 font-mono font-bold text-xs"
                          />
                        </div>

                        {/* Wool 4 VP */}
                        <div className="text-center space-y-1">
                          <span className="text-[10px] text-sky-400 font-bold block">Vuna (4)</span>
                          <input
                            type="number"
                            min="0"
                            value={player.wool}
                            onChange={(e) => updatePlayerField(player.id, 'wool', Math.max(0, parseInt(e.target.value) || 0))}
                            className="w-full text-center py-1 bg-stone-900 border border-stone-800 rounded text-stone-100 font-mono font-bold text-xs"
                          />
                        </div>

                        {/* Wine 3 VP */}
                        <div className="text-center space-y-1">
                          <span className="text-[10px] text-purple-400 font-bold block">Vino (3)</span>
                          <input
                            type="number"
                            min="0"
                            value={player.wine}
                            onChange={(e) => updatePlayerField(player.id, 'wine', Math.max(0, parseInt(e.target.value) || 0))}
                            className="w-full text-center py-1 bg-stone-900 border border-stone-800 rounded text-stone-100 font-mono font-bold text-xs"
                          />
                        </div>

                        {/* Cheese 2 VP */}
                        <div className="text-center space-y-1">
                          <span className="text-[10px] text-amber-400 font-bold block">Sir (2)</span>
                          <input
                            type="number"
                            min="0"
                            value={player.cheese}
                            onChange={(e) => updatePlayerField(player.id, 'cheese', Math.max(0, parseInt(e.target.value) || 0))}
                            className="w-full text-center py-1 bg-stone-900 border border-stone-800 rounded text-stone-100 font-mono font-bold text-xs"
                          />
                        </div>

                        {/* Grain 1 VP */}
                        <div className="text-center space-y-1">
                          <span className="text-[10px] text-stone-400 font-bold block">Žito (1)</span>
                          <input
                            type="number"
                            min="0"
                            value={player.grain}
                            onChange={(e) => updatePlayerField(player.id, 'grain', Math.max(0, parseInt(e.target.value) || 0))}
                            className="w-full text-center py-1 bg-stone-900 border border-stone-800 rounded text-stone-100 font-mono font-bold text-xs"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Section 4: Expansion Specific Inputs */}
                    {selectedExpansion === 'trade_intrigue' && (
                      <div className="p-4 bg-stone-950 border border-amber-900/40 rounded-xl space-y-3">
                        <div className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                          📜 Trade & Intrigue Dodatni Poeni
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-[11px] text-stone-400 block mb-1">
                              Narudžbine (Orders) VP:
                            </label>
                            <input
                              type="number"
                              min="0"
                              value={player.ordersVP}
                              onChange={(e) => updatePlayerField(player.id, 'ordersVP', Math.max(0, parseInt(e.target.value) || 0))}
                              className="w-full px-2 py-1 bg-stone-900 border border-stone-800 rounded text-amber-400 font-mono font-bold text-sm"
                            />
                          </div>
                          <div>
                            <label className="text-[11px] text-stone-400 block mb-1">
                              Kuća trgovca (većine × 4 VP):
                            </label>
                            <input
                              type="number"
                              min="0"
                              max="5"
                              value={player.merchantHouseGoodsCount}
                              onChange={(e) => updatePlayerField(player.id, 'merchantHouseGoodsCount', Math.max(0, parseInt(e.target.value) || 0))}
                              className="w-full px-2 py-1 bg-stone-900 border border-stone-800 rounded text-amber-400 font-mono font-bold text-sm"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {selectedMode === 'invasion_prosperity' && (
                      <div className="p-4 bg-stone-950 border border-amber-900/40 rounded-xl space-y-3">
                        <div className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                          🏛️ Prosperity (Blagostanje) Dodatni Poeni
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-[11px] text-stone-400 block mb-1">
                              Završene Građevine (Structures VP):
                            </label>
                            <input
                              type="number"
                              min="0"
                              value={player.completedStructuresVP}
                              onChange={(e) => updatePlayerField(player.id, 'completedStructuresVP', Math.max(0, parseInt(e.target.value) || 0))}
                              className="w-full px-2 py-1 bg-stone-900 border border-stone-800 rounded text-amber-400 font-mono font-bold text-sm"
                            />
                          </div>
                          <div>
                            <label className="text-[11px] text-stone-400 block mb-1">
                              Skladište (Depot setovi × 5 VP):
                            </label>
                            <input
                              type="number"
                              min="0"
                              value={player.hasDepotCompleteSets}
                              onChange={(e) => updatePlayerField(player.id, 'hasDepotCompleteSets', Math.max(0, parseInt(e.target.value) || 0))}
                              className="w-full px-2 py-1 bg-stone-900 border border-stone-800 rounded text-amber-400 font-mono font-bold text-sm"
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
