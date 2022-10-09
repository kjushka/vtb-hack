import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';

import { useFormik } from 'formik';

import { addProduct } from '@store/slices/productsSlice';

import { Button, Input, TextEditor } from '@components';
import { useNotifications } from '@hooks';

import styles from './style.module.scss';
import { toClassName } from '@utils/toClassName';

const CreatePage = () => {
	const router = useRouter();
	const { pushNotifications } = useNotifications();

	const dispatch = useDispatch();

	const formik = useFormik({
		initialValues: {
			image: null,
			description: '',
			count: 0,
			title: '',
			price: 0,
			isNFT: false,
		},
		validate: (data) => {
			const errors = {};

			if (!data.description.replace(/<\s*a[^>]*>|<\s*\/\s*a>/g, '')) {
				errors.description = 'Необходимо заполнить описание';
			}
			if (!data.title) {
				errors.title = 'Необходимо заполнить названия';
			}
			if (!data.price || data.price < 0) {
				errors.price = 'Необходимо заполнить цену';
			}
			if (!data.count || data.count < 0) {
				errors.count = 'Необходимо заполнить количество';
			}

			// Object.keys(errors).forEach((el) =>
			// 	pushNotifications({
			// 		type: 'error',
			// 		header: 'Ошибка',
			// 		description: errors[el],
			// 	})
			// );
			return errors;
		},
		onSubmit: (data) => {
			console.log(1);
			dispatch(
				addProduct({
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
							onChange={(value) =>
								formik.setFieldValue('image', value)
							}
						/>
					</div>
					<div className={styles['form-top-right']}>
						<Input
							className={formik.errors.title && styles.error}
							type='default'
							typedefault='text'
							placeholder='Title'
							name='title'
							value={formik.values.title}
							onChange={formik.handleChange}
							description={formik.errors.title}
						/>
						<Input
							className={formik.errors.title && styles.error}
							type='default'
							typedefault='number'
							placeholder='Count'
							name='count'
							value={formik.values.count}
							onChange={formik.handleChange}
							description={formik.errors.count}
						/>
						<Input
							className={formik.errors.title && styles.error}
							type='default'
							typedefault='number'
							placeholder='Price'
							name='price'
							value={formik.values.price}
							onChange={formik.handleChange}
							description={formik.errors.price}
						/>
						<Input
							className={formik.errors.title && styles.error}
							type='switch'
							value={formik.values.isNFT}
							text='NFT'
							onChange={({ target: { checked } }) =>
								formik.setFieldValue('isNFT', checked)
							}
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

export default CreatePage;
