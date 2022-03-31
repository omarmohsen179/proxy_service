import { request } from "../../../Services/CallAPI";

export const GET_BANKS_DATA = async () => {
	let config = {
		method: "post",
		url: `/Banks`,
	};
	return await request(config);
};

export const GET_NEXT_NUMBER = async () => {
	let config = {
		method: "post",
		url: `/BankAccountNextNumber`,
	};
	return await request(config);
};

export const DELETE_ITEM = async (bankAccountID) => {
	let config = {
		method: "post",
		url: `/BankAccountNextNumber/${bankAccountID}`,
	};
	return await request(config);
};

export const GET_EDIT_DELETE_DATA = async (data) => {
	let config = {
		method: "post",
		url: `/BanksCredits`,
		data: { ...data },
	};
	return await request(config);
};

export const INSERT_UPDATE = async (data) => {
	let config = {
		method: "post",
		url: `/BankAccountTransactions`,
		data: { ...data },
	};
	return await request(config);
};
