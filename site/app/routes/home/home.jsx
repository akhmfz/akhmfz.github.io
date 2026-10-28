import instrumenShot from '~/assets/projects/papan-instrumen.jpg';
import instrumenPlaceholder from '~/assets/projects/papan-instrumen-placeholder.jpg';
import gerakShot from '~/assets/projects/papan-gerak.jpg';
import gerakPlaceholder from '~/assets/projects/papan-gerak-placeholder.jpg';
import pspShot from '~/assets/projects/pine-semantic-platform.jpg';
import pspPlaceholder from '~/assets/projects/pine-semantic-platform-placeholder.jpg';
import { Footer } from '~/components/footer';
import { baseMeta } from '~/utils/meta';
import { Intro } from './intro';
import { Experience } from './experience';
import { Profile } from './profile';
import { ProjectSummary } from './project-summary';
import { useEffect, useRef, useState } from 'react';
import config from '~/config.json';
import styles from './home.module.css';

export const meta = () => {
  return baseMeta({
    title: 'Audit, Risk & Compliance Portfolio',
    description: `Portfolio of ${config.fullName} — Financial Management student at UNIDA Gontor building a career in internal audit, internal controls, risk management, and compliance.`,
  });
};

export const Home = () => {
  const [visibleSections, setVisibleSections] = useState([]);
  const [scrollIndicatorHidden, setScrollIndicatorHidden] = useState(false);
  const intro = useRef();
  const projectOne = useRef();
  const projectTwo = useRef();
  const projectThree = useRef();
  const experience = useRef();
  const details = useRef();

  useEffect(() => {
    const sections = [
      intro,
      projectOne,
      projectTwo,
      projectThree,
      experience,
      details,
    ];

    const sectionObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const section = entry.target;
            observer.unobserve(section);
            if (visibleSections.includes(section)) return;
            setVisibleSections(prevSections => [...prevSections, section]);
          }
        });
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.1 }
    );

    const indicatorObserver = new IntersectionObserver(
      ([entry]) => {
        setScrollIndicatorHidden(!entry.isIntersecting);
      },
      { rootMargin: '-100% 0px 0px 0px' }
    );

    sections.forEach(section => {
      sectionObserver.observe(section.current);
    });

    indicatorObserver.observe(intro.current);

    return () => {
      sectionObserver.disconnect();
      indicatorObserver.disconnect();
    };
  }, [visibleSections]);

  return (
    <div className={styles.home}>
      <Intro
        id="intro"
        sectionRef={intro}
        scrollIndicatorHidden={scrollIndicatorHidden}
      />
      <ProjectSummary
        id="project-1"
        sectionRef={projectOne}
        visible={visibleSections.includes(projectOne.current)}
        index={1}
        title="Scoring Indonesian equities in seconds"
        description="Papan Instrumen turns dozens of fundamental data points into a sector-aware score, so a stock can be read at a glance instead of row by row."
        meta="Pine Script v6 · TradingView Public Library · 96 automated tests"
        screenshot={{
          src: instrumenShot,
          placeholder: instrumenPlaceholder,
          width: 1280,
          height: 760,
          alt: 'Papan Instrumen repository on GitHub',
          url: 'github.com/akhmfz/papan-instrumen',
        }}
        buttonText="View the script"
        buttonLink="https://www.tradingview.com/script/s4Bjqc7S-Saham-Papan-Instrumen-By-Akhmfz/"
        secondaryLink="https://github.com/akhmfz/papan-instrumen"
        secondaryText="Source code"
      />
      <ProjectSummary
        id="project-2"
        alternate
        sectionRef={projectTwo}
        visible={visibleSections.includes(projectTwo.current)}
        index={2}
        title="A technical dashboard built for IDX liquidity"
        description="Papan Gerak combines trend, momentum, volatility, and volume into one score, with three entry-trigger modes, position sizing, and JSON webhook alerts."
        meta="Pine Script v6 · 50 parameters · 90 automated tests"
        screenshot={{
          src: gerakShot,
          placeholder: gerakPlaceholder,
          width: 1280,
          height: 760,
          alt: 'Papan Gerak repository on GitHub',
          url: 'github.com/akhmfz/papan-gerak',
        }}
        buttonText="View source"
        buttonLink="https://github.com/akhmfz/papan-gerak"
      />
      <ProjectSummary
        id="project-3"
        sectionRef={projectThree}
        visible={visibleSections.includes(projectThree.current)}
        index={3}
        title="Reading code the way a reviewer would"
        description="A Python CLI that parses Pine Script into an abstract syntax tree, answers semantic queries, and runs a staged validation pipeline before anything is published."
        meta="Python · ANTLR · 7 CLI commands · v2.0.0"
        screenshot={{
          src: pspShot,
          placeholder: pspPlaceholder,
          width: 1280,
          height: 760,
          alt: 'Pine Semantic Platform repository on GitHub',
          url: 'github.com/akhmfz/pine-semantic-platform',
        }}
        buttonText="View source"
        buttonLink="https://github.com/akhmfz/pine-semantic-platform"
      />
      <Experience
        id="experience"
        sectionRef={experience}
        visible={visibleSections.includes(experience.current)}
      />
      <Profile
        sectionRef={details}
        visible={visibleSections.includes(details.current)}
        id="details"
      />
      <Footer />
    </div>
  );
};
