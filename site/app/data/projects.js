import instrumenShot from '~/assets/projects/papan-instrumen-tradingview.png';
import instrumenPlaceholder from '~/assets/projects/papan-instrumen-placeholder.jpg';
import gerakShot from '~/assets/projects/papan-gerak.jpg';
import gerakPlaceholder from '~/assets/projects/papan-gerak-placeholder.jpg';

// Shared by the home summaries and the /projects/:slug pages, so the copy only
// lives in one place.
export const projects = [
  {
    slug: 'papan-instrumen',
    index: 1,
    title: 'Scoring Indonesian equities by sector',
    shortTitle: 'Papan Instrumen',
    description:
      'Papan Instrumen turns dozens of fundamental data points into a sector-aware score, so a stock can be read at a glance instead of row by row.',
    meta: 'Pine Script v6 · TradingView Public Library',
    screenshot: {
      src: instrumenShot,
      placeholder: instrumenPlaceholder,
      width: 1440,
      height: 900,
      alt: 'Papan Instrumen indicator running on a TradingView chart',
      url: 'tradingview.com/script/s4Bjqc7S-Saham-Papan-Instrumen-By-Akhmfz/',
    },
    repo: 'https://github.com/akhmfz/papan-instrumen',
    external: {
      label: 'Open in TradingView',
      href: 'https://www.tradingview.com/script/s4Bjqc7S-Saham-Papan-Instrumen-By-Akhmfz/',
    },
    summary:
      'A fundamental dashboard for the Indonesian market (IDX), written in Pine Script v6 and published in the TradingView public library. It is an analysis aid, not a buy or sell signal: every input, weight, and threshold is visible and can be overridden.',
    sections: [
      {
        heading: 'Seven dimensions, one score',
        body: 'Value, quality, growth, health, income, momentum, and an Indonesia-specific factor are scored separately, then combined with weights you can change. Five presets ship with it — equal, value-biased, quality-biased, growth-biased, and conservative.',
      },
      {
        heading: 'Sector-aware by default',
        body: 'Banks, insurers, consumer names, coal, CPO, property, and infrastructure do not share the same thresholds. The script auto-detects one of 15 sector classes and applies the matching weights, with a manual override when the guess is wrong.',
      },
      {
        heading: 'Risk kept separate from the score',
        body: 'Liquidity and pump-and-dump risk are flagged in their own module instead of being folded into the composite. A company can score well on fundamentals and still be marked as risky to trade.',
      },
      {
        heading: 'Built to be verified',
        body: 'Automated tests cover the scoring dimensions and regression cases, and the user guide is written in both Indonesian and English so the numbers can be checked rather than trusted.',
      },
    ],
    facts: [
      { label: 'Version', value: 'v0.3.0-beta' },
      { label: 'Market', value: 'IDX' },
      { label: 'Dimensions', value: '7' },
      { label: 'Sector classes', value: '15' },

      { label: 'License', value: 'MIT' },
    ],
  },
  {
    slug: 'papan-gerak',
    index: 2,
    title: 'A technical dashboard built for IDX liquidity',
    shortTitle: 'Papan Gerak',
    description:
      'Papan Gerak combines trend, momentum, volatility, and volume into one score, with three entry-trigger modes, position sizing, and JSON webhook alerts.',
    meta: 'Pine Script v6 · Technical dashboard',
    screenshot: {
      src: gerakShot,
      placeholder: gerakPlaceholder,
      width: 1280,
      height: 760,
      alt: 'Papan Gerak repository on GitHub',
      url: 'github.com/akhmfz/papan-gerak',
    },
    repo: 'https://github.com/akhmfz/papan-gerak',
    summary:
      'The technical companion to Papan Instrumen. Where that script answers “is this business worth owning”, this one answers “is now a sensible time to act”, and keeps the answer in the same visual language. It is a chart-study aid, not investment advice.',
    sections: [
      {
        heading: 'Four dimensions instead of one oscillator',
        body: 'Trend, momentum, volatility, and volume are scored independently and combined, giving chart readers several dimensions to consider instead of relying on one oscillator.',
      },
      {
        heading: 'Three entry triggers with risk attached',
        body: 'Each trigger mode comes with position sizing and a stop level, so a signal arrives with the risk it implies instead of asking the reader to work it out afterwards.',
      },
      {
        heading: 'MTF filter and webhook alerts',
        body: 'A higher-timeframe filter blocks entries that fight the dominant trend, and seven alert conditions are available in both a readable format and JSON for webhooks.',
      },
      {
        heading: 'Backtestable, not just drawable',
        body: 'The repository includes a strategy version for TradingView’s tester, allowing its behaviour to be explored against historical chart data.',
      },
    ],
    facts: [
      { label: 'Dimensions', value: '4' },
      { label: 'Parameters', value: '50' },
      { label: 'Alert conditions', value: '7' },

      { label: 'License', value: 'MIT' },
    ],
  },

];

export function getProject(slug) {
  return projects.find(project => project.slug === slug);
}
