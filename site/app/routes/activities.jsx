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
    title: 'Activities',
    description: `Notes on the roles, programs, and teaching work behind ${config.fullName}'s audit practice.`,
    canonical: `${config.url}/activities/`,
  });

export default function Activities() {
  return (
    <div className={styles.page}>
      <section className={styles.content}>
        <header className={styles.header}>
          <Heading level={5} as="h1">
            Notes from the field
          </Heading>
          <Text as="p" className={styles.intro}>
            Short entries on the committees, programs, and teaching work behind the audit
            practice.
          </Text>
        </header>

        <div className={styles.list}>
          {activities.map(activity => (
            <article className={styles.item} key={activity.org}>
              <div aria-hidden className={styles.meta}>
                <Divider notchWidth="64px" notchHeight="8px" collapsed={false} />
                <span>
                  {activity.period} · {activity.category}
                </span>
              </div>
              <Heading level={4} as="h2">
                {activity.title}
              </Heading>
              <Text size="s" className={styles.org}>
                {activity.org}
              </Text>
              <Text as="p" className={styles.detail}>
                {activity.detail}
              </Text>
            </article>
          ))}
        </div>
      </section>
      <Footer />
    </div>
  );
}
