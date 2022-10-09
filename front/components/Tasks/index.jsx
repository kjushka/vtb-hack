import { useRouter } from 'next/router';
import React from 'react';
import { Island, Popup, Loader } from '@components';

import styles from './style.module.scss';

const TaskLine = ({
	title = '',
	loading = false,
	items = [],
	type = 'default',
}) => {
	const router = useRouter();

	return (
		<>
			<h3 className={styles.tasks_headline}>{title}</h3>
			{loading ? (
				<div className={styles.tasks_loader}>
					<Loader />
				</div>
			) : (
				<div className={styles.tasks_container}>
					{items?.map((task) => (
						<Island
							key={task.id}
							type={type}
							header={task.title}
							description={task.description}
							buttonText='Открыть'
							price={task.award}
							onButtonClick={() =>
								router.push(`/tasks/view/${task.id}`)
							}
						/>
					))}
				</div>
			)}
		</>
	);
};

const Tasks = ({ tasks = {}, loading = false }) => {
	return (
		<div className={styles.tasks}>
			{(tasks?.weekly?.length > 0 || loading) && (
				<TaskLine
					type='weekly'
					loading={loading}
					title='Задания на неделю:'
					items={tasks?.weekly}
				/>
			)}

			{(tasks?.mounth?.length > 0 || loading) && (
				<TaskLine
					type='default'
					loading={loading}
					title='Задания на месяц:'
					items={tasks?.mounth}
				/>
			)}

			{/* <Popup
				type='custom'
				button='none'
				isOpenNow={true}
				contentLabel='Custom'
				closePopupNow={() => setIsOpen(!isOpenNow)}>
				<div className={styles.tasks_description}>
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

export { Tasks };
