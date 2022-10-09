import React from 'react';

import { FiUser } from 'react-icons/fi';

import styles from './style.module.scss';

const Avatar = ({ action = () => {} }) => {
	return (
		<div className={styles.container} onClick={action}>
			<FiUser className={styles.icon} />
		</div>
	);
};

export { Avatar };
