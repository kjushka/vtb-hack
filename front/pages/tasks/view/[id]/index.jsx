import React from 'react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import { getFullTask } from '@api/tasks';
import { selectTask, updateToFullTask } from '@store/slices/tasksSlice';

import { Loader, Price, TextViewer, ToolBar, User } from '@components';

import styles from './style.module.scss';
import { toClassName } from '@utils/toClassName';

const CreatePage = ({ fullTask = {} }) => {
	const router = useRouter();
	const dispatch = useDispatch();

	const task = useSelector(selectTask(fullTask.id));

	useEffect(() => {
		dispatch(updateToFullTask(fullTask));
	}, [fullTask]);

	return (
		<div className={styles.root}>
			<ToolBar
				onCreate={() => router.push('/tasks/create')}
				onEdit={() => router.push(router.asPath + '/edit')}
			/>
			{task.achievement ? (
				<div className={styles.task}>
					<h1>{task.title}</h1>
					<TextViewer value={task.description} />
					<div className={styles['task-info']}>
						<div className={styles['task-info-achievement']}>
							<img
								src={task.achievement.image}
								alt={task.achievement.title}
							/>
							<span>{task.achievement.title}</span>
						</div>
						<div className={styles['task-info-main']}>
							<div className={styles['task-info-main-item']}>
								<span>Автор:</span>
								<User
									id={task.host.id}
									name={task.host.userName}
									image={task.host.userAvatar}
									onClick={() =>
										router.push('/users/' + task.host.id)
									}
								/>
							</div>
							<div
								className={toClassName(
									styles['task-info-main-item']
								)}>
								<span>Награда:</span>
								<Price price={task.award} />
							</div>
							<div
								className={toClassName(
									styles['task-info-main-item']
								)}>
								<span>Участники:</span>
								<div
									className={
										styles['task-info-main-item-users']
									}>
									{/* <Users
										users={task.participants.map((el) => {
											return {
												id: el.id,
												name: el.userName,
												image: el.userAvatar,
												onClick: () => {},
											};
										})}
									/> */}
									{task.participants.map((el) => {
										return React.createElement(User, {
											key: el.id,
											className:
												styles[
													'task-info-main-item-users-user'
												],
											id: el.id,
											name: el.userName,
											image: el.userAvatar,
											// withName: false,
											onClick: () => {},
										});
									})}
								</div>
								{/* <Users users={users} /> */}
							</div>
						</div>
					</div>
				</div>
			) : (
				<div>
					<Loader />
				</div>
			)}
		</div>
	);
};

export const getServerSideProps = async ({ params: { id }, res }) => {
	let result = await getFullTask(id);

	if (false) {
		res.writeHead(301, { Location: '/404' });
		res.end();

		return true;
	}

	return {
		props: {
			fullTask: result.data,
		},
	};
};

export default CreatePage;
