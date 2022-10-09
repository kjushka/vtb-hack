import { useRouter } from 'next/router';

import { useSelector, useDispatch } from 'react-redux';

import { wrapper } from '@store';
import { selectOfferState, getOfferById } from '@store/slices/offersSlice';

import { Button } from '@components';

import styles from './style.module.scss';

const TestPaage = () => {
	const dispatch = useDispatch();
	const router = useRouter();

	const offer = useSelector(selectOfferState);

	return (
		<>
			<div>
				<span>{JSON.stringify(offer)}</span>
				<Button
					type='default'
					onClick={() =>
						dispatch(getOfferById(offer ? offer.id + 1 : 1))
					}>
					UPDATE AUTH
				</Button>
			</div>
			<div>
				<Button type='default' onClick={() => router.push('/test/2')}>
					TO OTHER PAGE
				</Button>
			</div>
			<div>
				<span className={styles.test}>
					йцукенгшщзхъфыва пролджэячсмитьбю
				</span>
				a
			</div>
		</>
	);
};

export const getServerSideProps = wrapper.getServerSideProps(
	(store) =>
		async ({ params }) => {
			await store.dispatch(getOfferById(0));
			console.log(store.getState());
			return {
				props: {},
			};
		}
);

export default TestPaage;
