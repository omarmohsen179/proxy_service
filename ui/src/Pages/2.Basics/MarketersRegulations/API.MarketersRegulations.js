import { request } from "../../../Services/CallAPI";

// get List of marketers
export const GET_MARKETERS_LIST = async () => {
	let config = {
		method: "post",
		url: `/SalesStaffRegulations`,
	};
	return await request(config);
};
// Submit Data
export const UPDATE_MARKETERS_REGULATION = async (data) => {
	let config = {
		method: "post",
		url: `/SalesStaffRegulationsTransactions`,
		data: { ...data },
	};
	return await request(config);
};
// Get Edit and delete data list
export const GET_EDIT_DELETE_DATA = async () => {
	let config = {
		method: "post",
		url: `/SalesRegulations`,
	};
	return await request(config);
};

// Get Edit data list
export const GET_EDIT_DATA = async (RegulationID) => {
	let config = {
		method: "post",
		url: `/SalesRegulationList/${RegulationID}`,
	};
	return await request(config);
};

// Delete Regulation
export const DELETE_REGULATION = async (SalesRegulationID) => {
	let config = {
		method: "post",
		url: `/DeleteSalesRegulation/${SalesRegulationID}`,
	};
	return await request(config);
};

// Delete
export const DELETE_REGULATION_ITEM = async (
	SalesRegulationID,
	SalesRegulationListItemID
) => {
	let config = {
		method: "post",
		url: `/DeleteSalesRegulationListItem/${SalesRegulationID}/${SalesRegulationListItemID}`,
	};
	return await request(config);
};
