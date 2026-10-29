// Publishes the built SPA to the repository root, which GitHub Pages serves.
// The SPA shell is patched with real <head> metadata so link previews and
// crawlers see the site before any JavaScript runs.
import { cp, mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const client = path.resolve(here, '../build/client');
const root = path.resolve(here, '../..');
const siteUrl = 'https://akhmfz.github.io';

const generated = [
  'assets',
  'articles',
  'contact',
  'details',
  'projects',
  'index.html',
  '404.html',
  'favicon.ico',
  'favicon.svg',
  'icon-256.png',
  'icon-512.png',
  'shortcut.png',
  'manifest.json',
  'robots.txt',
  'sitemap.xml',
  'humans.txt',
];

const themeScript = `try{var t=localStorage.getItem('theme');if(t==='light'||t==='dark')document.documentElement.dataset.theme=t}catch(e){}`;

const criticalCss = `
html{background:#111;color-scheme:dark light}
html[data-theme='light']{background:#f5f5f5;color-scheme:light}
body{margin:0;background:inherit;color:inherit;font-family:system-ui,sans-serif}
`;

// Links and social previews read this before JavaScript runs. The tags are
// appended to the end of <head> (not swapped in for the shell's <title>) because
// React's hydration expects the original shell markup — any other edit to the
// existing head nodes makes hydration fail on every page load.
function head({ title, description, path: pagePath }) {
  const canonical = `${siteUrl}${pagePath}`;
  return `<meta name="description" content="${description}">
<meta name="author" content="Muhammad Akhmal Fauzi Saefurohman">
<link rel="canonical" href="${canonical}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Muhammad Akhmal">
<meta property="og:url" content="${canonical}">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${description}">
<meta property="og:image" content="${siteUrl}/social-image.png">
<meta property="og:image:width" content="1280">
<meta property="og:image:height" content="800">
<meta property="og:image:alt" content="Muhammad Akhmal — Audit, Risk & Compliance portfolio">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${title}">
<meta name="twitter:description" content="${description}">
<meta name="twitter:image" content="${siteUrl}/social-image.png">
<script>${themeScript}</script>
<style>${criticalCss}</style>`;
}

const pages = {
  'index.html': {
    path: '/',
    title: 'Muhammad Akhmal | Audit, Risk & Compliance Portfolio',
    description:
      'Portfolio of Muhammad Akhmal Fauzi Saefurohman — Financial Management student at UNIDA Gontor building a career in internal audit, internal controls, risk management, and compliance.',
  },
  'articles/index.html': {
    path: '/articles',
    title: 'Muhammad Akhmal | Articles',
    description:
      'Writing by Muhammad Akhmal Fauzi Saefurohman on audit, risk, controls, and the Indonesian market.',
  },
  'contact/index.html': {
    path: '/contact',
    title: 'Muhammad Akhmal | Contact',
    description:
      'Send me a message about an internship, a project, or anything related to audit, risk, and financial controls.',
  },
  'details/index.html': {
    path: '/details',
    title: 'Muhammad Akhmal | Details',
    description:
      'Experience, education, and background of Muhammad Akhmal Fauzi Saefurohman — records, coordination, and controls.',
  },
  ...Object.fromEntries(
    // shortcut: head metadata for project pages is duplicated from
    // app/data/projects.js because that module imports Vite-only assets;
    // move the shared fields into JSON if the list outgrows three pages.
    [
      ['papan-instrumen', 'Papan Instrumen', 'Pine Script v6 · TradingView Public Library · 96 automated tests'],
      ['papan-gerak', 'Papan Gerak', 'Pine Script v6 · 50 parameters · 90 automated tests'],
      [
        'pine-semantic-platform',
        'Pine Semantic Platform',
        'Python · ANTLR · 7 CLI commands · v2.0.0',
      ],
    ].map(([slug, shortTitle, description]) => [
      `projects/${slug}/index.html`,
      {
        path: `/projects/${slug}`,
        title: `${shortTitle} | Muhammad Akhmal`,
        description,
      },
    ])
  ),
};

async function buildPage(sourceHtml, meta) {
  return sourceHtml
    .replace('<html lang="en">', '<html lang="en" data-theme="dark">')
    .replace('</head>', `${head(meta)}\n</head>`);
}

for (const entry of generated) {
  await rm(path.join(root, entry), { recursive: true, force: true });
}

const files = await readdir(client, { withFileTypes: true });
for (const file of files) {
  await cp(path.join(client, file.name), path.join(root, file.name), { recursive: true });
}

const sourceHtml = await readFile(path.join(client, 'index.html'), 'utf8');
for (const [target, meta] of Object.entries(pages)) {
  const out = path.join(root, target);
  await mkdir(path.dirname(out), { recursive: true });
  await writeFile(out, await buildPage(sourceHtml, meta));
}

await writeFile(path.join(root, '404.html'), await buildPage(sourceHtml, pages['index.html']));
await writeFile(path.join(root, '.nojekyll'), '');

console.log('Published to repository root.');
