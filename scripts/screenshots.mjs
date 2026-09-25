// Renders the Chrome Web Store screenshots (1280×800) and promo tiles (440×280, 1400×560).
// The real extension is loaded in Chrome for Testing, seeded with sample tasks, and its popup is
// captured at 2× — then each capture is composed onto a branded scene with a short caption.
// Output: chrome/v<version>/ (git-ignored).
//
//   npm run screenshots              (run after `npm run build -- --store`)
//   npm run screenshots -- --docs    also refresh the README images in docs/screenshots/
//
// Options (env):
//   OUT_DIR=path   write somewhere other than chrome/v<version>/
//   TZ_NAME=zone   the viewer's time zone in the shots (default America/New_York)
import { mkdirSync, readFileSync, readdirSync } from 'node:fs';
import { createRequire } from 'node:module';
import { join } from 'node:path';
import puppeteer from 'puppeteer';
import sharp from 'sharp';
import { ROOT, SRC, manifest } from './lib.mjs';

const { version } = manifest();
const out = process.env.OUT_DIR || join(ROOT, 'chrome', `v${version}`);
const docs = process.argv.includes('--docs');
const VIEWER_TZ = process.env.TZ_NAME || 'America/New_York';
mkdirSync(out, { recursive: true });
const W = 1280;
const H = 800;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const require = createRequire(import.meta.url);
const { zonedParts, zonedToEpoch, addDays } = require('../src/tasks.js');

// ── Sample data ─────────────────────────────────────────────────────────────
const now = Date.now();
const today = zonedParts(now, VIEWER_TZ);
const at = (days, hour, minute = 0, tz = VIEWER_TZ) => {
  const base = zonedParts(now, tz);
  return zonedToEpoch({ ...addDays(base, days), hour, minute }, tz);
};
const ago = (min) => now - min * 60000;
let n = 0;
const task = (text, extra = {}) => ({
  id: `demo${n++}`,
  text,
  done: false,
  createdAt: ago(30),
  ...extra,
});
// Keep "today" due times in the future whatever hour the script runs at.
const laterToday = Math.min(23, Math.max(today.hour + 2, 17));
const ACTIVE = [
  task('Book the dentist appointment', { dueAt: at(0, laterToday, 30), createdAt: ago(12) }),
  task('Call with the Tokyo design team', {
    dueAt: at(1, 10, 0, 'Asia/Tokyo'),
    tz: 'Asia/Tokyo',
    createdAt: ago(95),
  }),
  task('Send the quarterly report', { dueAt: at(3, 9), createdAt: ago(60 * 5) }),
  task('Water the plants', { dueAt: at(-1, 18), createdAt: ago(60 * 30) }),
  task('Pick up groceries for the weekend', { createdAt: ago(40) }),
  task('Plan a weekend hike', { createdAt: ago(60 * 50) }),
];
const DONE = [
  task('Renew library books', { done: true, completedAt: ago(8), createdAt: ago(60 * 26) }),
  task('Pay the electricity bill', { done: true, completedAt: ago(60 * 2) }),
  task('Morning run — 5 km', { done: true, completedAt: ago(60 * 7) }),
  task('Reply to Sam about Friday', { done: true, completedAt: ago(60 * 27) }),
];
for (const t of ACTIVE) t.tz ??= t.dueAt ? VIEWER_TZ : undefined;

// ── Capture the popup ───────────────────────────────────────────────────────
const browser = await puppeteer.launch({
  headless: true,
  pipe: true,
  enableExtensions: true,
  args: ['--lang=en-US', '--hide-scrollbars'],
  env: { ...process.env, LANG: 'en_US.UTF-8' },
});
const extId = await browser.installExtension(SRC);
const page = await browser.newPage();
await page.emulateTimezone(VIEWER_TZ);
await page.setExtraHTTPHeaders({ 'Accept-Language': 'en-US' });
await page.evaluateOnNewDocument(() => {
  Object.defineProperty(navigator, 'language', { get: () => 'en-US' });
});
await page.setViewport({ width: 360, height: 600, deviceScaleFactor: 2 });
const POPUP = `chrome-extension://${extId}/popup.html`;

/** Loads the popup with `tasks`, optionally runs `prepare`, and returns a 2× PNG of it. */
const capture = async (tasks, prepare) => {
  await page.goto(POPUP);
  await page.evaluate((t) => chrome.storage.local.set({ liquiddo_tasks: t }), tasks);
  await page.goto(POPUP);
  await page.evaluate(() => document.fonts.ready);
  await page.mouse.move(350, 590);
  if (prepare) await prepare();
  await sleep(700);
  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  return page.screenshot({ clip: { x: 0, y: 0, width: 360, height }, encoding: 'base64' });
};

const tasks = [...ACTIVE, ...DONE];
const popups = {
  list: await capture(tasks),
  picker: await capture(tasks, async () => {
    await page.click('[data-id="demo1"] [data-action="due"]');
    await page.mouse.move(350, 5);
  }),
  completed: await capture(tasks, () => page.click('#tabCompleted')),
  empty: await capture(DONE),
  hover: await capture(tasks, async () => {
    const box = await (await page.$('[data-id="demo4"]')).boundingBox();
    await page.mouse.move(box.x + box.width * 0.5, box.y + box.height / 2);
  }),
};

// ── Compose ─────────────────────────────────────────────────────────────────
const font = (file) => readFileSync(join(SRC, 'fonts', file)).toString('base64');
const FONTS = `
  @font-face { font-family: Nunito; font-weight: 200 1000; src: url(data:font/woff2;base64,${font('nunito-latin-wght-normal.woff2')}) format('woff2'); }
  @font-face { font-family: Lora; font-style: italic; font-weight: 400 700; src: url(data:font/woff2;base64,${font('lora-latin-wght-italic.woff2')}) format('woff2'); }`;
const logo = (
  await sharp(join(ROOT, 'assets/logo.svg'), { density: 600 }).resize(512, 512).png().toBuffer()
).toString('base64');
const img = (b64) => `data:image/png;base64,${b64}`;
const BACKDROP = `background:
    radial-gradient(60% 80% at 0% 0%, rgb(158 165 255 / 55%), transparent 60%),
    radial-gradient(55% 75% at 100% 100%, rgb(120 215 215 / 40%), transparent 65%),
    linear-gradient(150deg, #eef0ff 0%, #e3e9ff 50%, #eaf6ff 100%);`;

/** Display width for a 2× popup capture so it fits the 1280×800 frame with margin. */
const fitWidth = async (b64, maxW, maxH) => {
  const { width, height } = await sharp(Buffer.from(b64, 'base64')).metadata();
  return Math.round(Math.min(maxW, (maxH * width) / height));
};

const scene = (popup, title, sub, width) => `<!doctype html><html><head><style>${FONTS}
  body { margin:0; width:${W}px; height:${H}px; overflow:hidden; font-family:Nunito,sans-serif; color:#1e1e35; -webkit-font-smoothing:antialiased; ${BACKDROP} }
  .copy { position:absolute; left:96px; top:50%; transform:translateY(-50%); width:500px; }
  .brand { display:flex; align-items:center; gap:14px; margin-bottom:34px; }
  .brand img { width:52px; height:52px; filter:drop-shadow(0 8px 16px rgb(58 63 173 / 35%)); }
  .brand span { font-family:Lora,serif; font-style:italic; font-weight:600; font-size:30px; }
  h1 { margin:0; font-size:54px; line-height:1.08; font-weight:800; letter-spacing:-1px; }
  p { margin:22px 0 0; font-size:23px; line-height:1.45; color:#5a5a7a; font-weight:500; }
  .shot { position:absolute; right:110px; top:50%; transform:translateY(-50%); width:${width}px; border-radius:${Math.round((14 * width) / 360)}px; overflow:hidden;
          box-shadow:0 40px 90px -20px rgb(40 40 110 / 45%), 0 0 0 1px rgb(255 255 255 / 80%); }
  .shot img { display:block; width:100%; }
</style></head><body>
  <div class="copy">
    <div class="brand"><img src="${img(logo)}"><span>LiquidDo</span></div>
    <h1>${title}</h1><p>${sub}</p>
  </div>
  <div class="shot"><img src="${img(popup)}"></div>
</body></html>`;

const SHOTS = [
  [
    'list',
    'Your to-dos, one click away',
    'Add a task and press Enter. LiquidDo lives right in your toolbar.',
  ],
  [
    'picker',
    'Due dates in your time zone',
    'Pick a day and time — in your own time zone or any other in the world.',
  ],
  [
    'completed',
    'Tick it off. Bring it back.',
    'Completed tasks wait on their own tab until you clear them.',
  ],
  [
    'hover',
    'See what’s due at a glance',
    'Overdue, due soon or later — every task wears a clear, coloured label.',
  ],
  [
    'empty',
    'Private by design',
    'No accounts, no servers, no tracking. Your tasks never leave your computer.',
  ],
];

const composer = await browser.newPage();
await composer.setViewport({ width: W, height: H });
const shot = async (name, w, h) => {
  await composer.evaluate(() => document.fonts.ready);
  await sleep(300);
  const png = await composer.screenshot({ clip: { x: 0, y: 0, width: w, height: h } });
  // The dashboard expects opaque 24-bit images.
  await sharp(png).flatten({ background: '#ffffff' }).removeAlpha().png().toFile(join(out, name));
  console.log(`✔ ${join(out, name).replace(ROOT + '/', '')}`);
};

for (const [i, [key, title, sub]] of SHOTS.entries()) {
  await composer.setContent(scene(popups[key], title, sub, await fitWidth(popups[key], 420, 700)));
  await shot(`screenshot-${i + 1}-${key}.png`, W, H);
}

// Promo tiles. Store guidance: saturated colours, little text, readable at half size.
const tile = (w, h, big) => `<!doctype html><html><head><style>${FONTS}
  body { margin:0; width:${w}px; height:${h}px; overflow:hidden; color:#fff; font-family:Nunito,sans-serif; -webkit-font-smoothing:antialiased;
         background: radial-gradient(70% 90% at 10% 10%, rgb(160 170 255 / 60%), transparent 60%),
                     radial-gradient(70% 90% at 95% 100%, rgb(110 220 220 / 45%), transparent 65%),
                     linear-gradient(135deg, #6c70f0, #4a4ed4 50%, #262a86); }
  .copy { position:absolute; left:${big ? 100 : 34}px; top:50%; transform:translateY(-50%); }
  .copy img { display:block; width:${big ? 132 : 96}px; height:${big ? 132 : 96}px; margin-bottom:${big ? 24 : 14}px; filter:drop-shadow(0 16px 28px rgb(15 15 70 / 45%)); }
  .name { font-family:Lora,serif; font-style:italic; font-weight:600; font-size:${big ? 88 : 46}px; line-height:1; text-shadow:0 4px 24px rgb(15 15 70 / 35%); }
  .tag { margin-top:18px; font-size:30px; font-weight:700; color:rgb(255 255 255 / 88%); }
  .shot { position:absolute; border-radius:20px; overflow:hidden; box-shadow:0 40px 90px -25px rgb(10 10 60 / 70%), 0 0 0 1px rgb(255 255 255 / 40%); }
  .shot img { display:block; width:100%; }
</style></head><body>
  <div class="copy"><img src="${img(logo)}"><div class="name">LiquidDo</div>${big ? '<div class="tag">To-dos with due dates, right in your toolbar.</div>' : ''}</div>
  ${
    big
      ? `<div class="shot" style="right:120px;top:50px;width:380px;transform:rotate(3deg)"><img src="${img(popups.list)}"></div>`
      : `<div class="shot" style="right:-60px;top:36px;width:190px;transform:rotate(6deg)"><img src="${img(popups.list)}"></div>`
  }
</body></html>`;
for (const [w, h, name] of [
  [440, 280, 'promo-small-440x280.png'],
  [1400, 560, 'promo-marquee-1400x560.png'],
]) {
  await composer.setViewport({ width: w, height: h });
  await composer.setContent(tile(w, h, w > 1000));
  await shot(name, w, h);
}
await browser.close();

if (docs) {
  const dir = join(ROOT, 'docs', 'screenshots');
  mkdirSync(dir, { recursive: true });
  for (const [from, to] of [
    ['screenshot-1-list.png', 'list.jpg'],
    ['screenshot-2-picker.png', 'due-date.jpg'],
    ['promo-marquee-1400x560.png', 'banner.jpg'],
  ]) {
    await sharp(join(out, from)).jpeg({ quality: 84, mozjpeg: true }).toFile(join(dir, to));
    console.log(`✔ docs/screenshots/${to}`);
  }
}
console.log(
  `✔ ${readdirSync(out).filter((f) => /^(screenshot|promo)/.test(f)).length} store images in ${out.replace(ROOT + '/', '')}`,
);
