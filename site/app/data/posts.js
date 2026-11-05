import generated from './posts.json';
import manual from './manual-posts.json';

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
export const parseEditorialDate = value => {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const date = new Date(`${value}T00:00:00Z`);
  return Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== value
    ? null
    : date;
};

const validPost = post => {
  try {
    const url = new URL(post?.href);
    return Boolean(
      typeof post?.title === 'string' &&
      post.title.trim() &&
      ['http:', 'https:'].includes(url.protocol) &&
      typeof post?.platform === 'string' &&
      post.platform.trim() &&
      Boolean(parseEditorialDate(post.date))
    );
  } catch {
    return false;
  }
};

export const posts = [...manual, ...generated]
  .filter(validPost)
  .filter((post, index, all) => all.findIndex(item => item.href === post.href) === index)
  .sort((a, b) => {
    const aDate = parseEditorialDate(a.date)?.getTime() ?? -Infinity;
    const bDate = parseEditorialDate(b.date)?.getTime() ?? -Infinity;
    return bDate - aDate;
  });

// Profiles shown at the bottom of /articles, in this order.
export const platforms = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/muhammadakhmal172' },
  { label: 'Kompasiana', href: 'https://www.kompasiana.com/muhammadakhmal172' },
];
