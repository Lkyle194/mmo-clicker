<script>
  import { game, buy } from '../game/store';
  import { fmt } from '../game/format';
  import { UNITS, getTier, TIERS } from '../game/data';
  import { unitCost } from '../game/engine';

  // Regrouper par palier
  const tiers = $derived(
    TIERS.map((t, i) => ({
      ...t,
      units: UNITS.filter(u => u.unlockPalier === t.level),
    }))
  );

  function canBuy(u) {
    return $game.tier >= u.unlockPalier && $game.gold >= unitCost(u, $game.units[u.id] || 0);
  }
</script>

<div class="companions">
  <div class="panel">
    <div class="panel-title">🐺 Compagnons</div>
    <p class="hint">Recrutez des unités qui génèrent de l'or automatiquement. Chaque palier débloque de nouvelles unités.</p>
  </div>

  {#each tiers as t (t.level)}
    <div class="panel tier-block" class:locked={$game.tier < t.level}>
      <div class="tier-head">
        <span class="tier-icon" style="filter:drop-shadow(0 0 8px {t.color})">{t.icon}</span>
        <div>
          <div class="tier-name" style="color:{t.color}">{t.name}</div>
          <div class="tier-sub">Palier {t.level}{$game.tier < t.level ? ' — 🔒 verrouillé' : ''}</div>
        </div>
      </div>

      <div class="grid grid-3">
        {#each t.units as u (u.id)}
          {@const owned = $game.units[u.id] || 0}
          {@const cost = unitCost(u, owned)}
          <button
            class="item-card unit-card"
            class:locked={$game.tier < u.unlockPalier}
            class:affordable={canBuy(u)}
            disabled={!canBuy(u)}
            onclick={() => buy(u.id)}
          >
            {#if owned > 0}<span class="item-count">×{owned}</span>{/if}
            <span class="item-icon">{u.icon}</span>
            <span class="item-name">{u.name}</span>
            <span class="item-desc">{u.description}</span>
            <span class="item-stat">⚡ {fmt(u.baseRPS)}/s</span>
            <span class="item-cost" class:poor={!canBuy(u)}>🪙 {fmt(cost)}</span>
          </button>
        {/each}
      </div>
    </div>
  {/each}
</div>

<style>
  .companions { display: flex; flex-direction: column; gap: var(--spacing-md); flex: 1; min-height: 0; }
  .hint { font-size: 0.82rem; color: var(--color-text-secondary); line-height: 1.4; }

  .tier-block.locked { opacity: 0.55; }
  .tier-head { display: flex; align-items: center; gap: 10px; margin-bottom: var(--spacing-sm); }
  .tier-icon { font-size: 1.8rem; }
  .tier-name { font-family: var(--font-display); font-weight: 700; font-size: 1.05rem; }
  .tier-sub { font-size: 0.72rem; color: var(--color-text-secondary); }

  .unit-card { cursor: pointer; }
  .unit-card.affordable { border-color: var(--color-uncommon); box-shadow: 0 0 12px rgba(34,197,94,0.2); }
  .unit-card.affordable:hover { transform: translateY(-3px); }
  .unit-card:not(.affordable) { cursor: not-allowed; }
  .item-stat { font-size: 0.75rem; color: var(--color-xp); text-align: center; font-weight: 600; }
  .item-cost.poor { color: var(--color-hp); }
  .item-cost:not(.poor) { color: var(--color-accent); }

  @media (max-width: 600px) {
    .grid-3 { grid-template-columns: repeat(2, 1fr); }
  }
</style>
