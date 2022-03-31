import {
    createSlice,
    createAsyncThunk,
} from "@reduxjs/toolkit";
import { GET_CASHIER_STORES } from "../../Services/ApiServices/SalesBillAPI";


let fetchStores = createAsyncThunk(
    `itemsLookups/fetchStores`,
    async (params, { getState }) => {
        let stores = getState().entities.stores;
        let response = await GET_CASHIER_STORES();
        return response;
    }
);


let slice = createSlice({
    name: `itemsLookups`,
    initialState: {
        stores: [],
        lastFetch: null
    },

    extraReducers: {
        [fetchAll.fulfilled]: (state, { payload }) => {
            state.items = { ...payload };
        },
        [fetchAll.rejected]: (state, payload) => {
            state.status = "failed";
        },
    },
});


export default slice.reducer;
let { editMainUnit, editMainUnitList } = slice.actions;

const selectItemsLookups = (state) => state.entities.itemsLookups.items;
const selectElements = (state) => state.entities.itemsLookups.permissions;

export {
    fetchAll,
};