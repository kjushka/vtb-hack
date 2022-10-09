import { useFormik } from 'formik';
import moment from 'moment';

import { Input, Button, Loader, TextEditor } from '@components';
import { useNotifications } from '@hooks';

import styles from './style.module.scss';
import { toClassName } from '@utils';

const SignUpForm = ({
	onSubmit = () => {},
	onCancel = () => {},
	loading = false,
}) => {
	const { pushNotifications } = useNotifications();
	const formik = useFormik({
		initialValues: {
			login: '',
			password: '',
			passwordRepit: '',
			firstName: '',
			lastName: '',
			description: '',
			email: '',
			date: new Date(),
			image: null,
			department: '',
		},
		validate: (data) => {
			const error = {};

			if (!data.login) {
				error.login = 'Некорректный логин';
			}
			if (!data.firstName) {
				error.firstName = 'Некорректное имя';
			}
			if (!data.lastName) {
				error.lastName = 'Некорректная фамилия';
			}
			if (
				!data.email ||
				!/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
					data.email
				)
			) {
				error.email = 'Некорректный email';
			}
			if (!data.department) {
				error.department = 'Некорректное название департамента';
			}
			if (!data.date || moment(data.date).year() > 2005) {
				error.date = 'Некорректная дата рождения';
			}
			if (!data.password) {
			}
			if (!data.passwordRepit) {
			}
			if (data.password !== data.passwordRepit) {
				error.password = 'Пароли не совпадают';
				error.passwordRepit = 'Пароли не совпадают';
			}

			return error;
		},
		onSubmit: (data) => {
			const reg = {
				login: data.login,
				password: data.password,
			};

			const formData = new FormData();
			formData.append('firstName', data.firstName);
			formData.append('lastName', data.lastName);
			formData.append('description', data.description);
			formData.append('email', data.email);
			formData.append('birthday', data.date.toISOString().split('T')[0]);
			formData.append('avatar', data.image.file, data.image.name);
			formData.append('department', data.department);

			onSubmit(reg, formData);
		},
	});

	return (
		<form
			className={styles.form}
			onSubmit={(e) => {
				formik.handleSubmit();
				e.preventDefault();
			}}>
			{loading && (
				<div className={styles['form-loader-container']}>
					<Loader />
				</div>
			)}
			<div className={styles['form-input-container']}>
				<Input
					type='file'
					onChange={(value) => formik.setFieldValue('image', value)}
				/>
			</div>
			<div className={styles['form-input-container']}>
				<Input
					className={toClassName(
						styles['form-input-container-input'],
						formik.errors.login &&
							styles['form-input-container-input_error']
					)}
					type='default'
					typedefault='text'
					placeholder='Login'
					name='login'
					value={formik.values.login}
					onChange={formik.handleChange}
					description={formik.errors.login}
				/>
			</div>
			<div className={styles['form-input-container']}>
				<Input
					className={toClassName(
						styles['form-input-container-input'],
						formik.errors.firstName &&
							styles['form-input-container-input_error']
					)}
					type='default'
					typedefault='text'
					placeholder='First name'
					name='firstName'
					value={formik.values.firstName}
					onChange={formik.handleChange}
					description={formik.errors.lastName}
				/>
			</div>
			<div className={styles['form-input-container']}>
				<Input
					className={toClassName(
						styles['form-input-container-input'],
						formik.errors.lastName &&
							styles['form-input-container-input_error']
					)}
					type='default'
					typedefault='text'
					placeholder='Last name'
					name='lastName'
					value={formik.values.lastName}
					onChange={formik.handleChange}
					description={formik.errors.lastName}
				/>
			</div>
			<div className={styles['form-input-container']}>
				<Input
					className={toClassName(
						styles['form-input-container-input'],
						formik.errors.date &&
							styles['form-input-container-input_error']
					)}
					type='date'
					placeholder='Birth date'
					value={formik.values.date}
					onChange={(e) => formik.setFieldValue('date', e)}
					description={formik.errors.date}
				/>
			</div>
			<div className={styles['form-input-container']}>
				<Input
					className={toClassName(
						styles['form-input-container-input'],
						formik.errors.email &&
							styles['form-input-container-input_error']
					)}
					type='default'
					typedefault='email'
					placeholder='Email'
					name='email'
					value={formik.values.email}
					onChange={formik.handleChange}
					description={formik.errors.email}
				/>
			</div>
			<div className={styles['form-input-container']}>
				<Input
					className={toClassName(
						styles['form-input-container-input'],
						formik.errors.department &&
							styles['form-input-container-input_error']
					)}
					type='default'
					placeholder='Department'
					name='department'
					value={formik.values.department}
					onChange={formik.handleChange}
					description={formik.errors.department}
				/>
			</div>
			<div className={styles['form-input-container']}>
				<TextEditor
					placeholder='О себе'
					className={styles['form-input-container-editor']}
					onChange={(val) => formik.setFieldValue('description', val)}
				/>
			</div>
			<div className={styles['form-input-container']}>
				<Input
					className={toClassName(
						styles['form-input-container-input'],
						formik.errors.password &&
							styles['form-input-container-input_error']
					)}
					type='default'
					typedefault='password'
					placeholder='Password'
					name='password'
					value={formik.values.password}
					onChange={formik.handleChange}
					description={formik.errors.password}
				/>
			</div>
			<div className={styles['form-input-container']}>
				<Input
					className={toClassName(
						styles['form-input-container-input'],
						formik.errors.passwordRepit &&
							styles['form-input-container-input_error']
					)}
					type='default'
					typedefault='password'
					placeholder='Repeat password'
					name='passwordRepit'
					value={formik.values.passwordRepit}
					onChange={formik.handleChange}
					description={formik.errors.passwordRepit}
				/>
			</div>
			<div className={styles['form-buttons']}>
				<Button
					defaulttype='submit'
					className={styles['form-buttons-button']}
					disabled={loading}>
					Зарегистрироваться
				</Button>
				<Button
					type='text'
					className={styles['form-buttons-button']}
					disabled={loading}
					onClick={(e) => {
						e.preventDefault();
						onCancel();
					}}>
					Отмена
				</Button>
			</div>
		</form>
	);
};

export { SignUpForm };
