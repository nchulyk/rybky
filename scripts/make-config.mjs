// Створює config.js зі змінних середовища. Локально: node --env-file=.env scripts/make-config.mjs
import { writeFileSync } from 'node:fs';
const e = process.env;
const cfg = {
  apiKey: e.FIREBASE_API_KEY,
  authDomain: e.FIREBASE_AUTH_DOMAIN,
  projectId: e.FIREBASE_PROJECT_ID,
  storageBucket: e.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: e.FIREBASE_MESSAGING_SENDER_ID,
  appId: e.FIREBASE_APP_ID,
  measurementId: e.FIREBASE_MEASUREMENT_ID || undefined,
};
const missing = Object.keys(cfg).filter(k => !cfg[k] && k !== 'measurementId');
if (missing.length) { console.error('Не задано секрети для: ' + missing.join(', ')); process.exit(1); }
writeFileSync(process.argv[2] || 'config.js', 'window.RYB_FB = ' + JSON.stringify(cfg) + ';\n');
console.log('Готово: config.js (' + Object.keys(cfg).filter(k => cfg[k]).join(', ') + ')');
