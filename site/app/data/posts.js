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
    title: 'Pernah dengar orang bilang organisasinya punya sertifikasi ISO 9001?',
    date: '2026-10-23',
    href: 'https://www.linkedin.com/feed/update/urn:li:activity:7519306697467949056/',
    blurb:
      'This post distinguishes ISO’s standards-setting role from third-party certification and explains that ISO 9001 sets management-system requirements. Certification does not guarantee perfect product conformity.',
  },
  {
    platform: 'LinkedIn',
    title: 'Rilis MSCI 15 Oktober mencatat pelaku pasar menilai kemajuan belum terlihat konsisten.',
    date: '2026-10-21',
    href: 'https://www.linkedin.com/feed/update/urn:li:activity:7518599219725950976/',
    blurb:
      'The post summarises MSCI’s proposed review of Indonesia’s market classification, the consultation timeline, and concerns raised about market functioning and evidence of reform. It does not present the proposal as a final reclassification.',
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
