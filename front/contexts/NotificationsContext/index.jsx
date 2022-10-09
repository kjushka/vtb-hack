import React, { createElement, createContext, useState } from 'react';

import styles from './style.module.scss';

const initNotificationsContext = {
	notifications: [],
	setNotifications: () => {},
	maxNotifications: 5,
	deleteMS: 5000,
};

const NotificationContext = createContext(initNotificationsContext);

const NotificationContextProvider = ({
	max = 5,
	deleteMS = 5000,
	children,
}) => {
	const [notifications, setNotifications] = useState([]);
	const [maxNotifications, setMaxNotifications] = useState(max);
	const [_deleteMS, setDeleteMS] = useState(deleteMS);

	return (
		<NotificationContext.Provider
			value={{
				notifications,
				setNotifications,
				maxNotifications,
				deleteMS: _deleteMS,
			}}>
			{children}
			<div className={styles.notifications}>
				{notifications.length !== 0 &&
					notifications.map((el) => el.component)}
			</div>
		</NotificationContext.Provider>
	);
};

export {
	NotificationContext,
	NotificationContextProvider,
	initNotificationsContext,
};
