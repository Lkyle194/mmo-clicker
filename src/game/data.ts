// MMO Clicker — Données de jeu (port fidèle du moteur Kotlin)

export type ClassId = 'gardien' | 'sage' | 'berserck' | 'rune';

export interface GameClassDef {
  id: ClassId;
  name: string;
  role: string;
  description: string;
  icon: string;
  color: string;
  baseRPC: number;
  baseRPS: number;
  rpcMultiplier: number;
  rpsMultiplier: number;
  companionHealthBonus: number;
}

export const CLASSES: GameClassDef[] = [
  { id: 'gardien', name: 'Gardien', role: 'Tank', description: 'Absorber les dégâts, protéger', icon: '🛡️', color: '#3b82f6', baseRPC: 10, baseRPS: 5, rpcMultiplier: 1.0, rpsMultiplier: 1.0, companionHealthBonus: 0.50 },
  { id: 'sage', name: 'Sage', role: 'Healer', description: 'Soigner, soutenir', icon: '✨', color: '#10b981', baseRPC: 5, baseRPS: 15, rpcMultiplier: 1.0, rpsMultiplier: 1.30, companionHealthBonus: 0.0 },
  { id: 'berserck', name: 'Berserck', role: 'DPS', description: 'Détruire rapidement', icon: '⚔️', color: '#ef4444', baseRPC: 25, baseRPS: 3, rpcMultiplier: 2.0, rpsMultiplier: 1.0, companionHealthBonus: 0.0 },
  { id: 'rune', name: 'Rune', role: 'Support', description: 'Buffs, multiplicateurs', icon: '🔮', color: '#8b5cf6', baseRPC: 8, baseRPS: 8, rpcMultiplier: 1.25, rpsMultiplier: 1.25, companionHealthBonus: 0.0 },
];

export function getClass(id: ClassId): GameClassDef {
  return CLASSES.find(c => c.id === id) || CLASSES[0];
}

// ── Compagnons (36 unités, 6 paliers × 6) ──
export interface UnitDef {
  id: string;
  name: string;
  description: string;
  icon: string;
  baseRPS: number;
  cost: number;
  unlockPalier: number;
}

export const UNITS: UnitDef[] = [
  // Palier 1 — Village
  { id: 'squelette', name: 'Squelette', description: 'Un simple squelette qui ramasse des os', icon: '💀', baseRPS: 1, cost: 100, unlockPalier: 1 },
  { id: 'loup', name: 'Loup', description: 'Un loup affamé qui traque ses proies', icon: '🐺', baseRPS: 2, cost: 250, unlockPalier: 1 },
  { id: 'chat', name: 'Chat de Rune', description: 'Un chat qui canalise la magie', icon: '🐱', baseRPS: 3, cost: 500, unlockPalier: 1 },
  { id: 'nain', name: 'Nain Mineur', description: 'Un nain qui extrait des ressources', icon: '⛏️', baseRPS: 5, cost: 1000, unlockPalier: 1 },
  { id: 'oiseau', name: 'Oiseau Messager', description: 'Un oiseau qui rapporte des trésors', icon: '🦅', baseRPS: 8, cost: 2000, unlockPalier: 1 },
  { id: 'cheval', name: 'Cheval de Guerre', description: 'Un cheval rapide et puissant', icon: '🐴', baseRPS: 12, cost: 3500, unlockPalier: 1 },
  // Palier 2 — Hameau
  { id: 'gobelin', name: 'Gobelin', description: 'Un gobelin rusé et malin', icon: '👺', baseRPS: 20, cost: 1250, unlockPalier: 2 },
  { id: 'araignee', name: 'Ara géante', description: 'Une araignée géante venimeuse', icon: '🕷️', baseRPS: 30, cost: 2500, unlockPalier: 2 },
  { id: 'sorcier', name: 'Sorcier', description: 'Un sorcier qui lance des sorts', icon: '🧙', baseRPS: 45, cost: 5000, unlockPalier: 2 },
  { id: 'golem', name: 'Golem de Pierre', description: 'Un golem de pierre solide', icon: '🗿', baseRPS: 70, cost: 10000, unlockPalier: 2 },
  { id: 'lycan', name: 'Lycan', description: 'Un lycan transformé à la pleine lune', icon: '🐺', baseRPS: 100, cost: 17500, unlockPalier: 2 },
  { id: 'dragon', name: 'Dragonceau', description: 'Un jeune dragon en croissance', icon: '🐉', baseRPS: 150, cost: 25000, unlockPalier: 2 },
  // Palier 3 — Bourg
  { id: 'skeleton_king', name: 'Roi Squelette', description: 'Le roi des squelettes', icon: '💀', baseRPS: 250, cost: 12500, unlockPalier: 3 },
  { id: 'wolf_alpha', name: 'Loup Alpha', description: 'Le chef des loups', icon: '🐺', baseRPS: 375, cost: 25000, unlockPalier: 3 },
  { id: 'cat_mage', name: 'Chat Mage', description: 'Un chat de rune puissant', icon: '🐱', baseRPS: 560, cost: 50000, unlockPalier: 3 },
  { id: 'dwarf_king', name: 'Roi Nain', description: 'Le roi des nains mineurs', icon: '⛏️', baseRPS: 850, cost: 100000, unlockPalier: 3 },
  { id: 'bird_legend', name: 'Oiseau Légendaire', description: 'Un oiseau de légende', icon: '🦅', baseRPS: 1250, cost: 175000, unlockPalier: 3 },
  { id: 'horse_legend', name: 'Cheval Légendaire', description: 'Un cheval de légende', icon: '🐴', baseRPS: 1875, cost: 250000, unlockPalier: 3 },
  // Palier 4 — Ville
  { id: 'goblin_chief', name: 'Chef Gobelin', description: 'Le chef des gobelins', icon: '👺', baseRPS: 3000, cost: 62500, unlockPalier: 4 },
  { id: 'spider_queen', name: 'Reine Araignée', description: 'La reine des araignées', icon: '🕷️', baseRPS: 4500, cost: 125000, unlockPalier: 4 },
  { id: 'arch_sorcier', name: 'Archisorcier', description: "L'archisorcier suprême", icon: '🧙', baseRPS: 6750, cost: 250000, unlockPalier: 4 },
  { id: 'golem_giant', name: 'Géant de Pierre', description: 'Un géant de pierre massif', icon: '🗿', baseRPS: 10000, cost: 500000, unlockPalier: 4 },
  { id: 'lycan_king', name: 'Roi Lycan', description: 'Le roi des lycans', icon: '🐺', baseRPS: 15000, cost: 875000, unlockPalier: 4 },
  { id: 'dragon_elder', name: 'Doyen Dragon', description: 'Un dragon ancien et puissant', icon: '🐉', baseRPS: 22500, cost: 1250000, unlockPalier: 4 },
  // Palier 5 — Cité
  { id: 'skeleton_emperor', name: 'Empereur Squelette', description: "L'empereur des squelettes", icon: '💀', baseRPS: 35000, cost: 312500, unlockPalier: 5 },
  { id: 'wolf_emperor', name: 'Empereur Loup', description: "L'empereur des loups", icon: '🐺', baseRPS: 52500, cost: 625000, unlockPalier: 5 },
  { id: 'cat_emperor', name: 'Empereur Chat', description: "L'empereur des chats de rune", icon: '🐱', baseRPS: 78750, cost: 1250000, unlockPalier: 5 },
  { id: 'dwarf_emperor', name: 'Empereur Nain', description: "L'empereur des nains", icon: '⛏️', baseRPS: 118125, cost: 2500000, unlockPalier: 5 },
  { id: 'bird_emperor', name: 'Empereur Oiseau', description: "L'empereur des oiseaux", icon: '🦅', baseRPS: 177187.5, cost: 4375000, unlockPalier: 5 },
  { id: 'horse_emperor', name: 'Empereur Cheval', description: "L'empereur des chevaux", icon: '🐴', baseRPS: 265781.25, cost: 6250000, unlockPalier: 5 },
  // Palier 6 — Abysses
  { id: 'goblin_emperor', name: 'Empereur Gobelin', description: "L'empereur des gobelins", icon: '👺', baseRPS: 400000, cost: 1562500, unlockPalier: 6 },
  { id: 'spider_empress', name: 'Impératrice Araignée', description: "L'impératrice des araignées", icon: '🕷️', baseRPS: 600000, cost: 3125000, unlockPalier: 6 },
  { id: 'arch_sage', name: 'Arch Sage', description: "L'arch sage ultime", icon: '🧙', baseRPS: 900000, cost: 6250000, unlockPalier: 6 },
  { id: 'golem_colossus', name: 'Colosse de Pierre', description: 'Un colosse de pierre', icon: '🗿', baseRPS: 1350000, cost: 12500000, unlockPalier: 6 },
  { id: 'lycan_emperor', name: 'Empereur Lycan', description: "L'empereur des lycans", icon: '🐺', baseRPS: 2025000, cost: 25000000, unlockPalier: 6 },
  { id: 'dragon_emperor', name: 'Empereur Dragon', description: "L'empereur des dragons", icon: '🐉', baseRPS: 3037500, cost: 50000000, unlockPalier: 6 },
];

export function getUnit(id: string): UnitDef | undefined {
  return UNITS.find(u => u.id === id);
}

// ── Spécialisations (60 nœuds : 4 classes × 3 arbres × 5 niveaux) ──
export interface SpecNode {
  classId: ClassId;
  tree: number; // 0,1,2
  level: number; // 1-5
  name: string;
  description: string;
  threshold: number; // clics totaux requis
  rpsBonus: number;
  rpcBonus: number;
  gemBonus: number;
}

function specNodes(cls: ClassId, tree: number, names: string[], descs: string[], rps: number[], rpc: number[], gem: number[]): SpecNode[] {
  const thresholds = [100, 150, 225, 337, 506];
  return names.map((name, i) => ({
    classId: cls, tree, level: i + 1, name, description: descs[i],
    threshold: thresholds[i], rpsBonus: rps[i], rpcBonus: rpc[i], gemBonus: gem[i],
  }));
}

export const SPECS: SpecNode[] = [
  // Gardien — Défense / Contre-attaque / Régénération
  ...specNodes('gardien', 0, ['Peau de Roc', 'Forteresse Vivante', "Mur d'Ébène", 'Citadelle Imprenable', 'Gardien Éternel'], ['+10% vie compagnons', '+20% vie compagnons', '+30% vie compagnons', '+40% vie compagnons', '+50% vie compagnons'], [0.10, 0.20, 0.30, 0.40, 0.50], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0]),
  ...specNodes('gardien', 1, ['Contre-Attaque I', 'Contre-Attaque II', 'Contre-Attaque III', 'Contre-Attaque IV', 'Contre-Attaque V'], ['+5% RPC', '+10% RPC', '+15% RPC', '+20% RPC', '+25% RPC'], [0, 0, 0, 0, 0], [0.05, 0.10, 0.15, 0.20, 0.25], [0, 0, 0, 0, 0]),
  ...specNodes('gardien', 2, ['Régénération I', 'Régénération II', 'Régénération III', 'Régénération IV', 'Régénération V'], ['+5% RPS', '+10% RPS', '+15% RPS', '+20% RPS', '+25% RPS'], [0.05, 0.10, 0.15, 0.20, 0.25], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0]),
  // Sage — Soin / Soutien / Sagesse
  ...specNodes('sage', 0, ['Soin I', 'Soin II', 'Soin III', 'Soin IV', 'Soin V'], ['+5% RPS', '+10% RPS', '+15% RPS', '+20% RPS', '+25% RPS'], [0.05, 0.10, 0.15, 0.20, 0.25], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0]),
  ...specNodes('sage', 1, ['Soutien I', 'Soutien II', 'Soutien III', 'Soutien IV', 'Soutien V'], ['+5% RPC', '+10% RPC', '+15% RPC', '+20% RPC', '+25% RPC'], [0, 0, 0, 0, 0], [0.05, 0.10, 0.15, 0.20, 0.25], [0, 0, 0, 0, 0]),
  ...specNodes('sage', 2, ['Sagesse I', 'Sagesse II', 'Sagesse III', 'Sagesse IV', 'Sagesse V'], ['+5% gemmes', '+10% gemmes', '+15% gemmes', '+20% gemmes', '+25% gemmes'], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0.05, 0.10, 0.15, 0.20, 0.25]),
  // Berserck — Puissance / Vitesse / Fureur
  ...specNodes('berserck', 0, ['Puissance I', 'Puissance II', 'Puissance III', 'Puissance IV', 'Puissance V'], ['+10% RPC', '+20% RPC', '+30% RPC', '+40% RPC', '+50% RPC'], [0, 0, 0, 0, 0], [0.10, 0.20, 0.30, 0.40, 0.50], [0, 0, 0, 0, 0]),
  ...specNodes('berserck', 1, ['Vitesse I', 'Vitesse II', 'Vitesse III', 'Vitesse IV', 'Vitesse V'], ['+5% RPS', '+10% RPS', '+15% RPS', '+20% RPS', '+25% RPS'], [0.05, 0.10, 0.15, 0.20, 0.25], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0]),
  ...specNodes('berserck', 2, ['Fureur I', 'Fureur II', 'Fureur III', 'Fureur IV', 'Fureur V'], ['+5% gemmes', '+10% gemmes', '+15% gemmes', '+20% gemmes', '+25% gemmes'], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0.05, 0.10, 0.15, 0.20, 0.25]),
  // Rune — Puissance / Force / Chance
  ...specNodes('rune', 0, ['Rune de Puissance I', 'Rune de Puissance II', 'Rune de Puissance III', 'Rune de Puissance IV', 'Rune de Puissance V'], ['+5% RPS', '+10% RPS', '+15% RPS', '+20% RPS', '+25% RPS'], [0.05, 0.10, 0.15, 0.20, 0.25], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0]),
  ...specNodes('rune', 1, ['Rune de Force I', 'Rune de Force II', 'Rune de Force III', 'Rune de Force IV', 'Rune de Force V'], ['+5% RPC', '+10% RPC', '+15% RPC', '+20% RPC', '+25% RPC'], [0, 0, 0, 0, 0], [0.05, 0.10, 0.15, 0.20, 0.25], [0, 0, 0, 0, 0]),
  ...specNodes('rune', 2, ['Rune de Chance I', 'Rune de Chance II', 'Rune de Chance III', 'Rune de Chance IV', 'Rune de Chance V'], ['+5% gemmes', '+10% gemmes', '+15% gemmes', '+20% gemmes', '+25% gemmes'], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0.05, 0.10, 0.15, 0.20, 0.25]),
];

export const TREE_NAMES: Record<ClassId, string[]> = {
  gardien: ['Défense', 'Contre-attaque', 'Régénération'],
  sage: ['Soin', 'Soutien', 'Sagesse'],
  berserck: ['Puissance', 'Vitesse', 'Fureur'],
  rune: ['Puissance', 'Force', 'Chance'],
};

// ── Reliques (prestige) ──
export interface RelicDef {
  id: string;
  name: string;
  description: string;
  icon: string;
  clickBonus: number;
  globalBonus: number;
  rpsBonus: number;
  gemBonus: number;
  condition: string;
  conditionLabel: string;
  cost: number; // points de prestige
}

export const RELICS: RelicDef[] = [
  { id: 'relique_os', name: 'Os Ancien', description: '+10% RPC', icon: '🦴', clickBonus: 0.10, globalBonus: 0, rpsBonus: 0, gemBonus: 0, condition: 'palier_2', conditionLabel: 'Atteindre le palier 2', cost: 1 },
  { id: 'relique_coeur', name: 'Cœur de Dragon', description: '+15% RPS', icon: '❤️', clickBonus: 0, globalBonus: 0, rpsBonus: 0.15, gemBonus: 0, condition: 'palier_3', conditionLabel: 'Atteindre le palier 3', cost: 2 },
  { id: 'relique_oil', name: "Œil de l'Abysse", description: '+20% gemmes', icon: '👁️', clickBonus: 0, globalBonus: 0, rpsBonus: 0, gemBonus: 0.20, condition: 'palier_4', conditionLabel: 'Atteindre le palier 4', cost: 3 },
  { id: 'relique_couronne', name: 'Couronne Impériale', description: '+25% global', icon: '👑', clickBonus: 0, globalBonus: 0.25, rpsBonus: 0, gemBonus: 0, condition: 'palier_5', conditionLabel: 'Atteindre le palier 5', cost: 5 },
  { id: 'relique_main', name: 'Main du Titan', description: '+50% RPC', icon: '✋', clickBonus: 0.50, globalBonus: 0, rpsBonus: 0, gemBonus: 0, condition: 'clics_10000', conditionLabel: '10 000 clics', cost: 4 },
  { id: 'relique_sceau', name: 'Sceau du Sage', description: '+30% RPS', icon: '📜', clickBonus: 0, globalBonus: 0, rpsBonus: 0.30, gemBonus: 0, condition: 'level_25', conditionLabel: 'Niveau 25', cost: 3 },
  { id: 'relique_pierre', name: 'Pierre de Lune', description: '+25% gemmes', icon: '🌙', clickBonus: 0, globalBonus: 0, rpsBonus: 0, gemBonus: 0.25, condition: 'gold_100000', conditionLabel: '100 000 or', cost: 2 },
  { id: 'relique_eternelle', name: 'Relique Éternelle', description: '+100% global', icon: '💠', clickBonus: 0, globalBonus: 1.0, rpsBonus: 0, gemBonus: 0, condition: 'palier_6', conditionLabel: 'Atteindre le palier 6', cost: 10 },
];

// ── Potions (temporaires) ──
export interface PotionDef {
  id: string;
  name: string;
  description: string;
  icon: string;
  clickBonus: number;
  globalBonus: number;
  durationMs: number;
  cost: number; // gemmes
}

export const POTIONS: PotionDef[] = [
  { id: 'potion_force', name: 'Potion de Force', description: '×2 RPC pendant 60s', icon: '🧪', clickBonus: 1.0, globalBonus: 0, durationMs: 60000, cost: 5 },
  { id: 'potion_rune', name: 'Potion de Rune', description: '×2 RPS pendant 60s', icon: '⚗️', clickBonus: 0, globalBonus: 1.0, durationMs: 60000, cost: 8 },
  { id: 'elixir_or', name: 'Élixir d\'Or', description: '×3 global pendant 30s', icon: '🏺', clickBonus: 0, globalBonus: 2.0, durationMs: 30000, cost: 15 },
  { id: 'essence', name: 'Essence de Dragon', description: '×5 global pendant 15s', icon: '🔥', clickBonus: 0, globalBonus: 4.0, durationMs: 15000, cost: 30 },
];

// ── Paliers (zones) ──
export interface TierDef {
  level: number;
  name: string;
  icon: string;
  enemy: string;
  enemyIcon: string;
  threshold: number; // or total requis pour atteindre
  upgradeCost: number; // coût pour passer au palier suivant
  color: string;
}

export const TIERS: TierDef[] = [
  { level: 1, name: 'Village', icon: '🏘️', enemy: 'Rat des Égouts', enemyIcon: '🐀', threshold: 0, upgradeCost: 500, color: '#22c55e' },
  { level: 2, name: 'Hameau', icon: '🏡', enemy: 'Gobelin Bandit', enemyIcon: '👺', threshold: 500, upgradeCost: 2500, color: '#84cc16' },
  { level: 3, name: 'Bourg', icon: '🏰', enemy: 'Golem de Pierre', enemyIcon: '🗿', threshold: 2500, upgradeCost: 12500, color: '#eab308' },
  { level: 4, name: 'Ville', icon: '🏙️', enemy: 'Archisorcier', enemyIcon: '🧙', threshold: 12500, upgradeCost: 62500, color: '#f59e0b' },
  { level: 5, name: 'Cité', icon: '🌆', enemy: 'Doyen Dragon', enemyIcon: '🐉', threshold: 62500, upgradeCost: 312500, color: '#ef4444' },
  { level: 6, name: 'Abysses', icon: '🌋', enemy: 'Empereur Dragon', enemyIcon: '🐲', threshold: 312500, upgradeCost: 0, color: '#a855f7' },
];

export function getTier(level: number): TierDef {
  return TIERS[Math.min(Math.max(level - 1, 0), TIERS.length - 1)];
}
