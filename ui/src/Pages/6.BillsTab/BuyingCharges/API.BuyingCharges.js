import { request } from "../../../Services/CallAPI";

export const GET_COSTS_TYPES = async () => {
	let config = {
		method: "post",
		url: `/CostsTypes`,
	};
	return await request(config);
};
export const GET_OTHER_ACCOUNTS = async (AccountTypeID) => {
	let config = {
		method: "post",
		url: `/GetDiffAccounts/${AccountTypeID}`,
	};
	return await request(config);
};

export const GET_NEXT_NUMBER = async () => {
	let config = {
		method: "post",
		url: `/PurchasesCostNextNumber`,
	};
	return await request(config);
};

export const GET_EDIT_DELETE_DATA = async () => {
	let config = {
		method: "post",
		url: `/AllCostsForPurchases`,
	};
	return await request(config);
};

export const DELETE_ITEM = async (CostID) => {
	let config = {
		method: "post",
		url: `/DeletePurchasesCost/${CostID}`,
	};
	return await request(config);
};

export const INSERT_UPDATE = async (Data) => {
	let config = {
		method: "post",
		url: `/PurchasesCostTransactions`,
		data: Data,
	};
	return await request(config);
};
