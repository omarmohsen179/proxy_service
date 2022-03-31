import {
    createSlice,
} from "@reduxjs/toolkit";


let slice = createSlice({
    name: `Items`,
    initialState: {
        items: [],
        lastFetch: null,
        searchKeys: {
            typ_id: 0,
            ItemNumber: "",
            ItemName: "",
            code_no: "",
            addres: "",
            SearchName: "",
            qunt: 0,
            m_no: 0
        },
        visible: false,
        item: { name: '', quantity: 0, itemId: 0 }
    },

    reducers: {
        setSearchKeys: (state, { payload }) => {
            state.searchKeys = { ...state.searchKeys, ...payload };
        },
        setVisible: (state, { payload }) => {
            if (payload === true || payload === false) {
                state.visible = payload
            } else {
                state.visible = !state.visible;
            }
        },
        setItem: (state, { payload }) => {
            state.item = payload;
        }
    },
});

export default slice.reducer;

const { setSearchKeys, setVisible, setItem } = slice.actions;
const selectItems = (state) => state.entities.items.items;
const selectSearchKeys = (state) => state.entities.items.searchKeys;
const selectVisible = (state) => state.entities.items.visible;
const selectItem = (state) => state.entities.items.item;

export {
    setVisible,
    setItem,
    setSearchKeys,
    selectItems,
    selectSearchKeys,
    selectVisible,
    selectItem
};