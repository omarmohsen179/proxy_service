import { request } from "../../../Services/CallAPI";

export const GET_BANKS_CREDITS_TABLE_DATA = async (data) => {
	let config = {
		method: "post",
		url: `/BanksCredits`,
		data: { ...data },
	};
	return await request(config);
};
