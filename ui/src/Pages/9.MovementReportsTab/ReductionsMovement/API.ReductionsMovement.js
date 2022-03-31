import { request } from "../../../Services/CallAPI";

export const DISCOUNTS_INVOICES_TRANSACTIONS = async ({
	data,
	skip,
	take,
	FilterQuery,
}) => {
	let config = {
		method: "post",
		url: `/DiscountsInvoicesTransactions`,
		data: { ...data, skip, take, FilterQuery },
	};
	return await request(config);
};

export const GET_ACCOUNTS = async () => {
	let config = {
		method: "post",
		url: `/Accounts/Customer/-1/Sales`,
	};

	return await request(config);
};

export const GET_MAIN_CATEGORIES = async () => {
	let config = {
		method: "post",
		url: `/ItemsCategories`,
	};
	return await request(config);
};
