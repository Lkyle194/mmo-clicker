<script>
  import { game, chooseClass, unlock } from '../game/store';
  import { fmtInt } from '../game/format';
  import { CLASSES, SPECS, TREE_NAMES } from '../game/data';
  import { specKey, specAvailable, specUnlocked } from '../game/engine';

  const cls = $derived(CLASSES.find(c => c.id === $game.selectedClass));
  const trees = $derived(
    [0, 1, 2].map(tree => ({
      tree,
      name: TREE_NAMES[$game.selectedClass][tree],
      nodes: SPECS.filter(s => s.classId === $game.selectedClass && s.tree === tree).sort((a, b) => a.level - b.level),
    }))
  );
</script>

<div class="specs">
  <div class="panel">
    <div class="panel-title">🌳 Spécialisations</div>
    <p class="hint">Choisissez votre classe et débloquez des spécialisations en accumulant des clics. Chaque spécialisation améliore vos statistiques.</p>

    <div class="class-row">
      {#each CLASSES as c (c.id)}
        <button
          class="class-chip"
          class:active={$game.selectedClass === c.id}
          style="--cls-color:{c.color}"
          onclick={() => chooseClass(c.id)}
        >
          <span class="class-icon">{c.icon}</span>
          <span class="class-name">{c.name}</span>
          <span class="class-role">{c.role}</span>
        </button>
      {/each}
    </div>
  </div>

  {#if cls}
    <div class="panel class-panel" style="--cls-color:{cls.color}">
      <div class="class-header">
        <span class="class-big-icon">{cls.icon}</span>
        <div>
          <div class="class-title">{cls.name} <span class="class-role-tag">{cls.role}</span></div>
          <div class="class-desc">{cls.description}</div>
          <div class="class-stats">
            <span>👆 {cls.baseRPC} or/clic</span>
            <span>⚡ {cls.baseRPS} or/s</span>
          </div>
        </div>
      </div>
    </div>

    <div class="trees">
      {#each trees as t (t.tree)}
        <div class="panel tree-panel">
          <div class="tree-name">{t.name}</div>
          <div class="tree-nodes">
            {#each t.nodes as n (specKey(n.classId, n.tree, n.level))}
              {@const unlocked = specUnlocked($game, n)}
              {@const available = specAvailable($game, n)}
              <button
                class="spec-node"
                class:unlocked
                class:available
                disabled={!available}
                onclick={() => unlock(n)}
              >
                <span class="spec-level">Niv {n.level}</span>
                <span class="spec-name">{n.name}</span>
                <span class="spec-desc">{n.description}</span>
                <span class="spec-req">
                  {#if unlocked}✅ Débloqué
                  {:else if available}🔓 Débloquer
                  {:else}🔒 {fmtInt(n.threshold)} clics
                  {/if}
                </span>
              </button>
            {/each}
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>

<style>
  .specs { display: flex; flex-direction: column; gap: var(--spacing-md); flex: 1; min-height: 0; }
  .hint { font-size: 0.82rem; color: var(--color-text-secondary); line-height: 1.4; margin-bottom: var(--spacing-sm); }

  .class-row { display: flex; gap: 8px; flex-wrap: wrap; }
  .class-chip {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
    padding: 10px 14px;
    background: var(--color-bg-tertiary);
    border: 2px solid var(--color-border);
    border-radius: var(--radius-md);
    transition: all var(--transition-fast);
    min-width: 80px;
  }
  .class-chip:hover { border-color: var(--cls-color); }
  .class-chip.active {
    border-color: var(--cls-color);
    background: color-mix(in srgb, var(--cls-color) 18%, var(--color-bg-tertiary));
    box-shadow: 0 0 14px color-mix(in srgb, var(--cls-color) 40%, transparent);
  }
  .class-icon { font-size: 1.6rem; }
  .class-name { font-weight: 700; font-size: 0.85rem; }
  .class-role { font-size: 0.68rem; color: var(--color-text-secondary); }

  .class-panel { border-color: var(--cls-color); }
  .class-header { display: flex; align-items: center; gap: 14px; }
  .class-big-icon { font-size: 3rem; }
  .class-title { font-family: var(--font-display); font-size: 1.3rem; font-weight: 700; color: var(--cls-color); }
  .class-role-tag { font-size: 0.75rem; color: var(--color-text-secondary); font-weight: 500; }
  .class-desc { font-size: 0.85rem; color: var(--color-text-secondary); margin: 4px 0; }
  .class-stats { display: flex; gap: 16px; font-size: 0.85rem; font-weight: 600; }

  .trees { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--spacing-md); }
  .tree-name { font-family: var(--font-display); font-weight: 700; margin-bottom: var(--spacing-sm); color: var(--color-text-bright); }
  .tree-nodes { display: flex; flex-direction: column; gap: 8px; }

  .spec-node {
    display: flex;
    flex-direction: column;
    gap: 3px;
    text-align: left;
    padding: 10px 12px;
    background: var(--color-bg-tertiary);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    transition: all var(--transition-fast);
  }
  .spec-node .spec-level { font-size: 0.65rem; color: var(--color-text-muted); font-weight: 700; text-transform: uppercase; }
  .spec-node .spec-name { font-weight: 700; font-size: 0.88rem; }
  .spec-node .spec-desc { font-size: 0.72rem; color: var(--color-text-secondary); }
  .spec-node .spec-req { font-size: 0.72rem; font-weight: 700; margin-top: 2px; }
  .spec-node.available { border-color: var(--color-uncommon); cursor: pointer; }
  .spec-node.available:hover { transform: translateY(-2px); box-shadow: 0 0 12px rgba(34,197,94,0.25); }
  .spec-node.available .spec-req { color: var(--color-uncommon); }
  .spec-node.unlocked { border-color: var(--color-xp); background: color-mix(in srgb, var(--color-xp) 12%, var(--color-bg-tertiary)); }
  .spec-node.unlocked .spec-req { color: var(--color-xp); }
  .spec-node:disabled:not(.unlocked):not(.available) { opacity: 0.5; }
  .spec-node:disabled .spec-req { color: var(--color-text-muted); }

  @media (max-width: 768px) {
    .trees { grid-template-columns: 1fr; }
  }
</style>
