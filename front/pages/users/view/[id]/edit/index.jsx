import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { getUserByID } from '@api/user';

import {
	selectUserById,
	editUser
} from '@store/slices/userSlice';

import { useNotifications } from '@hooks';

import { useFormik } from 'formik';

import { toClassName } from '@utils';
import { Loader, Svg, Button, Toolbar, Input, TextEditor } from '@components';

import styles from './style.module.scss';


const EditUser = ({userInfo = {}}) => {
	const router = useRouter();
	const { pushNotifications } = useNotifications();
	const user = useSelector(selectUserById(userInfo.id));

	const dispatch = useDispatch();

	const formik = useFormik({
		initialValues: {
			avatar: user.info.avatar,
			username: user.info.username,
			department: user.info.department,
			first_name: user.info.first_name,
			last_name: user.info.last_name,
			birthday: user.info.birthday,
			phone_number: user.info.phone_number,
			description: user.info.description
		},
		validate: (data) => {
			const errors = {};

			if (!data.description.replace(/<\s*a[^>]*>|<\s*\/\s*a>/g, '')) {
				errors.description = 'Необходимо заполнить значения';
			}
			if (!data.username) {
				errors.username = 'Необходимо заполнить значения';
			}
			if (!data.department) {
				errors.department = 'Необходимо заполнить значения';
			}
			if (!data.first_name) {
				errors.first_name = 'Необходимо заполнить значения';
			}
			
			if (data.phone_number.length !== 11 ) {
				if (data.phone_number) errors.phone_number = 'Некорректно указан номер телефона';
				else errors.phone_number = 'Необходимо заполнить значения';
			}
			

			return errors;
		},
		onSubmit: (data) => {
			dispatch(
				editUser({
					id: user.id,
					info: {
						...user.info,
						...data
					},
					callback: (type) => {
						if (type === 'success') {
							pushNotifications({
								type: 'success',
								header: 'Успешно',
								description: 'Успешно изменено',
							});
							router.back();
						} else {
							pushNotifications({
								type: 'error',
								header: 'Ошибка',
								description: 'Не удалось изменить',
							});
						}
					},
				})
			);
		},
	});

	return (
		<div className={ styles.root }>
			<h1>Редактирование информации о пользователе:</h1>
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
							initValue={user.info.avatar.url}
							onChange={ (value) => formik.setFieldValue('avatar', value)}
							
						/>
					</div>
					<div className={styles['form-top-right']}>
						<Input
							type='default'
							typedefault='text'
							placeholder='Username'
							name='username'
							value={formik.values.username}
							onChange={formik.handleChange}
							description={formik.errors.username}
						/>
						<Input
							type='default'
							typedefault='text'
							placeholder='First name'
							name='first_name'
							value={formik.values.first_name}
							onChange={formik.handleChange}
							description={formik.errors.first_name}
						/>
						<Input
							type='default'
							typedefault='text'
							placeholder='Last name'
							name='last_name'
							value={formik.values.last_name}
							onChange={formik.handleChange}
							description={formik.errors.last_name}
						/>
						<Input
							type='default'
							typedefault='text'
							placeholder='Departament'
							name='department'
							value={formik.values.department}
							onChange={formik.handleChange}
							description={formik.errors.department}
						/>
						<Input
							type='default'
							typedefault='text'
							placeholder='Phone number'
							name='phone_number'
							value={formik.values.phone_number}
							onChange={formik.handleChange}
							description={formik.errors.phone_number}
						/>
						<Input
							type='date'
							placeholder='Birthday'
							name='birthday'
							value={formik.values.birthday}
							onChange={(val) => formik.setFieldValue('birthday', val)}
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
					onChange={ (val) => formik.setFieldValue('description', val)}
				/>
				<Button className={styles['form-button']}>Сохранить</Button>
			</form>
		</div>
	);
};

export const getServerSideProps = async ({ params: { id }, res }) => {
	let result = await getUserByID(id);

	if (false) {
		res.writeHead(301, { Location: '/404' });
		res.end();

		return true;
	}

	return {
		props: {
			userInfo: result.data,
		},
	};
};
export default EditUser;
