import { createSlice } from '@reduxjs/toolkit';
import { HYDRATE } from "next-redux-wrapper";

import {
    getMounthTasks as getMounthTasksApi,
    getWeeklyTasks as getWeeklyTasksApi,
    getFullTaskApi
} from '@api/tasks';

const initTasksState = {
    tasks: null,
    loadingTasks: false
};

export const tasksSlice = createSlice({
    name: 'tasks',
    initialState: initTasksState,
    reducers: {
        setTasks: (state, { payload }) => {
            state.tasks = payload;
        },
        setLoadingTasks: (state, { payload }) => {
            state.loadingTasks = payload;
        },
        updateToFullTask: (state, { payload }) => {
            const idx = state.tasks.mounth.findIndex(el => el.id === payload.id);
            if (idx !== -1) state.tasks.mounth[idx] = payload;
            else {
                const idx = state.tasks.weekly.findIndex(el => el.id === payload.id);
                if (idx !== -1) state.tasks.weekly[idx] = payload;
            }
        }
    },
    extraReducers: {
        [HYDRATE]: (state, action) => {
            return {
                ...state,
                ...action.payload.tasks,
            };
        },
    },
});

export const { setLoadingTasks, setTasks, updateToFullTask } = tasksSlice.actions;

export const selectTasks = (state) => state.tasks.tasks;
export const selectLoadingTasks = (state) => state.tasks.loadingTasks;
export const selectTask = (id) => (state) => {
    const idx = state.tasks.tasks.mounth.findIndex(el => el.id === id);
    if (idx !== -1) return state.tasks.tasks.mounth[idx];
    else {
        const idx = state.tasks.tasks.weekly.findIndex(el => el.id === id);
        if (idx !== -1) return state.tasks.tasks.weekly[idx];
    }
    return null;
};

export const getTasks = () => async dispatch => {
    dispatch(tasksSlice.actions.setLoadingTasks(true));

    Promise
        .allSettled([getMounthTasksApi(), getWeeklyTasksApi()])
        .then(res => {
            dispatch(tasksSlice.actions.setTasks({
                mounth: res[0].value,
                weekly: res[1].value
            }));
        })
        .catch(err => console.error(err))
        .finally(() => dispatch(tasksSlice.actions.setLoadingTasks(false)));
};


export default tasksSlice.reducer;