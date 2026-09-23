export type Language = 'sr' | 'en';

export type GameExpansion = 'base' | 'trade_intrigue' | 'invasion';

export type GameMode = 
  | 'base'
  | 'trade_orders'
  | 'trade_intrigue'
  | 'invasion_prosperity'
  | 'invasion_coop'
  | 'invasion_duel'
  | 'invasion_solo_dignitary'
  | 'invasion_solo_vierzon'
  | 'invasion_solo_salesman';

export type FollowerType = 'farmer' | 'boatman' | 'craftsman' | 'trader' | 'knight' | 'scholar' | 'monk';

export type GoodType = 'brocade' | 'wool' | 'wine' | 'cheese' | 'grain';

export type EventSeverity = 'positive' | 'negative' | 'restriction' | 'payment' | 'special';

export interface EventDefinition {
  id: string;
  nameSr: string;
  nameEn: string;
  originalName: string; // German name as printed on tiles
  expansion: GameExpansion;
  scenarioOrPile?: string; // e.g., 'Pile A', 'Pile B', 'Pile C', 'Pile D', 'Prosperity', 'Invasion A', 'Invasion B', 'Duel', 'Solo'
  phase?: number;
  phaseNameSr: string;
  phaseNameEn: string;
  descriptionSr: string;
  descriptionEn: string;
  rulesDetailSr?: string;
  rulesDetailEn?: string;
  severity: EventSeverity;
  count?: number;
}

export interface GoodDefinition {
  id: GoodType;
  nameSr: string;
  nameEn: string;
  vp: number;
  totalInGame: number;
  color: string;
  iconBg: string;
}

export interface FollowerDefinition {
  id: FollowerType;
  nameSr: string;
  nameEn: string;
  trackNameSr: string;
  trackNameEn: string;
  color: string;
  totalNeutral: number;
  trackRewardSr: string;
  trackRewardEn: string;
  bonusDescSr: string;
  bonusDescEn: string;
}

export type PlaceCategory = 'I' | 'II' | 'expansion';

export interface PlaceTileDefinition {
  id: string;
  nameSr: string;
  nameEn: string;
  originalName: string;
  expansion: GameExpansion;
  category: PlaceCategory;
  workersNeeded: FollowerType[];
  anyWorker?: boolean;
  effectSr: string;
  effectEn: string;
  tipSr?: string;
  tipEn?: string;
  type: 'goods' | 'coins' | 'development' | 'special' | 'movement';
}

export interface PlayerScore {
  id: string;
  name: string;
  color: 'blue' | 'red' | 'yellow' | 'green' | 'black';
  coins: number;
  brocade: number;
  wool: number;
  wine: number;
  cheese: number;
  grain: number;
  tradingStations: number;
  citizenTiles: number;
  developmentStatus: number;
  developmentTrackPosition: number;
  hasMostTradingStationsBonus: boolean;
  ordersVP: number;
  merchantHouseGoodsCount: number;
  completedStructuresVP: number;
  hasDepotCompleteSets: number;
  duelObjectivesCompleted: number;
}

export interface CoopInvasionState {
  playerCount: 2 | 3 | 4 | 5;
  cityWallsKnightsPlaced: number;
  citizenTilesCollected: number;
  cityTreasuryCoins: number;
  warehouseGrain: number;
  warehouseCheese: number;
  warehouseWine: number;
  fortifiedTowersBuilt: number;
  characterCardsCompleted: Record<string, boolean>;
}

export interface GameHistoryRecord {
  id: string;
  date: string;
  gameMode: GameMode;
  playerCount: number;
  scores: {
    name: string;
    color: string;
    totalVP: number;
    coinsVP: number;
    goodsVP: number;
    stationsAndCitizensVP: number;
    ordersVP?: number;
    structuresVP?: number;
    rank: number;
  }[];
  winner: string;
  coopWon?: boolean;
}
