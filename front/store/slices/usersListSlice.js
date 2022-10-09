import moment from 'moment';

import { createSlice } from '@reduxjs/toolkit';
import { HYDRATE } from "next-redux-wrapper";

import {
    getUsers as getUsersApi
} from '@api/user';

const initUsersState = {
    users: null,
    loadingUsers: false
};

export const usersSlice = createSlice({
    name: 'users',
    initialState: initUsersState,
    reducers: {
        setUsers: (state, { payload }) => {
            state.users = payload;
        },
        setLoadingUsers: (state, { payload }) => {
            state.loadingUsers = payload;
        },
        setFullInfoInUsers: (state, { payload }) => {
            const idx = state.users.findIndex(el => el.id === payload.id);
            if (idx !== -1) state.users[idx] = payload;
        },
        // addReview: (state, { payload: { id, name, email, avatar } }) => {
        //     const idx = state.users.findIndex(el => el.id === id);
        //     if (idx !== -1) {
        //         const obj = {
        //             name,
        //             avatar,
        //             email,
        //             createDate: moment().toISOString()
        //         };

        //         // if (state.users[idx].reviews)
        //         //     state.users[idx].reviews.unshift(obj);
        //         // else
        //         //     state.users[idx].reviews = [obj];
        //     };
        // },
        // deleteUsers: (state, { payload }) => {
        //     state.users = state.users.filter(el => el.id !== payload);
        // }
    },
    extraReducers: {
        [HYDRATE]: (state, action) => {
            return {
                ...state,
                ...action.payload.users,
            };
        },
    },
});

export const { setLoadingUsers, setUsers, setFullInfoInProduct } = usersSlice.actions;

export const selectUsers = (state) => state.users.users;

export const selectLoadingUsers = (state) => state.users.loadingUsers;


export const getUsers = () => async dispatch => {
    dispatch(usersSlice.actions.setLoadingUsers(true));

    getUsersApi()
        .then(({ data }) => {
            dispatch(usersSlice.actions.setUsers(data));
        })
        .catch(err => console.error(err))
        .finally(() => dispatch(usersSlice.actions.setLoadingUsers(false)));
};

// export const addReviewToProduct =
//     ({ id = '', name = '', name = '', user = {}, callback = () => {} }) =>
//     async dispatch => {
//         dispatch(usersSlice.actions.addReview({ id, name, email, avatar}));

//         return new Promise(res => setTimeout(res(), 1000))
//             .then(() => callback('success'))
//             .catch(() => callback('error'));
//     };

// export const deleteProduct = ({ id = '', callback = () => {} }) =>
//     async dispatch => {
//         dispatch(usersSlice.actions.deleteUser(id));

//         return new Promise(res => setTimeout(res(), 1000))
//             .then(() => callback('success'))
//             .catch(() => callback('error'));
//     };

export default usersSlice.reducer;