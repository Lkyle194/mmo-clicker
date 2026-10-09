<script>
  import { game, rpc, rps, tier, prestigePoints } from './game/store';
  import { fmt } from './game/format';
  import Combat from './screens/Combat.svelte';
  import Companions from './screens/Companions.svelte';
  import Specializations from './screens/Specializations.svelte';
  import Relics from './screens/Relics.svelte';
  import Potions from './screens/Potions.svelte';
  import Options from './screens/Options.svelte';

  let tab = $state('combat');

  const TABS = [
    { id: 'combat', label: 'Combat', icon: '⚔️' },
    { id: 'companions', label: 'Compagnons', icon: '🐺' },
    { id: 'specs', label: 'Spécialisations', icon: '🌳' },
    { id: 'relics', label: 'Reliques', icon: '👑' },
    { id: 'potions', label: 'Potions', icon: '🧪' },
    { id: 'options', label: 'Options', icon: '⚙️' },
  ];
</script>

<div class="top-bar">
  <div class="nav-title">⚔️ MMO Clicker</div>
  <div class="nav-resources">
    <span class="resource gold">🪙 {$fmt($game.gold)}</span>
    <span class="resource gems">💎 {$fmt($game.gems)}</span>
    <span class="resource level">⭐ Niv {$game.level}</span>
    <span class="resource prestige">👑 {$fmt($prestigePoints)}</span>
  </div>
</div>

<div class="layout">
  <nav class="tab-nav">
    {#each TABS as t (t.id)}
      <button class="tab-btn" class:active={tab === t.id} onclick={() => (tab = t.id)}>
        <span class="tab-icon">{t.icon}</span>
        <span>{t.label}</span>
      </button>
    {/each}
  </nav>

  <main class="main-area">
    {#if tab === 'combat'}
      <Combat />
    {:else if tab === 'companions'}
      <Companions />
    {:else if tab === 'specs'}
      <Specializations />
    {:else if tab === 'relics'}
      <Relics />
    {:else if tab === 'potions'}
      <Potions />
    {:else if tab === 'options'}
      <Options />
    {/if}
  </main>
</div>

<style>
  /* styles globaux dans app.css */
</style>
