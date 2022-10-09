import { useState, useRef } from 'react';
import { DayPicker } from 'react-day-picker';
import ru from 'date-fns/locale/ru';
import 'react-day-picker/dist/style.css';
import styles from './style.module.scss';

const DatePicker = ({value, onChange}) =>
{
    const [isOpenPiscker, setIsOpenPiscker] = useState(false)
    const picker = useRef()
    return (
        <div  className={ styles.wrapper }>
         
            <input ref={picker} onClick={ () => { if (picker) return setIsOpenPiscker(!isOpenPiscker)}} className={ styles.wrapper_input } type="text" value={ `${value}`.indexOf('.') !== -1 ? value : new Date(value).toLocaleString().split(',')[0] } readOnly />
            {isOpenPiscker && <div className={styles.wrapper_picker}>
                <DayPicker 
                    defaultMonth={ new Date(`${value}`.split('.').reverse().join('-')) }
                    mode="single"
                    selected={ value }
                    onSelect={ onChange }
                    locale={ ru }
                    weekStartsOn={1}
                />
            </div>}
        </div>
        

    );
}

export { DatePicker };