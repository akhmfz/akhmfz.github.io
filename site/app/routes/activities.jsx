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
    description: `Leadership, publication, documentation, and financial-literacy activities by ${config.fullName}.`,
    canonical: `${config.url}/activities/`,
  });

export default function Activities() {
  return (
    <div className={styles.page}>
      <section className={styles.content}>
        <Text size="s">Leadership & activities</Text>
        <Heading level={0} as="h1">Work beyond the tools</Heading>
        <Text size="l" as="p" className={styles.intro}>
          Selected responsibilities through GIS UNIDA Gontor, presented as concise activity notes rather than a photo gallery.
        </Text>
        <div className={styles.list}>
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
