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
const manual = [
  {
    platform: 'LinkedIn',
    title: 'ISO 9001: Apa yang Sebenarnya Dinilai?',
    date: '2026-10-23',
    href: 'https://www.linkedin.com/feed/update/urn:li:activity:7519306697467949056/',
    blurb:
      'ISO develops standards, while independent certification bodies assess organizations. ISO 9001 sets quality-management system requirements rather than one identical way of working; certification does not guarantee every product is always fully conforming.',
  },
  {
    platform: 'LinkedIn',
    title: 'MSCI Indonesia: Proposal Reclassification dan Isu Integritas Pasar',
    date: '2026-10-21',
    href: 'https://www.linkedin.com/feed/update/urn:li:activity:7518599219725950976/',
    blurb:
      'MSCI opened a consultation on 15 October 2026 on a proposal—not a final decision—to reclassify Indonesia from Emerging Market to Standalone Market. Feedback is due by 30 April 2027, with a decision by 30 June 2027; the post discusses governance, market functioning, and evidence of enforcement.',
    sources: [
      {
        label: 'MSCI consultation',
        href: 'https://www.msci.com/downloads/documents/press-releases/media-room/Indonesia_PR_Oct_26.pdf',
      },
      {
        label: 'OJK press release',
        href: 'https://www.ojk.go.id/en/berita-dan-kegiatan/siaran-pers/Pages/OJK-Reaffirms-Commitment-to-Advancing-Indonesias-Capital-Market-Reform.aspx',
      },
    ],
  },
];

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
      post.platform.trim()
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
