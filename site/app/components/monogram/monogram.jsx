import { forwardRef, useId } from 'react';
import { classes } from '~/utils/style';
import styles from './monogram.module.css';

/**
 * "A" compass monogram for Muhammad Akhmal.
 * Same API as the template monogram: fill comes from --textTitle (monogram.module.css),
 * the accent highlight sweeps in on hover when `highlight` is set.
 */
export const Monogram = forwardRef(({ highlight, className, ...props }, ref) => {
  const id = useId();
  const clipId = `${id}monogram-clip`;

  return (
    <svg
      aria-hidden
      className={classes(styles.monogram, className)}
      width="26"
      height="34"
      viewBox="0 0 230 299"
      ref={ref}
      {...props}
    >
      <defs>
        <clipPath id={clipId}>
          <path clipRule="evenodd" d="M104.8 18L104.9 42.1L100.5 50.6L91.8 54.9L95 63L94.8 65.6L-0.2 285L30.2 298.8L32.8 298.5L71.5 210L158 209.9L159.9 212.4L197 298.2L198 299.1L229.5 285.8L229.8 283.2L188 187.5L186.8 182.4L184.9 180.2L135.1 65.6L134.9 63L138.1 54.9L129.4 50.6L125 42.1L125.1 18ZM114.6 110.2L115.9 111L146 180.4L145.6 181.9L84.6 182L83.8 181.4Z" />
          <circle cx="114.5" cy="12" r="12" />
        </clipPath>
      </defs>
      <rect clipPath={`url(#${clipId})`} width="100%" height="100%" />
      {highlight && (
        <g clipPath={`url(#${clipId})`}>
          <rect className={styles.highlight} width="100%" height="100%" />
        </g>
      )}
    </svg>
  );
});
