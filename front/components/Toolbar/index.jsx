import { FiPlus, FiTrash2, FiEdit } from 'react-icons/fi';

import styles from './style.module.scss';
import { toClassName } from '@utils';

const ToolBar = ({
	edit = true,
	create = true,
	del = true,
	onEdit = () => {},
	onCreate = () => {},
	onDelete = () => {},
	className = '',
	...props
}) => {
	return (
		<div className={toClassName(styles.toolbar, className)}>
			{create && (
				<div className={styles['toolbar-button']} onClick={onCreate}>
					<FiPlus />
				</div>
			)}
			{edit && (
				<div className={styles['toolbar-button']} onClick={onEdit}>
					<FiEdit />
				</div>
			)}
			{del && (
				<div className={styles['toolbar-button']} onClick={onDelete}>
					<FiTrash2 />
				</div>
			)}
		</div>
	);
};

export { ToolBar };
