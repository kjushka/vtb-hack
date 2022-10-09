import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { Tasks } from '@components';

import {
	getTasks,
	selectLoadingTasks,
	selectTasks,
} from '@store/slices/tasksSlice';

import styles from './style.module.scss';

const TasksPage = () => {
	const loading = useSelector(selectLoadingTasks);
	const tasks = useSelector(selectTasks);

	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(getTasks());
	}, []);

	return (
		<div className={styles.root}>
			<h2 className={styles.root_headline}>Задания</h2>
			<Tasks tasks={tasks} loading={loading} />
		</div>
	);
};

export default TasksPage;
