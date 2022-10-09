import { useState } from 'react';

import { BiSearchAlt2 } from 'react-icons/bi';
import { AiFillCloseCircle } from 'react-icons/ai';
import {RiLockPasswordFill} from 'react-icons/ri';

import { Input } from '@components';


const InputsBlock = () =>
{
	const [files, setFiles] = useState([])
    const [pass, setPass] = useState('');
	const [num, setNum] = useState('');
	const [search, setSearch] = useState('');
	const [defaultInput, setDeafultInput] = useState('');
	const [checkbox, setCheckbox] = useState(true);
	const [swicthValue, setSwitchValue] = useState(true);
	const [date, setDate] = useState(new Date());
	const [itemsDropdown] = useState([
		{
			value: 'dog',
			label: 'Dog',
		},
		{
			value: 'cat',
			label: 'Cat'
		},
		{
			value: 'chicken',
			label: 'Chicken'
		}
	])

	return (
		<div
				style={{
					width: 200,
					display: 'flex',
					flexDirection: 'column',
					gap: 20,
            } }>
            <h3>Инпуты:</h3>
				<Input 	typedefault="password" rightIcon={RiLockPasswordFill} value={ pass } onChange={ (e) => setPass(e.target.value) } placeholder='Input - Password' description={''} /> 
				<Input 	typedefault="text" value={ defaultInput } onChange={ (e) => setDeafultInput(e.target.value) } placeholder='Input - Text' description={''} />  
				<Input 	typedefault="number" value={ num } onChange={ (e) => setNum(e.target.value) } placeholder='Input - Number' description={''} />
				<Input 	typedefault="search" leftIcon={BiSearchAlt2} value={ search } onChange={ (e) => setSearch(e.target.value) } placeholder='Search...' description={'Поиск чего-то важного'} />     

				<Input  disabled value={ 'Disabled input Default' }/>

				<Input type="checkbox" text={ 'Checkbox' } value={checkbox} onChange={ (e) => setCheckbox(e.target.checked) }/>
				<Input disabled type="checkbox" text={ 'Checkbox disabled' } value={true} />

				<Input type="switch" text={ 'Switch' } value={swicthValue} onChange={ (e) => setSwitchValue(e.target.checked) }/>

				<Input type="dropdown" dropdownName={ 'Dropdown pets list:' }  items={itemsDropdown} value='' onChange={() => {}}/>
				<Input type="dropdown" multiple dropdownName={ 'Dropdown & select' } items={ itemsDropdown } value='' onChange={() => {}} />
			
				<Input type="date" value={ date } onChange={ (e) => setDate(e) } />
				
			
				{/* иконка нужна - в import */}
				<Input type="file" leftIcon={ AiFillCloseCircle } value={ files } onChange={ (e) => setFiles(e) } />
			
		</div>
	);
};

export { InputsBlock };
