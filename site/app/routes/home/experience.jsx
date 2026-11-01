import { Divider } from '~/components/divider';
import { Heading } from '~/components/heading';
import { Section } from '~/components/section';
import { Text } from '~/components/text';
import { Transition } from '~/components/transition';
import { Fragment } from 'react';
import styles from './experience.module.css';

const roles = [
  {
    period: '2026 – Present',
    role: 'Chairman',
    org: 'Islamic Investment Gallery (GIS) · UNIDA Gontor',
    detail:
      'Lead a team of 15 members in Islamic capital-market literacy programs; coordinate activities with BEI and OJK; facilitate the Kuliah Umum Pasar Modal Syariah under OJK SEPMT 2026 East Java; instruct KSPM members on Islamic investment fundamentals.',
  },
  {
    period: '2025 – 2026',
    role: 'Publication, Documentation & Design Division',
    org: 'Islamic Investment Gallery (GIS) · UNIDA Gontor',
    detail:
      'Produced content, documentation, and design assets for GIS programs; coordinated IDX Roadshow to School across three high schools in Ponorogo.',
  },
  {
    period: '2025 – Present',
    role: 'Secretary',
    org: 'Management Student Association · UNIDA Gontor',
    detail:
      'Maintain official records and correspondence, draft meeting minutes, and support administrative compliance across association activities.',
  },
  {
    period: '2025 – 2026',
    role: 'Secretary',
    org: 'Dewan Racana · Racana Al-Faraby Scouts · UNIDA Gontor',
    detail: 'Managed secretarial duties, formal records, and official correspondence for the university scout council.',
  },
  {
    period: '2026 – Present',
    role: 'Secretary',
    org: 'Gugus Depan 04.091 Scout HQ · UNIDA Gontor',
    detail: 'Manage archival records, official correspondence, and administrative documentation for the scout headquarters unit.',
  },
  {
    period: '2026',
    role: 'Secretary',
    org: 'OSPEK Orientation Committee · UNIDA Gontor',
    detail: 'Oversaw documentation, official correspondence, and administrative operations for the new-student orientation program.',
  },
  {
    period: '2024 – Present',
    role: 'Independent Market Researcher',
    org: 'Forex price-action analysis · Remote',
    detail:
      'Conduct independent price-action analysis and develop systematic trade plans based on technical structure and market context.',
  },
  {
    period: '2024 – Present',
    role: 'Volunteer Scout Instructor',
    org: 'MIN 7 Ponorogo',
    detail: 'Mentor elementary-school students in scouting and explain structured material clearly.',
  },
];

const education = [
  {
    period: '2024 – Present',
    role: 'Bachelor of Financial Management',
    org: 'Universitas Darussalam Gontor (UNIDA)',
    detail: 'GPA 3.73/4.00 · Semester 6 · Focus on financial management, investment analysis, and Islamic business.',
  },
  {
    period: 'Graduated 2024',
    role: "KMI · Kulliyatul Mu'allimin al-Islamiyyah",
    org: 'Pondok Modern Darussalam Gontor',
    detail: 'Six-year bilingual Arabic and English integrated program covering religious and general sciences.',
  },
];

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
