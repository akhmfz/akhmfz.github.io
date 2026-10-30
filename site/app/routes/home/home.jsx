import { Footer } from '~/components/footer';
import { baseMeta } from '~/utils/meta';
import { projects } from '~/data/projects';
import { activities } from '~/data/activities';
import { posts } from '~/data/posts';
import { Button } from '~/components/button';
import { Heading } from '~/components/heading';
import { Text } from '~/components/text';
import { Intro } from './intro';
import { ProjectSummary } from './project-summary';
import { useEffect, useRef, useState } from 'react';
import config from '~/config.json';
import styles from './home.module.css';
import activityStyles from './home-content.module.css';

export const meta = () => {
  return baseMeta({
    title: 'Financial Management Student — Internal Audit, Risk & Compliance',
    description: `Financial Management student at UNIDA Gontor focused on internal audit, internal controls, risk management, compliance, and governance.`,
  });
};

export const Home = () => {
  const [visibleSections, setVisibleSections] = useState([]);
  const [scrollIndicatorHidden, setScrollIndicatorHidden] = useState(false);
  const intro = useRef();
  const projectOne = useRef();
  useEffect(() => {
    const sections = [intro, projectOne];

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
      <section className={activityStyles.work} aria-labelledby="work-title">
        <div className={activityStyles.headingRow}>
          <Text size="s">Selected work</Text>
          <Heading level={3} as="h2" id="work-title">Analysis tools & personal projects</Heading>
        </div>
        <ProjectSummary
          id="project-1"
          key={projects[0].slug}
          sectionRef={projectOne}
          visible={visibleSections.includes(projectOne.current)}
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
        {projects.slice(1).map(project => (
          <article className={activityStyles.projectRow} id={`project-${project.index}`} key={project.slug}>
            <div>
              <Text size="s" className={activityStyles.eyebrow}>{project.meta}</Text>
              <Heading level={4} as="h3">{project.shortTitle}</Heading>
              <Text as="p">{project.description}</Text>
            </div>
            <div className={activityStyles.projectActions}>
              <Button href={`/projects/${project.slug}/`}>Project details</Button>
              <Button secondary href={project.repo}>Source code</Button>
            </div>
          </article>
        ))}
      </section>
      <section className={activityStyles.content} aria-labelledby="activities-title">
        <div className={activityStyles.headingRow}>
          <Text size="s">Selected leadership & activities</Text>
          <Heading level={3} as="h2" id="activities-title">Work beyond the tools</Heading>
        </div>
        <div className={activityStyles.activityGrid}>
          {activities.map(activity => (
            <article className={activityStyles.card} key={activity.title}>
              <Text size="s" className={activityStyles.eyebrow}>{activity.category}</Text>
              <Heading level={4} as="h3">{activity.title}</Heading>
              <Text size="s" className={activityStyles.organization}>{activity.organization}</Text>
              <Text as="p">{activity.summary}</Text>
              <Text as="p">{activity.contribution}</Text>
            </article>
          ))}
        </div>
        <Button secondary href="/activities/">View activity notes</Button>
      </section>
      <section className={activityStyles.content} aria-labelledby="writing-title">
        <div className={activityStyles.headingRow}>
          <Text size="s">Selected writing</Text>
          <Heading level={3} as="h2" id="writing-title">Notes from the field</Heading>
        </div>
        <div className={activityStyles.writingList}>
          {posts.length ? posts.slice(0, 3).map(post => (
            <a className={activityStyles.writingItem} href={post.href} target="_blank" rel="noopener noreferrer" key={post.href}>
              <span>{post.platform} · {post.date || 'Date unavailable'}</span>
              <strong>{post.title}</strong>
              <small>{post.blurb || 'Read the original publication.'}</small>
            </a>
          )) : (
            <Text size="s" className={activityStyles.emptyWriting}>
              Writing will appear here when a new publication is added.
            </Text>
          )}
        </div>
        {posts.length > 0 && <Button secondary href="/articles/">View all writing</Button>}
      </section>
      <section className={activityStyles.about} id="about-preview" aria-labelledby="about-preview-title">
        <Text size="s">About</Text>
        <Heading level={3} as="h2" id="about-preview-title">Training for work that stands up to review.</Heading>
        <Text as="p">Financial Management undergraduate at Universitas Darussalam Gontor, building a foundation in controls, risk, compliance, and governance alongside capital-market research.</Text>
        <div><Button href="/details/">Read the full profile</Button><Button secondary href="/contact/">Get in touch</Button></div>
      </section>
      <Footer />
    </div>
  );
};
