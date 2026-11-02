import profileImgLarge from '~/assets/profile-large.jpg';
import profileImgPlaceholder from '~/assets/profile-placeholder.jpg';
import profileImg from '~/assets/profile.jpg';
import { Button } from '~/components/button';
import { DecoderText } from '~/components/decoder-text';
import { Divider } from '~/components/divider';
import { Heading } from '~/components/heading';
import { Image } from '~/components/image';
import { Section } from '~/components/section';
import { Text } from '~/components/text';
import { Transition } from '~/components/transition';
import { Fragment, useState } from 'react';
import { media } from '~/utils/style';
import config from '~/config.json';
import styles from './profile.module.css';

const ProfileText = ({ visible, titleId, headingAs }) => (
  <Fragment>
    <Heading className={styles.title} data-visible={visible} level={3} as={headingAs} id={titleId}>
      <DecoderText text="Hi there" start={visible} delay={500} />
    </Heading>
    <Text className={styles.description} data-visible={visible} size="l" as="p">
      I’m Akhmal, a Financial Management student.
      My career interests are internal audit, controls, risk, compliance, and corporate
      governance; I also build tools for capital-market analysis.
    </Text>
    <Text className={styles.description} data-visible={visible} size="l" as="p">
      I’m developing relevant knowledge through my studies and independent analytical
      projects as I prepare for an internship in internal audit, risk, or compliance.
    </Text>
  </Fragment>
);

export const Profile = ({ id, visible, sectionRef, headingAs = 'h1' }) => {
  const [focused, setFocused] = useState(false);
  const titleId = `${id}-title`;

  return (
    <Section
      className={styles.profile}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      as="section"
      id={id}
      ref={sectionRef}
      aria-labelledby={titleId}
      tabIndex={-1}
    >
      <Transition in={visible || focused} timeout={0}>
        {({ visible, nodeRef }) => (
          <div className={styles.content} ref={nodeRef}>
            <div className={styles.column}>
              <ProfileText visible={visible} titleId={titleId} headingAs={headingAs} />
              <div className={styles.actions} data-visible={visible}>
                <Button
                  secondary
                  href={`mailto:${config.email}`}
                  icon="send"
                >
                  Send me a message
                </Button>
                <Button
                  secondary
                  href={config.linkedin}
                  icon="linkedin"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  LinkedIn
                </Button>
              </div>
            </div>
            <div className={styles.column}>
              <div className={styles.tag} aria-hidden>
                <Divider
                  notchWidth="64px"
                  notchHeight="8px"
                  collapsed={!visible}
                  collapseDelay={1000}
                />
                <div className={styles.tagText} data-visible={visible}>
                  About me
                </div>
              </div>
              <div className={styles.image}>
                <Image
                  reveal
                  delay={100}
                  placeholder={profileImgPlaceholder}
                  srcSet={`${profileImg} 480w, ${profileImgLarge} 960w`}
                  width={960}
                  height={1280}
                  sizes={`(max-width: ${media.mobile}px) 100vw, 480px`}
                  alt="Muhammad Akhmal Fauzi Saefurohman"
                />
              </div>
            </div>
          </div>
        )}
      </Transition>
    </Section>
  );
};
