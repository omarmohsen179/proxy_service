import {
    createAsyncThunk,
    createSelector,
    createSlice,
} from "@reduxjs/toolkit";
import { isNumber } from "lodash";

import {
    ASSIGN_PERMISSION,
    FREE_PERMISSION,
    GET_OTHER_PERMISSIONS_IN,
    GET_OTHER_PERMISSIONS_OUT,
} from "../Services/ApiServices/PermissionsAPI";

// Call API
export const getOtherPermissions = createAsyncThunk(
    "otherPermissions/getOtherPermissions",
    async (arg, { dispatch, getState }) => {
        let groupId = getState().entities.groups.selectedGroupId;
        const isGot =
            groupId && getState().entities.otherPermissions.byGroupId[groupId]
                ? true
                : false;
        if (!isGot) {
            let otherPermissionsIn = await GET_OTHER_PERMISSIONS_IN(groupId);

            let otherPermissionsOut = await GET_OTHER_PERMISSIONS_OUT(groupId);

            let data = {
                nodes: {
                    name: "nodes",
                    type: "Node",
                    title: "تخصيص فروع للموظف",
                    titleEn: "Allow nodes to employee",
                    in: otherPermissionsIn.filter(
                        (permission) => permission.type === "Nodes"
                    ),
                    out: otherPermissionsOut.filter(
                        (permission) => permission.type === "Nodes"
                    ),
                },
                stores: {
                    name: "stores",
                    type: "Store",
                    title: "تخصيص مخازن للموظف",
                    titleEn: "Allow storages to reports",
                    in: otherPermissionsIn.filter(
                        (permission) => permission.type === "Stores"
                    ),
                    out: otherPermissionsOut.filter(
                        (permission) => permission.type === "Stores"
                    ),
                },
                showingStore: {
                    name: "showingStore",
                    type: "Showing Store",
                    title: "تخصيص مخازن لكشف المخزون",
                    titleEn: "Allow storages to reports",
                    in: otherPermissionsIn.filter(
                        (permission) => permission.type === "Showing Store"
                    ),
                    out: otherPermissionsOut.filter(
                        (permission) => permission.type === "Showing Store"
                    ),
                },
                safes: {
                    name: "safes",
                    type: "Safe",
                    title: "تخصيص خزائن للموظف",
                    titleEn: "Allow safes to employee",
                    in: otherPermissionsIn.filter(
                        (permission) => permission.type === "Safes"
                    ),
                    out: otherPermissionsOut.filter(
                        (permission) => permission.type === "Safes"
                    ),
                },
                banks: {
                    name: "banks",
                    type: "Bank",
                    title: "تخصيص مصارف للموظف",
                    titleEn: "Allow banks to employee",
                    in: otherPermissionsIn.filter(
                        (permission) => permission.type === "Banks"
                    ),
                    out: otherPermissionsOut.filter(
                        (permission) => permission.type === "Banks"
                    ),
                },
            };
            return { data, groupId };
        }
    }
);

export const updateOtherPermissions = createAsyncThunk(
    "otherPermissions/updateOtherPermissions",
    async (otherPermission, { dispatch, getState }) => {
        let groupId = getState().entities.groups.selectedGroupId;
        const isGot =
            groupId && getState().entities.otherPermissions.byGroupId[groupId]
                ? true
                : false;
        let newId = null;
        if (isGot) {
            console.log(otherPermission);
            let result = await ASSIGN_PERMISSION(
                groupId,
                otherPermission.type,
                otherPermission.id
            );
            newId = result.id;
        }
        if (isNumber(newId)) newId = newId.toString();
        return {
            id: otherPermission.id,
            newId,
            name: otherPermission.name,
            groupId,
        };
    }
);

export const deleteOtherPermissions = createAsyncThunk(
    "otherPermissions/deleteOtherPermissions",
    async (element, { dispatch, getState }) => {
        console.log(element);
        let groupId = getState().entities.groups.selectedGroupId;
        const isGot =
            groupId && getState().entities.otherPermissions.byGroupId[groupId]
                ? true
                : false;
        if (isGot) {
            await FREE_PERMISSION(groupId, element.type, element.id);
        }
        console.log({ id: element.id, name: element.name, groupId });
        return { id: element.id, name: element.name, groupId };
    }
);

// Slice
const otherPermissionsSlice = createSlice({
    name: "otherPermissions",
    initialState: {
        byGroupId: {},
        loading: false,
    },
    reducers: {},
    extraReducers: {
        // Get otherPermissions
        [getOtherPermissions.pending](state, action) {
            state.loading = true;
        },
        [getOtherPermissions.fulfilled](state, { payload }) {
            console.log(payload);
            if (payload) {
                state.byGroupId = {
                    ...state.byGroupId,
                    [payload.groupId]: payload.data,
                };
            }
            state.loading = false;
        },
        [getOtherPermissions.rejected](state, action) {
            state.loading = false;
        },
        // Update otherPermissions
        [updateOtherPermissions.pending](state, action) {
            state.loading = true;
        },
        [updateOtherPermissions.fulfilled](
            state,
            { payload: { id, newId, name, groupId } }
        ) {
            if (id && name && groupId) {
                state.byGroupId[groupId][name].in.push({
                    ...state.byGroupId[groupId][name].out.filter(
                        (item) => item.id === id
                    )[0],
                    id: newId,
                });
                state.byGroupId[groupId][name].out = state.byGroupId[groupId][
                    name
                ].out.filter((item) => item.id !== id);
            }
            state.loading = false;
        },
        [updateOtherPermissions.rejected](state, action) {
            state.loading = false;
        },

        // Delete otherPermissions
        [deleteOtherPermissions.pending](state, action) {
            state.loading = true;
        },
        [deleteOtherPermissions.fulfilled](
            state,
            { payload: { id, name, groupId } }
        ) {
            if (id && name && groupId) {
                console.log(
                    state.byGroupId[groupId][name].in.filter(
                        (item) => item.id === id
                    )[0]
                );
                state.byGroupId[groupId][name].out.push(
                    state.byGroupId[groupId][name].in.filter(
                        (item) => item.id === id
                    )[0]
                );
                state.byGroupId[groupId][name].in = state.byGroupId[groupId][
                    name
                ].in.filter((item) => item.id !== id);
            }
            state.loading = false;
        },
        [deleteOtherPermissions.rejected](state, action) {
            state.loading = false;
        },
    },
});

// Exports
export default otherPermissionsSlice.reducer;

export const getOtherPermissions_IN_OUT = (state) => {
    let groupId = state.entities.groups.selectedGroupId;
    let data = [];
    if (groupId) {
        data = state.entities.otherPermissions.byGroupId[groupId];
    }
    return data;
};

export const getOtherPermissionsEntities_IN_OUT = createSelector(
    (state) => state.entities.groups.selectedGroupId,
    (state) => getOtherPermissions_IN_OUT(state),
    (selectedGroupId, otherPermissions) => {
        let data =
            selectedGroupId && otherPermissions
                ? otherPermissions
                : {
                    nodes: {
                        name: "nodes",
                        title: "تخصيص فروع للموظف",
                        titleEn: "Allow nodes to employee"
                    },
                    stores: {
                        name: "stores",
                        title: "تخصيص مخازن للموظف",
                        titleEn: "Allow storages to employee"
                    },
                    showingStore: {
                        name: "showingStore",
                        title: "تخصيص مخازن لكشف المخزون",
                        titleEn: "Allow storages to reports"
                    },
                    safes: {
                        name: "safes",
                        title: "تخصيص خزائن للموظف",
                        titleEn: "Allow safes to employee"
                    },
                    banks: {
                        name: "banks",
                        title: "تخصيص مصارف للموظف",
                        titleEn: "Allow banks to employee"

                    },
                };

        return Object.values(data);
    }
);

export const getNodesIn = (state) => {
    let groupId = state.entities.groups.selectedGroupId;
    let data = [];
    if (groupId && state.entities.otherPermissions.byGroupId[groupId]) {
        data = state.entities.otherPermissions.byGroupId[groupId].nodes.in;
    }
    return data;
};
