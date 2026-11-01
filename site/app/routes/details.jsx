import { Footer } from '~/components/footer';
import { baseMeta } from '~/utils/meta';
import { Experience } from './home/experience';
import { Profile } from './home/profile';
import config from '~/config.json';
import styles from '~/pages/details.module.css';

export const meta = () =>
  baseMeta({
    title: 'Details',
    description: `Education and professional interests of ${config.fullName}, a Financial Management student developing a foundation in internal audit, risk, and compliance.`,
    canonical: `${config.url}/details/`,
  });

export default function Details() {
  return (
    <div className={styles.page}>
      <Profile id="about" visible />
      <Experience id="experience" visible />
      <Footer />
    </div>
  );
}
