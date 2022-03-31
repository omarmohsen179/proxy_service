import { combineReducers } from "redux";
import permissionsReducer from "./permissions";
import groupsReducer from "./groups";
import otherPermissions from "./otherPermissions";
import ItemsLookupsReducer from "./itemsLookups";
import CategoriesReducer from "./Items/CategoriesSlice";
import ItemsReducer from "./Items/ItemsSlice";

export default combineReducers({
    permissions: permissionsReducer,
    otherPermissions: otherPermissions,
    groups: groupsReducer,
    itemsLookups: ItemsLookupsReducer,
    categories: CategoriesReducer,
    items: ItemsReducer,
});
