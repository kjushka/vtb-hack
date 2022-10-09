import PropTypes from 'prop-types';

import styles from './style.module.scss';
import { toClassName } from '@utils';

const DefaultInput = ({
	type = 'text',
	leftIcon: LeftIcon = null,
	rightIcon: RightIcon = null,
	className = '',
	descriptionClassName = '',
	...props
}) => {
	const stylesInput = props.disabled
		? styles.input + ' ' + styles['disabled']
		: styles.input;

	return (
		<div className={toClassName(styles.wrapper, className)}>
			<div className={stylesInput}>
				{!!LeftIcon && <LeftIcon className={styles.input_icon__left} />}
				<input type={type} {...props} />
				{!!RightIcon && (
					<RightIcon className={styles.input_icon__right} />
				)}
			</div>
			<p
				className={toClassName(
					styles.input_description,
					descriptionClassName
				)}>
				{props.description}
			</p>
		</div>
	);
};

DefaultInput.propTypes = {
	type: PropTypes.string,
};

export { DefaultInput };
