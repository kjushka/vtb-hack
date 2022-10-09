import { FiChevronRight, FiChevronLeft } from 'react-icons/fi';
import { Button } from '@components';

const ButtonsBlock = () => {
	return (
		<div
			style={{
				width: 300,
				display: 'flex',
				flexDirection: 'column',
				gap: 10,
			}}>
			<h3>Кнопки:</h3>
			<Button onClick={() => console.log('default')}>Default</Button>
			<Button
				onClick={() => console.log('default disabled')}
				disabled
				leftIcon={FiChevronLeft}>
				Default
			</Button>
			<Button type='border' onClick={() => console.log('border')}>
				Border
			</Button>
			<Button
				type='border'
				rightIcon={FiChevronRight}
				onClick={() => console.log('border disabled')}
				disabled>
				Border
			</Button>
			<Button type='light' onClick={() => console.log('light')}>
				Light
			</Button>
			<Button
				type='light'
				rightIcon={FiChevronRight}
				onClick={() => console.log('light disabled')}
				disabled>
				Light
			</Button>
			<Button
				type='lightborder'
				onClick={() => console.log('lightborder')}>
				Light Border
			</Button>
			<Button
				type='lightborder'
				rightIcon={FiChevronRight}
				onClick={() => console.log('lightborder disabled')}
				disabled>
				Light Border
			</Button>
			<Button type='text' onClick={() => console.log('text')}>
				Text
			</Button>
			<Button
				type='text'
				rightIcon={FiChevronRight}
				onClick={() => console.log('text disabled')}
				disabled>
				Text
			</Button>
		</div>
	);
};
export { ButtonsBlock };
