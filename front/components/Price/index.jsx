import { RiCopperCoinFill } from 'react-icons/ri';
import styles from './style.module.scss';

const Price = ({ price = null, ...props }) => {
	return (
		<div className={styles.price} title='стоимость' {...props}>
			<RiCopperCoinFill size={24} className={styles['price-icon']} />
			<span className={styles['price-value']}>{price}</span>
		</div>
	);
};

export { Price };
