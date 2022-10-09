
import Select from 'react-select'

import styles from './style.module.scss';


const DropdownInput = ({  dropdownName, multiple, items }) =>
{
    const customStyles = {
        option: (provided, state) => ({
            ...provided,
            color: state.isSelected ? 'white' : 'rgb(23, 112, 255)',
            padding: '10px 16px',
            textOverflow: 'ellipsis',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            ':hover': {
                color: 'white',
                backgroundColor: 'rgb(23, 112, 255)'
            },
        }),
        control: () => ({
            display: 'flex',
            fontSize: 'inherit',
            fontFamily: 'inherit',
            width: '100%',
            borderRadius: 4,
            minHeight: 44,
            boxShadow: '0px 2px 13px rgb(51 51 51 / 10%)',
            appearance: 'none',
        }),
        multiValue: (styles) => {
            return {
                ...styles,
                backgroundColor: 'rgb(23, 112, 255)',
                color: 'white'
            };
        },
        multiValueLabel: (styles) => ({
            ...styles,
            color: 'white'
        }),
        multiValueRemove: (styles) => ({
            ...styles,
            ':hover': {
                backgroundColor: 'rgb(23, 112, 255)',
                color: 'white',
            },
        }),
        singleValue: (provided, state) => {
            const opacity = state.isDisabled ? 0.5 : 1;
            const transition = 'opacity 300ms';

            return { ...provided, opacity, transition };
        }
}
    
    return (
        <div className={styles.dropdown}>
            <p className={styles.dropdown_label}>{dropdownName}</p>
            <Select styles={customStyles} isMulti={multiple} options={items} />
        </div> 
        
    );
};


export { DropdownInput };
