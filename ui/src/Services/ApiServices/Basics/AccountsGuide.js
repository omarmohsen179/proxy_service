import { request } from "../../CallAPI";

export const GET_ACCOUNTS_GUIDE_SELCECTED_DATA = async (id) => {
	let config = {
		method: "post",
		url: `/Account/${id}`,
	};
	return await request(config);
};

export const GET_MARKETERS = async () => {
	let config = {
		method: "post",
		url: `/Staff`,
	};
	return await request(config);
};

export const GET_ACCOUNT_TYPE = async (AccountType) => {
	let config = {
		method: "post",
		url: `/AccountNextNumber/${AccountType}`,
	};
	return await request(config);
};

export const GET_EDIT_LIST = async (AccountType, ShowHidden) => {
	let config = {
		method: "post",
		url: `/SearchAboutAccount/${AccountType}/${ShowHidden}`,
	};
	return await request(config);
};

export const GET_EDIT_ITEM = async (id) => {
	let config = {
		method: "post",
		url: `/Account/${id}`,
	};
	return await request(config);
};

export const POST_ACCOUNTS_GUIDE_DATA = async (index, Data) => {
	let config = {
		method: "post",
		url: `/AccountTransactions/${index}`,
		data: { Data: [Data] },
	};
	return await request(config);
};

export const DELETE_ROW = async (id) => {
	let config = {
		method: "post",
		url: `/DeleteAccount/${id}`,
	};
	return await request(config);
};

export const VALIDATE_ACCOUNTS_GUIDE = async (AccountType, Data) => {
	let config = {
		method: "post",
		url: `/CheckAccountData/${AccountType}`,
		data: Data,
	};
	return await request(config);
};