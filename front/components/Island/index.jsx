import React from 'react';
import PropTypes from 'prop-types';

import * as IslandTypes from './Types';

const Island = ({ type = 'default', ...props }) => {
	return React.createElement(IslandTypes[type], props);
};

Island.propTypes = {
	type: PropTypes.oneOf(Object.keys(IslandTypes)),
	badge: PropTypes.string,
	header: PropTypes.string.isRequired,
	description: PropTypes.PropTypes.string.isRequired,
	buttonText: PropTypes.string.isRequired,
	price: PropTypes.number,
	onButtonClick: PropTypes.func,
};

export { Island };
