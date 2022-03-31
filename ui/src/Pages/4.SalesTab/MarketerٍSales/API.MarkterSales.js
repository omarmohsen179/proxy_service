

import { request } from "../../../Services/CallAPI";
export const ITEM_SSALES_PROFIT = async (e) => {
	let config = {
		method: "post",
		url: `/ItemsSalesProfites`,
        data:e

	};
	return await request(config);
};
//Accounts/Customer/1/Purchases
export const SUPPLIERIES = async () => {
	let config = {
		method: "post",
		url: `/Accounts/Customer/-1/Purchases`,


	};
	return await request(config);
};
export const GET_STORES = async () => {
	let config = {
	  method: "post",
	  url: "/Stores",
	};
	return await request(config);
  };

  export const CUSTOMERIES = async () => {
	let config = {
		method: "post",
		url: `/Accounts/Customer/-1/Sales`,


	};
	return await request(config);
};
export const GET_STUFF = async () => {
	let config = {
		method: "post",
		url: `/Staff`,
	};
	return await request(config);
};