<script>
  import { game, potion } from '../game/store';
  import { fmt, fmtTime } from '../game/format';
  import { POTIONS } from '../game/data';

  // Compte à rebours (mis à jour chaque frame via le store)
  const now = $derived(Date.now());
  const active = $derived(
    $game.activePotion && now <= $game.activePotion.endsAt
      ? POTIONS.find(p => p.id === $game.activePotion.id)
      : null
  );
  const remaining = $derived(active ? active.endsAt - now : 0);
</script>

<div class="potions">
  <div class="panel">
    <div class="panel-title">🧪 Potions</div>
    <p class="hint">Achetez des boosts temporaires avec vos gemmes 💎. Une seule potion active à la fois.</p>

    {#if active}
      <div class="active-banner">
        <span class="active-icon">{active.icon}</span>
        <div class="active-info">
          <div class="active-name">{active.name} active</div>
          <div class="active-desc">{active.description}</div>
        </div>
        <div class="active-timer">{fmtTime(remaining)}</div>
      </div>
    {:else}
      <div class="no-active">Aucune potion active</div>
    {/if}
  </div>

  <div class="grid grid-2">
    {#each POTIONS as p (p.id)}
      {@const isActive = active?.id === p.id}
      {@const affordable = $game.gems >= p.cost}
      <button
        class="item-card potion-card"
        class:active={isActive}
        class:affordable={affordable && !isActive}
        disabled={isActive || !affordable}
        onclick={() => potion(p.id)}
      >
        <span class="item-icon">{p.icon}</span>
        <span class="item-name">{p.name}</span>
        <span class="item-desc">{p.description}</span>
        <span class="item-cost" class:poor={!affordable && !isActive}>
          {#if isActive}⏳ En cours{:else}💎 {p.cost} gemmes{/if}
        </span>
      </button>
    {/each}
  </div>
</div>

<style>
  .potions { display: flex; flex-direction: column; gap: var(--spacing-md); flex: 1; min-height: 0; }
  .hint { font-size: 0.82rem; color: var(--color-text-secondary); line-height: 1.4; margin-bottom: var(--spacing-sm); }

  .active-banner {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px;
    background: linear-gradient(135deg, rgba(139,92,246,0.2), rgba(59,130,246,0.1));
    border: 1px solid var(--color-secondary);
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-glow-secondary);
  }
  .active-icon { font-size: 2rem; animation: pulse 1.5s ease-in-out infinite; }
  .active-name { font-weight: 700; color: var(--color-epic); }
  .active-desc { font-size: 0.78rem; color: var(--color-text-secondary); }
  .active-timer { margin-left: auto; font-size: 1.3rem; font-weight: 800; color: var(--color-text-bright); font-variant-numeric: tabular-nums; }

  .no-active { font-size: 0.85rem; color: var(--color-text-muted); padding: 8px 0; }

  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.15); }
  }

  .potion-card { cursor: pointer; }
  .potion-card.affordable { border-color: var(--color-epic); }
  .potion-card.affordable:hover { transform: translateY(-3px); box-shadow: 0 0 12px rgba(168,85,247,0.25); }
  .potion-card.active { border-color: var(--color-xp); background: color-mix(in srgb, var(--color-xp) 10%, var(--color-bg-tertiary)); cursor: default; }
  .potion-card:not(.affordable):not(.active) { cursor: not-allowed; opacity: 0.6; }
  .item-cost.poor { color: var(--color-hp); }
  .item-cost:not(.poor) { color: var(--color-epic); }

  @media (max-width: 600px) {
    .grid-2 { grid-template-columns: 1fr; }
  }
</style>
