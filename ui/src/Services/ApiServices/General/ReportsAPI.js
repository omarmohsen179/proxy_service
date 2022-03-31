import { request } from "../../CallAPI";

export const GET_REPORT_ITEM_STORES_QUANTITY = async (itemId) => {
	let config = {
		method: "post",
		url: `/ReportAboutItemStoresQuantities/${itemId}`,
	};

	return await request(config);
};

export const GET_REPORT_ITEM_TRANSACTIONS = async ({
	itemId,
	skip,
	take,
	storeID = "0",
	fromDate = "01/01/2010",
	toDate = "01/01/2050",
}) => {
	let config = {
		method: "post",
		url: `/ReportAboutItemTransactions`,
		data: {
			FromDate: fromDate,
			ToDate: toDate,
			skip,
			take,
			StoreID: storeID,
			InputQuantity: 0,
			ItemID: itemId,
		},
	};

	return await request(config);
};

export const GET_CUSTOMER_LAST_TRANSACTION = async (itemID, customerID) => {
	let config = {
		method: "post",
		url: `/CustomerLastItemTransaction/${customerID}/${itemID}`,
	};

	return await request(config);
};

// Send Email Or Sms
export const SEND_EMAIL_SMS = async (type, data) => {
	let config = {
		method: "post",
		url: `/SendReportToAccount/${type}`,
		data,
	};

	return await request(config);
};

// التصنيف
export const GET_CLASSIFICATIONS = async () => {
	let config = {
		method: "post",
		url: `/AccountsTypes`,
	};

	return await request(config);
};

// التصنيف
export const GET_MOVEMENT_SHEET_DATA = async ({
	skip,
	take,
	AccountID,
	BySystemMoneyType,
	data,
}) => {
	let config = {
		method: "post",
		url: `/AccountTransactions/${AccountID}/${BySystemMoneyType}`,
		data: { ...data, skip, take },
	};
	return await request(config);
};

export const GET_ASSETS = async () => {
	let config = {
		method: "post",
		url: `/AllBoughtAssets`,
	};
	return await request(config);
};