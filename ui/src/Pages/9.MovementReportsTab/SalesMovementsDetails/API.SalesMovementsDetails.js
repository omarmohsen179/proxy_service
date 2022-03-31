

import { request } from "../../../Services/CallAPI";

export const AGENT = async () => {
	let config = {
		method: "post",
		url: `/staff`,


	};
	return await request(config);
};
export const SALES_TRANSACTION_DETAILS = async (e) => {
	let config = {
		method: "post",
		url: `/SalesTransactionsDetails`,
        data:e
	};
	return await request(config);
};
export const SEND_EMAIL_SMS = async (type, data) => {
	let config = {
		method: "post",
		url: `/SendReportToAccount/${type}`,
		data,
	};

	return await request(config);
}