import { createSlice } from '@reduxjs/toolkit';
import { HYDRATE } from "next-redux-wrapper";

import { getOfferById as getOfferByIdApi } from '@api/offers';

const initOffersState = {
    offer: null,
    loading: false
};

export const offersSlice = createSlice({
    name: 'offers',
    initialState: initOffersState,
    reducers: {
        setOfferState: (state, action) => {
            state.offer = action.payload;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        }
    },
    extraReducers: {
        [HYDRATE]: (state, action) => ({
            ...state,
            ...action.payload.offers,
        }),
    },
});

export const { setOffersState } = offersSlice.actions;

export const selectOfferState = (state) => state.offers.offer;

export const getOfferById = (id) => async dispatch => {
    dispatch(offersSlice.actions.setLoading(true));
    getOfferByIdApi(id)
        .then(res => res.data)
        .then(res =>
            dispatch(offersSlice.actions.setOfferState(res))
        ).catch(error => {
            dispatch(offersSlice.actions.setOfferState(null));
            console.error(new Error('Error in offer by id request'));
        }).finally(_ =>
            dispatch(offersSlice.actions.setLoading(true))
        );
};

export default offersSlice.reducer;