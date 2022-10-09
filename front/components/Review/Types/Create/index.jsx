import { TextEditor } from '@components';

import styles from './style.module.scss';
import { toClassName } from '@utils/toClassName';

const CreateReview = ({ initValue = '', onChange = () => {}, ...props }) => {
	return (
		<div className={toClassName(styles.review)} {...props}>
			<TextEditor
				initValue={initValue}
				onChange={onChange}
				className={styles['review-editor']}
			/>
		</div>
	);
};

export { CreateReview };
