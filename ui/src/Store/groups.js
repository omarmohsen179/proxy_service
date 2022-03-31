import {
	createAsyncThunk,
	createEntityAdapter,
	createSlice,
} from "@reduxjs/toolkit";
import { ADD_GROUP } from "../Services/ApiServices/GroupsAPI";
import { GET_GROUPS } from "../Services/ApiServices/GroupsAPI";

// Call Api
export const getGroups = createAsyncThunk(
	"groups/getGroups",
	async (arg, { dispatch, getState }) => {
		const isGot = getState().entities.groups.ids.length > 0;
		if (!isGot) {
			let data = await GET_GROUPS();
			return data;
		}
	}
);

export const addNewGroup = createAsyncThunk(
	"groups/addNewGroup",
	async ({ getFromId, groupName }, { dispatch, getState }) => {
		let data = await ADD_GROUP(groupName, getFromId);
		console.log(data);
		return { name: groupName, id: data["id"] };
	}
);

// Adapter
const groupsAdapter = createEntityAdapter({
	selectId: (group) => group.id,
});

// Slice
const groupsSlice = createSlice({
	name: "groups",
	initialState: groupsAdapter.getInitialState({
		selectedGroupId: null,
		loading: false,
	}),

	reducers: {
		setSelectedGroupId(state, { payload }) {
			state.selectedGroupId = payload;
		},
	},
	extraReducers: {
		// getGroups
		[getGroups.pending](state, action) {
			state.loading = true;
		},
		[getGroups.fulfilled](state, { payload }) {
			if (payload) {
				groupsAdapter.setAll(state, payload);
			}
			state.loading = false;
		},
		[getGroups.rejected](state, action) {
			state.loading = false;
		},
		// addNewGroup
		[addNewGroup.pending](state, action) {
			state.loading = true;
		},
		[addNewGroup.fulfilled](state, { payload }) {
			if (payload) {
				console.log(payload);
				groupsAdapter.addOne(state, payload);
			}
			state.loading = false;
		},
		[addNewGroup.rejected](state, action) {
			state.loading = false;
		},
	},
});

// Exports
export const groupsSelector = groupsAdapter.getSelectors(
	(state) => state.entities.groups
);

export const getSelectedGroupId = (state) => {
	return state.entities.groups.selectedGroupId;
};

export default groupsSlice.reducer;

export const { setSelectedGroupId } = groupsSlice.actions;
