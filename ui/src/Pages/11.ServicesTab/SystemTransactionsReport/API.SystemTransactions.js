import { request } from "../../../Services/CallAPI";

export const GET_SYSTEM_TRANSACTIONS = async ({ mosweq_id, fromDate, toDate, skip, take, FilterQuery }) => {
    let config = {
        method: "post",
        url: `/SystemTransactionsReport`,
        data: {
            FromDate: fromDate,
            ToDate: toDate,
            UserID: mosweq_id,
            skip,
            take,
            FilterQuery
        }
    };

    return await request(config);
};