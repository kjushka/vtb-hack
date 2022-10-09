import React from 'react';

import { toClassName } from '@utils';

import styles from './style.module.scss';

const MenuItem = ({
	icon: Icon = <></>,
	selected = false,
	containerClassName = '',
	iconClassName = '',
	action = () => {},
	title = '',
	isFull,
}) => {
	return (
		<div
			className={toClassName(
				styles['menu-item'],
				selected && styles['menu-item__selected'],
				isFull && styles['menu-item__full'],
				containerClassName
			)}
			onClick={action}
			title={title}>
			<Icon
				className={toClassName(styles['menu-item-icon'], iconClassName)}
			/>
			<span>{title}</span>
		</div>
	);
};

export { MenuItem };
