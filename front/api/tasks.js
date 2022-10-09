import { api } from './index';

import { v4 as uuid } from 'uuid';

const mockArray = () => Array(Math.round(Math.random() * 10 + 2))
    .fill(null)
    .map(() => ({
        id: uuid(),
        title: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
        progress: Math.round(Math.random() * 100),
        award: Math.round(Math.random() * 200),
    }));

const getWeeklyTasks = () => {
    return new Promise(res =>
        setTimeout(
            () => res(mockArray()),
            500
        )
    );
};

const getMounthTasks = () => {
    return new Promise(res =>
        setTimeout(
            () => res(mockArray()),
            800
        )
    );
};

const fullTaskMock = (id) => ({
    id,
    title: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    progress: Math.round(Math.random() * 100),
    award: Math.round(Math.random() * 200),
    achievement: {
        image: 'https://img1.akspic.ru/crops/7/8/8/9/6/169887/169887-gorod-zdanie-purpur-tsvetnoy-liniya_gorizonta-7680x4320.jpg',
        title: '7 Skills of Highly Effective Programmers'
    },
    host: {
        userAvatar: 'https://sun9-70.userapi.com/impg/_d3jGXuFnEspdPnqQfr-HYiyLeW792auSXffTg/KJaeZbAlMfM.jpg?size=2560x1707&quality=95&sign=8c7b1be6e9a2ed435a716b64fdb68925&type=album',
        userName: 'Test test',
        id: uuid(),
    },
    participants: [
        {
            userAvatar: 'https://sun9-70.userapi.com/impg/_d3jGXuFnEspdPnqQfr-HYiyLeW792auSXffTg/KJaeZbAlMfM.jpg?size=2560x1707&quality=95&sign=8c7b1be6e9a2ed435a716b64fdb68925&type=album',
            userName: 'Test test',
            id: uuid(),
        },
        {
            userAvatar: 'https://sun9-70.userapi.com/impg/_d3jGXuFnEspdPnqQfr-HYiyLeW792auSXffTg/KJaeZbAlMfM.jpg?size=2560x1707&quality=95&sign=8c7b1be6e9a2ed435a716b64fdb68925&type=album',
            userName: 'Test test',
            id: uuid(),
        },
        {
            userAvatar: 'https://sun9-70.userapi.com/impg/_d3jGXuFnEspdPnqQfr-HYiyLeW792auSXffTg/KJaeZbAlMfM.jpg?size=2560x1707&quality=95&sign=8c7b1be6e9a2ed435a716b64fdb68925&type=album',
            userName: 'Test test',
            id: uuid(),
        },
        {
            userAvatar: 'https://sun9-70.userapi.com/impg/_d3jGXuFnEspdPnqQfr-HYiyLeW792auSXffTg/KJaeZbAlMfM.jpg?size=2560x1707&quality=95&sign=8c7b1be6e9a2ed435a716b64fdb68925&type=album',
            userName: 'Test test',
            id: uuid(),
        }
    ]
});

const getFullTask = (id) => {
    return new Promise(res =>
        setTimeout(() => res({ data: fullTaskMock(id) }), 700)
    );
};

export { getWeeklyTasks, getMounthTasks, getFullTask };