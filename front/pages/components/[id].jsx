import { useRouter } from 'next/router';

const TestPaage = (props) => {
	const {
		query: { id },
	} = useRouter();

	return (
		<div>
			<div>{id}</div>
		</div>
	);
};

export default TestPaage;
