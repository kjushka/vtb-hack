import moment from 'moment';

import { TextViewer, User } from '@components';

import styles from './style.module.scss';
import { toClassName } from '@utils/toClassName';

const ReadReview = ({
	author = {},
	createDate = '',
	text = '',
	onAuthorClick = () => {},
	className = '',
	...props
}) => {
	return (
		<div className={toClassName(styles.review, className)} {...props}>
			<div className={styles['review-header']}>
				<User
					id={author.id}
					name={author.name}
					image={author.image}
					onClick={onAuthorClick}
				/>
				<span className={styles['review-header-date']}>
					{moment(createDate).format('DD.MM.YYYY HH:MM')}
				</span>
			</div>
			<TextViewer value={text} />
		</div>
	);
};

export { ReadReview };
