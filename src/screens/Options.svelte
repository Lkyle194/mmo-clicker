<script>
  import { game, saveNow, hardReset } from '../game/store';
  import { fmtInt } from '../game/format';
  import { Capacitor } from '@capacitor/core';

  const isNative = $derived(Capacitor.isNativePlatform());
  const origin = $derived(typeof window !== 'undefined' ? window.location.origin : '');
  // L'APK est servi depuis le même déploiement Vercel (dossier /downloads)
  const apkUrl = $derived(origin ? `${origin}/downloads/mmo-clicker.apk` : '/downloads/mmo-clicker.apk');

  function downloadApk() {
    const a = document.createElement('a');
    a.href = apkUrl;
    a.download = 'mmo-clicker.apk';
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  function exportSave() {
    const data = JSON.stringify($game, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mmo-clicker-save-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function importSave() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = () => {
      const file = input.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const parsed = JSON.parse(reader.result);
          localStorage.setItem('mmo-clicker-save-v1', JSON.stringify(parsed));
          location.reload();
        } catch {
          alert('Fichier de sauvegarde invalide.');
        }
      };
      reader.readAsText(file);
    };
    input.click();
  }

  function reset() {
    if (confirm('Réinitialiser TOUTE la progression ? Cette action est irréversible.')) {
      hardReset();
    }
  }
</script>

<div class="options">
  <div class="panel">
    <div class="panel-title">⚙️ Options</div>

    {#if isNative}
      <div class="native-note">
        📱 Vous êtes dans la version Android du jeu.
      </div>
    {:else}
      <div class="panel apk-panel">
        <div class="apk-icon">📱</div>
        <div class="apk-info">
          <div class="apk-title">Jouer sur Android</div>
          <div class="apk-desc">Téléchargez le jeu en application Android (identique à la version web, fonctionne hors-ligne).</div>
        </div>
        <button class="btn btn-primary apk-btn" onclick={downloadApk}>
          ⬇️ Télécharger l'APK
        </button>
      </div>
    {/if}
  </div>

  <div class="panel">
    <div class="panel-title">💾 Sauvegarde</div>
    <p class="hint">Votre progression est sauvegardée automatiquement sur cet appareil. Vous pouvez aussi l'exporter pour la transférer.</p>
    <div class="btn-row">
      <button class="btn btn-ghost" onclick={saveNow}>💾 Sauvegarder</button>
      <button class="btn btn-ghost" onclick={exportSave}>📤 Exporter</button>
      <button class="btn btn-ghost" onclick={importSave}>📥 Importer</button>
    </div>
  </div>

  <div class="panel">
    <div class="panel-title">📊 Statistiques</div>
    <div class="stats-grid">
      <div class="stat-box"><span class="stat-num">{fmtInt($game.totalClicks)}</span><span class="stat-lbl">Clics totaux</span></div>
      <div class="stat-box"><span class="stat-num">{fmtInt($game.totalGold)}</span><span class="stat-lbl">Or total gagné</span></div>
      <div class="stat-box"><span class="stat-num">{$game.level}</span><span class="stat-lbl">Niveau</span></div>
      <div class="stat-box"><span class="stat-num">{$game.prestigeCount}</span><span class="stat-lbl">Prestiges</span></div>
    </div>
  </div>

  <div class="panel danger-panel">
    <div class="panel-title">⚠️ Zone dangereuse</div>
    <p class="hint">Efface toute votre progression (compagnons, spécialisations, or, gemmes). Les reliques sont conservées.</p>
    <button class="btn btn-danger" onclick={reset}>🗑️ Réinitialiser la progression</button>
  </div>

  <div class="footer">
    ⚔️ MMO Clicker — version web &amp; Android
  </div>
</div>

<style>
  .options { display: flex; flex-direction: column; gap: var(--spacing-md); }
  .hint { font-size: 0.82rem; color: var(--color-text-secondary); line-height: 1.4; margin-bottom: var(--spacing-sm); }

  .native-note {
    padding: 12px;
    background: color-mix(in srgb, var(--color-xp) 12%, var(--color-bg-tertiary));
    border: 1px solid var(--color-xp);
    border-radius: var(--radius-md);
    font-size: 0.88rem;
    color: var(--color-xp);
    font-weight: 600;
  }

  .apk-panel {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 16px;
    margin-top: var(--spacing-sm);
    background: linear-gradient(135deg, rgba(59,130,246,0.15), rgba(139,92,246,0.1));
    border: 1px solid var(--color-border-glow);
    border-radius: var(--radius-lg);
    flex-wrap: wrap;
  }
  .apk-icon { font-size: 2.4rem; }
  .apk-info { flex: 1; min-width: 180px; }
  .apk-title { font-family: var(--font-display); font-weight: 700; font-size: 1.1rem; color: var(--color-text-bright); }
  .apk-desc { font-size: 0.8rem; color: var(--color-text-secondary); margin-top: 2px; }
  .apk-btn { white-space: nowrap; }

  .btn-row { display: flex; gap: 8px; flex-wrap: wrap; }

  .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: var(--spacing-sm); }
  .stat-box {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
    padding: 12px 8px;
    background: var(--color-bg-tertiary);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
  }
  .stat-num { font-size: 1.1rem; font-weight: 800; color: var(--color-text-bright); }
  .stat-lbl { font-size: 0.68rem; color: var(--color-text-secondary); text-align: center; }

  .danger-panel { border-color: var(--color-hp); }
  .footer { text-align: center; font-size: 0.75rem; color: var(--color-text-muted); padding: var(--spacing-sm); }

  @media (max-width: 600px) {
    .stats-grid { grid-template-columns: repeat(2, 1fr); }
  }
</style>
