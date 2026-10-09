<script>
  import { game, rpc, rps, tier, click, upgrade, canUpgradeTier } from '../game/store';
  import { fmt, fmtInt } from '../game/format';
  import { getTier, TIERS, CLASSES, getClass } from '../game/data';
  import { xpForLevel } from '../game/engine';

  // Particules de clic (feedback visuel)
  let particles = $state([]);
  let clickCount = 0;

  function onPointer(e) {
    click();
    clickCount++;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now() + Math.random();
    particles.push({ id, x, y, val: $rpc });
    setTimeout(() => {
      particles = particles.filter(p => p.id !== id);
    }, 800);
  }

  const currentTier = $derived(getTier($game.tier));
  const nextTier = $derived($game.tier < TIERS.length ? TIERS[$game.tier] : null);
  const canUp = $derived(canUpgradeTier($game));
  const cls = $derived(getClass($game.selectedClass));
  const xpPct = $derived(Math.min(100, ($game.xp / $game.xpToNext) * 100));
</script>

<div class="combat">
  <!-- Ennemi + bouton de clic -->
  <div class="panel enemy-panel">
    <div class="enemy-header">
      <span class="enemy-icon">{currentTier.enemyIcon}</span>
      <div class="enemy-info">
        <div class="enemy-name">{currentTier.enemy}</div>
        <div class="enemy-tier">
          <span class="badge" style="background:{currentTier.color}33;color:{currentTier.color}">
            {currentTier.icon} {currentTier.name}
          </span>
        </div>
      </div>
    </div>

    <button class="click-btn" onpointerdown={onPointer}>
      <span class="click-emoji">{cls.icon}</span>
      <span class="click-label">CLIQUEZ !</span>
      <span class="click-rpc">+{fmt($rpc)} 🪙</span>
      {#each particles as p (p.id)}
        <span class="particle" style="left:{p.x}px;top:{p.y}px">+{fmt(p.val)}</span>
      {/each}
    </button>

    <div class="stats-row">
      <div class="stat">
        <span class="stat-icon">👆</span>
        <div>
          <div class="stat-val">{fmt($rpc)}</div>
          <div class="stat-label">Or / clic</div>
        </div>
      </div>
      <div class="stat">
        <span class="stat-icon">⚡</span>
        <div>
          <div class="stat-val">{fmt($rps)}</div>
          <div class="stat-label">Or / seconde</div>
        </div>
      </div>
      <div class="stat">
        <span class="stat-icon">🖱️</span>
        <div>
          <div class="stat-val">{fmtInt($game.totalClicks)}</div>
          <div class="stat-label">Clics totaux</div>
        </div>
      </div>
    </div>
  </div>

  <!-- Progression (XP + palier) -->
  <div class="panel progress-panel">
    <div class="xp-row">
      <span class="xp-label">⭐ Niveau {$game.level}</span>
      <span class="xp-val">{$fmtInt($game.xp)} / {$fmtInt($game.xpToNext)} XP</span>
    </div>
    <div class="bar">
      <div class="bar-fill xp" style="width:{xpPct}%"></div>
    </div>

    <div class="tier-row">
      <div class="tier-current">
        <span class="tier-icon">{currentTier.icon}</span>
        <div>
          <div class="tier-name">{currentTier.name}</div>
          <div class="tier-sub">Palier {$game.tier} / {TIERS.length}</div>
        </div>
      </div>
      {#if nextTier}
        <button class="btn btn-accent" disabled={!canUp} onclick={() => upgrade()}>
          ⬆️ {nextTier.icon} {nextTier.name}
          <small>{fmt(nextTier.threshold)} or total</small>
        </button>
      {:else}
        <span class="badge legendary">🏆 Palier max atteint</span>
      {/if}
    </div>
  </div>
</div>

<style>
  .combat { display: flex; flex-direction: column; gap: var(--spacing-md); }

  .enemy-panel { display: flex; flex-direction: column; gap: var(--spacing-md); }
  .enemy-header { display: flex; align-items: center; gap: 12px; }
  .enemy-icon { font-size: 3rem; filter: drop-shadow(0 0 12px rgba(239,68,68,0.5)); }
  .enemy-name { font-family: var(--font-display); font-size: 1.3rem; font-weight: 700; color: var(--color-text-bright); }
  .enemy-tier { margin-top: 4px; }

  .click-btn {
    position: relative;
    width: 100%;
    aspect-ratio: 16/9;
    max-height: 280px;
    border-radius: var(--radius-xl);
    background:
      radial-gradient(circle at center, rgba(59,130,246,0.25), transparent 70%),
      linear-gradient(135deg, var(--color-surface), var(--color-bg-tertiary));
    border: 2px solid var(--color-border-glow);
    box-shadow: var(--shadow-glow), inset 0 0 40px rgba(59,130,246,0.1);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8px;
    overflow: hidden;
    user-select: none;
    transition: transform 80ms ease, box-shadow 80ms ease;
  }
  .click-btn:active {
    transform: scale(0.97);
    box-shadow: var(--shadow-glow-secondary), inset 0 0 60px rgba(139,92,246,0.2);
  }
  .click-emoji { font-size: 4rem; animation: float 3s ease-in-out infinite; }
  .click-label { font-family: var(--font-display); font-size: 1.4rem; font-weight: 800; letter-spacing: 2px; color: var(--color-text-bright); }
  .click-rpc { font-size: 1rem; font-weight: 700; color: var(--color-accent); }

  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-8px); }
  }

  .particle {
    position: absolute;
    font-weight: 800;
    color: var(--color-accent);
    text-shadow: 0 0 8px rgba(245,158,11,0.8);
    pointer-events: none;
    animation: rise 0.8s ease-out forwards;
    font-size: 1.1rem;
    transform: translate(-50%, -50%);
  }
  @keyframes rise {
    0% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
    100% { opacity: 0; transform: translate(-50%, -180%) scale(1.4); }
  }

  .stats-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--spacing-sm); }
  .stat { display: flex; align-items: center; gap: 8px; padding: 10px; background: var(--color-bg-tertiary); border-radius: var(--radius-md); border: 1px solid var(--color-border); }
  .stat-icon { font-size: 1.4rem; }
  .stat-val { font-weight: 800; font-size: 1rem; color: var(--color-text-bright); }
  .stat-label { font-size: 0.7rem; color: var(--color-text-secondary); }

  .progress-panel { display: flex; flex-direction: column; gap: var(--spacing-sm); }
  .xp-row { display: flex; justify-content: space-between; font-size: 0.85rem; }
  .xp-label { font-weight: 700; color: var(--color-xp); }
  .xp-val { color: var(--color-text-secondary); }

  .tier-row { display: flex; align-items: center; justify-content: space-between; gap: var(--spacing-sm); margin-top: var(--spacing-sm); flex-wrap: wrap; }
  .tier-current { display: flex; align-items: center; gap: 10px; }
  .tier-icon { font-size: 2rem; }
  .tier-name { font-family: var(--font-display); font-weight: 700; font-size: 1.1rem; color: var(--color-text-bright); }
  .tier-sub { font-size: 0.75rem; color: var(--color-text-secondary); }
  .btn small { display: block; font-size: 0.65rem; font-weight: 500; opacity: 0.85; }

  @media (max-width: 600px) {
    .stats-row { grid-template-columns: 1fr; }
    .click-btn { aspect-ratio: 4/3; }
  }
</style>
