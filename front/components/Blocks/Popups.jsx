import { useState } from 'react';

import { Popup, Island } from '@components';

import styles from './style.module.scss'

const PopupBlock = () => {
	const [progress, setProgress] = useState(0);

	return (
		<div
				style={{
					width: 200,
					display: 'flex',
					flexDirection: 'column',
					gap: 10,
            } }>
            
			<h3>Попапы:</h3>
				<Popup
					type='success'
					button='border'
					buttonText='Success попап'
					classNameButton={styles.button}
        			contentLabel="Success"
				>
					It is Success!
      			</Popup>
				
				<Popup
					type='error'
					button='border'
					buttonText='Error попап'
					classNameButton={styles.button}
        			contentLabel="Error"
				>
					It is Error!
                </Popup>
                <Popup
					type='confirm'
					button='border'
                    buttonText='Confirm попап'
                    buttonPopupConfirm='Delete'
                    buttonPopupDelete='Cancel'
					classNameButton={styles.button}
        			contentLabel="Confirm"
				>
					Do you want delete?
				</Popup>
				<Popup
					type='custom'
					button='default'
                    buttonText='Custom попап'
        			contentLabel="Custom"
			>
						<input
							type='range'
							min={0}
							max={100}
							value={progress}
							step='5'
							onChange={({ target: { valueAsNumber } }) =>
							setProgress(valueAsNumber)
							}
						/>
						<Island
							badge='Задание'
							description='Description sdf sdf sdf sdf sdf sdf sdf sd fs df sdf sd fs df sdf sdf sdf sd f sdfsdfsdf sfds  sdfhsdjf sd fsd f sdf sd fsd f sd fsd fsd f'
							header='Header'
							progress={progress}
							price={100}
							onButtonClick={() =>
								pushNotifications(<div>{new Date().toISOString()}</div>)
							}
							buttonText='Button'/>
						
      			</Popup>
			</div>
	);
};

export { PopupBlock };
