import { useRouter } from 'next/router';

import { Button } from '@components';

const TestPaage = () => {
	const router = useRouter();

	return (
		<>
			<div>
				<Button type='default' onClick={() => router.push('/test')}>
					TO OTHER PAGE
				</Button>
			</div>
		</>
	);
};

export default TestPaage;
