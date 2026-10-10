<script>
  import { game, prestigePoints, unlockR, prestige } from '../game/store';
  import { fmt } from '../game/format';
  import { RELICS } from '../game/data';
  import { relicUnlocked, relicAvailable, checkRelicCondition, prestigeGain } from '../game/engine';

  const gain = $derived(prestigeGain($game));
  const canPrestige = $derived(gain >= 1);
</script>

<div class="relics">
  <div class="panel prestige-panel">
    <div class="panel-title">👑 Prestige</div>
    <p class="hint">
      Réinitialisez votre progression pour gagner des <strong>points de prestige</strong> (permanents).
      Vos reliques sont conservées. Points gagnés : <strong class="gain">+{fmt(gain)}</strong>
    </p>
    <div class="prestige-row">
      <div class="prestige-stat">
        <span class="prestige-icon">👑</span>
        <div>
          <div class="prestige-val">{fmt($game.prestige)}</div>
          <div class="prestige-label">Points disponibles</div>
        </div>
      </div>
      <button class="btn btn-secondary" disabled={!canPrestige} onclick={() => prestige()}>
        🔄 Faire un prestige (+{fmt(gain)})
      </button>
    </div>
  </div>

  <div class="panel">
    <div class="panel-title">💠 Reliques</div>
    <p class="hint">Débloquez des bonus permanents avec vos points de prestige. Chaque relique a une condition à remplir.</p>

    <div class="grid grid-2">
      {#each RELICS as r (r.id)}
        {@const unlocked = relicUnlocked($game, r)}
        {@const available = relicAvailable($game, r)}
        {@const condMet = checkRelicCondition($game, r.condition)}
        <button
          class="item-card relic-card"
          class:unlocked
          class:available
          disabled={!available}
          onclick={() => unlockR(r.id)}
        >
          <span class="item-icon">{r.icon}</span>
          <span class="item-name">{r.name}</span>
          <span class="item-desc">{r.description}</span>
          <span class="relic-cond" class:met={condMet}>
            {condMet ? '✅' : '🔒'} {r.conditionLabel}
          </span>
          <span class="item-cost" class:poor={!available && !unlocked}>
            {#if unlocked}✅ Débloquée{:else}👑 {r.cost} pts{/if}
          </span>
        </button>
      {/each}
    </div>
  </div>
</div>

<style>
  .relics { display: flex; flex-direction: column; gap: var(--spacing-md); flex: 1; min-height: 0; }
  .hint { font-size: 0.82rem; color: var(--color-text-secondary); line-height: 1.4; }
  .hint .gain { color: var(--color-mythic); }

  .prestige-panel { border-color: var(--color-secondary); }
  .prestige-row { display: flex; align-items: center; justify-content: space-between; gap: var(--spacing-sm); margin-top: var(--spacing-sm); flex-wrap: wrap; }
  .prestige-stat { display: flex; align-items: center; gap: 10px; }
  .prestige-icon { font-size: 2rem; }
  .prestige-val { font-size: 1.4rem; font-weight: 800; color: var(--color-mythic); }
  .prestige-label { font-size: 0.75rem; color: var(--color-text-secondary); }

  .relic-card { cursor: pointer; }
  .relic-card.available { border-color: var(--color-epic); box-shadow: 0 0 12px rgba(168,85,247,0.2); }
  .relic-card.available:hover { transform: translateY(-3px); }
  .relic-card.unlocked { border-color: var(--color-xp); background: color-mix(in srgb, var(--color-xp) 10%, var(--color-bg-tertiary)); }
  .relic-card:not(.available):not(.unlocked) { cursor: not-allowed; opacity: 0.6; }
  .relic-cond { font-size: 0.72rem; color: var(--color-text-muted); text-align: center; }
  .relic-cond.met { color: var(--color-uncommon); }
  .item-cost.poor { color: var(--color-text-muted); }
  .item-cost:not(.poor) { color: var(--color-epic); }

  @media (max-width: 600px) {
    .grid-2 { grid-template-columns: 1fr; }
  }
</style>
