

import { request } from "../../../Services/CallAPI";
export const REORDERRPRODUCTS = async (e) => {
	let config = {
		method: "post",
		url: `/ReOrderProducts`,
        data:e

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
