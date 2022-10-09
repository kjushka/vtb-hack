import PropTypes from 'prop-types';

const Confirm = ({ className = '' }) => {
	return (
        
		<svg
			className={className}
			width='7'
			height='36'
			viewBox='0 0 7 36'
			fill='none'
			xmlns='http://www.w3.org/2000/svg'>
			<path
				fillRule='evenodd'
				clipRule='evenodd'
				d='M3.5 9.91821e-05C1.84315 9.91821e-05 0.5 1.34325 0.5 3.0001V25.0001C0.5 26.657 1.84315 28.0001 3.5 28.0001C5.15685 28.0001 6.5 26.657 6.5 25.0001V3.0001C6.5 1.34325 5.15685 9.91821e-05 3.5 9.91821e-05ZM3.5 36.0001C1.84315 36.0001 0.5 34.657 0.5 33.0001C0.5 31.3432 1.84315 30.0001 3.5 30.0001C5.15685 30.0001 6.5 31.3432 6.5 33.0001C6.5 34.657 5.15685 36.0001 3.5 36.0001Z'
				fill='#FFD912'
			/>
		</svg>
	);
};

Confirm.propTypes = {
	className: PropTypes.string,
};

export { Confirm };
