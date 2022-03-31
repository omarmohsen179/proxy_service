import { request } from "../../../Services/CallAPI";

export const GET_DOLLAR_CHANGE_RATE = async () => {
	let config = {
		method: "post",
		url: `/DollarChangeRate`,
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

export const GET_SEARCH_ITEMS = async ({ data, skip, take, FilterQuery }) => {
	let config = {
		method: "post",
		url: `/SearchAboutItems`,
		data: {
			...data,
			skip,
			take,
			FilterQuery,
		},
	};
	try {
		return await request(config);
	} catch (err) {}
};

export const SUBMIT_EDITS = async (data) => {
	let config = {
		method: "post",
		url: `/UpdateItemsPrices`,
		data: data,
	};
	return await request(config);
};
