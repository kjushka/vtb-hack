import styles from './style.module.scss';

import { toClassName } from '@utils';

const SwitchInput = ({ value, text, onChange = () => {}, ...props }) => {
	return (
		<label
			className={toClassName(
				styles.switch,
				props.disabled && styles['switch-disabled']
			)}>
			<p className={styles.switch_text}>{text}</p>
			<input type='checkbox' checked={value} onChange={onChange} />
			<span className={toClassName(styles.slider, styles.round)}></span>
		</label>
	);
};

export { SwitchInput };
