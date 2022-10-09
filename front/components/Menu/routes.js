import { FiAward, FiClipboard, FiShoppingCart, FiUsers } from 'react-icons/fi';

export const routes = [
    {
        name: 'Задания',
        path: '/tasks',
        icon: FiClipboard
    },
    {
        name: 'Награды',
        path: '/awards',
        icon: FiAward
    },
    {
        name: 'Продукты',
        path: '/products',
        icon: FiShoppingCart
    },
    {
        name: 'Пользователи',
        path: '/users',
        icon: FiUsers
    }
];

export const notShowing = ['/404', '/login', '/', ''];