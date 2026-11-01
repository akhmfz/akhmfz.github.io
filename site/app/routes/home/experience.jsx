import { Divider } from '~/components/divider';
import { Heading } from '~/components/heading';
import { Section } from '~/components/section';
import { Text } from '~/components/text';
import { Transition } from '~/components/transition';
import { Fragment } from 'react';
import styles from './experience.module.css';

const roles = [
  {
    period: '',
    role: 'Self-directed market analysis',
    org: 'Forex price action study',
    detail:
      'Build structured trade plans from market structure and support/resistance, with a written review process for each setup.',
  },
];

const education = [
  {
    period: '',
    role: 'Financial Management undergraduate',
    org: '',
  },
];

function Row({ period, role, org, detail, visible }) {
  return (
    <div className={styles.row} data-visible={visible}>
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
              Independent analysis
            </Heading>
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
