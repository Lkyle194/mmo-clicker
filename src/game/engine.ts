// MMO Clicker — Moteur de jeu (port fidèle de GameEngine.kt)
import {
  CLASSES, getClass, UNITS, getUnit, SPECS, RELICS, POTIONS, TIERS, getTier,
  type ClassId, type UnitDef, type SpecNode, type RelicDef, type PotionDef,
} from './data';

export interface GameState {
  gold: number;
  totalGold: number;
  gems: number;
  level: number;
  xp: number;
  xpToNext: number;
  tier: number; // 1-6
  prestige: number;
  prestigeCount: number;
  selectedClass: ClassId;
  totalClicks: number;
  units: Record<string, number>; // id -> count
  unlockedSpecs: string[]; // "classId:tree:level"
  unlockedRelics: string[]; // relic ids
  activePotion: { id: string; endsAt: number } | null;
  lastSave: number;
}

export const SAVE_KEY = 'mmo-clicker-save-v1';

export function defaultState(): GameState {
  return {
    gold: 0, totalGold: 0, gems: 0, level: 1, xp: 0, xpToNext: 100,
    tier: 1, prestige: 0, prestigeCount: 0, selectedClass: 'gardien',
    totalClicks: 0, units: {}, unlockedSpecs: [], unlockedRelics: [],
    activePotion: null, lastSave: Date.now(),
  };
}

// ── Formules de progression ──
export function xpForLevel(level: number): number {
  return Math.floor(100 * Math.pow(1.15, level - 1));
}

// ── Multiplicateurs ──
export function specBonuses(state: GameState) {
  let rps = 0, rpc = 0, gem = 0;
  for (const key of state.unlockedSpecs) {
    const [cls, tree, lvl] = key.split(':').map(Number);
    const node = SPECS.find(s => s.classId === cls && s.tree === tree && s.level === lvl);
    if (node) { rps += node.rpsBonus; rpc += node.rpcBonus; gem += node.gemBonus; }
  }
  return { rps, rpc, gem };
}

export function relicBonuses(state: GameState) {
  let click = 0, global = 0, rps = 0, gem = 0;
  for (const id of state.unlockedRelics) {
    const r = RELICS.find(x => x.id === id);
    if (r) { click += r.clickBonus; global += r.globalBonus; rps += r.rpsBonus; gem += r.gemBonus; }
  }
  return { click, global, rps, gem };
}

export function potionBonus(state: GameState) {
  if (!state.activePotion) return { click: 0, global: 0 };
  if (Date.now() > state.activePotion.endsAt) return { click: 0, global: 0 };
  const p = POTIONS.find(x => x.id === state.activePotion!.id);
  return p ? { click: p.clickBonus, global: p.globalBonus } : { click: 0, global: 0 };
}

// ── Calculs dérivés ──
export function computeRPS(state: GameState): number {
  const cls = getClass(state.selectedClass);
  let base = cls.baseRPS * cls.rpsMultiplier;
  // compagnons
  let unitRPS = 0;
  for (const [id, count] of Object.entries(state.units)) {
    const u = getUnit(id);
    if (u && count > 0) unitRPS += u.baseRPS * count;
  }
  const spec = specBonuses(state);
  const relic = relicBonuses(state);
  const potion = potionBonus(state);
  const total = (base + unitRPS) * (1 + spec.rps + relic.rps + relic.global + potion.global);
  return total;
}

export function computeRPC(state: GameState): number {
  const cls = getClass(state.selectedClass);
  let base = cls.baseRPC * cls.rpcMultiplier;
  const spec = specBonuses(state);
  const relic = relicBonuses(state);
  const potion = potionBonus(state);
  return base * (1 + spec.rpc + relic.click + relic.global + potion.global + potion.click);
}

export function computeGemMult(state: GameState): number {
  const spec = specBonuses(state);
  const relic = relicBonuses(state);
  return 1 + spec.gem + relic.gem;
}

// ── Coûts ──
export function unitCost(u: UnitDef, owned: number): number {
  return Math.floor(u.cost * Math.pow(1.15, owned));
}

export function specKey(cls: ClassId, tree: number, level: number): string {
  return `${cls}:${tree}:${level}`;
}

export function specUnlocked(state: GameState, node: SpecNode): boolean {
  return state.unlockedSpecs.includes(specKey(node.classId, node.tree, node.level));
}

export function specAvailable(state: GameState, node: SpecNode): boolean {
  if (specUnlocked(state, node)) return false;
  if (state.selectedClass !== node.classId) return false;
  if (state.totalClicks < node.threshold) return false;
  // le niveau précédent doit être débloqué
  if (node.level > 1) {
    const prev = SPECS.find(s => s.classId === node.classId && s.tree === node.tree && s.level === node.level - 1);
    if (prev && !specUnlocked(state, prev)) return false;
  }
  return true;
}

export function relicUnlocked(state: GameState, r: RelicDef): boolean {
  return state.unlockedRelics.includes(r.id);
}

export function relicAvailable(state: GameState, r: RelicDef): boolean {
  if (relicUnlocked(state, r)) return false;
  if (state.prestige < r.cost) return false;
  return checkRelicCondition(state, r.condition);
}

export function checkRelicCondition(state: GameState, cond: string): boolean {
  switch (cond) {
    case 'palier_2': return state.tier >= 2;
    case 'palier_3': return state.tier >= 3;
    case 'palier_4': return state.tier >= 4;
    case 'palier_5': return state.tier >= 5;
    case 'palier_6': return state.tier >= 6;
    case 'clics_10000': return state.totalClicks >= 10000;
    case 'level_25': return state.level >= 25;
    case 'gold_100000': return state.totalGold >= 100000;
    default: return true;
  }
}

// ── Actions ──
export function doClick(state: GameState): number {
  const rpc = computeRPC(state);
  state.gold += rpc;
  state.totalGold += rpc;
  state.totalClicks += 1;
  gainXP(state, rpc);
  return rpc;
}

export function gainXP(state: GameState, amount: number): void {
  state.xp += amount;
  while (state.xp >= state.xpToNext) {
    state.xp -= state.xpToNext;
    state.level += 1;
    state.xpToNext = xpForLevel(state.level);
    // gemme par niveau
    state.gems += 1;
  }
}

export function buyUnit(state: GameState, id: string): boolean {
  const u = getUnit(id);
  if (!u) return false;
  if (state.tier < u.unlockPalier) return false;
  const owned = state.units[id] || 0;
  const cost = unitCost(u, owned);
  if (state.gold < cost) return false;
  state.gold -= cost;
  state.units[id] = owned + 1;
  return true;
}

export function unlockSpec(state: GameState, node: SpecNode): boolean {
  if (!specAvailable(state, node)) return false;
  state.unlockedSpecs.push(specKey(node.classId, node.tree, node.level));
  return true;
}

export function unlockRelic(state: GameState, r: RelicDef): boolean {
  if (!relicAvailable(state, r)) return false;
  state.prestige -= r.cost;
  state.unlockedRelics.push(r.id);
  return true;
}

export function usePotion(state: GameState, id: string): boolean {
  const p = POTIONS.find(x => x.id === id);
  if (!p) return false;
  if (state.gems < p.cost) return false;
  state.gems -= p.cost;
  state.activePotion = { id, endsAt: Date.now() + p.durationMs };
  return true;
}

export function selectClass(state: GameState, id: ClassId): void {
  state.selectedClass = id;
}

// ── Paliers ──
export function canUpgradeTier(state: GameState): boolean {
  if (state.tier >= TIERS.length) return false;
  const next = TIERS[state.tier]; // index = tier (0-based) -> palier suivant
  return state.totalGold >= next.threshold;
}

export function upgradeTier(state: GameState): boolean {
  if (!canUpgradeTier(state)) return false;
  state.tier += 1;
  return true;
}

// ── Prestige ──
export function prestigeGain(state: GameState): number {
  // points de prestige = racine carrée de l'or total / 1000, min 0
  return Math.floor(Math.sqrt(state.totalGold / 1000));
}

export function doPrestige(state: GameState): boolean {
  const gain = prestigeGain(state);
  if (gain < 1) return false;
  state.prestige += gain;
  state.prestigeCount += 1;
  // reset progression (conserve les reliques)
  state.gold = 0;
  state.totalGold = 0;
  state.gems = 0;
  state.level = 1;
  state.xp = 0;
  state.xpToNext = xpForLevel(1);
  state.tier = 1;
  state.totalClicks = 0;
  state.units = {};
  state.unlockedSpecs = [];
  state.activePotion = null;
  return true;
}

// ── Tick passif (RPS) ──
export function tick(state: GameState, dtMs: number): void {
  const rps = computeRPS(state);
  const gain = rps * (dtMs / 1000);
  if (gain > 0) {
    state.gold += gain;
    state.totalGold += gain;
    gainXP(state, gain);
  }
  // expiration potion
  if (state.activePotion && Date.now() > state.activePotion.endsAt) {
    state.activePotion = null;
  }
}

// ── Sauvegarde ──
export function save(state: GameState): void {
  state.lastSave = Date.now();
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(state));
  } catch { /* quota / private mode */ }
}

export function load(): GameState {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return defaultState();
    const parsed = JSON.parse(raw);
    return { ...defaultState(), ...parsed };
  } catch {
    return defaultState();
  }
}

export function resetSave(): void {
  try { localStorage.removeItem(SAVE_KEY); } catch { /* noop */ }
}
