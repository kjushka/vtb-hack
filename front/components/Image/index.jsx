import React, { useEffect } from 'react';
import { Loader } from '@components';

import { useImageError } from '@hooks';

const CustomImage = ({
	src = '',
	alt = '',
	onError = () => {},
	onLoad = () => {},
}) => {
	const [setImg, load, hasError] = useImageError();

	useEffect(() => {
		if (load) onLoad();
	}, [load, onLoad]);

	if (hasError) return onError();
	if (load && hasError) return <Loader />;

	return hasError ? onError() : <img ref={setImg} src={src} alt={alt} />;
};

export { CustomImage };
