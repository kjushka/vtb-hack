import PropTypes from 'prop-types';

import { Svg, Button } from '@components';
import { FiChevronRight } from 'react-icons/fi';

import styles from './style.module.scss';


const UserCard = ({info = {}, onUserClick }) =>
{
    return (
        <div className={ styles['user-card']}>
            <div className={ styles['user-card_avatar'] }>
                {
                    !info.avatar && <Svg type='avatar' className={ styles['user-card_avatar--empty'] } />
                }
                {
                    info.avatar && <img src={ info.avatar.url } alt={`Аватар ${info.username}`} />
                }
            </div>
            <div className={ styles['user-card_info'] }>
                <h3>{ info.username }</h3> 
                <a href={ `mailto:${info.email}` }>{ info.email }</a>
                <Button
                    className={ styles['user-card_button'] }
					type='text'
					rightIcon={FiChevronRight}
					onClick={onUserClick}>
						Перейти
				</Button>
            </div>
        </div>
       
    )
}

UserCard.propTypes = {
    info: PropTypes.object,
    onUserClick: PropTypes.func
};

export {UserCard}