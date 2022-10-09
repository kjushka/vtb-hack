import {
    configureStore,
    combineReducers,
} from '@reduxjs/toolkit';
import { createWrapper, HYDRATE } from 'next-redux-wrapper';
import storage from './storage';

import * as slicesArray from './slices';

const slices = {};

for (const slice in slicesArray) {
    slices[slicesArray[slice].name] = slicesArray[slice].reducer;
}

const rootReducer = combineReducers(slices);

const reducer = (state, action) => {
    if (action.type === HYDRATE) {
        let nextState = {
            ...state,
            ...action.payload,
        };
        return nextState;
    } else {
        return rootReducer(state, action);
    }
};


// export const store =
//     configureStore({
//         reducer: rootReducer,
//         devTools: process.env.NODE_ENV !== 'production'
//     });

// const makeStore = () => store;

let resetStore = () => { };

const isDev = process.env.NODE_ENV !== 'production';

export const makeStore = ({ isServer }) => {
    let middleware = [];

    if (isServer) {
        const store = configureStore({
            reducer,
            middleware: (getDefaultMiddleware) =>
                getDefaultMiddleware().concat(middleware),
            devTools: isDev,
            preloadedState: undefined,
        });

        return store;
    } else {
        const { persistStore, persistReducer } = require('redux-persist');

        const persistConfig = {
            key: 'nextjs', // only counter will be persisted, add other reducers if needed
            storage, // if needed, use a safer storage
        };

        const persistedReducer = persistReducer(persistConfig, reducer); // Create a new reducer with our existing reducer

        resetStore = (state, action) =>
            rootReducer(action.type === 'USER_LOGOUT' ? undefined : state, action);

        const store =
            configureStore({
                reducer: persistedReducer,
                middleware: (getDefaultMiddleware) =>
                    getDefaultMiddleware().concat(middleware),
                devTools: isDev,
                preloadedState: undefined,
            });

        store.__persistor = persistStore(store); // This creates a persistor object & push that persisted object to .__persistor, so that we can avail the persistability feature

        return store;
    }
};

export { resetStore };
export const wrapper = createWrapper(makeStore, { debug: isDev });