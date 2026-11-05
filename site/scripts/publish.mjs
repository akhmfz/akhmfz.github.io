// Publishes the built SPA to the repository root or PUBLISH_DIR for Actions.
// The SPA shell is patched with real <head> metadata so link previews and
// crawlers see the site before any JavaScript runs.
import { cp, mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const client = path.resolve(here, '../build/client');
const root = path.resolve(here, '../..');
const outputRoot = process.env.PUBLISH_DIR ? path.resolve(process.env.PUBLISH_DIR) : root;
const siteUrl = 'https://akhmfz.github.io';
const pageTitles = JSON.parse(await readFile(path.resolve(here, '../app/data/page-titles.json'), 'utf8'));
const siteConfig = JSON.parse(await readFile(path.resolve(here, '../app/config.json'), 'utf8'));
const projects = JSON.parse(await readFile(path.resolve(here, '../app/data/projects-content.json'), 'utf8'));
const projectSlugs = projects.map(project => project.slug);

if (
  projectSlugs.some(slug => typeof slug !== 'string' || !/^[a-z0-9-]+$/.test(slug)) ||
  new Set(projectSlugs).size !== projectSlugs.length
) {
  throw new Error('Project slugs must be unique lowercase letters, numbers, or hyphens.');
}

const generated = [
  'assets',
  'uploads',
  'articles',
  'contact',
  'details',
  'activities',
  'projects',
  'index.html',
  '404.html',
  'favicon.ico',
  'favicon.svg',
  'apple-touch-icon.png',
  'social-image.png',
  'icon-192.png',
  'icon-512.png',
  'icon-maskable-512.png',
  // Removed in the logo refresh; kept here so stale root copies are deleted.
  'icon-256.png',
  'shortcut.png',
  'manifest.json',
  'robots.txt',
  'sitemap.xml',
  'humans.txt',
];

const criticalCss = `
html{background:#111;color-scheme:dark light}
html[data-theme='light']{background:#f5f5f5;color-scheme:light}
body{margin:0;background:inherit;color:inherit;font-family:system-ui,sans-serif}
`;

// Keep the static title identical to the route meta title React uses on hydration.
function head({ title, description, path: pagePath }) {
  const canonical = escapeHtml(`${siteUrl}${pagePath}`);
  const safeTitle = escapeHtml(title);
  const safeDescription = escapeHtml(description);
  return `<meta name="description" content="${safeDescription}">
<meta name="author" content="Muhammad Akhmal Fauzi Saefurohman">
<link rel="canonical" href="${canonical}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Muhammad Akhmal">
<meta property="og:url" content="${canonical}">
<meta property="og:title" content="${safeTitle}">
<meta property="og:description" content="${safeDescription}">
<meta property="og:image" content="${siteUrl}/social-image.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="Muhammad Akhmal — Financial Management student focused on Internal Audit, Risk & Compliance">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${safeTitle}">
<meta name="twitter:description" content="${safeDescription}">
<meta name="twitter:image" content="${siteUrl}/social-image.png">
<style>${criticalCss}</style>`;
}

const pages = {
  'index.html': {
    path: '/',
    title: pageTitles['/'],
    description:
      'Financial Management student at UNIDA Gontor developing knowledge of internal audit, risk, compliance, and governance through study and independent analytical projects.',
  },
  'articles/index.html': {
    path: '/articles/',
    title: pageTitles['/articles/'],
    description:
      'Writing by Muhammad Akhmal Fauzi Saefurohman on quality standards, market integrity, and financial inclusion in Indonesia.',
  },
  'contact/index.html': {
    path: '/contact/',
    title: pageTitles['/contact/'],
    description:
      'Send me a message about an internship, a project, or anything related to audit, risk, and financial controls.',
  },
  'details/index.html': {
    path: '/details/',
    title: pageTitles['/details/'],
    description:
      'Education and professional interests of Muhammad Akhmal Fauzi Saefurohman, a Financial Management student developing a foundation in internal audit, risk, and compliance.',
  },
  'activities/index.html': {
    path: '/activities/',
    title: pageTitles['/activities/'],
    description: 'Photo stories from the programs, scholarship, and community work of Muhammad Akhmal Fauzi Saefurohman.',
  },
  ...Object.fromEntries(
    projects.map(({ slug, shortTitle, description }) => [
      `projects/${slug}/index.html`,
      {
        path: `/projects/${slug}/`,
        title: `${siteConfig.name} | ${shortTitle}`,
        description: description || '',
      },
    ])
  ),
};

async function buildPage(sourceHtml, meta) {
  return sourceHtml
    // Keep the rewritten title consistent with the route-aware SPA fallback.
    .replace(/<title>[^<]*<\/title>/, `<title>${escapeHtml(meta.title)}</title>`)
    .replace('</head>', `${head(meta)}\n</head>`);
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, character => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  })[character]);
}

await mkdir(outputRoot, { recursive: true });
for (const entry of generated) {
  await rm(path.join(outputRoot, entry), { recursive: true, force: true });
}

const files = await readdir(client, { withFileTypes: true });
for (const file of files) {
  await cp(path.join(client, file.name), path.join(outputRoot, file.name), { recursive: true });
}

const sourceHtml = await readFile(path.join(client, 'index.html'), 'utf8');
for (const [target, meta] of Object.entries(pages)) {
  const out = path.join(outputRoot, target);
  await mkdir(path.dirname(out), { recursive: true });
  await writeFile(out, await buildPage(sourceHtml, meta));
}

await writeFile(
  path.join(outputRoot, '404.html'),
  await buildPage(sourceHtml, {
    path: '/404.html',
    title: pageTitles['404'],
    description: 'The page you were looking for could not be found.',
  })
);
await writeFile(path.join(outputRoot, '.nojekyll'), '');

console.log(`Published static output to ${outputRoot}.`);
