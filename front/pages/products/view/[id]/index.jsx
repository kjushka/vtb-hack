import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { getProductById } from '@api/products';
import {
	selectProductById,
	setFullInfoInProduct,
	addReviewToProduct,
	deleteProduct as deleteProductStore,
} from '@store/slices/productsSlice';
import { selectInfo } from '@store/slices/userSlice';

import {
	Loader,
	CustomImage,
	User,
	Price,
	Button,
	TextViewer,
	Review,
	ToolBar,
} from '@components';
import { useNotifications } from '@hooks';

import styles from './style.module.scss';
import { toClassName } from '@utils';

const Product = ({ productInfo = {} }) => {
	const router = useRouter();
	const dispatch = useDispatch();

	const fullInfo = useSelector(selectProductById(productInfo.id));
	const user = useSelector(selectInfo);

	const { pushNotifications } = useNotifications();

	const [addReview, setAddReview] = useState(false);
	const [reviewValue, setReviewValue] = useState('');

	useEffect(() => {
		dispatch(setFullInfoInProduct(productInfo));
	}, [productInfo]);

	const createReview = useCallback(() => {
		dispatch(
			addReviewToProduct({
				id: fullInfo.id,
				text: reviewValue,
				user,
				callback: (type) => {
					if (type === 'success') {
						pushNotifications({
							type: 'success',
							header: 'Успешно',
							description: 'Отзыв создан',
						});
						setReviewValue('');
						setAddReview();
					} else {
						pushNotifications({
							type: 'error',
							header: 'Ошибка',
							description: 'Не удалось создать отзыв',
						});
					}
				},
			})
		);
	}, [user, fullInfo, reviewValue]);

	const deleteProduct = useCallback(() => {
		dispatch(
			deleteProductStore({
				id: fullInfo.id,
				callback: (type) => {
					if (type === 'success') {
						pushNotifications({
							type: 'success',
							header: 'Успешно',
							description: 'Отзыв удален',
						});
						router.back();
					} else {
						pushNotifications({
							type: 'error',
							header: 'Ошибка',
							description: 'Не удалось удалить отзыв',
						});
					}
				},
			})
		);
	}, []);

	return (
		<div className={styles.root}>
			{fullInfo ? (
				<>
					<ToolBar
						onEdit={() => router.push(router.asPath + '/edit')}
						onCreate={() => router.push('/products/create')}
						onDelete={() => deleteProduct()}
					/>
					<div className={styles['image-container']}>
						<CustomImage
							src={fullInfo.imageURL}
							alt={fullInfo.title}
						/>
					</div>
					<div className={styles['content-container']}>
						<h1 className={styles['content-container-title']}>
							{fullInfo.title}
						</h1>
						<div className={styles['content-container-info']}>
							<div
								className={
									styles['content-container-info-user']
								}>
								<User
									id={fullInfo.user.id}
									name={fullInfo.user.userName}
									image={fullInfo.user.userAvatar}
									onClick={() =>
										router.push(`/user/${fullInfo.user.id}`)
									}
								/>
							</div>
							<div
								className={
									styles['content-container-info-buy']
								}>
								<div
									className={
										styles[
											'content-container-info-buy-count'
										]
									}>
									<span>Осталось</span>
									<span>
										{fullInfo.count !== undefined
											? fullInfo.count
											: 1}{' '}
										шт.
									</span>
								</div>
								<Button
									title='Купить'
									className={
										styles[
											'content-container-info-buy-button'
										]
									}>
									<Price price={fullInfo.price} />
								</Button>
							</div>
						</div>
						<TextViewer value={fullInfo.description} />
						<div className={styles['content-container-add-review']}>
							{!addReview ? (
								<Button
									className={
										styles[
											'content-container-add-review-button'
										]
									}
									onClick={() => setAddReview(true)}>
									Добавить отзыв
								</Button>
							) : (
								<>
									<Review
										type='create'
										onChange={(val) => setReviewValue(val)}
									/>
									<div
										className={
											styles[
												'content-container-add-review-buttons'
											]
										}>
										<Button
											className={toClassName(
												styles[
													'content-container-add-review-button'
												],
												styles[
													'content-container-add-review-button__cancel'
												]
											)}
											onClick={() => setAddReview(false)}>
											Отмена
										</Button>
										<Button
											className={
												styles[
													'content-container-add-review-button'
												]
											}
											onClick={() => createReview()}>
											Отправить
										</Button>
									</div>
								</>
							)}
						</div>
						{fullInfo.reviews?.length > 0 && (
							<div
								className={styles['content-container-reviews']}>
								<h3>Отзывы:</h3>
								{fullInfo.reviews.map((el) => (
									<Review
										key={el.id}
										type='read'
										author={{
											id: el.user.id,
											name: el.user.userName,
											image: el.user.userAvatar,
										}}
										text={el.text}
										createDate={el.createDate}
									/>
								))}
							</div>
						)}
					</div>
				</>
			) : (
				<div>
					<Loader />
				</div>
			)}
		</div>
	);
};

export const getServerSideProps = async ({ params: { id }, res }) => {
	let result = await getProductById(id);

	if (false) {
		res.writeHead(301, { Location: '/404' });
		res.end();

		return true;
	}

	return {
		props: {
			productInfo: result.data,
		},
	};
};

export default Product;
