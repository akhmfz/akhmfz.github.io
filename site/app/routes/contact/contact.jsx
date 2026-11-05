import { Button } from '~/components/button';
import { DecoderText } from '~/components/decoder-text';
import { Divider } from '~/components/divider';
import { Footer } from '~/components/footer';
import { Heading } from '~/components/heading';
import { Input } from '~/components/input';
import { Section } from '~/components/section';
import { Text } from '~/components/text';
import { tokens } from '~/components/theme-provider/theme';
import { Transition } from '~/components/transition';
import { useFormInput } from '~/hooks';
import { useState } from 'react';
import { cssProps, msToNum, numToMs } from '~/utils/style';
import { baseMeta } from '~/utils/meta';
import config from '~/config.json';
import styles from './contact.module.css';

export const meta = () => {
  return baseMeta({
    title: 'Contact',
    description:
      'Send me a message about an internship, a project, or anything related to audit, risk, and financial controls.',
    canonical: `${config.url}/contact/`,
  });
};

const MAX_EMAIL_LENGTH = 512;
const MAX_MESSAGE_LENGTH = 4096;
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xaeekdpv';

export const Contact = () => {
  const email = useFormInput('');
  const message = useFormInput('');
  const initDelay = tokens.base.durationS;
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setSubmitError('');

    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        body: new FormData(event.currentTarget),
        headers: { Accept: 'application/json' },
      });

      if (!response.ok) throw new Error('Form submission failed');
      setSent(true);
    } catch {
      setSubmitError(`Message could not be sent. Please email ${config.email} directly.`);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Section className={styles.contact}>
      <Transition unmount in={!sent} timeout={1600}>
        {({ status, nodeRef }) => (
          <form
            action={FORMSPREE_ENDPOINT}
            className={styles.form}
            method="post"
            ref={nodeRef}
            onSubmit={handleSubmit}
          >
            <Heading
              className={styles.title}
              data-status={status}
              level={3}
              as="h1"
              style={getDelay(tokens.base.durationXS, initDelay, 0.3)}
            >
              <DecoderText text="Say hello" start={status !== 'exited'} delay={300} />
            </Heading>
            <Divider
              className={styles.divider}
              data-status={status}
              style={getDelay(tokens.base.durationXS, initDelay, 0.4)}
            />
            <Input
              required
              className={styles.input}
              data-status={status}
              style={getDelay(tokens.base.durationXS, initDelay)}
              autoComplete="email"
              label="Your email"
              type="email"
              name="email"
              maxLength={MAX_EMAIL_LENGTH}
              {...email}
            />
            <Input
              required
              multiline
              className={styles.input}
              data-status={status}
              style={getDelay(tokens.base.durationS, initDelay)}
              autoComplete="off"
              label="Message"
              name="message"
              maxLength={MAX_MESSAGE_LENGTH}
              {...message}
            />
            <input
              className={styles.botkiller}
              type="text"
              name="_gotcha"
              tabIndex={-1}
              autoComplete="off"
            />
            {submitError && (
              <div className={styles.formError} role="alert">
                <div className={styles.formErrorContent}>
                  <p className={styles.formErrorMessage}>{submitError}</p>
                </div>
              </div>
            )}
            <Button
              className={styles.button}
              data-status={status}
              style={getDelay(tokens.base.durationM, initDelay)}
              icon="send"
              type="submit"
              loading={submitting}
              loadingText="Sending"
              disabled={submitting}
            >
              {submitting ? 'Sending…' : 'Send message'}
            </Button>
          </form>
        )}
      </Transition>
      <Transition unmount in={sent}>
        {({ status, nodeRef }) => (
          <div className={styles.complete} aria-live="polite" ref={nodeRef}>
            <Heading level={3} as="h3" className={styles.completeTitle} data-status={status}>
              Message sent
            </Heading>
            <Text
              size="l"
              as="p"
              className={styles.completeText}
              data-status={status}
              style={getDelay(tokens.base.durationXS)}
            >
              Thanks for reaching out. I’ll reply to your email as soon as I can. If needed,
              you can also reach me at {config.email}.
            </Text>
            <Button
              secondary
              iconHoverShift
              className={styles.completeButton}
              data-status={status}
              style={getDelay(tokens.base.durationM)}
              href="/"
              icon="chevron-right"
            >
              Back to homepage
            </Button>
          </div>
        )}
      </Transition>
      <Footer className={styles.footer} />
    </Section>
  );
};

function getDelay(delayMs, offset = numToMs(0), multiplier = 1) {
  const numDelay = msToNum(delayMs) * multiplier;
  return cssProps({ delay: numToMs((msToNum(offset) + numDelay).toFixed(0)) });
}
