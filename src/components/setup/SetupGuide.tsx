import { useState } from 'react';
import { Language, GoodType, GameExpansion, GameMode } from '../../types/orleans';
import { 
  GOODS_DATA, 
  FOLLOWERS_DATA, 
  BASE_SETUP_RULES_BY_PLAYER_COUNT, 
  PLACE_TILES_DATA,
  COOP_INVASION_GOALS,
  CHARACTER_OBJECTIVES_DATA,
  DUEL_OBJECTIVES_DATA
} from '../../data/rulesData';
import { 
  FollowerBadge, 
  BrocadeIcon, 
  WoolIcon, 
  WineIcon, 
  CheeseIcon, 
  GrainIcon, 
  CoinIcon, 
  CitizenIcon, 
  TradingStationIcon,
  HourglassIcon,
  TechCogIcon,
  FleurDeLisIcon
} from '../common/Icons';
import { 
  CheckCircle2, 
  Circle, 
  AlertCircle, 
  Shuffle, 
  ShieldAlert, 
  Sparkles, 
  BookOpen, 
  Layers,
  Swords,
  Users,
  ShieldCheck,
  UserCheck,
  Award
} from 'lucide-react';

interface SetupGuideProps {
  language: Language;
}

export function SetupGuide({ language }: SetupGuideProps) {
  const [selectedExpansion, setSelectedExpansion] = useState<GameExpansion>('base');
  const [selectedMode, setSelectedMode] = useState<GameMode>('base');
  const [playerCount, setPlayerCount] = useState<2 | 3 | 4 | 5>(4);
  const [activeTab, setActiveTab] = useState<'checklist' | 'adjustments' | 'randomizer' | 'draft' | 'expansion_special'>('checklist');
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({});
  
  // Random Goods Generator State
  const [removedGoods, setRemovedGoods] = useState<{ type: GoodType; count: number }[]>([]);
  const [goodsDrawn, setGoodsDrawn] = useState(false);

  // Place Tile Exclusion Draft State
  const [excludedTiles, setExcludedTiles] = useState<string[]>([]);

  const setupData = BASE_SETUP_RULES_BY_PLAYER_COUNT[playerCount as 2 | 3 | 4 | 5] || BASE_SETUP_RULES_BY_PLAYER_COUNT[4];

  const toggleStep = (id: string) => {
    setCompletedSteps(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleRandomizeGoodsRemoval = () => {
    const totalToRemove = setupData.goodsToRemoveRandomly;
    if (totalToRemove === 0) {
      setRemovedGoods([]);
      setGoodsDrawn(true);
      return;
    }

    const pool: GoodType[] = [
      ...Array(24).fill('grain'),
      ...Array(21).fill('cheese'),
      ...Array(18).fill('wine'),
      ...Array(15).fill('wool'),
      ...Array(12).fill('brocade'),
    ];

    const shuffled = [...pool].sort(() => 0.5 - Math.random());
    const picked = shuffled.slice(0, totalToRemove);

    const counts: Record<GoodType, number> = {
      grain: 0,
      cheese: 0,
      wine: 0,
      wool: 0,
      brocade: 0,
    };

    picked.forEach(g => {
      counts[g] = (counts[g] || 0) + 1;
    });

    setRemovedGoods(
      (Object.keys(counts) as GoodType[])
        .filter(k => counts[k] > 0)
        .map(k => ({ type: k, count: counts[k] }))
    );
    setGoodsDrawn(true);
  };

  // Steps generator based on Expansion & Mode
  const getSetupSteps = () => {
    if (selectedMode === 'invasion_prosperity') {
      return [
        {
          id: 'prop-1',
          titleSr: '1. Tabla Blagostanja (Prosperity Board) i Događaji',
          titleEn: '1. Prosperity Board & Predetermined Events',
          descSr: 'Zamenite tablu Segensreiche Werke sa tablom Prosperity.',
          descEn: 'Replace Beneficial Deeds board with Prosperity board.',
          itemsSr: [
            'Postavite tablu "Prosperity" sa 16 fiksiranih događaja i 3 nova dobrotvorna dela (Carpenter\'s Guild, Right of Assembly, Orphanage)',
            'Stavite neutralni marker na Događaj [1] kao brojač rundi (ukupno 16 rundi)',
            'Uklonite običan špil peščanih satova iz igre (ne koristi se!)'
          ],
          itemsEn: [
            'Place Prosperity board with 16 predetermined events and 3 Beneficial Deeds',
            'Place neutral marker on Event [1] as round counter (16 rounds total)',
            'Remove base game hour glass tiles'
          ]
        },
        {
          id: 'prop-2',
          titleSr: '2. Stolar (Carpenter) i Građevine (Structures)',
          titleEn: '2. Carpenter Extension & Structure Cards',
          descSr: 'Svaki igrač dobija dodatak za tablu i početne karte građevina:',
          descEn: 'Each player receives board extension and starting structure cards:',
          itemsSr: [
            'Svaki igrač uzima 1 "Carpenter" proširenje za svoju tablu i 1 neutralni marker pod koji stavlja završene građevine',
            'Postavite 1 pokrivnu pločicu preko Skriptorijuma (Scriptorium) koja daje izbor: +1 razvojni poen ILI nova karta građevine',
            'Postavite figuricu Stolara (Carpenter Token) u Orlean gde se nalaze trgovci',
            'Promešajte 22 karte Građevina licem nadole, podelite svakom igraču po 2: izaberite 1, a drugu vratite na dno špila'
          ],
          itemsEn: [
            'Each player takes 1 Carpenter extension and 1 neutral marker for completed structures',
            'Cover Scriptorium with Cover Tile (+1 Dev Point OR exchange/draw Structure Card)',
            'Place Carpenter Token in Orléans',
            'Deal 2 Structure Cards to each player: keep 1, return other to bottom of draw pile'
          ]
        },
        {
          id: 'prop-3',
          titleSr: '3. Skrivena roba i Građani',
          titleEn: '3. Face-Down Goods & Citizen Tiles Rules',
          descSr: 'Specifična pravila postavke:',
          descEn: 'Specific setup rules:',
          itemsSr: [
            'Žetoni robe se postavljaju LICEM NADOLE na putna i vodena polja i ostaju skriveni dok ih igrač ne podigne!',
            'Stavite po 1 žeton Građanina na označena mesta staza Lađara i Vitezova + 3 na tablu Prosperity. NE stavljajte građane na stazu razvoja niti na mapu!',
            'Koriste se samo određene zgrade (vidi katalog zgrada sa oznakom "Prosperity")'
          ],
          itemsEn: [
            'Goods tiles are placed FACE DOWN on routes and remain hidden until collected!',
            'Place Citizen tiles on Boatmen & Knights tracks + 3 on Prosperity board. NONE on Dev Track or map!',
            'Only specific Place Tiles are used'
          ]
        }
      ];
    }

    if (selectedMode === 'invasion_coop') {
      return [
        {
          id: 'coop-1',
          titleSr: '1. Postavljanje Table Odbrane Grada (City Defense)',
          titleEn: '1. City Defense Board & Objectives',
          descSr: 'Kooperativni scenario za 2-5 igrača protiv invazije:',
          descEn: 'Cooperative scenario for 2-5 players against invasion:',
          itemsSr: [
            'Postavite dvodelnu tablu Odbrane grada (City Defense) pored glavne table',
            'Postavite špil kooperativnih događaja (A, B, C): 2-3 igrača = 9x A + 8x B + 1x C (18 rundi); 4-5 igrača = 8x A + 7x B + 1x C (16 rundi)',
            'Svaki igrač uzima 1 "Support" tablu (Vozilo, Cehovska kuća, Prenoćište, Palatinat)',
            'NEMA popisa seljaka (Census / Faza 2 se preskače)!'
          ],
          itemsEn: [
            'Place two-part City Defense board next to game board',
            'Prepare event deck: 2-3p = 9A + 8B + 1C (18 rounds); 4-5p = 8A + 7B + 1C (16 rounds)',
            'Each player takes 1 Support board (Vehicle, Guild House, Hostel, Palatinate)',
            'NO Census (Phase 2 is omitted)!'
          ]
        },
        {
          id: 'coop-2',
          titleSr: '2. Utvrđene Kule i Lične Uloge (Character Cards)',
          titleEn: '2. Fortified Towers & Personal Objectives',
          descSr: 'Priprema spoljnih gradova i uloga:',
          descEn: 'Outer towns preparation and personal roles:',
          itemsSr: [
            'Postavite pločice Specijalnih zgrada (Special Buildings) na sve spoljne gradove na ivici mape',
            playerCount === 3 ? 'U 3 igrača: postavite 3 početne utvrđene kule u neiskorišćenoj boji (La Chatre, Briaire, Tours).' : playerCount === 2 ? 'U 2 igrača: postavite 7 početnih utvrđenih kula (La Chatre, Briaire, Tours, Etampes, Montagis, S.-Amond-Montrand, Chinon).' : 'U 4-5 igrača: nema unapred izgrađenih kula.',
            'Svaki igrač vuče 1 kartu Karakterne Uloge sa ličnim zadatkom (npr. Većnik dobija Skupštinsku salu, Bibliotekar, Ribar, Krčmar...)',
            'Cilj tima: Ispuniti SVIH 5 Zajedničkih ciljeva + SVE Lične ciljeve pre kraja poslednje runde!'
          ],
          itemsEn: [
            'Place Special Building tiles on all outer edge towns',
            playerCount === 3 ? '3p: Place 3 neutral starting Fortified Towers (La Chatre, Briaire, Tours).' : playerCount === 2 ? '2p: Place 7 neutral towers (La Chatre, Briaire, Tours, Etampes, Montagis, S.-Amond, Chinon).' : '4-5p: No pre-built towers.',
            'Each player draws 1 Character Card with Personal Objective',
            'Team Goal: Complete all 5 Common Objectives + all Personal Objectives before round ends!'
          ]
        }
      ];
    }

    if (selectedMode === 'trade_orders' || selectedMode === 'trade_intrigue') {
      return [
        {
          id: 'trade-1',
          titleSr: '1. Modul Narudžbina (Orders Module)',
          titleEn: '1. Orders Module Setup',
          descSr: '23 karte narudžbina za mercantile ekspedicije:',
          descEn: '23 Order cards for mercantile deliveries:',
          itemsSr: [
            'Promešajte špil od 23 karte Narudžbina (Orders) i postavite pored table',
            'Okrenite 5 karata sa vrha licem nagore',
            'Isporuka robe: Kada vaš trgovac stigne u grad sa karte, možete platiti traženu robu (trajno se uklanja) i uzeti kartu!',
            'VAŽNO: Isporuka narudžbine je POSLEDNJA akcija u rundi (morate odmah pasirati).'
          ],
          itemsEn: [
            'Shuffle 23 Order cards and place draw pile next to board',
            'Reveal 5 face-up Order cards',
            'Fulfilling order: When Merchant is in target town, pay goods (removed from play) and claim card!',
            'IMPORTANT: Fulfilling an Order is your last action in the round (must pass immediately).'
          ]
        },
        {
          id: 'trade-2',
          titleSr: '2. Novi Špil Događaja (34 karte A, B, C, D + Silentium)',
          titleEn: '2. New Events Deck (A, B, C, D + Silentium)',
          descSr: 'Zamena za osnovni špil peščanih satova:',
          descEn: 'Replaces base game hour glass stack:',
          itemsSr: [
            'Izdvojite 2 pločice "Silentium". Sortirajte ostale u 4 kupa (A, B, C, D) i promešajte svaki',
            'Složite špil od 18 pločica odozdo nagore: Silentium (ili Peasant Uprising varijanta) na dno, zatim 4x D, 4x C, 4x B, 4x A, i drugi Silentium na sam vrh!',
            'Ako koristite tablu Intriga (Intrigue): zamenjuje Beneficial Deeds, omogućava podmićivanje (bribing) i napade na protivnike.'
          ],
          itemsEn: [
            'Set aside 2 Silentium tiles. Sort remaining into A, B, C, D piles and shuffle each',
            'Build 18-tile deck from bottom to top: Silentium at bottom, 4 D, 4 C, 4 B, 4 A, Silentium on top!',
            'If using Intrigue board: replaces Beneficial Deeds, enables bribing and attacking opponents.'
          ]
        }
      ];
    }

    // Default Base Game Steps
    return [
      {
        id: 'step-1',
        titleSr: '1. Lične komponente svakog igrača',
        titleEn: '1. Each Player Personal Setup',
        descSr: 'Svaki igrač bira jednu boju i uzima:',
        descEn: 'Each player selects one color and takes:',
        itemsSr: [
          '1 Lična tabla igrača (Player Board)',
          '1 Vrećica za pratioce (Followers Bag)',
          '1 Figura trgovca (Merchant Token) u Orlean (grad na mapi)',
          '10 Trgovačkih ispostava (Trading Stations) u svojoj boji',
          '7 Drvenih kockica / markera u svojoj boji (po 1 na prvo polje svake od 6 staza pratilaca + 1 na Stazu razvoja)',
          '5 Novčića iz zaliha (1×5 ili 5×1)',
          '4 Početna pratioca u svojoj boji (Seljak, Lađar, Zanatlija, Trgovac) postavljena na Pijacu (Market) na svojoj tabli'
        ],
        itemsEn: [
          '1 Player Board',
          '1 Followers Bag',
          '1 Merchant Token placed in Orléans',
          '10 Trading Stations in player color',
          '7 Wooden markers (1 on first space of each 6 character tracks + 1 on Development track)',
          '5 Coins from supply',
          '4 Starting followers of player color (Farmer, Boatman, Craftsman, Trader) on Market spaces'
        ]
      },
      {
        id: 'step-2',
        titleSr: '2. Postavljanje centralnih tabli i zaliha',
        titleEn: '2. Main Boards & Common Supplies',
        descSr: 'Postavite glavnu tablu sa mapom i manju tablu Segensreiche Werke (Beneficial Deeds):',
        descEn: 'Place the large game board and the Beneficial Deeds board:',
        itemsSr: [
          'Sortirajte neutralne pratioce po zgradama na mapi',
          'Postavite gomilu pločica Tehnologije (zupčanici) na odgovarajuće mesto',
          'Postavite 13 žetona Građana na označena mesta i 1 preostali stavite pored table za igrača sa najviše Trgovačkih ispostava',
          'Preostale novčiće stavite na dohvat ruke svim igračima'
        ],
        itemsEn: [
          'Sort neutral character tiles onto their buildings on the board',
          'Place Technology Tiles stack on its space',
          'Place 13 Citizen Tiles on marked spaces; 1 remaining tile placed beside board for most trading stations bonus',
          'Place coin supply close at hand'
        ]
      },
      {
        id: 'step-3',
        titleSr: '3. Priprema špila Događaja (Peščani satovi)',
        titleEn: '3. Prepare Hour Glass Event Deck',
        descSr: 'Pravilo za špil od 18 runda:',
        descEn: '18-round deck composition rule:',
        itemsSr: [
          'Iz špila od 18 pločica izdvojite 1 pločicu "Hodočašće" (Pilgrimage - svetlije nijanse)',
          'Promešajte preostalih 17 pločica licem nadole',
          'Stavite izdvojenu pločicu Hodočašća NA SAM VRH špila (prva runda uvek počinje Hodočašćem!)'
        ],
        itemsEn: [
          'Remove 1 "Pilgrimage" tile from the 18 hour glass tiles',
          'Shuffle remaining 17 tiles face down',
          'Place Pilgrimage tile ON TOP of the stack (Round 1 starts with Pilgrimage)'
        ]
      },
      {
        id: 'step-4',
        titleSr: '4. Postavljanje Robe na drumove i vodotokove',
        titleEn: '4. Goods on Roads & Waterways',
        descSr: 'Nasumično postavljanje robe:',
        descEn: 'Random road/waterway goods setup:',
        itemsSr: [
          playerCount === 2 
            ? 'Uklonite 12 žetona robe nasumično. Ne stavljajte robu na polja "3" i "4"!'
            : playerCount === 3
            ? 'Uklonite 6 žetona robe nasumično. Ne stavljajte robu na polja "4"!'
            : 'Sva polja dobijaju robu (nema praznih polja).',
          'Promešajte robu licem nadole i postavite po 1 žeton licem nagore na svako važeće polje',
          'Preostale žetone robe sortirajte licem nagore na Pijacu robe (Goods Market)'
        ],
        itemsEn: [
          playerCount === 2 
            ? 'Remove 12 Goods tiles randomly. Do not place goods on spaces marked "3" or "4"!'
            : playerCount === 3
            ? 'Remove 6 Goods tiles randomly. Do not place goods on spaces marked "4"!'
            : 'All road/waterway spaces receive a goods tile.',
          'Shuffle goods and place 1 tile face up on each valid route space',
          'Sort remaining goods face up on Goods Market'
        ]
      }
    ];
  };

  return (
    <div className="space-y-8">
      {/* Game Mode / Expansion Selection Banner */}
      <div className="bg-stone-900/95 border border-stone-800 rounded-xl p-6 shadow-xl space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-stone-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-500 uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4" />
              {language === 'sr' ? 'Izbor Edicije i Scenarija' : 'Expansion & Scenario Selection'}
            </div>
            <h2 className="text-2xl font-bold text-stone-100 font-display">
              {language === 'sr' ? 'Setup Vodič za Sve Ekspanzije' : 'Comprehensive Setup Assistant'}
            </h2>
          </div>

          {/* Expansion Selector Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-stone-950 border border-stone-800 rounded-xl">
            <button
              onClick={() => {
                setSelectedExpansion('base');
                setSelectedMode('base');
              }}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
                selectedExpansion === 'base'
                  ? 'bg-amber-600 text-stone-950 shadow-md font-extrabold'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              ⚜️ {language === 'sr' ? 'Osnovna Igra' : 'Base Game'}
            </button>

            <button
              onClick={() => {
                setSelectedExpansion('trade_intrigue');
                setSelectedMode('trade_orders');
              }}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
                selectedExpansion === 'trade_intrigue'
                  ? 'bg-amber-600 text-stone-950 shadow-md font-extrabold'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              📜 Trade & Intrigue
            </button>

            <button
              onClick={() => {
                setSelectedExpansion('invasion');
                setSelectedMode('invasion_prosperity');
              }}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
                selectedExpansion === 'invasion'
                  ? 'bg-amber-600 text-stone-950 shadow-md font-extrabold'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              ⚔️ Invasion (Velika Ekspanzija)
            </button>
          </div>
        </div>

        {/* Sub-scenario buttons when an expansion is selected */}
        {selectedExpansion === 'trade_intrigue' && (
          <div className="flex flex-wrap items-center gap-2 pt-1 pb-2">
            <span className="text-xs text-amber-400 font-semibold">{language === 'sr' ? 'Modul:' : 'Module:'}</span>
            <button
              onClick={() => setSelectedMode('trade_orders')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                selectedMode === 'trade_orders' ? 'bg-amber-600 text-stone-950 font-bold' : 'bg-stone-800 text-stone-300'
              }`}
            >
              📦 {language === 'sr' ? 'Narudžbine (Orders)' : 'Orders Module'}
            </button>
            <button
              onClick={() => setSelectedMode('trade_intrigue')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                selectedMode === 'trade_intrigue' ? 'bg-amber-600 text-stone-950 font-bold' : 'bg-stone-800 text-stone-300'
              }`}
            >
              🗡️ {language === 'sr' ? 'Intrige & Novi Događaji' : 'Intrigue & New Events'}
            </button>
          </div>
        )}

        {selectedExpansion === 'invasion' && (
          <div className="flex flex-wrap items-center gap-2 pt-1 pb-2">
            <span className="text-xs text-amber-400 font-semibold">{language === 'sr' ? 'Scenario:' : 'Scenario:'}</span>
            <button
              onClick={() => setSelectedMode('invasion_prosperity')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                selectedMode === 'invasion_prosperity' ? 'bg-amber-600 text-stone-950 font-bold' : 'bg-stone-800 text-stone-300'
              }`}
            >
              🏛️ {language === 'sr' ? 'Prosperity (Blagostanje)' : 'Prosperity (2-5p)'}
            </button>
            <button
              onClick={() => setSelectedMode('invasion_coop')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                selectedMode === 'invasion_coop' ? 'bg-amber-600 text-stone-950 font-bold' : 'bg-stone-800 text-stone-300'
              }`}
            >
              🛡️ {language === 'sr' ? 'Invasion (Kooperativno 2-5p)' : 'Invasion Co-op'}
            </button>
            <button
              onClick={() => {
                setSelectedMode('invasion_duel');
                setPlayerCount(2);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                selectedMode === 'invasion_duel' ? 'bg-amber-600 text-stone-950 font-bold' : 'bg-stone-800 text-stone-300'
              }`}
            >
              ⚔️ {language === 'sr' ? 'The Duel (Dvoboj za 2)' : 'The Duel (2p)'}
            </button>
            <button
              onClick={() => {
                setSelectedMode('invasion_solo_dignitary');
                setPlayerCount(2); // 1 player essentially
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                selectedMode.startsWith('invasion_solo') ? 'bg-amber-600 text-stone-950 font-bold' : 'bg-stone-800 text-stone-300'
              }`}
            >
              👤 {language === 'sr' ? 'Solo Scenariji' : 'Solo Scenarios'}
            </button>
          </div>
        )}

        {/* Player Count Selector & Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-stone-800">
          <div className="flex items-center gap-2 p-1.5 bg-stone-950 border border-stone-800 rounded-lg">
            <span className="text-xs text-stone-400 font-medium px-2">
              {language === 'sr' ? 'Broj igrača:' : 'Players:'}
            </span>
            {([2, 3, 4, ...(selectedExpansion === 'invasion' ? [5] : [])] as const).map(num => (
              <button
                key={num}
                onClick={() => {
                  setPlayerCount(num as any);
                  setGoodsDrawn(false);
                }}
                className={`px-3.5 py-1.5 rounded-md font-semibold text-xs md:text-sm transition cursor-pointer ${
                  playerCount === num
                    ? 'bg-amber-600 text-white shadow-md'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                {num} {language === 'sr' ? 'Igrača' : 'Players'}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveTab('checklist')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'checklist' ? 'bg-stone-800 text-amber-400 border border-amber-500/30' : 'text-stone-400'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              {language === 'sr' ? 'Koraci' : 'Steps'}
            </button>

            <button
              onClick={() => setActiveTab('adjustments')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'adjustments' ? 'bg-stone-800 text-amber-400 border border-amber-500/30' : 'text-stone-400'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              {language === 'sr' ? 'Uklanjanje' : 'Removals'}
            </button>

            <button
              onClick={() => setActiveTab('randomizer')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'randomizer' ? 'bg-stone-800 text-amber-400 border border-amber-500/30' : 'text-stone-400'
              }`}
            >
              <Shuffle className="w-3.5 h-3.5" />
              {language === 'sr' ? 'Roba' : 'Goods'}
            </button>
          </div>
        </div>
      </div>

      {/* TAB 1: STEPS */}
      {activeTab === 'checklist' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {getSetupSteps().map(step => {
              const isDone = completedSteps[step.id];
              return (
                <div
                  key={step.id}
                  onClick={() => toggleStep(step.id)}
                  className={`p-5 rounded-xl border transition-all cursor-pointer ${
                    isDone
                      ? 'bg-stone-900/60 border-emerald-800/60 text-stone-300'
                      : 'bg-stone-900/90 border-stone-800 hover:border-stone-700 text-stone-100 shadow-md'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <button
                      type="button"
                      aria-label={isDone ? 'Mark as incomplete' : 'Mark as complete'}
                      className="mt-1 text-emerald-500 hover:text-emerald-400 shrink-0"
                    >
                      {isDone ? <CheckCircle2 className="w-6 h-6 text-emerald-500" /> : <Circle className="w-6 h-6 text-stone-600" />}
                    </button>
                    <div>
                      <h3 className={`text-lg font-bold font-display ${isDone ? 'line-through text-stone-400' : 'text-stone-100'}`}>
                        {language === 'sr' ? step.titleSr : step.titleEn}
                      </h3>
                      <p className="text-sm text-stone-400 mt-0.5">
                        {language === 'sr' ? step.descSr : step.descEn}
                      </p>

                      <ul className="mt-3 space-y-1.5 pl-2 border-l-2 border-amber-600/40">
                        {(language === 'sr' ? step.itemsSr : step.itemsEn).map((item, idx) => (
                          <li key={idx} className="text-xs md:text-sm text-stone-300 flex items-start gap-2">
                            <span className="text-amber-500 font-bold">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: ADJUSTMENTS */}
      {activeTab === 'adjustments' && (
        <div className="bg-stone-900 border border-stone-800 rounded-xl p-6 space-y-4">
          <h3 className="text-xl font-bold font-display text-amber-400 flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-amber-500" />
            {language === 'sr' ? `Uklanjanje komponenti za ${playerCount} igrača:` : `Components to remove for ${playerCount} players:`}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-stone-950 p-5 rounded-xl border border-stone-800 space-y-3">
              <h4 className="font-bold text-stone-200 text-sm">{language === 'sr' ? 'Neutralni pratioci za uklanjanje:' : 'Neutral Followers:'}</h4>
              <div className="space-y-2">
                {Object.entries(setupData.neutralFollowersToRemove).map(([key, count]) => {
                  const f = FOLLOWERS_DATA[key];
                  return (
                    <div key={key} className="flex items-center justify-between p-2 rounded bg-stone-900/60 text-xs">
                      <div className="flex items-center gap-2">
                        <FollowerBadge type={key} size={22} />
                        <span>{language === 'sr' ? f.nameSr : f.nameEn}</span>
                      </div>
                      <span className="font-mono font-bold text-rose-400">- {count}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-stone-950 p-5 rounded-xl border border-stone-800 space-y-3">
              <h4 className="font-bold text-stone-200 text-sm">{language === 'sr' ? 'Roba i Ograničenja:' : 'Goods & Restrictions:'}</h4>
              <p className="text-xs text-amber-300">
                {language === 'sr' ? setupData.goodsBoardRestrictionsSr : setupData.goodsBoardRestrictionsEn}
              </p>
              <p className="text-xs text-stone-400">
                {language === 'sr' ? setupData.unusedPlayerTokensSr : setupData.unusedPlayerTokensEn}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: RANDOMIZER */}
      {activeTab === 'randomizer' && (
        <div className="bg-stone-900 border border-stone-800 rounded-xl p-6">
          <div className="flex items-center justify-between pb-4 border-b border-stone-800">
            <div>
              <h3 className="text-lg font-bold font-display text-amber-400">{language === 'sr' ? 'Generator uklanjanja robe' : 'Random Goods Removal'}</h3>
              <p className="text-xs text-stone-400">{language === 'sr' ? `Za ${playerCount} igrača uklanja se ${setupData.goodsToRemoveRandomly} robe.` : `Remove ${setupData.goodsToRemoveRandomly} goods for ${playerCount} players.`}</p>
            </div>
            {setupData.goodsToRemoveRandomly > 0 && (
              <button
                onClick={handleRandomizeGoodsRemoval}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold rounded-lg text-xs cursor-pointer"
              >
                {language === 'sr' ? 'Izvuci nasumično' : 'Draw Random'}
              </button>
            )}
          </div>

          {setupData.goodsToRemoveRandomly === 0 ? (
            <div className="py-8 text-center text-stone-400 text-sm">
              {language === 'sr' ? 'Za 4 i 5 igrača ne uklanja se roba.' : 'For 4 and 5 players, no goods are removed.'}
            </div>
          ) : goodsDrawn ? (
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-4">
              {removedGoods.map(item => (
                <div key={item.type} className="bg-stone-950 border border-stone-800 rounded-xl p-3 text-center">
                  <div className="text-xs font-bold text-stone-200">{GOODS_DATA[item.type].nameSr}</div>
                  <div className="text-lg font-mono font-bold text-rose-400 mt-1">- {item.count}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center">
              <button onClick={handleRandomizeGoodsRemoval} className="px-5 py-2.5 bg-stone-800 text-amber-400 rounded-lg text-xs font-bold cursor-pointer">
                {language === 'sr' ? 'Kliknite za izvlačenje robe' : 'Click to Draw Goods'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
