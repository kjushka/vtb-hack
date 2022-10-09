import React from 'react';

import * as svgTypes from './Types';

const Svg = ({type, ...props}) => {
	return React.createElement(svgTypes[type], props);
};

export { Svg };
