import { Footer } from '~/components/footer';
import { baseMeta } from '~/utils/meta';
import { projects } from '~/data/projects';
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
  const projectRefs = [projectOne, projectTwo, projectThree];
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
      {projects.map((project, i) => (
        <ProjectSummary
          key={project.slug}
          id={`project-${project.index}`}
          alternate={i % 2 === 1}
          sectionRef={projectRefs[i]}
          visible={visibleSections.includes(projectRefs[i].current)}
          index={project.index}
          title={project.title}
          description={project.description}
          meta={project.meta}
          screenshot={project.screenshot}
          buttonText="View project"
          buttonLink={`/projects/${project.slug}`}
          secondaryLink={project.repo}
          secondaryText="Source code"
        />
      ))}
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
