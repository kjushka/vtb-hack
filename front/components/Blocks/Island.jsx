import { useNotifications } from '@hooks';
import { Island } from '@components';
import { useState } from 'react';

const IslandBlock = () => {
	const [progress, setProgress] = useState();
	const { pushNotifications } = useNotifications();

	return (
		<div
			style={{
				display: 'flex',
				gap: 10,
				flexDirection: 'column',
			}}>
			<h3>Прогресс задания:</h3>
			<input
				type='range'
				min={0}
				max={100}
				value={progress}
				step='5'
				onChange={({ target: { valueAsNumber } }) =>
					setProgress(valueAsNumber)
				}
			/>
			<Island
				type='weekly'
				badge='Задание'
				description='Description sdf sdf sdf sdf sdf sdf sdf sd fs df sdf sd fs df sdf sdf sdf sd f sdfsdfsdf sfds  sdfhsdjf sd fsd f sdf sd fsd f sd fsd fsd f'
				header='Header'
				progress={progress}
				price={100}
				onButtonClick={() =>
					pushNotifications({
						type: 'custom',
						custom: <span>Тут должен быть переход</span>,
						onClose: () => console.log('close custom'),
						style: { color: 'rgb(23, 112, 255)' },
					})
				}
				buttonText='Button'
			/>
			<Island
				badge='Задание'
				description='Description sdf sdf sdf sdf sdf sdf sdf sd fs df sdf sd fs df sdf sdf sdf sd f sdfsdfsdf sfds  sdfhsdjf sd fsd f sdf sd fsd f sd fsd fsd f'
				header='Header'
				progress={progress}
				price={100}
				onButtonClick={() =>
					pushNotifications({
						type: 'custom',
						custom: <span>Тут должен быть переход</span>,
						onClose: () => console.log('close custom'),
						style: { color: 'rgb(23, 112, 255)' },
					})
				}
				buttonText='Button'
			/>
		</div>
	);
};

export { IslandBlock };
