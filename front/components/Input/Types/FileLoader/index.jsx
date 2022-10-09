import { useEffect, useRef, useState } from 'react';

import { Svg } from '@components';

import DataTransfer from './DataTransfer';

import styles from './style.module.scss';

const FileLoader = ({
	onChange = () => {},
	leftIcon: LeftIcon = null,
	initValue = '',
}) => {
	const fileInput = useRef();
	const preview = useRef();

	const [result, setResult] = useState({
		url: initValue,
		name: '',
		file: null,
	});

	const addFile = (input) => {
		const file = input.current.files[0];

		if (file) {
			const url = URL.createObjectURL(file);
			setResult({
				name: file.name,
				url,
				file: file,
			});
		}
	};

	useEffect(() => {
		onChange(result);
	}, [result]);

	const removeFilesItem = (target) => {
		setResult({
			name: '',
			url: '',
			file: null,
		});
	};

	return (
		<div className={styles.file}>
			<div ref={preview} className={styles.file_preview}>
				{!!result.file ||
				(result.url === initValue && initValue !== '') ? (
					<div className={styles.file_preview__content}>
						<img
							className={styles['file_preview__content--img']}
							src={result.url}
							alt='Loaded file'
						/>
						{/* <span
							className={styles['file_preview__content--label']}>
							{fileName}
						</span> */}
						{!!LeftIcon && (
							<LeftIcon
								onClick={(e) => removeFilesItem(e)}
								className={
									styles['file_preview__content--icon']
								}
							/>
						)}
					</div>
				) : (
					<Svg type='empty' />
				)}
			</div>
			<label
				onChange={() => addFile(fileInput)}
				className={styles.file_input}>
				<input
					ref={fileInput}
					type='file'
					name='file[]'
					multiple
					accept='image/*'
				/>
				<span>Выберите файл</span>
			</label>
		</div>
	);
};

export { FileLoader };
