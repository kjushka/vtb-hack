import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { getUserByID } from '@api/user';

import {
	selectUserById
} from '@store/slices/userSlice';

import { toClassName } from '@utils';
import { Loader, Svg, Button } from '@components';

import styles from './style.module.scss';


const User = ({userInfo = {}}) => {
	const router = useRouter();
    const dispatch = useDispatch();
    
    console.log('userInfo', userInfo)

    const user = useSelector(selectUserById(userInfo.id));
    console.log(user)
	return (
        <div className={ styles['user-page'] }>
            { user ? (
                <div className={ styles['user-page_card'] }>
                    <div className={ styles['user-page_card__content'] }>
                        <div className={ toClassName(styles['user-page_card__content'], styles.avatar) }>
                            {
                                !user.info.avatar ?
                                    <Svg type='avatar' className={  toClassName(styles['user-page_card__content'], styles['avatar--empty']) } />
                                    :
                                    <img  src={ user.info.avatar } alt={ `Аватар ${ user.info.username }` } />
                            }
                        </div>
                        <div className={ toClassName(styles['user-page_card__content'], styles.information) }>
                            <div className={ toClassName(styles['user-page_card__content'], styles.information_wrapper) }>
                                <h2 className={ toClassName(styles['user-page_card__content'], styles.information_name) }>Иван Иванович </h2>
                                <strong>{user.info.username}</strong>
                            </div>
                            <p className={ toClassName(styles['user-page_card__content'], styles.information_paragraph) }>
                                <strong>Департмент:</strong>
                                <span>ПВииВо ВЛРОВ иВОРИВ</span>
                            </p>

                            <div className={ toClassName(styles['user-page_card__content'], styles.information_wrapper) }>
                                <p className={ toClassName(styles['user-page_card__content'], styles.information_paragraph) }>
                                    <strong>Дата рождения:</strong>
                                    <span>31.02.2566</span>
                                </p>
                                <p className={ toClassName(styles['user-page_card__content'], styles.information_paragraph) }>
                                    <strong>Телефон:</strong>
                                    <span>+76565615166464</span>
                                </p>
                                <p className={ toClassName(styles['user-page_card__content'], styles.information_paragraph) }>
                                    <strong>e-mail:</strong>
                                    <a className={ styles.information_link } href={ `mailto:${user.info.email}` } >{ user.info.email }</a>
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className={ styles['user-page_card__description'] }>
                        <h3 className={ styles['user-page_card__description--title'] }>Описание:</h3>
                        <p className={ styles['user-page_card__description--text'] }>
                            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ullam aperiam ab
                            eveniet expedita. Ab incidunt iste expedita voluptate? Aliquid sit illo
                            delectus consequuntur ipsam aperiam
                            soluta magnam est perspiciatis voluptatibus.
                        </p>
                    </div>
                    <div className={ styles['user-page_card__products'] }>
                        <p className={ styles['user-page_card__products--p'] }><strong>Баланс</strong> <span>{ '233923440 трилионов долларов'  }</span></p>
                        <h3 className={ styles['user-page_card__products--headline'] }>Продукты:</h3>
                        <h3 className={ styles['user-page_card__products--headline'] }>Покупки:</h3>
                    </div>
                    <div className={ styles['user-page_card__btn'] }>
                      <Button>
					    Поблагодарить
					</Button>  
                    </div>
                    
                </div> 
            ) : (
                <div>
					<Loader />
				</div>
            )}
		</div>
	);
};

export const getServerSideProps = async ({ params: { id }, res }) => {
	let result = await getUserByID(id);

	if (false) {
		res.writeHead(301, { Location: '/404' });
		res.end();

		return true;
	}

	return {
		props: {
			userInfo: result.data,
		},
	};
};
export default User;
