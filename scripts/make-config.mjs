import { readFileSync, writeFileSync, existsSync } from 'node:fs';

if (existsSync('.env')) {
  for (const line of readFileSync('.env', 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (!m || line.trim().startsWith('#')) continue;
    const v = m[2].replace(/^(['"])(.*)\1$/, '$2');
    if (process.env[m[1]] === undefined || process.env[m[1]] === '') process.env[m[1]] = v;
  }
}

const MAP = {
  apiKey: 'FIREBASE_API_KEY',
  authDomain: 'FIREBASE_AUTH_DOMAIN',
  projectId: 'FIREBASE_PROJECT_ID',
  storageBucket: 'FIREBASE_STORAGE_BUCKET',
  messagingSenderId: 'FIREBASE_MESSAGING_SENDER_ID',
  appId: 'FIREBASE_APP_ID',
  measurementId: 'FIREBASE_MEASUREMENT_ID',
};
const OPTIONAL = new Set(['measurementId']);

const cfg = {}, missing = [];
for (const [key, env] of Object.entries(MAP)) {
  const v = (process.env[env] || '').trim();
  if (v) cfg[key] = v; else if (!OPTIONAL.has(key)) missing.push(env);
}
if (missing.length) {
  console.error('Не задано змінні: ' + missing.join(', '));
  console.error('Локально — впиши їх у .env; у GitHub — Settings → Environments → github-pages → Environment secrets.');
  process.exit(1);
}
if (!/^AIza[0-9A-Za-z_-]{35}$/.test(cfg.apiKey)) { console.error('FIREBASE_API_KEY має дивний вигляд — перевір, що скопійовано повністю.'); process.exit(1); }

const out = process.argv[2] || 'config.js';
writeFileSync(out, 'window.RYB_FB = ' + JSON.stringify(cfg, null, 2) + ';\n');
console.log(`Готово: ${out} (${Object.keys(cfg).join(', ')})
