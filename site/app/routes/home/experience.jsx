import { Divider } from '~/components/divider';
import { Heading } from '~/components/heading';
import { Section } from '~/components/section';
import { Text } from '~/components/text';
import { Transition } from '~/components/transition';
import { Fragment } from 'react';
import styles from './experience.module.css';

const roles = [
  {
    period: '2026 — Present',
    role: 'Chairperson',
    org: 'Sharia Investment Gallery (GIS), UNIDA Gontor',
    detail:
      'Lead student-led Islamic capital-market literacy initiatives and support programme coordination.',
  },
  {
    period: '2026 — Present',
    role: 'Secretary',
    org: 'Gugus Depan 04.091 Scout HQ',
    detail:
      'Manage archival records, official correspondence, and administrative documentation for the scout headquarters unit.',
  },
  {
    period: '2025 — Present',
    role: 'Secretary',
    org: 'Management Student Association',
    detail:
      'Draft minutes and formal correspondence, and keep administrative records consistent across all association activities.',
  },
  {
    period: '2025 — 2026',
    role: 'Publication, Documentation & Design',
    org: 'Sharia Investment Gallery (GIS)',
    detail:
      'Supported publication, documentation, and design for the IDX Roadshow to School programme on Islamic capital-market fundamentals.',
  },
  {
    period: '2024 — Present',
    role: 'Independent Market Researcher',
    org: 'Forex price action analysis',
    detail:
      'Build structured trade plans from market structure and support/resistance, with a written review process for every setup taken.',
  },
];

const education = [
  {
    period: '2024 — 2028',
    role: 'Bachelor of Financial Management',
    org: 'Universitas Darussalam Gontor',
    detail: 'GPA 3.73 / 4.00 · semester 6 · focus on investment analysis and Islamic business.',
  },
  {
    period: '2018 — 2024',
    role: 'KMI — Kulliyatul Mu’allimin al-Islamiyyah',
    org: 'Pondok Modern Darussalam Gontor',
    detail: 'Six-year integrated bilingual programme in Arabic and English.',
  },
];

function Row({ period, role, org, detail, visible }) {
  return (
    <div className={styles.row} data-visible={visible}>
      <span className={styles.period}>{period}</span>
      <div className={styles.body}>
        <h3 className={styles.role}>{role}</h3>
        <span className={styles.org}>{org}</span>
        <Text className={styles.detail} as="p">
          {detail}
        </Text>
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
              Records, coordination, and controls
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
