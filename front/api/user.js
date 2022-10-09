import { authApi, userApi } from './';

import { v4 as uuid } from 'uuid';

const login = (data) => {
    const params = new URLSearchParams(data);
    return authApi.get(`/login?${params}`);
};

const register = (data) => {
    const params = new URLSearchParams(data);
    return authApi.get(`/register?${params}`);
};

const getUserByID = (id) => {
    return userApi.get(`/user_service/users/${id}`);
};

const register2 = (data) => {
    return userApi.post(`/user_service/users`, data, {
        headers: { "Content-Type": "multipart/form-data" }
    });
};



const signup = (data) => {
    return new Promise((res) =>
        setTimeout(() =>
            res({ data: { login: 'test', username: 'test', id: 1 } }),
            1000
        ));
    return api.post('/signup', data);
};

const mockArray = () => Array(Math.round(Math.random() * 20 + 2))
    .fill(null)
    .map(() => ({
        id: uuid(),
        info: {
            username: 'username_user_418',
            email: 'usermail_2022@gmail.com',
            avatar: {
                url: 'https://th-thumbnailer.cdn-si-edu.com/jlWcmkkwETB7aONf_PpzTyHS0D8=/fit-in/1072x0/https://tf-cmsv2-smithsonianmag-media.s3.amazonaws.com/filer/97/2c/972c4531-0552-4a49-b51b-4cdb5066bd1d/tacc1157_05_faceright_10k_rgb.jpg'
            },
            department: 'ПВииВо ВЛРОВ иВОРИВ',
            birthday: '08.12.1999',
            phone_number: '86566151664',
            last_name: 'Петровна',
            first_name: 'Антонина',
            description: `Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ullam aperiam ab
                eveniet expedita. Ab incidunt iste expedita voluptate? Aliquid sit illo
                delectus consequuntur ipsam aperiam
                soluta magnam est perspiciatis voluptatibus.`,
            balance: '233923440 трилионов долларов',
            products: null,
            purchases: null

        }
    }));

const getUsers = () => {
    return new Promise(res =>
        setTimeout(
            () => res({ data: mockArray() }),
            2800
        )
    );
};

export {
    login,
    register,
    register2,
    signup,
    getUsers,
    getUserByID
};