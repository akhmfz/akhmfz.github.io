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
    description: `Writing by ${config.fullName} on quality standards, market integrity, and financial inclusion in Indonesia.`,
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

function ArticlesPost({ post, featured = false }) {
  const titleLang = post.titleLang ?? (post.platform === 'Kompasiana' ? 'id' : 'en');
  const blurb = post.blurb || 'Read the original publication.';
  const blurbLang = post.blurbLang ?? (post.blurb ? titleLang : 'en');

  return (
    <article className={styles.post} data-featured={featured}>
      {featured && post.banner && (
        <div aria-hidden className={styles.postImage}>
          <img alt="" src={post.banner} />
        </div>
      )}
      {featured && (
        <Text className={styles.postLabel} size="s">
          Featured
        </Text>
      )}
      <a
        className={styles.postLink}
        href={post.href}
        target="_blank"
        rel="noopener noreferrer"
      >
        <div className={styles.postDetails}>
          <div aria-hidden className={styles.postDate}>
            <Divider notchWidth="64px" notchHeight="8px" collapsed={false} />
            {formatDate(post.date)}
          </div>
          <Heading as="h2" level={featured ? 3 : 4}>
            <span lang={titleLang}>{post.title}</span>
          </Heading>
          <Text size={featured ? 'l' : 's'} as="p">
            <span lang={blurbLang}>{blurb}</span>
          </Text>
          <div className={styles.postFooter}>
            <Button secondary iconHoverShift icon="chevron-right" as="div">
              Read article
            </Button>
            <Text className={styles.postSource} size="s">
              {post.platform}
            </Text>
          </div>
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
  );
}

export default function Articles() {
  const [featured, ...rest] = posts;

  return (
    <div className={styles.page}>
      <section className={styles.content}>
        <div className={styles.grid}>
          <header className={styles.header}>
            <Heading level={5} as="h1" className={styles.heading}>
              Latest articles
            </Heading>
          </header>

          <div className={styles.list}>
            {rest.length === 0 ? (
              <Text as="p" className={styles.empty}>
                Nothing has been collected here yet. New posts will be listed as they go out.
              </Text>
            ) : (
              rest.map(post => <ArticlesPost post={post} key={post.href} />)
            )}
          </div>

          {featured && (
            <div className={styles.featured}>
              <ArticlesPost post={featured} featured />
            </div>
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
