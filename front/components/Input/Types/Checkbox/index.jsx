import { toClassName } from '@utils/toClassName';

import styles from './style.module.scss';

const CheckboxInput = ({ value, disabled, text, onChange }) => {
    const styleDisabled = disabled ?  'container-disabled' :  '';
    return (
        
        <label className={toClassName(style.container, styleDisabled)}  >{text}
            <input type="checkbox" checked={value} onChange={ onChange } />
            <span className={styles.checkmark} ></span>
        </label>
   );
};


export { CheckboxInput };
