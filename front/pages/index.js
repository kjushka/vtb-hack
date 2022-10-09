import { useRouter } from 'next/router';

import { Svg } from '@components';

import styles from './style.module.scss';

export default function Home() {
  const router = useRouter();

  return (
    <div className={styles.root}>
      <h1>Welcome!</h1>
      <Svg type='mainpage' className={styles.icon} />
      <span className={styles.link} onClick={() => router.push('/login')}>
        <b>Go to login</b>
      </span>
    </div>
  );
}
