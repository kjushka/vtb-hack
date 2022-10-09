import React, { createRef, useContext } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { Notification } from '@components';
import { NotificationContext } from '@contexts';

/**
 * @typedef {Object} NotificationOptions
 * @property {'default'|'warning'|'success'|'error'|'custom'} type - тип уведомления
 * @property {string} header - название
 * @property {string} description - описание
 * @property {null|import('react').ReactElement} custom - если передан тим custom, то необходимо передать сюда jsx
 * @property {Function} onMouseEnter - когда курсок попал в область
 * @property {Function} onMouseLeave - когда курсор покинул область
 * @property {Function} onClose - при закрытии
 * @property {...any} other - другие параметы, которые будут переданы в основноя div
 */

const useNotifications = () => {
	const { notifications, setNotifications, maxNotifications, deleteMS } =
		useContext(NotificationContext);

	/**
	 *
	 * @param {NotificationOptions} param0
	 */
	const pushNotifications = ({
		type,
		header,
		description,
		custom = null,
		onClose = () => {},
		onMouseEnter = () => {},
		onMouseLeave = () => {},
		...other
	}) => {
		setNotifications((prev) => {
			const tmp = [...prev];
			if (notifications.length === maxNotifications) {
				tmp.shift();
			}

			const id = uuidv4();
			const deleteNotification = () => {
				const element = document.getElementById(id);
				if (element) {
					element.style =
						'transform: translate(120%) scale(0.5); opacity: 0';
					element.addEventListener('transitionend', () => {
						setNotifications((prev) =>
							prev.filter((el) => el.id !== id)
						);
					});
				} else {
					setNotifications((prev) =>
						prev.filter((el) => el.id !== id)
					);
				}
			};

			let timer = setTimeout(deleteNotification, deleteMS);

			const component = (
				<Notification
					id={id}
					key={id}
					type={type}
					header={header}
					description={description}
					onClick={() => {
						clearTimeout(timer);
						deleteNotification();
						onClose();
					}}
					onMouseEnter={() => {
						clearTimeout(timer);
						onMouseEnter();
					}}
					onMouseLeave={() => {
						timer = setTimeout(deleteNotification, 2000);
						onMouseLeave();
					}}
					{...other}>
					{type === 'custom' && custom !== null && custom}
				</Notification>
			);

			tmp.push({
				id: id,
				component,
			});

			return [...tmp];
		});
	};

	return { pushNotifications };
};

export { useNotifications };
