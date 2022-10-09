import { Loader } from '@components';

const LoaderBlock = () => {
	return (
		<div
			style={{
				width: 100,
				display: 'flex',
				flexDirection: 'column',
				gap: 10,
			}}>
			<h3>Лоадер:</h3>
			<Loader />
		</div>
	);
};
export { LoaderBlock };
