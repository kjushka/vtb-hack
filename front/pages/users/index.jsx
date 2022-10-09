import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';

import {
	selectLoadingUsers,
	selectUsers,
	getUsers,
} from '@store/slices/userSlice';

import { UsersList } from '@components';

import styles from './style.module.scss';

const UsersPage = ({}) => {
	const users = useSelector(selectUsers);
	const loadingUsers = useSelector(selectLoadingUsers);
	
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(getUsers());
	}, []);



	return (
		<div className={styles.root}>
			<h2 className={styles.root_headline}>Пользователи</h2>
			<UsersList users={ users } loading={loadingUsers} />
		</div>
	);
};

export default UsersPage;
