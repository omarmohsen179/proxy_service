

import { request } from "../../../Services/CallAPI";

export const ITEMS_VALUES = async (e) => {
	let config = {
		method: "post",
		url: `/ItemsValuesInYearMonths`,
        data:e

	};
	return await request(config);
};

