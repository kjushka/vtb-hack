import { toClassName } from '@utils/toClassName';
import React from 'react';
import styles from './style.module.scss';

const Loader = ({ className = '', ...props }) => {
	return <div className={toClassName(styles.loader)} {...props} />;
};

export { Loader };
