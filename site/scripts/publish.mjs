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
  'activities',
  'projects',
  'index.html',
  '404.html',
  'favicon.ico',
  'favicon.svg',
  'social-image.png',
  'icon-192.png',
  'icon-maskable-512.png',
  'icon-256.png',
  'icon-512.png',
  'icon-maskable-512.png',
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
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="Muhammad Akhmal — Financial Management student focused on Internal Audit, Risk & Compliance">
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
    title: 'Muhammad Akhmal | Financial Management Student — Internal Audit, Risk & Compliance',
    description:
      'Portfolio of Muhammad Akhmal Fauzi Saefurohman — Financial Management student focused on internal audit, risk, compliance, capital-market analysis, and GIS financial literacy.',
  },
  'articles/index.html': {
    path: '/articles/',
    title: 'Muhammad Akhmal | Articles',
    description:
      'Writing by Muhammad Akhmal Fauzi Saefurohman on audit, risk, controls, and the Indonesian market.',
  },
  'contact/index.html': {
    path: '/contact/',
    title: 'Muhammad Akhmal | Contact',
    description:
      'Send me a message about an internship, a project, or anything related to audit, risk, and financial controls.',
  },
  'details/index.html': {
    path: '/details/',
    title: 'Muhammad Akhmal | Details',
    description:
      'Experience, education, and background of Muhammad Akhmal Fauzi Saefurohman — records, coordination, and controls.',
  },
  'activities/index.html': {
    path: '/activities/',
    title: 'Muhammad Akhmal | Activities',
    description: 'Leadership, publication, documentation, and financial-literacy activities through GIS UNIDA Gontor.',
  },
  ...Object.fromEntries(
    // shortcut: head metadata for project pages is duplicated from
    // app/data/projects.js because that module imports Vite-only assets;
    // move the shared fields into JSON if the list outgrows three pages.
    [
      [
        'papan-instrumen',
        'Papan Instrumen',
        'A transparent, sector-aware fundamental analysis dashboard for Indonesian equities, built in Pine Script v6.',
      ],
      [
        'papan-gerak',
        'Papan Gerak',
        'A personal technical-analysis tool combining trend, momentum, volatility, and volume for IDX charts.',
      ],
      [
        'pine-semantic-platform',
        'Pine Semantic Platform',
        'A Python CLI for parsing Pine Script into a semantic model, querying code relationships, and validating changes.',
      ],
    ].map(([slug, shortTitle, description]) => [
      `projects/${slug}/index.html`,
      {
        path: `/projects/${slug}/`,
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
