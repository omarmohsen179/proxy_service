import { request } from "../../../Services/CallAPI";

export const GET_SYSTEM_SETTINGS = async () => {
	let config = {
		method: "post",
		url: `/SystemSetting`,
	};
	return await request(config);
};

export const POST_SYSTEM_SETTINGS = async (Data) => {
	let config = {
		method: "post",
		url: `/UpdateSystemSetting`,
		data: { Data: Data },
	};
	return await request(config);
};

export const CHECK_OTHER_SETTINGS = async (Password) => {
	let config = {
		method: "post",
		url: `/CheckOtherSetting/${Password}`,
	};
	return await request(config);
};

//lookups
export const GET_SYSTEMSETTINGS_ALLGROUPS_LOOKUPS = async () => {
	let config = {
		method: "post",
		url: `/ALLGroups`,
	};
	return await request(config);
};

export const GET_SYSTEMSETTINGS_MONEYTYPES_LOOKUPS = async () => {
	let config = {
		method: "post",
		url: `/MoneyTypes`,
	};
	return await request(config);
};

export const GET_SYSTEMSETTINGS_NODES_LOOKUPS = async () => {
	let config = {
		method: "post",
		url: `/Nodes`,
	};
	return await request(config);
};

//
export const GET_FINANCIAL_TRANSACTIONS_TYPES = async () => {
	let config = {
		method: "post",
		url: `/FinancialTransactionsTypes`,
	};
	return await request(config);
};
//
export const CHECK_FINANCIAL_TRANSACTIONSDATA = async (data) => {
	let config = {
		method: "post",
		url: `/CheckFinancialTransactionsData`,
		data: data,
	};
	return await request(config);
};

export const FINANCIAL_TRANSACTIONS = async (Data) => {
	let config = {
		method: "post",
		url: `/FinancialTransactions`,
		data: { Data: Data },
	};
	return await request(config);
};

export const DELETE_FINANCIAL_TRANSACTIONS = async (FinancialTransactionID) => {
	let config = {
		method: "post",
		url: `/DeleteFinancialTransactions/${FinancialTransactionID}`,
	};
	return await request(config);
};
