import {
  Links,
  Meta,
  Outlet,
  Scripts,
  useLocation,
  useNavigation,
  useRouteError,
} from '@remix-run/react';
import { ThemeProvider, themeStyles } from '~/components/theme-provider';
import GothamBook from '~/assets/fonts/gotham-book.woff2';
import GothamMedium from '~/assets/fonts/gotham-medium.woff2';
import { useEffect, useMemo, useState } from 'react';
import { Error } from '~/layouts/error';
import { VisuallyHidden } from '~/components/visually-hidden';
import { Navbar } from '~/layouts/navbar';
import { Progress } from '~/components/progress';
import pageTitles from '~/data/page-titles.json';
import config from '~/config.json';
import styles from './root.module.css';
import './reset.css';
import './global.css';

const THEME_KEY = 'theme';

function getHydrateTitle() {
  // Match the served shell in both Vite dev and route-specific published HTML.
  return typeof document === 'undefined' ? pageTitles['/'] : document.title;
}

// Runs before hydration so a stored light theme never flashes dark on load.
const themeScript = `try{history.scrollRestoration='manual'}catch(e){};try{var t=localStorage.getItem('${THEME_KEY}');if(t==='light'||t==='dark')document.documentElement.dataset.theme=t}catch(e){};addEventListener('pageshow',function(){if(!location.hash)scrollTo(0,0)},{once:true});`;

function getInitialTheme() {
  try {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored === 'light' || stored === 'dark') return stored;
  } catch (error) {
    // Storage can be blocked; fall back to the default theme.
  }
  return 'dark';
}

export const links = () => [
  {
    rel: 'preload',
    href: GothamMedium,
    as: 'font',
    type: 'font/woff2',
    crossOrigin: '',
  },
  {
    rel: 'preload',
    href: GothamBook,
    as: 'font',
    type: 'font/woff2',
    crossOrigin: '',
  },
  { rel: 'manifest', href: '/manifest.json' },
  { rel: 'icon', href: '/favicon.ico' },
  { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' },
  { rel: 'apple-touch-icon', href: '/apple-touch-icon.png', sizes: '180x180' },
];

export function HydrateFallback() {
  const theme =
    typeof document === 'undefined' ? 'dark' : document.documentElement.dataset.theme || 'dark';

  return (
    <html lang="en" data-theme={theme}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <title>{getHydrateTitle()}</title>
        <Links />
      </head>
      <body>
        <main style={{ fontFamily: 'system-ui, sans-serif', padding: '2rem' }} />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  const [theme, setTheme] = useState(getInitialTheme);
  const { state } = useNavigation();
  const location = useLocation();
  const { pathname } = location;

  const canonicalUrl = useMemo(() => {
    const path = pathname === '/' ? '/' : `${pathname.replace(/\/+$/, '')}/`;
    return `${config.url}${path}`;
  }, [pathname]);

  function toggleTheme(newTheme) {
    const next = newTheme || (theme === 'dark' ? 'light' : 'dark');
    setTheme(next);
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch (error) {
      // Storage can be blocked; the theme still applies for this session.
    }
  }

  useEffect(() => {
    console.info(
      `${config.ascii}\n`,
      `Taking a peek huh? Check out the source code: ${config.repo}\n\n`
    );
  }, []);

  useEffect(() => {
    if (!location.hash) window.scrollTo(0, 0);
  }, [location.hash, location.key]);

  return (
    <html lang="en" data-theme={theme}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* Theme color doesn't support oklch so I'm hard coding these hexes for now */}
        <meta name="theme-color" content={theme === 'dark' ? '#111' : '#F2F2F2'} />
        <meta
          name="color-scheme"
          content={theme === 'light' ? 'light dark' : 'dark light'}
        />
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <style dangerouslySetInnerHTML={{ __html: themeStyles }} />
        <Meta />
        <Links />
        <link rel="canonical" href={canonicalUrl} />
      </head>
      <body>
        <ThemeProvider theme={theme} toggleTheme={toggleTheme}>
          <Progress />
          <VisuallyHidden showOnFocus as="a" className={styles.skip} href="#main-content">
            Skip to main content
          </VisuallyHidden>
          <Navbar />
          <main
            id="main-content"
            className={styles.container}
            tabIndex={-1}
            data-loading={state === 'loading'}
          >
            <Outlet />
          </main>
        </ThemeProvider>
        <Scripts />
      </body>
    </html>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  return (
    <html lang="en" data-theme="dark">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#111" />
        <meta name="color-scheme" content="dark light" />
        <style dangerouslySetInnerHTML={{ __html: themeStyles }} />
        <Meta />
        <Links />
      </head>
      <body>
        <Error error={error} />
        <Scripts />
      </body>
    </html>
  );
}
