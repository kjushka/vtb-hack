import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { getProductById } from '@api/products';
import { useDispatch, useSelector } from 'react-redux';

import { useFormik } from 'formik';

import {
	selectProductById,
	setFullInfoInProduct,
	editProduct,
} from '@store/slices/productsSlice';

import { Button, Input, TextEditor } from '@components';
import { useNotifications } from '@hooks';

import styles from './style.module.scss';
import { toClassName } from '@utils/toClassName';

const EditProduct = ({ productInfo = {} }) => {
	const router = useRouter();
	const { pushNotifications } = useNotifications();
	const fullInfo = useSelector(selectProductById(productInfo.id));

	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(setFullInfoInProduct(productInfo.id));
	}, [productInfo]);

	const formik = useFormik({
		initialValues: {
			image: null,
			description: fullInfo.description,
			count: fullInfo.count,
			title: fullInfo.title,
			price: fullInfo.price,
		},
		validate: (data) => {
			const errors = {};

			if (!data.description.replace(/<\s*a[^>]*>|<\s*\/\s*a>/g, '')) {
				errors.description = 'Необходимо заполнить значения';
			}
			if (!data.title) {
				errors.title = 'Необходимо заполнить значения';
			}
			if (!data.price || data.price < 0) {
				errors.price = 'Необходимо заполнить значения';
			}
			if (!data.count || data.count < 0) {
				errors.price = 'Необходимо заполнить значения';
			}

			return errors;
		},
		onSubmit: (data) => {
			dispatch(
				editProduct({
					...fullInfo,
					...data,
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
		},
	});

	return (
		<div className={styles.root}>
			<h1>Редактирование продукта:</h1>
			<form
				className={styles.form}
				onSubmit={(e) => {
					formik.handleSubmit();
					e.preventDefault();
				}}>
				<div className={styles['form-top']}>
					<div className={styles['form-top-left']}>
						<Input
							type='file'
							initValue={fullInfo.imageURL}
							onChange={(value) =>
								formik.setFieldValue('image', value)
							}
						/>
					</div>
					<div className={styles['form-top-right']}>
						<Input
							type='default'
							typedefault='text'
							placeholder='Title'
							name='title'
							value={formik.values.title}
							onChange={formik.handleChange}
							description={formik.errors.title}
						/>
						<Input
							type='default'
							typedefault='number'
							placeholder='Count'
							name='count'
							value={formik.values.count}
							onChange={formik.handleChange}
							description={formik.errors.count}
						/>
						<Input
							type='default'
							typedefault='number'
							placeholder='Price'
							name='price'
							value={formik.values.price}
							onChange={formik.handleChange}
							description={formik.errors.price}
						/>
					</div>
				</div>
				<TextEditor
					className={toClassName(
						styles['form-input-container-editor'],
						formik.errors.description &&
							styles['form-input-container-editor_error']
					)}
					initValue={formik.values.description}
					onChange={(val) => formik.setFieldValue('description', val)}
				/>
				<Button className={styles['form-button']}>Сохранить</Button>
			</form>
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

export default EditProduct;
