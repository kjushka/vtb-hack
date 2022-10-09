import { ProductCard } from '@components';

import { useNotifications } from '@hooks';

const ProductCardBlock = () => {
	const { pushNotifications } = useNotifications();

	return (
		<div
			style={{
				width: 350,
				display: 'flex',
				flexDirection: 'column',
				gap: 10,
			}}>
			<h3>Карта продукта:</h3>
			<ProductCard
				tittle='7 Skills of Highly Effective Programmers'
				imageURL='https://img1.akspic.ru/crops/7/8/8/9/6/169887/169887-gorod-zdanie-purpur-tsvetnoy-liniya_gorizonta-7680x4320.jpg'
				description='Our team was inspired by the seven skills of highly effective programmers created by the TechLead. We wanted to provide our own take on the topic Our team was inspired by the seven skills of highly effective programmers created by the TechLead. We wanted to provide our own take on the topic...'
				userAvatar='https://sun9-70.userapi.com/impg/_d3jGXuFnEspdPnqQfr-HYiyLeW792auSXffTg/KJaeZbAlMfM.jpg?size=2560x1707&quality=95&sign=8c7b1be6e9a2ed435a716b64fdb68925&type=album'
				userName='Test test'
				price={4000}
				onUserClick={() =>
					pushNotifications({
						type: 'custom',
						custom: <span>Тут должен быть переход</span>,
						onClose: () => console.log('close custom'),
						style: { color: 'rgb(23, 112, 255)' },
					})
				}
                onReedMore={() =>
                    pushNotifications({
                        type: 'custom',
                        custom: <span>Тут должен быть переход</span>,
                        onClose: () => console.log('close custom'),
                        style: { color: 'rgb(23, 112, 255)' },
                    })
                }
			/>
			<ProductCard
				tittle='7 Skills of Highly Effective Programmers'
				imageURL='testtjndgjf'
				description='Our team was inspired by the seven skills of highly effective programmers created by the TechLead. We wanted to provide our own take on the topic Our team was inspired by the seven skills of highly effective programmers created by the TechLead. We wanted to provide our own take on the topic...'
				userAvatar='https://sun9-70.userapi.com/impg/_d3jGXuFnEspdPnqQfr-HYiyLeW792auSXffTg/KJaeZbAlMfM.jpg?size=2560x1707&quality=95&sign=8c7b1be6e9a2ed435a716b64fdb68925&type=album'
				userName='Test test'
				price={4000}
				onUserClick={() =>
					pushNotifications({
						type: 'custom',
						custom: <span>Тут должен быть переход</span>,
						onClose: () => console.log('close custom'),
						style: { color: 'rgb(23, 112, 255)' },
					})
				}
				onReedMore={() =>
					pushNotifications({
						type: 'custom',
						custom: <span>Тут должен быть переход</span>,
						onClose: () => console.log('close custom'),
						style: { color: 'rgb(23, 112, 255)' },
					})
				}
			/>
		</div>
	);
};
export { ProductCardBlock };
