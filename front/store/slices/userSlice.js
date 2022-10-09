import { createSlice } from '@reduxjs/toolkit';
import { HYDRATE } from "next-redux-wrapper";

import {
    getUserByID,
    login as userLogin,
    signup as userSignup,
    register,
    register2
} from '@api/user';

const _user = {
    "id": 1,
    "firstName": "andrey",
    "lastName": "popkov",
    "email": "popkovand@mail.com",
    "phoneNumber": "+79087777777",
    "description": "im bitch",
    "avatar": "/tmp/var/public/users/1/me.jpeg",
    "birthday": "2020-01-01T00:00:00Z",
    "department": "developers"
};

const initUserState = {
    info: null,
    loading: false,
    test: false,
    users: null,
    loadingUsers: false
};

export const userSlice = createSlice({
    name: 'user',
    initialState: initUserState,
    reducers: {
        setInfo: (state, { payload }) => {
            state.info = payload;
        },
        setLoading: (state, { payload }) => {
            state.loading = payload;
        },
        setTest: (state, { payload }) => {
            state.test = payload;
        },
        setUsers: (state, { payload }) => {
            state.users = payload;
        },
        setLoadingUsers: (state, { payload }) => {
            state.loadingUsers = payload;
        },
        editUser: (state, { payload: { id, ...payload } }) => {
            const idx = state.users.findIndex(el => el.id === id);
            if (idx !== -1) {
                const tmp = { ...payload };
                state.users[idx] = {
                    ...state.users[idx],
                    ...tmp
                };
            };
        },

    },
    extraReducers: {
        [HYDRATE]: (state, action) => {
            return {
                ...state,
                ...action.payload.user,
            };
        },
    },
});


export const { setLoading, setInfo, setTest } = userSlice.actions;

export const selectInfo = (state) => state.user.info;
export const selectLoading = (state) => state.user.loading;

export const selectUserById = (id) => (state) => state.user.users.find(el => el.id === id);

export const { setLoadingUsers, setUsers } = userSlice.actions;

export const selectUsers = (state) => state.user.users;

export const selectLoadingUsers = (state) => state.user.loadingUsers;


export const getUsers = () => async dispatch => {
    dispatch(userSlice.actions.setLoadingUsers(true));

    getUsersApi()
        .then(({ data }) => {
            dispatch(userSlice.actions.setUsers(data));
        })
        .catch(err => console.error(err))
        .finally(() => dispatch(userSlice.actions.setLoadingUsers(false)));
};

export const login = (logpass) =>
    async dispatch => {
        dispatch(userSlice.actions.setLoading(true));
        try {
            const { data: { result: { id } } } = await userLogin(logpass);
            const { data } = await getUserByID(id);

            dispatch(userSlice.actions.setInfo(data));
        } catch (e) {
            console.error(e);
        } finally {
            dispatch(userSlice.actions.setLoading(false));
        }
    };

export const signup = ({ reg, fd, callback = () => { } }) =>
    async dispatch => {
        dispatch(userSlice.actions.setLoading(true));
        try {
            const { data: { result: { id } } } = await register(reg);
            fd.append('id', id);
            const { data: user } = await register2(fd);
            callback();
        } catch (e) {
            console.log(e);
        } finally {
            dispatch(userSlice.actions.setLoading(false));
        }
    };


export const editUser = ({ callback = () => { }, ...editedUser }) =>
    async dispatch => {
        return new Promise(res => {
            dispatch(userSlice.actions.editUser(editedUser));
            setTimeout(() => res(), 1000);
        })
            .then(() => callback('success'))
            .catch((error) => {
                console.error(error);
                callback('error');
            });
    };
export default userSlice.reducer;