import { Button } from '@components';
import { useNotifications } from '@hooks';

import styles from './style.module.scss';

const NotificationsBlock = () => {
	const { pushNotifications } = useNotifications();

	return (
		<div
			style={{
				width: 300,
				display: 'flex',
				flexDirection: 'column',
				gap: 10,
			}}>
			<h3>Уведомления:</h3>
			<Button
				type='border'
				className={styles.button}
				onClick={() =>
					pushNotifications({
						type: 'default',
						header: 'Header',
						description: new Date().toISOString(),
						onClose: () => console.log('close default'),
					})
				}>
				Показать Default
			</Button>
			<Button
				type='border'
				className={styles.button}
				onClick={() =>
					pushNotifications({
						type: 'warning',
						header: 'Header',
						description: new Date().toISOString(),
						onClose: () => console.log('close warning'),
					})
				}>
				Показать Warning
			</Button>
			<Button
				type='border'
				className={styles.button}
				onClick={() =>
					pushNotifications({
						type: 'success',
						header: 'Header',
						description: new Date().toISOString(),
						onClose: () => console.log('close success'),
					})
				}>
				Показать Success
			</Button>
			<Button
				type='border'
				className={styles.button}
				onClick={() =>
					pushNotifications({
						type: 'error',
						header: 'Header',
						description: new Date().toISOString(),
						onClose: () => console.log('close error'),
					})
				}>
				Показать Error
			</Button>
			<Button
				type='border'
				className={styles.button}
				onClick={() =>
					pushNotifications({
						type: 'custom',
						custom: <span>Это кастомный компонет</span>,
						onClose: () => console.log('close custom'),
						className: styles['custom-notification'],
					})
				}>
				Показать Custom
			</Button>
		</div>
	);
};

export { NotificationsBlock };
