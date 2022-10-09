import { toClassName } from '@utils/toClassName';
import styles from './style.module.scss';

const DefaultButon = ({
	onClick = () => {},
	className = '',
	children = null,
	leftIcon: LeftIcon = null,
	rightIcon: RightIcon = null,
	...props
}) => {
	return (
		<button
			onClick={onClick}
			className={toClassName(styles.button, className)}
			{...props}>
			{!!LeftIcon && <LeftIcon />}
			{!!children && children}
			{!!RightIcon && <RightIcon />}
		</button>
	);
};

export { DefaultButon };
