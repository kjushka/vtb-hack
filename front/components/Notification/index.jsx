import React from 'react';
import * as notificationTypes from './Types';

import PropTypes from 'prop-types';

const Notification = ({ type = 'default', ...props }) => {
	return React.createElement(notificationTypes[type], props);
};

Notification.propTypes = {
	type: PropTypes.oneOf(Object.keys(notificationTypes)).isRequired,
	header: PropTypes.string,
	description: PropTypes.string,
	onClick: PropTypes.func,
	onMouseEnter: PropTypes.func,
	onMouseLeave: PropTypes.func,
};

export { Notification };
