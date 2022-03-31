

import { request } from "../../../Services/CallAPI";
export const TRANSATION_VALUES= async (e) => {
	let config = {
		method: "post",
		url: `/TransactionsValues`,
        data:e

	};
	return await request(config);
};
export const ALL_TRANSATION= async (e) => {
	let config = {
		method: "post",
		url: `/AllTransactions`,
        data:e

	};
	return await request(config);
};
