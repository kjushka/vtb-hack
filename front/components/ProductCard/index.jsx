import dynamic from 'next/dynamic';
import { useState } from 'react';

import { Button, Loader, Svg } from '@components';

import { FiChevronRight } from 'react-icons/fi';
import { RiCopperCoinFill } from 'react-icons/ri';
import styles from './style.module.scss';
import { toClassName } from '@utils';

const CustomImage = dynamic(
	() => import('@components').then((mod) => mod.CustomImage),
	{
		ssr: false,
		loading: () => <Loader />,
	}
);

const ProductCard = ({
	className = '',
	imageURL = '',
	tittle = '',
	description = '',
	userAvatar = '',
	userName = '',
	price = '',
	onUserClick = () => {},
	onReedMore = () => {},
}) => {
	const [error, setError] = useState(false);

	return (
		<div className={toClassName(styles.card, className)}>
			<div className={styles['card-image']}>
				{!imageURL || error ? (
					<Svg type='empty' className={styles['card-image_empty']} />
				) : (
					<CustomImage
						src={imageURL}
						alt={tittle}
						onError={() => setError(true)}
					/>
				)}
			</div>
			<div className={styles['card-content']}>
				<span className={styles['card-content-header']}>{tittle}</span>
				<span className={styles['card-content-description']}>
					{description}
				</span>
				<div className={styles['card-content-price']}>
					<span>{price}</span>
					<RiCopperCoinFill
						size={24}
						className={styles['card-content-price-icon']}
					/>
				</div>
				<div className={styles['card-content-footer']}>
					<div
						className={styles['card-content-footer-user']}
						onClick={onUserClick}>
						<div
							className={
								styles['card-content-footer-user-avatar']
							}>
							<CustomImage src={userAvatar} />
						</div>
						<span
							className={styles['card-content-footer-user-name']}>
							{userName}
						</span>
					</div>
					<Button
						type='text'
						className={styles['card-content-footer-reed-more']}
						rightIcon={FiChevronRight}
						onClick={onReedMore}>
						Подробнее
					</Button>
				</div>
			</div>
		</div>
	);
};

export { ProductCard };
