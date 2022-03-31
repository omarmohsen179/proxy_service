
import { request } from "../../../Services/CallAPI";
export const STAFF_MEMEBERS_TRANCATION = async (e) => {
	let config = {
		method: "post",
		url: `/StaffMemebersTransactions`,
        data:e
	};
	return await request(config);
};
