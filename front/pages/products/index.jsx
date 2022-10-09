import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';

import {
	selectLoadingProducts,
	selectProducts,
	getProducts,
} from '@store/slices/productsSlice';

import { Products } from '@components';

import styles from './style.module.scss';

const ProductsPage = ({}) => {
	const products = useSelector(selectProducts);
	const productsLoading = useSelector(selectLoadingProducts);

	const dispstch = useDispatch();

	useEffect(() => {
		dispstch(getProducts());
	}, []);

	return (
		<div className={styles.root}>
			<h2 className={styles.root_headline}>Продукты</h2>
			<Products cards={products} loading={productsLoading} />
		</div>
	);
};

export default ProductsPage;
