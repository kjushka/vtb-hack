import { useMemo, useState } from 'react';

import { CustomImage } from '@components';

import styles from './style.module.scss';

const Users = ({ users = [] }) => {
	// const _users = useMemo(() => users.splice(0, 3), [users]);

	console.log(1, users, users.length);

	return (
		<div>
			{users.splice(0, 3).map((el) => (
				<div key={el.id} className={styles['user-avatar']}>
					<CustomImage src={el.image} alt={el.name} />
				</div>
			))}
			<div></div>
		</div>
	);
};

export { Users };
