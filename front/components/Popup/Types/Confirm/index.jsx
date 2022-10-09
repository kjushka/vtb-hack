import { Button, Svg } from '@components';

import styles from './style.module.scss';

const ConfirmPopup = ({ children, toggle, buttonPopupConfirm, buttonPopupDelete}) => {
	return (
		<div className={ styles['popup-confirm'] }>
            <div className={ styles['popup-confirm_circle'] }>
                <Svg type='confirm' className={styles['popup-confirm_circle__icon'] }/> 
            </div>
			<h2 className={ styles['popup-confirm_description'] }>{ children }</h2>
			<div className={ styles['popup-confirm_btns'] }>
				<Button type='default' onClick={toggle}>
					{buttonPopupConfirm}
				</Button>
				<Button type='border' onClick={toggle}>
					{buttonPopupDelete}
				</Button>
			</div>
        </div>
	);
};

export { ConfirmPopup };
