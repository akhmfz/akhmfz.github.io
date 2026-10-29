import config from '~/config.json';

// Newest first. Add an entry each time something is published, then run
// `npm run publish` so /articles picks it up. `href` must be the public post URL.
//
// {
//   platform: 'LinkedIn',
//   title: 'Why a clean audit trail beats a clever spreadsheet',
//   date: '2026-11-02',
//   href: 'https://www.linkedin.com/posts/...',
//   blurb: 'One or two sentences summarising the post.',
// }
export const posts = [];

// Profiles shown at the bottom of /articles, in this order.
export const platforms = [
  { label: 'LinkedIn', href: config.linkedin },
  { label: 'GitHub', href: `https://github.com/${config.github}` },
];
