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
    description: `Selected activities by ${config.fullName}.`,
    canonical: `${config.url}/activities/`,
  });

export default function Activities() {
  return (
    <div className={styles.page}>
      <section className={styles.content}>
        <Text size="s">Leadership & activities</Text>
        <Heading level={0} as="h1">Work beyond the tools</Heading>
        <div className={styles.list}>
          {activities.length === 0 && (
            <Text as="p" className={styles.intro}>
              Activity notes will appear here once each role is confirmed and documented.
            </Text>
          )}
          {activities.map(activity => (
            <article className={styles.item} key={activity.title}>
              <Text size="s" className={styles.category}>{activity.category}</Text>
              <Heading level={3} as="h2">{activity.title}</Heading>
              <Text size="s" className={styles.role}>{activity.role} · {activity.organization}</Text>
              <Text as="p">{activity.summary}</Text>
              <Text as="p">{activity.contribution}</Text>
            </article>
          ))}
        </div>
      </section>
      <Footer />
    </div>
  );
}
