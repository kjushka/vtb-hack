import { useRouter } from 'next/router';
import { Svg } from '@components';
import styles from './style.module.scss';

export default function FourOhFour() {
	const router = useRouter();
	return (
		<div className={styles.root}>
			<h1>404 - Page Not Found</h1>
			<Svg type='error404' className={styles.icon} />
			<span className={styles.link} onClick={() => router.back()}>
				<b>Go back</b>
			</span>
		</div>
	);
}
