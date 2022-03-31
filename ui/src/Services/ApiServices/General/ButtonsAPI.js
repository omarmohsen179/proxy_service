import { request } from "../../CallAPI";

export const GET_MAIN_SUB_BUTTONS = async () => {
	let config = {
		method: "post",
		url: `/buttons`,
	};
	return await request(config);
};
