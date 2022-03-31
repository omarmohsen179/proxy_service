import { GET_LOOKUPS, GET_VISIBLE_PANELS, GET_STORES } from './../Services/ApiServices/ItemsAPI';
import {
    createSlice,
    createAsyncThunk,
} from "@reduxjs/toolkit";



let fetchAll = createAsyncThunk(
    `itemsLookups/fetchAll`,
    async (params, { getState }) => {
        let items = getState().entities.itemsLookups.items;
        if (!items.getted) {
            let response = await GET_LOOKUPS();
            return response;
        } return items;
    }
);

let fetchStores = createAsyncThunk(
    `itemsLookups/fetchStores`,
    async (params, { getState }) => {
        let stores = getState().entities.itemsLookups.stores;
        if (!stores.getted) {
            let response = await GET_STORES();
            return response;
        } return stores;
    }
);


let fetchPermissions = createAsyncThunk(
    `itemsLookups/fetchPermissions`,
    async (params, { getState }) => {
        let permissions = getState().entities.itemsLookups.permissions;
        if (!permissions.getted) {
            let response = await GET_VISIBLE_PANELS();
            return response;
        } return permissions;
    }
);

let fetchCategories = createAsyncThunk(
    `itemsLookups/fetchCategories`,
    async (params, { getState }) => {
        let permissions = getState().entities.itemsLookups.permissions;
        if (!permissions.getted) {
            let response = await GET_VISIBLE_PANELS();
            return response;
        } return permissions;
    }
);


let slice = createSlice({
    name: `itemsLookups`,
    initialState: {
        status: null,
        items: { MainUnit: [], OtherCategory: [], Supplier: [] },
        permissions: { Work_with_Seramik: false, Cancel_box: false, Work_with_validity: false },
        mainUnit: [],
        stores: [],
    },

    reducers: {
        editMainUnit: (state, { payload }) => {
            let { previous, value } = payload;
            state.items.MainUnit = state.items.MainUnit.map(m => {
                //if (m.id === value) return { ...m, disabled: true }
                if (m.id === previous) return { ...m }
                else return m;
            })
        },

        editMainUnitList: (state, { payload }) => {
            let cloneArr = [...state.items.MainUnit];
            /* payload.forEach(e => {
                 let obj = cloneArr.find(i => i.id == e);
                 obj.disabled = !obj.disabled;
             })*/
        }
    },

    extraReducers: {
        /********************/
        [fetchAll.pending]: (state, payload) => {
            state.status = "loading";
        },
        [fetchAll.fulfilled]: (state, { payload }) => {
            payload.MainUnit.map(e => ({ ...e, disabled: false }))
            state.items = { ...payload, getted: true };
            state.mainUnit = payload.MainUnit;
            state.status = "success";
        },
        [fetchAll.rejected]: (state, payload) => {
            state.status = "failed";
        },

        /********************/
        [fetchStores.pending]: (state, payload) => {
            state.status = "loading";
        },
        [fetchStores.fulfilled]: (state, { payload }) => {
            state.stores = { ...payload, getted: true };
            state.status = "success";
        },
        [fetchStores.rejected]: (state, payload) => {
            state.status = "failed";
        },

        /********************/
        [fetchPermissions.pending]: (state, payload) => {
            state.status = "loading";
        },
        [fetchPermissions.fulfilled]: (state, { payload }) => {
            state.permissions = { ...payload, getted: true };
            state.status = "success";
        },
        [fetchPermissions.rejected]: (state, payload) => {
            state.status = "failed";
        },

        /********************/
        [fetchCategories.pending]: (state, payload) => {
            state.status = "loading";
        },
        [fetchCategories.fulfilled]: (state, { payload }) => {
            state.permissions = { ...payload, getted: true };
            state.status = "success";
        },
        [fetchCategories.rejected]: (state, payload) => {
            state.status = "failed";
        },
    },
});


export default slice.reducer;
let { editMainUnit, editMainUnitList } = slice.actions;

const selectItemsLookups = (state) => state.entities.itemsLookups.items;
const selectElements = (state) => state.entities.itemsLookups.permissions;
const selectMainUnit = (state) => state.entities.itemsLookups.mainUnit;
const selectStores = (state) => state.entities.itemsLookups.stores;


export {
    fetchAll,
    fetchPermissions,
    editMainUnit,
    editMainUnitList,
    fetchStores,
    selectMainUnit,
    selectItemsLookups,
    selectElements,
    selectStores
};