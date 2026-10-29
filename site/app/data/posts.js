import generated from './posts.json';

// LinkedIn, Instagram, and TikTok have no public feed to read, so posts from
// those platforms are added by hand, newest first:
//
// {
//   platform: 'LinkedIn',
//   title: '...',
//   date: '2026-11-02',
//   href: 'https://www.linkedin.com/posts/...',
//   blurb: 'One or two sentences summarising the post.',
// }
const manual = [];

export const posts = [...manual, ...generated].sort((a, b) => b.date.localeCompare(a.date));

// Profiles shown at the bottom of /articles, in this order.
export const platforms = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/muhammadakhmal172' },
  { label: 'Kompasiana', href: 'https://www.kompasiana.com/muhammadakhmal172' },
];
