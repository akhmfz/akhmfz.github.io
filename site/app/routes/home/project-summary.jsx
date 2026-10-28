import { Button } from '~/components/button';
import { Divider } from '~/components/divider';
import { Heading } from '~/components/heading';
import { Image } from '~/components/image';
import { Section } from '~/components/section';
import { Text } from '~/components/text';
import { useTheme } from '~/components/theme-provider';
import { Transition } from '~/components/transition';
import { useState } from 'react';
import { cssProps, media } from '~/utils/style';
import katakana from './katakana.svg';
import styles from './project-summary.module.css';

export function ProjectSummary({
  id,
  visible: sectionVisible,
  sectionRef,
  index,
  title,
  description,
  meta,
  screenshot,
  buttonText,
  buttonLink,
  secondaryLink,
  secondaryText,
  alternate,
  ...rest
}) {
  const [focused, setFocused] = useState(false);
  const { theme } = useTheme();
  const titleId = `${id}-title`;
  const svgOpacity = theme === 'light' ? 0.7 : 1;
  const indexText = index < 10 ? `0${index}` : index;

  function renderDetails(visible) {
    return (
      <div className={styles.details}>
        <div aria-hidden className={styles.index}>
          <Divider
            notchWidth="64px"
            notchHeight="8px"
            collapsed={!visible}
            collapseDelay={1000}
          />
          <span className={styles.indexNumber} data-visible={visible}>
            {indexText}
          </span>
        </div>
        <Heading
          level={3}
          as="h2"
          className={styles.title}
          data-visible={visible}
          id={titleId}
        >
          {title}
        </Heading>
        <Text className={styles.meta} data-visible={visible}>
          {meta}
        </Text>
        <Text className={styles.description} data-visible={visible} as="p">
          {description}
        </Text>
        <div className={styles.button} data-visible={visible}>
          <Button iconHoverShift href={buttonLink} iconEnd="arrow-right">
            {buttonText}
          </Button>
          {secondaryLink && (
            <Button secondary href={secondaryLink}>
              {secondaryText}
            </Button>
          )}
        </div>
      </div>
    );
  }

  function renderPreview(visible) {
    return (
      <div className={styles.preview}>
        <svg
          type="project"
          data-visible={visible}
          data-light={theme === 'light'}
          style={cssProps({ opacity: svgOpacity })}
          className={styles.svg}
          viewBox="0 0 751 136"
        >
          <use href={`${katakana}#katakana-project`} />
        </svg>
        <div className={styles.frame} data-visible={visible}>
          <div className={styles.frameBar} aria-hidden>
            <span className={styles.dot} />
            <span className={styles.dot} />
            <span className={styles.dot} />
            <span className={styles.frameUrl}>{screenshot.url}</span>
          </div>
          <Image
            srcSet={`${screenshot.src} ${screenshot.width}w`}
            placeholder={screenshot.placeholder}
            width={screenshot.width}
            height={screenshot.height}
            alt={screenshot.alt}
            sizes={`(max-width: ${media.tablet}px) 92vw, 45vw`}
          />
        </div>
      </div>
    );
  }

  return (
    <Section
      className={styles.summary}
      data-alternate={alternate}
      data-first={index === 1}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      as="section"
      aria-labelledby={titleId}
      ref={sectionRef}
      id={id}
      tabIndex={-1}
      {...rest}
    >
      <div className={styles.content}>
        <Transition in={sectionVisible || focused}>
          {({ visible }) => (
            <>
              {!alternate && (
                <>
                  {renderDetails(visible)}
                  {renderPreview(visible)}
                </>
              )}
              {alternate && (
                <>
                  {renderPreview(visible)}
                  {renderDetails(visible)}
                </>
              )}
            </>
          )}
        </Transition>
      </div>
    </Section>
  );
}
