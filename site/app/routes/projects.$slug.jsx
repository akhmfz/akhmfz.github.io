import { Button } from '~/components/button';
import { Divider } from '~/components/divider';
import { Footer } from '~/components/footer';
import { Heading } from '~/components/heading';
import { Image } from '~/components/image';
import { Link } from '~/components/link';
import { Text } from '~/components/text';
import { Error } from '~/layouts/error';
import { baseMeta } from '~/utils/meta';
import { useParams } from '@remix-run/react';
import { getProject, projects } from '~/data/projects';
import styles from '~/pages/project.module.css';

export const meta = ({ params }) => {
  const project = getProject(params.slug);

  if (!project) {
    return [{ title: '404 | Muhammad Akhmal' }];
  }

  return baseMeta({
    title: project.shortTitle,
    description: project.meta,
  });
};

export default function Project() {
  const { slug } = useParams();
  const project = getProject(slug);

  if (!project) {
    return <Error error={{ status: 404, statusText: 'Not found' }} />;
  }

  const next = projects[project.index] || projects[0];
  const { screenshot } = project;

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <Link className={styles.back} href="/#project-1">
          All projects
        </Link>
        <Heading level={0} as="h1" className={styles.title}>
          {project.title}
        </Heading>
        <Text className={styles.meta} size="s">
          {project.meta}
        </Text>
        <Text className={styles.summary} size="l" as="p">
          {project.summary}
        </Text>
        <div className={styles.actions}>
          <Button href={project.repo} iconEnd="arrow-right">
            Source code
          </Button>
          {project.external && (
            <Button secondary href={project.external.href}>
              {project.external.label}
            </Button>
          )}
        </div>
      </section>

      <section className={styles.shot}>
        <div className={styles.frame}>
          <div className={styles.frameBar} aria-hidden>
            <span className={styles.dot} />
            <span className={styles.dot} />
            <span className={styles.dot} />
            <span className={styles.frameUrl}>{screenshot.url}</span>
          </div>
          <Image
            src={screenshot.src}
            placeholder={screenshot.placeholder}
            width={screenshot.width}
            height={screenshot.height}
            sizes="(max-width: 768px) 92vw, 1100px"
            alt={screenshot.alt}
          />
        </div>
      </section>

      <section className={styles.body}>
        <div className={styles.article}>
          {project.sections.map(section => (
            <div className={styles.block} key={section.heading}>
              <Heading level={3} as="h2" className={styles.blockTitle}>
                {section.heading}
              </Heading>
              <Text as="p" className={styles.blockBody}>
                {section.body}
              </Text>
            </div>
          ))}
        </div>

        <div className={styles.aside}>
          <div aria-hidden className={styles.asideTag}>
            <Divider notchWidth="64px" notchHeight="8px" />
            <span className={styles.asideTagText}>At a glance</span>
          </div>
          <dl className={styles.facts}>
            {project.facts.map(fact => (
              <div className={styles.fact} key={fact.label}>
                <dt>{fact.label}</dt>
                <dd>{fact.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className={styles.next}>
        <Text size="s">Next project</Text>
        <Link className={styles.nextLink} href={`/projects/${next.slug}`}>
          {next.shortTitle}
        </Link>
      </section>

      <Footer />
    </div>
  );
}
