import { request } from "../../../Services/CallAPI";

export const GET_ACCOUNT_STATEMENT_TABLE_DATA = async ({
	data,
	skip,
	take,
	FilterQuery,
}) => {
	let config = {
		method: "post",
		url: `/BanksTransactions`,
		data: { ...data, skip, take, FilterQuery },
	};
	return await request(config);
};
