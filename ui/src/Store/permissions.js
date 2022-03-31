import {
    createAsyncThunk,
    createEntityAdapter,
    createSelector,
    createSlice,
} from "@reduxjs/toolkit";
import {
    GET_ALL_MAIN_PERMMISIONS,
    GET_ALL_MAIN_PERMMISIONS_DETAILS,
    UPDATE_SUB_PRSMISSIONS,
    // UPDATE_QUERY,
} from "../Services/ApiServices/PermissionsAPI";

export const getMainPermissions = createAsyncThunk(
    "permissions/getMainPermissions",
    async (arg, { dispatch, getState }) => {
        const isGot =
            getState().entities.permissions.mainPermissions.ids.length > 0;
        if (!isGot) {
            let data = await GET_ALL_MAIN_PERMMISIONS();
            let mappedData = data.map((permission) => ({
                ...permission,
                subPermissions: {},
            }));
            return mappedData;
        }
    }
);

export const getSubPermissions = createAsyncThunk(
    "permissions/getSubPermissions",
    async (arg, { dispatch, getState }) => {
        let groupId = getState().entities.groups.selectedGroupId;
        const isGot = getState().entities.permissions.mainPermissions.entities[
            arg.mainId
        ].subPermissions[groupId]
            ? true
            : false;
        if (!isGot) {
            let data = await GET_ALL_MAIN_PERMMISIONS_DETAILS(
                groupId,
                arg.mainName
            );
            return { id: arg.mainId, groupId: groupId, data: data };
        }
        return { id: arg.mainId };
    }
);

export const updateSubPermissions = createAsyncThunk(
    "permissions/updateSubPermissions",
    async (changes, { dispatch, getState }) => {
        let groupId = getState().entities.groups.selectedGroupId;
        await UPDATE_SUB_PRSMISSIONS(changes);
        return { data: changes, groupId };
    }
);

// End Calling API

// Create Adapter
const mainPermissionsAdapter = createEntityAdapter({
    selectId: (pirmission) => pirmission.id,
});

const subPermissionsAdapter = createEntityAdapter({
    selectId: (pirmission) => pirmission.id,
});
// End of creating Adapter

const permissionsSlice = createSlice({
    name: "permissions",
    initialState: {
        mainPermissions: mainPermissionsAdapter.getInitialState(),
        selectedMainPermissionId: null,
        loading: false,
        lastFetch: null,
    },
    reducers: {},
    extraReducers: {
        // getMainPermissions
        [getMainPermissions.pending](state, action) {
            state.loading = true;
        },
        [getMainPermissions.fulfilled](state, { payload }) {
            if (payload) {
                mainPermissionsAdapter.setAll(state.mainPermissions, payload);
                state.lastFetch = Date.now();
            }
            state.loading = false;
        },
        [getMainPermissions.rejected](state, action) {
            state.loading = false;
        },
        // getSubPermissions
        [getSubPermissions.pending](state, action) {
            state.loading = true;
        },
        [getSubPermissions.fulfilled](state, { payload }) {
            state.selectedMainPermissionId = payload.id;
            if (payload.data && payload.groupId) {
                // Array => object
                let data = payload.data.reduce(
                    (
                        accumulator,
                        currentValue,
                        currentIndex,
                        arrayInputData
                    ) => {
                        return {
                            ...accumulator,
                            [currentValue.id]: currentValue,
                        };
                    },
                    {}
                );
                state.mainPermissions.entities[payload.id].subPermissions[
                    payload.groupId
                ] = data;
                state.lastFetch = Date.now();
            }
            state.loading = false;
        },
        [getSubPermissions.rejected](state, action) {
            state.loading = false;
        },
        // updateSubPermissions
        [updateSubPermissions.pending](state, action) {
            state.loading = true;
        },
        [updateSubPermissions.fulfilled](state, { payload }) {
            let groupId = payload.groupId;
            payload.data[0] &&
                payload.data.map((e) => {
                    state.mainPermissions.entities[
                        state.selectedMainPermissionId
                    ].subPermissions[groupId][e.key.id] = {
                        ...e.key,
                        ...e.data,
                    };
                });
            state.loading = false;
        },
        [updateSubPermissions.rejected](state, action) {
            state.loading = false;
        },
    },
});

export const mainPermissionsSelector = mainPermissionsAdapter.getSelectors(
    (state) => state.entities.permissions.mainPermissions
);

export const subPermissionsSelector = (state) => {
    let id = state.entities.permissions.selectedMainPermissionId;
    let groupId = state.entities.groups.selectedGroupId;
    let selected =
        id &&
            state.entities.permissions.mainPermissions.entities[id].subPermissions[
            groupId
            ]
            ? state.entities.permissions.mainPermissions.entities[id]
                .subPermissions[groupId]
            : {};
    // Object => Array
    return Object.values(selected);
};

export const selectedMainPermission = (state) => {
    return state.entities.permissions.selectedMainPermissionId;
};

// End of Export Selectors

// Export Slice
export default permissionsSlice.reducer;

// Export Actions
export const { clearSubPermissions } = permissionsSlice.actions;
