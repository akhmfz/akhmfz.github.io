// Collects a Kompasiana author's articles into app/data/posts.json.
// Usage: npm run posts -- https://www.kompasiana.com/<user> [limit]
//
// LinkedIn has no public feed (profile pages return 999/auth wall), so posts
// from there are added by hand in app/data/posts.js.
import { writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const UA =
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0 Safari/537.36';

const here = path.dirname(fileURLToPath(import.meta.url));
const out = path.resolve(here, '../app/data/posts.json');

const profile = process.argv[2];
const limit = Number(process.argv[3] || 20);

if (!profile || !/kompasiana\.com\/[^/]+/.test(profile)) {
  console.error('Usage: npm run posts -- https://www.kompasiana.com/<user> [limit]');
  process.exit(1);
}

const user = new URL(profile).pathname.split('/').filter(Boolean)[0];

async function get(url) {
  const res = await fetch(url, { headers: { 'user-agent': UA } });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return res.text();
}

const decode = value =>
  value
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&');

const meta = (html, attr, name) => {
  const pattern = new RegExp(`<meta ${attr}="${name}" content="([^"]*)"`, 'i');
  const match = html.match(pattern);
  return match ? decode(match[1]) : '';
};

const profileHtml = await get(`https://www.kompasiana.com/${user}`);
const urls = [
  ...new Set(
    [...profileHtml.matchAll(new RegExp(`https://www\\.kompasiana\\.com/${user}/[0-9a-f]{24}/[^"'?#\\s]+`, 'g'))].map(
      match => match[0]
    )
  ),
].slice(0, limit);

if (urls.length === 0) {
  console.error(`No articles found on the profile of ${user}.`);
  process.exit(1);
}

const posts = [];
for (const url of urls) {
  const html = await get(url);
  const published = meta(html, 'property', 'article:published_time');
  posts.push({
    platform: 'Kompasiana',
    title: meta(html, 'property', 'og:title'),
    date: (published ? new Date(published) : new Date()).toISOString().slice(0, 10),
    href: url,
    blurb: meta(html, 'property', 'og:description'),
  });
}

posts.sort((a, b) => b.date.localeCompare(a.date));
await writeFile(out, `${JSON.stringify(posts, null, 2)}\n`);
console.log(`Wrote ${posts.length} post(s) to ${path.relative(process.cwd(), out)}`);
