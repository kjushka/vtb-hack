import React from 'react';

import * as ReviewTypes from './Types';

const Review = ({ type = 'read', ...props }) => {
	return React.createElement(ReviewTypes[type], props);
};

export { Review };
