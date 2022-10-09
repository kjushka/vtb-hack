import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { getUserByID } from '@api/user';

import {
	selectUserById
} from '@store/slices/userSlice';

import { toClassName } from '@utils';
import { Loader, Svg, Button, ToolBar } from '@components';

import styles from './style.module.scss';


const User = ({userInfo = {}}) => {
	const router = useRouter();
    const dispatch = useDispatch();
    
    const user = useSelector(selectUserById(userInfo.id));
    return (
        <>
            <ToolBar
                className={styles.tools}
                create={false}
                del={false}
                onEdit={() => router.push(router.asPath + '/edit')}
            />
            <div className={ styles['user-page'] }>
            { user ? (                    
                    <div className={ styles['user-page_card'] }>
                        <div className={ styles['user-page_card__content'] }>
                            <div className={ toClassName(styles['user-page_card__content'], styles.avatar) }>
                                {
                                    !user.info.avatar ?
                                        <Svg type='avatar' className={  toClassName(styles['user-page_card__content'], styles['avatar--empty']) } />
                                        :
                                        <img  src={ user.info.avatar.url } alt={ `Аватар ${ user.info.username }` } />
                                }
                            </div>
                            <div className={ toClassName(styles['user-page_card__content'], styles.information) }>
                                <div className={ toClassName(styles['user-page_card__content'], styles.information_wrapper) }>
                                    <h2 className={ toClassName(styles['user-page_card__content'], styles.information_name) }>{user.info.first_name + ' ' + user.info.last_name}</h2>
                                    <strong>{user.info.username}</strong>
                                </div>
                                <p className={ toClassName(styles['user-page_card__content'], styles.information_paragraph) }>
                                    <strong>Департмент:</strong>
                                    <span>{ user.info.department }</span>
                                </p>

                                <div className={ toClassName(styles['user-page_card__content'], styles.information_wrapper) }>
                                    <p className={ toClassName(styles['user-page_card__content'], styles.information_paragraph) }>
                                        <strong>Дата рождения:</strong>
                                        <span>{ user.info.birthday }</span>
                                    </p>
                                    <p className={ toClassName(styles['user-page_card__content'], styles.information_paragraph) }>
                                        <strong>Телефон:</strong>
                                        <span>{ user.info.phone_number }</span>
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
                               { user.info.description }
                            </p>
                        </div>
                        <div className={ styles['user-page_card__products'] }>
                            <p className={ styles['user-page_card__products--p'] }><strong>Баланс</strong> <span>{ user.info.balance  }</span></p>
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
        </>
        
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
