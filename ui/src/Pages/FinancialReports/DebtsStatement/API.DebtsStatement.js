import { request } from "../../../Services/CallAPI";


//
export const GET_TABLE_DATA = async ({
	AccountType,
	AgentID,
	DebitType,
	MoneyTypeId,
	skip,
	take,
}) => {
	let config = {
		method: "post",
		url: `/AccountsDebitReport/${AccountType}/${AgentID}/${DebitType}/${MoneyTypeId}`,
		data: { skip, take },
	};

	return await request(config);
};

// التصنيف
export const GEt_MOVEMENT_SHEET_DATA = async ({
	skip,
	take,
	AccountID,
	BySystemMoneyType,
	MoneyTypeId,
	LanguageID,
	data,
}) => {
	let config = {
		method: "post",
		url: `/AccountTransactions/${AccountID}/${BySystemMoneyType}/${MoneyTypeId}/${LanguageID}`,
		data: { ...data, skip, take },
	};
	return await request(config);
};

// التصنيف
export const GET_PDF = async (data) => {
	let config = {
		method: "post",
		url: `/Report/AccountsDebits`,
		data,
	};

	return await request(config);
};

// التصنيف
export const GET_MOVEMENT_SHEET_PDF = async (data) => {
	let config = {
		method: "post",
		url: `/Report/AccountTransactions`,
		data,
	};

	return await request(config);
};
