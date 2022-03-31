import { combineReducers } from "redux";
import entitesReducer from "./entitesReducer";

/// We need to add userReducer to reach group id anywhere
export default combineReducers({
	entities: entitesReducer,
});
