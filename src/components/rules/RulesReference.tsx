import { useState } from 'react';
import { Language } from '../../types/orleans';
import { FOLLOWERS_DATA, TORTURE_OPTIONS } from '../../data/rulesData';
import { 
  FollowerBadge, 
  TechCogIcon, 
  TradingStationIcon, 
  CitizenIcon, 
  DevStarIcon,
  FleurDeLisIcon,
  CoinIcon
} from '../common/Icons';
import { ShieldCheck, HelpCircle, AlertTriangle, Scale, BookOpen, Compass, Skull } from 'lucide-react';

interface RulesReferenceProps {
  language: Language;
}

export function RulesReference({ language }: RulesReferenceProps) {
  const [activeTab, setActiveTab] = useState<'general' | 'tech' | 'deeds' | 'torture'>('general');

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-stone-900/90 border border-stone-800 rounded-xl p-6 shadow-xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-stone-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-500 uppercase tracking-wider mb-1">
              <BookOpen className="w-4 h-4" />
              {language === 'sr' ? 'Pravilnik i Česta Pitanja' : 'Rulebook & FAQ Reference'}
            </div>
            <h2 className="text-2xl font-bold text-stone-100 font-display">
              {language === 'sr' ? 'Zvanična Pravila i Razrešenje Nedoumica' : 'Official Rules & Clarifications'}
            </h2>
            <p className="text-sm text-stone-400 mt-0.5">
              {language === 'sr' 
                ? 'Brza provera pravila za tehnologije, segensreiche werke (beneficial deeds), kretanje i mučenje.' 
                : 'Fast lookup for technology restrictions, town hall deeds, movement, and bankruptcy.'}
            </p>
          </div>

          <div className="flex items-center gap-2 p-1.5 bg-stone-950 border border-stone-800 rounded-lg">
            <button
              onClick={() => setActiveTab('general')}
              className={`px-3 py-1.5 text-xs font-bold rounded-md transition cursor-pointer ${
                activeTab === 'general' ? 'bg-amber-600 text-stone-950' : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              {language === 'sr' ? 'Opšta pravila' : 'General Rules'}
            </button>
            <button
              onClick={() => setActiveTab('tech')}
              className={`px-3 py-1.5 text-xs font-bold rounded-md transition cursor-pointer ${
                activeTab === 'tech' ? 'bg-amber-600 text-stone-950' : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              {language === 'sr' ? 'Tehnologije' : 'Technology'}
            </button>
            <button
              onClick={() => setActiveTab('deeds')}
              className={`px-3 py-1.5 text-xs font-bold rounded-md transition cursor-pointer ${
                activeTab === 'deeds' ? 'bg-amber-600 text-stone-950' : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              {language === 'sr' ? 'Gradska kuća & Dela' : 'Beneficial Deeds'}
            </button>
            <button
              onClick={() => setActiveTab('torture')}
              className={`px-3 py-1.5 text-xs font-bold rounded-md transition cursor-pointer ${
                activeTab === 'torture' ? 'bg-amber-600 text-stone-950' : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              {language === 'sr' ? 'Mučenje (Bankrot)' : 'Torture'}
            </button>
          </div>
        </div>

        {/* TAB 1: GENERAL RULES */}
        {activeTab === 'general' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Rule Card: Bag Check */}
            <div className="bg-stone-950/80 border border-stone-800 rounded-xl p-5 space-y-2">
              <h3 className="font-bold text-stone-100 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-500" />
                {language === 'sr' ? 'Provera sadržaja vrećice' : 'Checking on Your Followers'}
              </h3>
              <p className="text-xs text-stone-300 leading-relaxed">
                {language === 'sr'
                  ? 'U bilo kom trenutku tokom igre možete pogledati u svoju vrećicu da vidite koliko i koje pratioce imate. Kada završite, dobro promešajte vrećicu kako ne biste namerno vukli određene pločice.'
                  : 'At any time during the game, you may look into your bag to see how many and which Followers you have in there. Shake/shuffle well afterward.'}
              </p>
            </div>

            {/* Rule Card: Marked Starting Followers */}
            <div className="bg-stone-950/80 border border-stone-800 rounded-xl p-5 space-y-2">
              <h3 className="font-bold text-stone-100 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-500" />
                {language === 'sr' ? 'Početni pratioci u boji igrača' : 'Marked Starting Followers'}
              </h3>
              <p className="text-xs text-stone-300 leading-relaxed">
                {language === 'sr'
                  ? 'Vaša 4 početna pratioca (sa ivicom u vašoj boji) UVEK ostaju kod vas (u vrećici ili na tabli). NE MOGU se slati u Gradsku kuću (Beneficial Deeds), ne mogu se izgubiti od Kuge i ne mogu se žrtvovati u Mučenju!'
                  : 'Your initial 4 marked followers always stay with you. You cannot use them for Beneficial Deeds, lose them to the Plague, or pay with them during Torture.'}
              </p>
            </div>

            {/* Rule Card: Empty Roads & Waterways */}
            <div className="bg-stone-950/80 border border-stone-800 rounded-xl p-5 space-y-2">
              <h3 className="font-bold text-stone-100 flex items-center gap-2">
                <Compass className="w-4 h-4 text-amber-500" />
                {language === 'sr' ? 'Prazni putevi i reke' : 'Empty Roads & Waterways'}
              </h3>
              <p className="text-xs text-stone-300 leading-relaxed">
                {language === 'sr'
                  ? 'Možete se slobodno kretati preko puteva i vodotokova sa kojih je roba već uzeta (ili na kojima roba nije postavljena). Jednostavno u tom slučaju ne dobijate robu.'
                  : 'You may move along empty roads and waterways; you simply do not collect a goods tile.'}
              </p>
            </div>

            {/* Rule Card: Trading Stations in Orleans */}
            <div className="bg-stone-950/80 border border-stone-800 rounded-xl p-5 space-y-2">
              <h3 className="font-bold text-stone-100 flex items-center gap-2">
                <TradingStationIcon size={18} />
                {language === 'sr' ? 'Trgovačke ispostave u Orleanu (Izuzetak)' : 'Trading Stations in Orléans'}
              </h3>
              <p className="text-xs text-stone-300 leading-relaxed">
                {language === 'sr'
                  ? 'U svakom gradu na mapi može postojati samo JEDNA Trgovačka ispostava (bez obzira čija je). IZUZETAK: U gradu Orlean svaki igrač može sagraditi po jednu svoju Trgovačku ispostavu!'
                  : 'Each town can only have 1 Trading Station. Exception: In Orléans, EACH player may build one Trading Station.'}
              </p>
            </div>

            {/* Rule Card: Moving Placed Followers */}
            <div className="bg-stone-950/80 border border-stone-800 rounded-xl p-5 space-y-2 md:col-span-2">
              <h3 className="font-bold text-stone-100 flex items-center gap-2">
                <Scale className="w-4 h-4 text-amber-500" />
                {language === 'sr' ? 'Premeštanje radnika tokom Faze 3 (Izvlačenje)' : 'Placed Followers & Drawing Phase Rule'}
              </h3>
              <p className="text-xs text-stone-300 leading-relaxed">
                {language === 'sr'
                  ? 'Ne možete direktno premeštati radnike sa jednog akcionog polja na drugo. Međutim, tokom Faze 3 (Izvlačenje pratilaca), za svakog pratioca koga ODBIJETE da izvučete iz vrećice, možete umesto toga premestiti 1 pratioca sa akcionog polja nazad na svoju Pijacu (Market)!'
                  : 'You cannot move tiles directly from one action space to another. However, during Phase 3 (Followers), for each follower you decline to draw, you may move a follower from an action space back to your market.'}
              </p>
            </div>
          </div>
        )}

        {/* TAB 2: TECHNOLOGY TILES RULES */}
        {activeTab === 'tech' && (
          <div className="bg-stone-950/80 border border-stone-800 rounded-xl p-6 space-y-5">
            <h3 className="text-xl font-bold font-display text-amber-400 flex items-center gap-2">
              <TechCogIcon size={24} />
              {language === 'sr' ? 'Pravila za Pločice Tehnologije (Zupčanike)' : 'Technology Tiles Rules & Constraints'}
            </h3>

            <p className="text-sm text-stone-300">
              {language === 'sr'
                ? 'Kada napredujete na stazi zanatlija ili upotrebite Laboratoriju, dobijate pločicu tehnologije. Možete je postaviti tek NAKON što pasirate u toj rundi.'
                : 'When advancing on Craftsmen track or using Laboratory, gain a Technology Tile. Place it only after you pass.'}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-3.5 bg-stone-900 border border-stone-800 rounded-lg text-xs space-y-1">
                <span className="font-bold text-amber-400">1. Prva Tehnologija</span>
                <p className="text-stone-300">
                  {language === 'sr' ? 'PRVA tehnologija koju postavite u igri MORA zameniti Seljaka (Farmer).' : 'The FIRST Technology Tile placed in a game MUST replace a Farmer.'}
                </p>
              </div>

              <div className="p-3.5 bg-stone-900 border border-stone-800 rounded-lg text-xs space-y-1">
                <span className="font-bold text-amber-400">2. Naredne Tehnologije</span>
                <p className="text-stone-300">
                  {language === 'sr' ? 'Sve sledeće tehnologije mogu zameniti BILO KOG pratioca OSIM Monaha.' : 'Subsequent Technology Tiles may replace any character EXCEPT Monks.'}
                </p>
              </div>

              <div className="p-3.5 bg-stone-900 border border-stone-800 rounded-lg text-xs space-y-1">
                <span className="font-bold text-amber-400">3. Zabrana za Monaha</span>
                <p className="text-stone-300">
                  {language === 'sr' ? 'Monah (Monk) se NIKADA ne može zameniti pločicom tehnologije!' : 'Monks can NEVER be replaced with Technology Tiles.'}
                </p>
              </div>

              <div className="p-3.5 bg-stone-900 border border-stone-800 rounded-lg text-xs space-y-1">
                <span className="font-bold text-amber-400">4. Maksimalno 1 po zgradi</span>
                <p className="text-stone-300">
                  {language === 'sr' ? 'Ne možete postaviti više od 1 tehnologije na istu zgradu/akciju.' : 'You may not place more than 1 Technology Tile at one Place.'}
                </p>
              </div>

              <div className="p-3.5 bg-stone-900 border border-stone-800 rounded-lg text-xs space-y-1">
                <span className="font-bold text-amber-400">5. Zabrana na zgradama sa 1 radnikom</span>
                <p className="text-stone-300">
                  {language === 'sr' ? 'Ne možete staviti tehnologiju na akciju koja zahteva samo 1 pratioca.' : 'Cannot place a Tech Tile on a Place requiring only a single character.'}
                </p>
              </div>

              <div className="p-3.5 bg-stone-900 border border-stone-800 rounded-lg text-xs space-y-1">
                <span className="font-bold text-amber-400">6. Trajnost</span>
                <p className="text-stone-300">
                  {language === 'sr' ? 'Kada se jednom postavi, tehnologija se NE MOŽE pomerati i ostaje trajno do kraja igre.' : 'Once placed, Tech Tiles cannot be moved and stay forever.'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: TOWN HALL & BENEFICIAL DEEDS */}
        {activeTab === 'deeds' && (
          <div className="bg-stone-950/80 border border-stone-800 rounded-xl p-6 space-y-5">
            <h3 className="text-xl font-bold font-display text-amber-400 flex items-center gap-2">
              <CitizenIcon size={24} />
              {language === 'sr' ? 'Gradska kuća i Dobrotvorna Dela (Segensreiche Werke)' : 'Town Hall & Beneficial Deeds'}
            </h3>

            <div className="space-y-3 text-xs md:text-sm text-stone-300 leading-relaxed">
              <div className="p-4 bg-stone-900 border border-stone-800 rounded-xl space-y-2">
                <span className="font-bold text-amber-400 text-sm">{language === 'sr' ? 'Slanje pratilaca iz Gradske kuće:' : 'Sending Followers from Town Hall:'}</span>
                <p>
                  {language === 'sr'
                    ? 'Tokom faze planiranja možete postaviti 1 ili 2 pratioca u Gradsku kuću (Rathaus). Kada aktivirate akciju, šaljete ih na slobodna odgovarajuća polja na tabli Dobrotvornih dela (Beneficial Deeds).'
                    : 'Place 1 or 2 followers in Town Hall during planning. Move them to free matching spaces on the Beneficial Deeds board.'}
                </p>
              </div>

              <div className="p-4 bg-stone-900 border border-stone-800 rounded-xl space-y-2">
                <span className="font-bold text-amber-400 text-sm">{language === 'sr' ? 'Nagrade i Građani:' : 'Rewards & Citizen Tiles:'}</span>
                <p>
                  {language === 'sr'
                    ? 'Za svakog poslatog pratioca dobijate prikazanu nagradu (1, 2 ili 3 novčića, a kod Kanalizacije 1 novčić ili 1 Razvojni poen). Igrač koji postavi POSLEDNJEG potrebnog pratioca na delo (tj. završi ga) dobija žeton Građanina!'
                    : 'Receive depicted rewards (1-3 coins or Dev point). The player who places the LAST tile to complete a Beneficial Deed receives its Citizen Tile.'}
                </p>
              </div>

              <div className="p-4 bg-rose-950/30 border border-rose-800/40 rounded-xl space-y-2">
                <span className="font-bold text-rose-300 text-sm">⚠️ {language === 'sr' ? 'Stroge zabrane:' : 'Strict Constraints:'}</span>
                <p>
                  {language === 'sr'
                    ? '1. NE SMETE koristiti Monaha kao zamenu za pratioce na Dobrotvornim delima (mora biti tačan traženi pratilac!).\n2. NE SMETE slati svoje početne pratioce u boji igrača na Dobrotvorna dela!'
                    : '1. Monks CANNOT substitute required character tiles on Beneficial Deeds.\n2. You CANNOT send your starting player-colored followers to Beneficial Deeds!'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: TORTURE */}
        {activeTab === 'torture' && (
          <div className="bg-stone-950/80 border border-stone-800 rounded-xl p-6 space-y-5">
            <h3 className="text-xl font-bold font-display text-rose-400 flex items-center gap-2">
              <Skull className="w-5 h-5" />
              {language === 'sr' ? 'Detaljna pravila Mučenja (Torture)' : 'Detailed Torture Rules'}
            </h3>

            <p className="text-xs md:text-sm text-stone-300 leading-relaxed">
              {language === 'sr'
                ? 'Ako morate da platite novčić (npr. u Popisu, Žetvi ili Porezu) a nemate dovoljno, morate pretrpeti Mučenje. Možete kombinovati bilo koje stavke sa ove liste za svaki novčić koji dugujete:'
                : 'If you owe coins and cannot pay, undergo Torture. Replace each missing coin with any item from this list:'}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {TORTURE_OPTIONS.map((opt, idx) => (
                <div key={opt.id} className="p-3.5 bg-stone-900 border border-stone-800 rounded-xl">
                  <div className="text-xs font-bold text-rose-300 mb-1">
                    #{idx + 1} {language === 'sr' ? opt.nameSr : opt.nameEn}
                  </div>
                  <div className="text-[11px] text-stone-400">
                    {language === 'sr' ? opt.descSr : opt.descEn}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
