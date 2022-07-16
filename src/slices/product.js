import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
    productResponse: {},
    loading: false,
    pageInfo: null,
    productCache: {}
};

const URL = 'http://localhost:5000';

export const fetchProducts = createAsyncThunk(
    'products/list',
    async (pageInfo) => {
        const url = pageInfo ? `${URL}/?pageInfo=${pageInfo}` : URL;
        const response = await axios.get(url);
        return {
            pageInfo: pageInfo,
            ...response.data
        };
    }
);

export const productSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {
        setProductResponse: (state, action) => {
            state.productResponse = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProducts.pending, (state) => { state.loading = true; })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.productResponse = action.payload;
                if(action.payload.pageInfo){
                    state.productCache[action.payload.pageInfo] = action.payload;
                }
            });
    },
});

export const setPageInfo = pageInfo => (dispatch, getState) => {
    const state = getState().products;

    if(state.productCache[pageInfo]){
        dispatch(productSlice.actions.setProductResponse(state.productCache[pageInfo]));
    } else {
        dispatch(fetchProducts(pageInfo));
    }
}

export default productSlice.reducer;
