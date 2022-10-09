import { Svg } from '@components';

import styles from './style.module.scss';

const SuccessPopup = ({ children }) => {
	return (
        <div className={ styles['popup-success'] }>
            <div className={ styles['popup-success_circle'] }>
	            <Svg type='check' className={styles['popup-success_circle__icon'] }/> 
            </div>
            <h2 className={ styles['popup-success_description'] }>{ children }</h2>
        </div>
	);
};

export { SuccessPopup };
