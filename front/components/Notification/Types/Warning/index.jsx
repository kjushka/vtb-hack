import { FiInfo } from 'react-icons/fi';

import styles from './style.module.scss';

const WarningNotification = ({
	header = '',
	description = '',
	onClick = () => {},
	onMouseEnter = () => {},
	onMouseLeave = () => {},
	...props
}) => {
	return (
		<div
			className={styles.notification}
			onClick={(e) => onClick(e)}
			onMouseEnter={(e) => onMouseEnter(e)}
			onMouseLeave={(e) => onMouseLeave(e)}
			{...props}>
			<div className={styles.notification__content}>
				<span className={styles.notification__header}>{header}</span>
				{!!description && (
					<span className={styles.notification__description}>
						{description}
					</span>
				)}
			</div>
			<div className={styles['notification__icon-container']}>
				<FiInfo
					className={styles['notification__icon-container__icon']}
				/>
			</div>
		</div>
	);
};

export { WarningNotification };
