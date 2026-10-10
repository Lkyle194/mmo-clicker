import { JSDOM } from 'jsdom';
import { readFileSync } from 'fs';

const html = readFileSync('dist/index.html', 'utf8');
const dom = new JSDOM(html, {
  runScripts: 'outside-only',
  url: 'https://mmo-clicker-web.vercel.app/',
  pretendToBeVisual: true,
});

const { window } = dom;

// Capture les erreurs de console + erreurs non gérées
window.console.error = (...a) => console.log('[console.error]', ...a);
window.console.warn = (...a) => console.log('[console.warn]', ...a);
window.addEventListener('error', (e) => console.log('[window.onerror]', e.message, e.error?.stack));
window.addEventListener('unhandledrejection', (e) => console.log('[unhandledrejection]', e.reason?.message, e.reason?.stack));

// Polyfills manquants dans jsdom
window.requestAnimationFrame = (cb) => setTimeout(() => cb(performance.now()), 16);
window.cancelAnimationFrame = (id) => clearTimeout(id);
if (!window.performance?.now) window.performance = { now: () => Date.now() };

// Charger le bundle
const js = readFileSync('dist/assets/index-6pq0Unvj.js', 'utf8');
try {
  window.eval(js);
} catch (e) {
  console.log('[EVAL ERROR]', e.message);
  console.log(e.stack);
}

// Attendre un tick pour laisser le rAF tourner
await new Promise(r => setTimeout(r, 100));

const app = window.document.getElementById('app');
console.log('\n=== #app innerHTML (longueur) ===');
console.log('longueur:', app?.innerHTML?.length ?? 'null');
console.log('aperçu:', (app?.innerHTML ?? '').slice(0, 400));
