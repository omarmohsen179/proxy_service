import {
    createSlice,
    createAsyncThunk,
} from "@reduxjs/toolkit";

import { GET_MAIN_CATEGORIES } from './../../Services/ApiServices/ItemsAPI';
import { checkForCall } from './../../Services/services';

const fetchCategories = createAsyncThunk(
    `categories/fetchCategories`,
    async (params, { getState }) => {
        let { lastFetch, items } = getState().entities.categories;
        let makeRequest = checkForCall(lastFetch);
        if (!makeRequest) {
            let { MainCategory } = await GET_MAIN_CATEGORIES();
            return MainCategory;
        }
        return items;
    }
);


let slice = createSlice({
    name: `categories`,
    initialState: {
        items: [],
        lastFetch: null,
    },

    extraReducers: {
        [fetchCategories.fulfilled]: (state, { payload }) => {
            state.items = payload;
            state.lastFetch = Date.now();
        },
        [fetchCategories.rejected]: (state, payload) => {
            state.status = "failed";
        },
    },

});

export default slice.reducer;

const selectCategories = (state) => state.entities.categories.items;

export {
    fetchCategories,
    selectCategories
};