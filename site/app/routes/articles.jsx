import { Button } from '~/components/button';
import { Divider } from '~/components/divider';
import { Footer } from '~/components/footer';
import { Heading } from '~/components/heading';
import { Text } from '~/components/text';
import { baseMeta } from '~/utils/meta';
import config from '~/config.json';
import { parseEditorialDate, platforms, posts } from '~/data/posts';
import styles from '~/pages/articles.module.css';

export const meta = () =>
  baseMeta({
    title: 'Articles',
    description: `Writing by ${config.fullName} on audit, risk, controls, and the Indonesian market.`,
    canonical: `${config.url}/articles/`,
  });

const formatDate = value =>
  parseEditorialDate(value)
    ? parseEditorialDate(value).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
      })
    : 'Date unavailable';

export default function Articles() {
  return (
    <div className={styles.page}>
      <section className={styles.content}>
        <header className={styles.header}>
          <Heading level={5} as="h1">
            Latest articles
          </Heading>
        </header>

        <div className={styles.list}>
          {posts.length === 0 ? (
            <Text as="p" className={styles.empty}>
              Nothing has been collected here yet. New posts will be listed as they go out.
            </Text>
          ) : (
            posts.map(post => (
              <article className={styles.post} key={post.href}>
                <a
                  className={styles.postLink}
                  href={post.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div aria-hidden className={styles.postDate}>
                    <Divider notchWidth="64px" notchHeight="8px" collapsed={false} />
                    {formatDate(post.date)}
                  </div>
                  <Heading as="h2" level={4}>
                    {post.title}
                  </Heading>
                  <Text size="s" as="p">
                    {post.blurb || 'Read the original publication.'}
                  </Text>
                  <div className={styles.postFooter}>
                    <Button secondary iconHoverShift icon="chevron-right" as="div">
                      Read article
                    </Button>
                    <Text className={styles.postSource} size="s">
                      {post.platform}
                    </Text>
                  </div>
                </a>
                {post.sources?.length > 0 && (
                  <div className={styles.sources}>
                    <Text size="s">Sources:</Text>
                    {post.sources.map(source => (
                      <a href={source.href} target="_blank" rel="noopener noreferrer" key={source.href}>
                        {source.label}
                      </a>
                    ))}
                  </div>
                )}
              </article>
            ))
          )}
        </div>
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
