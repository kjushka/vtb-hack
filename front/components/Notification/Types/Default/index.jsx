import styles from './style.module.scss';

const DefaultNotification = ({
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
			<span className={styles.notification__header}>{header}</span>
			{!!description && (
				<span className={styles.notification__description}>
					{description}
				</span>
			)}
		</div>
	);
};

export { DefaultNotification };
