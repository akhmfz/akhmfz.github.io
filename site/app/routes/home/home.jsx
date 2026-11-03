import { Footer } from '~/components/footer';
import { baseMeta } from '~/utils/meta';
import { projects } from '~/data/projects';
import { Heading } from '~/components/heading';
import { Text } from '~/components/text';
import { Intro } from './intro';
import { ProjectSummary } from './project-summary';
import { Profile } from './profile';
import { Experience } from './experience';
import { createRef, useEffect, useRef, useState } from 'react';
import styles from './home.module.css';
import activityStyles from './home-content.module.css';

export const meta = () => {
  return baseMeta({
    title: 'Financial Management Student — Internal Audit, Risk & Compliance',
    description: `Financial Management student at UNIDA Gontor developing knowledge of internal audit, risk, compliance, and governance through study and independent analytical projects.`,
  });
};

export const Home = () => {
  const [visibleSections, setVisibleSections] = useState([]);
  const [scrollIndicatorHidden, setScrollIndicatorHidden] = useState(false);
  const intro = useRef();
  const projectRefs = useRef(projects.map(() => createRef()));
  const profile = useRef();
  const experience = useRef();
  useEffect(() => {
    const sections = [intro, ...projectRefs.current, profile, experience];

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
      <section id="projects" className={activityStyles.work} aria-labelledby="work-title">
        <div className={activityStyles.headingRow}>
          <Text size="s">Selected work</Text>
          <Heading level={3} as="h2" id="work-title">Analysis tools & personal projects</Heading>
        </div>
        <ProjectSummary
          id="project-1"
          key={projects[0].slug}
          sectionRef={projectRefs.current[0]}
          visible={visibleSections.includes(projectRefs.current[0].current)}
          index={projects[0].index}
          title={projects[0].title}
          description={projects[0].description}
          meta={projects[0].meta}
          screenshot={projects[0].screenshot}
          buttonText="View project"
          buttonLink={`/projects/${projects[0].slug}/`}
          secondaryLink={projects[0].repo}
          secondaryText="Source code"
        />
        {projects.slice(1).map((project, index) => (
          <ProjectSummary
            id={`project-${project.index}`}
            key={project.slug}
            sectionRef={projectRefs.current[index + 1]}
            visible={visibleSections.includes(projectRefs.current[index + 1].current)}
            index={project.index}
            title={project.title}
            description={project.description}
            meta={project.meta}
            screenshot={project.screenshot}
            buttonText="View project"
            buttonLink={`/projects/${project.slug}/`}
            secondaryLink={project.repo}
            secondaryText="Source code"
            alternate={index % 2 === 0}
          />
        ))}
      </section>
      <Profile
        id="about"
        sectionRef={profile}
        visible={visibleSections.includes(profile.current)}
        headingAs="h2"
      />
      <Experience
        id="experience"
        sectionRef={experience}
        visible={visibleSections.includes(experience.current)}
      />
      <Footer />
    </div>
  );
};
