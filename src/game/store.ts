// MMO Clicker — Store Svelte 5 (état réactif + boucle de jeu)
import { writable, derived, get } from 'svelte/store';
import {
  type GameState, defaultState, load, save, resetSave,
  doClick, tick, buyUnit, unlockSpec, unlockRelic, usePotion,
  selectClass, upgradeTier, doPrestige, prestigeGain,
  computeRPS, computeRPC, computeGemMult,
} from './engine';
import { getTier, TIERS, RELICS } from './data';

// ── État brut (muté par le moteur, version bump pour réactivité) ──
const state = load();
let v = 0;

export const game = writable<GameState>(state);
export const version = writable(0);

function bump() {
  version.set(++v);
  game.set(state);
}

// ── Dérivés réactifs ──
export const rpc = derived(game, s => computeRPC(s));
export const rps = derived(game, s => computeRPS(s));
export const gemMult = derived(game, s => computeGemMult(s));
export const tier = derived(game, s => getTier(s.tier));
export const prestigePoints = derived(game, s => prestigeGain(s));
// Logique inlinée (évite l'alias canUpgradeTierFn, tree-shaken à tort par le minifier)
export const canUpgrade = derived(game, s => {
  if (s.tier >= TIERS.length) return false;
  return s.totalGold >= TIERS[s.tier].threshold;
});

// ── Actions (exposées aux composants) ──
export function click() {
  doClick(state);
  bump();
}

export function buy(id: string) {
  if (buyUnit(state, id)) bump();
}

export function unlock(node: Parameters<typeof unlockSpec>[0]) {
  if (unlockSpec(state, node)) bump();
}

export function unlockR(id: string) {
  const r = RELICS.find(x => x.id === id);
  if (r && unlockRelic(state, r)) bump();
}

export function potion(id: string) {
  if (usePotion(state, id)) bump();
}

export function chooseClass(id: Parameters<typeof selectClass>[1]) {
  selectClass(state, id);
  bump();
}

export function upgrade() {
  if (upgradeTier(state)) bump();
}

export function prestige() {
  if (doPrestige(state)) bump();
}

export function hardReset() {
  resetSave();
  Object.assign(state, defaultState());
  bump();
}

export function saveNow() {
  save(state);
}

// ── Boucle de jeu (RPS passif + sauvegarde auto) ──
let last = performance.now();
let saveAccum = 0;

export function startLoop() {
  if (startLoop._running) return;
  startLoop._running = true;
  const loop = (now: number) => {
    const dt = Math.min(now - last, 1000); // clamp anti-onglet-inactif
    last = now;
    tick(state, dt);
    saveAccum += dt;
    if (saveAccum >= 5000) { saveAccum = 0; save(state); }
    bump();
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
}
(startLoop as any)._running = false;

// Sauvegarde au départ de l'onglet
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => save(state));
  window.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') save(state);
  });
}
