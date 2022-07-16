import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
    productResponse: {},
    loading: false
};

const URL = 'http://localhost:5000';

export const fetchProducts = createAsyncThunk(
    'products/list',
    async (pageInfo) => {
        const url = pageInfo ? `${URL}/?pageInfo=${pageInfo}` : URL;
        const response = await axios.get(url);
        return response.data;
    }
);

export const productSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {
        increment: (state) => {
            state.value += 1;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProducts.pending, (state) => { state.loading = true; })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.productResponse = action.payload;
            });
    },
});

export default productSlice.reducer;
