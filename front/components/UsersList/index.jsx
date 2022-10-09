import { useRouter } from 'next/router';
import React from 'react';
import { UserCard, Popup, Loader } from '@components';

import PropTypes from 'prop-types';

import styles from './style.module.scss';

const UsersList = ({ users = [], loading = false }) => {
	const router = useRouter();

	return (
		<div className={styles['user-list']}>
			{loading ? (
				<div className={styles['user-list_loader']}>
					<Loader />
				</div>
			) : (
				!!users &&
				users.map(({ id, ...card }) => (
					<UserCard
						key={id}
						info={ card.info}
						onUserClick={() =>
							router.push(`users/view/${id}`)
						}
					/>
				))
			)}
			{/* <Popup
        }
				type='custom'
				button='none'
				isOpenNow={true}
				contentLabel='Custom'
				closePopupNow={() => setIsOpen(!isOpenNow)}>
				<div className={styles.products_description}>
					<h3>
						Lorem ipsum dolor sit, amet consectetur adipisicing
						elit.{' '}
					</h3>
					<p>
						Lorem ipsum dolor sit amet consectetur adipisicing elit.
						Ducimus dolore facilis sapiente reprehenderit dolores
						veniam rem modi repudiandae perferendis enim, quos quis
						sed optio quisquam accusantium quaerat voluptatum
						aliquid magni!
					</p>
				</div>
			</Popup> */}
		</div>
	);
};

UsersList.propTypes = {
	users: PropTypes.array,
};

export { UsersList };
