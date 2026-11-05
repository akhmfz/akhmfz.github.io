import { Divider } from '~/components/divider';
import { Heading } from '~/components/heading';
import { Section } from '~/components/section';
import { Text } from '~/components/text';
import { Transition } from '~/components/transition';
import { Fragment } from 'react';
import { education, roles } from '~/data/career';
import { experienceHighlights } from '~/data/experience-highlights';
import styles from './experience.module.css';

function Row({ period, role, org, detail, visible }) {
  return (
    <div className={styles.row} data-visible={visible} data-no-period={!period || undefined}>
      {period && <span className={styles.period}>{period}</span>}
      <div className={styles.body}>
        <h3 className={styles.role}>{role}</h3>
        {org && <span className={styles.org}>{org}</span>}
        {detail && <Text className={styles.detail} as="p">{detail}</Text>}
      </div>
    </div>
  );
}

export const Experience = ({ id, visible, sectionRef }) => {
  const titleId = `${id}-title`;

  return (
    <Section
      className={styles.experience}
      as="section"
      id={id}
      ref={sectionRef}
      aria-labelledby={titleId}
      tabIndex={-1}
    >
      <Transition in={visible}>
        {({ visible: show }) => (
          <Fragment>
            <div className={styles.header}>
              <Divider
                notchWidth="64px"
                notchHeight="8px"
                collapsed={!show}
                collapseDelay={800}
              />
              <Text className={styles.label} data-visible={show}>
                Experience
              </Text>
            </div>
            <Heading level={3} as="h2" className={styles.title} id={titleId}>
              Experience
            </Heading>
            <div
              className={styles.highlights}
              role="group"
              aria-label="Activity photo highlights"
            >
              {experienceHighlights.map(item => {
                const images = item.images || [{ src: item.image, alt: item.alt }];
                const Preview = item.source ? 'a' : 'div';

                return (
                <figure className={styles.highlight} key={item.source || item.title}>
                  <Preview
                    className={styles.highlightImage}
                    data-gallery={images.length > 1 || undefined}
                    {...(item.source
                      ? {
                          href: item.source,
                          target: '_blank',
                          rel: 'noopener noreferrer',
                          'aria-label': `View source for ${item.title}`,
                        }
                      : {})}
                  >
                    {images.map(image => (
                      <img
                        key={image.src}
                        src={image.src}
                        alt={image.alt}
                        loading="lazy"
                        decoding="async"
                      />
                    ))}
                  </Preview>
                  <figcaption className={styles.highlightCaption}>
                    <span className={styles.highlightDate}>{item.date}</span>
                    <strong>{item.title}</strong>
                    {item.source && (
                      <a href={item.source} target="_blank" rel="noopener noreferrer">
                        Photo: UNIDA Gontor
                      </a>
                    )}
                    {item.credit && <span>{item.credit}</span>}
                  </figcaption>
                </figure>
                );
              })}
            </div>
            <div className={styles.list}>
              {roles.map(item => (
                <Row key={`${item.org}-${item.role}`} {...item} visible={show} />
              ))}
            </div>
            <div className={styles.header} data-secondary>
              <Divider
                notchWidth="64px"
                notchHeight="8px"
                collapsed={!show}
                collapseDelay={1000}
              />
              <Text className={styles.label} data-visible={show}>
                Education
              </Text>
            </div>
            <div className={styles.list}>
              {education.map(item => (
                <Row key={item.org} {...item} visible={show} />
              ))}
            </div>
          </Fragment>
        )}
      </Transition>
    </Section>
  );
};
