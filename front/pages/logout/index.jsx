import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import {} from 'redux-persist';

import { resetStore } from '@store/store';

const Page = () => {
	const router = useRouter();
	const dispatch = useDispatch();

	useEffect(() => {
		// localStorage.removeItem('persist:nextjs');
		// dispatch(resetStore);
		// setTimeout(() => router.push('/login'), 5000);
	}, []);

	return <></>;
};

export default Page;
