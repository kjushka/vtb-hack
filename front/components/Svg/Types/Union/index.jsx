import PropTypes from 'prop-types';

const Union = ({ className = '' }) => {
	return (
		<svg
			className={className}
			width='36'
			height='36'
			viewBox='0 0 36 36'
			fill='none'
			xmlns='http://www.w3.org/2000/svg'>
			<path
				fillRule='evenodd'
				clipRule='evenodd'
				d='M9 3C5.68629 3 3 5.68629 3 9V27C3 30.3137 5.68629 33 9 33H27C30.3137 33 33 30.3137 33 27V9C33 5.68629 30.3137 3 27 3H9ZM18 13.5C19.2426 13.5 20.25 12.4926 20.25 11.25C20.25 10.0074 19.2426 9 18 9C16.7574 9 15.75 10.0074 15.75 11.25C15.75 12.4926 16.7574 13.5 18 13.5ZM18 27C19.2426 27 20.25 25.9926 20.25 24.75C20.25 23.5074 19.2426 22.5 18 22.5C16.7574 22.5 15.75 23.5074 15.75 24.75C15.75 25.9926 16.7574 27 18 27ZM10.5 18C10.5 17.1716 11.1716 16.5 12 16.5H24C24.8284 16.5 25.5 17.1716 25.5 18C25.5 18.8284 24.8284 19.5 24 19.5H12C11.1716 19.5 10.5 18.8284 10.5 18Z'
				fill='white'
			/>
		</svg>
	);
};

Union.propTypes = {
	className: PropTypes.string,
};

export { Union };
