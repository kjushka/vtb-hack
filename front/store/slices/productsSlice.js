import moment from 'moment';
import { v4 as uuid } from 'uuid';

import { createSlice } from '@reduxjs/toolkit';
import { HYDRATE } from "next-redux-wrapper";

import {
    getProducts as getProductsApi
} from '@api/products';

const initProductsState = {
    products: null,
    loadingProducts: false
};

export const productsSlice = createSlice({
    name: 'products',
    initialState: initProductsState,
    reducers: {
        setProducts: (state, { payload }) => {
            state.products = payload;
        },
        setLoadingProducts: (state, { payload }) => {
            state.loadingProducts = payload;
        },
        setFullInfoInProduct: (state, { payload }) => {
            const idx = state.products.findIndex(el => el.id === payload.id);
            if (idx !== -1) state.products[idx] = payload;
        },
        addReview: (state, { payload: { id, text, user } }) => {
            const idx = state.products.findIndex(el => el.id === id);
            if (idx !== -1) {
                const obj = {
                    text,
                    user,
                    createDate: moment().toISOString()
                };

                if (state.products[idx].reviews)
                    state.products[idx].reviews.unshift(obj);
                else
                    state.products[idx].reviews = [obj];
            };
        },
        deleteProduct: (state, { payload }) => {
            state.products = state.products.filter(el => el.id !== payload);
        },
        editProduct: (state, { payload: { id, ...payload } }) => {
            const idx = state.products.findIndex(el => el.id === id);
            if (idx !== -1) {
                const tmp = { ...payload, image: undefined };
                state.products[idx] = {
                    ...state.products[idx],
                    ...tmp
                };
            };
        },
        addNewProduct: (state, { image, ...payload }) => {
            // const imageURL = URL.createObjectURL(image);

            state.products.unshift({
                id: uuid(),
                imageURL: 'https://img1.akspic.ru/crops/7/8/8/9/6/169887/169887-gorod-zdanie-purpur-tsvetnoy-liniya_gorizonta-7680x4320.jpg',
                ...payload
            });
        }
    },
    extraReducers: {
        [HYDRATE]: (state, action) => {
            return {
                ...state,
                ...action.payload.products,
            };
        },
    },
});

export const { setLoadingProducts, setProducts, setFullInfoInProduct } = productsSlice.actions;

export const selectProducts = (state) => state.products.products;
export const selectLoadingProducts = (state) => state.products.loadingProducts;
export const selectProductById = (id) => (state) => state.products.products.find(el => el.id === id);

export const getProducts = () => async dispatch => {
    dispatch(productsSlice.actions.setLoadingProducts(true));

    getProductsApi()
        .then(({ data }) => {
            dispatch(productsSlice.actions.setProducts(data));
        })
        .catch(err => console.error(err))
        .finally(() => dispatch(productsSlice.actions.setLoadingProducts(false)));
};

export const addReviewToProduct =
    ({ id = '', text = '', user = {}, callback = () => { } }) =>
        async dispatch => {
            return new Promise(res => {
                dispatch(productsSlice.actions.addReview({ id, text, user }));
                setTimeout(() => res(), 1000);
            })
                .then(() => callback('success'))
                .catch(() => callback('error'));
        };

export const deleteProduct = ({ id = '', callback = () => { } }) =>
    async dispatch => {
        return new Promise(res => {
            dispatch(productsSlice.actions.deleteProduct(id));
            setTimeout(() => res(), 1000);
        })
            .then(() => callback('success'))
            .catch(() => callback('error'));
    };

export const editProduct = ({ callback = () => { }, ...editedProduct }) =>
    async dispatch => {
        return new Promise(res => {
            dispatch(productsSlice.actions.editProduct(editedProduct));
            setTimeout(() => res(), 1000);
        })
            .then(() => callback('success'))
            .catch((error) => {
                console.error(error);
                callback('error');
            });
    };

export const addProduct = ({ callback = () => { }, ...newProduct }) =>
    async dispatch => {
        return new Promise(res => {
            dispatch(productsSlice.actions.addNewProduct(newProduct));
            setTimeout(() => res(), 1000);
        })
            .then(() => callback('success'))
            .catch((error) => {
                console.error(error);
                callback('error');
            });
    };

export default productsSlice.reducer;