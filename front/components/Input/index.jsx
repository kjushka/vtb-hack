import React from 'react';
import PropTypes from 'prop-types';

import * as inputTypes from './Types';

const Input = ({ type = 'default', typedefault = 'text', ...props }) => {
	return React.createElement(inputTypes[type], {
		...props,
		type: typedefault,
	});
};

Input.propTypes = {
	type: PropTypes.oneOf(Object.keys(inputTypes)),
	value: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.number,
		PropTypes.bool,
		PropTypes.array,
	]),
	onChange: PropTypes.func,
	onClick: PropTypes.func,
	rightIcon: PropTypes.func,
	leftIcon: PropTypes.func,
};

export { Input };
