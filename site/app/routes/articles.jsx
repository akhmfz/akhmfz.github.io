import { Button } from '~/components/button';
import { Footer } from '~/components/footer';
import { Heading } from '~/components/heading';
import { Link } from '~/components/link';
import { Text } from '~/components/text';
import { baseMeta } from '~/utils/meta';
import config from '~/config.json';
import { platforms, posts } from '~/data/posts';
import styles from '~/pages/articles.module.css';

export const meta = () =>
  baseMeta({
    title: 'Articles',
    description: `Writing by ${config.fullName} on audit, risk, controls, and the Indonesian market.`,
  });

const formatDate = value =>
  new Date(`${value}T00:00:00Z`).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  });

export default function Articles() {
  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <Heading level={0} as="h1" className={styles.title}>
          Articles
        </Heading>
        <Text size="l" as="p" className={styles.intro}>
          Notes on audit, risk, and the Indonesian market. Longer pieces and short
          observations are collected here as they are published elsewhere.
        </Text>
      </section>

      <section className={styles.list}>
        {posts.length === 0 ? (
          <Text as="p" className={styles.empty}>
            Nothing has been collected here yet. New posts will be listed as they go out.
          </Text>
        ) : (
          posts.map(post => (
            <article className={styles.post} key={post.href}>
              <div className={styles.postMeta}>
                <span>{post.platform}</span>
                <span>{formatDate(post.date)}</span>
              </div>
              <Link className={styles.postLink} href={post.href}>
                {post.title}
              </Link>
              <Text as="p" className={styles.postBlurb}>
                {post.blurb}
              </Text>
            </article>
          ))
        )}
      </section>

      <section className={styles.elsewhere}>
        <Text size="s" as="p" className={styles.elsewhereLabel}>
          Elsewhere
        </Text>
        <div className={styles.actions}>
          {platforms.map(platform => (
            <Button secondary key={platform.label} href={platform.href}>
              {platform.label}
            </Button>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
