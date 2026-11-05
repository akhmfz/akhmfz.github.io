import { Divider } from '~/components/divider';
import { Footer } from '~/components/footer';
import { Heading } from '~/components/heading';
import { Text } from '~/components/text';
import { baseMeta } from '~/utils/meta';
import config from '~/config.json';
import { activities } from '~/data/activities';
import styles from '~/pages/activities.module.css';

export const meta = () =>
  baseMeta({
    title: 'Journal',
    description: `Photo stories from the programs, scholarship, and community work of ${config.fullName}.`,
    canonical: `${config.url}/activities/`,
  });

export default function Activities() {
  const [featured, ...rest] = activities;
  const photoStories = rest.filter(activity => activity.image);
  const otherActivities = rest.filter(activity => !activity.image);

  return (
    <div className={styles.page}>
      <section className={styles.content}>
        <header className={styles.header}>
          <Heading level={5} as="h1">
            Journal
          </Heading>
          <Text as="p" className={styles.intro}>
            Field notes from scholarship, capital-market education, student organizations, and
            community work.
          </Text>
        </header>

        {featured && (
          <article className={styles.featured}>
            {featured.image && (
              <img
                className={styles.featuredImage}
                src={featured.image}
                alt={featured.imageAlt || featured.title}
                style={{ objectPosition: featured.imagePosition || 'center' }}
                loading="eager"
                decoding="async"
              />
            )}
            <div className={styles.featuredBody}>
              <div className={styles.meta}>
                <Divider notchWidth="64px" notchHeight="8px" collapsed={false} />
                <span>{featured.period} · {featured.category}</span>
              </div>
              <Heading level={3} as="h2">{featured.title}</Heading>
              <Text size="s" className={styles.org}>{featured.org}</Text>
              <Text as="p" className={styles.detail}>{featured.detail}</Text>
            </div>
          </article>
        )}

        {photoStories.length > 0 && (
          <section className={styles.stories} aria-labelledby="programs-title">
            <Heading level={4} as="h2" id="programs-title" className={styles.sectionTitle}>
              Programs & community
            </Heading>
            <div className={styles.storyGrid}>
              {photoStories.map(activity => (
                <article className={styles.story} key={`${activity.org}-${activity.title}`}>
                  <img
                    className={styles.storyImage}
                    src={activity.image}
                    alt={activity.imageAlt || activity.title}
                    style={{ objectPosition: activity.imagePosition || 'center' }}
                    loading="lazy"
                    decoding="async"
                  />
                  <div className={styles.storyBody}>
                    <div className={styles.meta}>
                      <Divider notchWidth="64px" notchHeight="8px" collapsed={false} />
                      <span>{activity.period} · {activity.category}</span>
                    </div>
                    <Heading level={4} as="h3">{activity.title}</Heading>
                    <Text size="s" className={styles.org}>{activity.org}</Text>
                    <Text as="p" className={styles.detail}>{activity.detail}</Text>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {otherActivities.length > 0 && (
          <section className={styles.other} aria-labelledby="other-title">
            <Heading level={4} as="h2" id="other-title" className={styles.sectionTitle}>
              Other activities
            </Heading>
            <div className={styles.list}>
              {otherActivities.map(activity => (
                <article className={styles.item} key={`${activity.org}-${activity.title}`}>
              <div className={styles.meta}>
                <Divider notchWidth="64px" notchHeight="8px" collapsed={false} />
                    <span>{activity.period} · {activity.category}</span>
              </div>
                  <Heading level={4} as="h3">{activity.title}</Heading>
                  <Text size="s" className={styles.org}>{activity.org}</Text>
                  <Text as="p" className={styles.detail}>{activity.detail}</Text>
                </article>
              ))}
            </div>
          </section>
        )}
      </section>
      <Footer />
    </div>
  );
}
