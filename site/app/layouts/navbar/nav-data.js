import config from '~/config.json';

export const navLinks = [
  {
    label: 'Projects',
    pathname: '/#projects',
  },
  {
    label: 'Journal',
    pathname: '/activities/',
  },
  {
    label: 'Articles',
    pathname: '/articles/',
  },
  {
    label: 'About',
    pathname: '/#about',
  },
  {
    label: 'Contact',
    pathname: '/contact/',
  },
];

export const socialLinks = [
  {
    label: 'LinkedIn',
    url: config.linkedin,
    icon: 'linkedin',
  },
  {
    label: 'GitHub',
    url: `https://github.com/${config.github}`,
    icon: 'github',
  },
  {
    label: 'Email',
    url: `mailto:${config.email}`,
    icon: 'mail',
  },
];
