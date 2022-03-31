import { request } from "../../../Services/CallAPI";

export const GET_ITEMS_TRANSACTION_BY_ACCOUNTS = async ({ ItemID, skip, take, FilterQuery }) => {
    let config = {
        method: "post",
        url: `/ItemTransactionsWithAccounts`,
        data: {
            ItemID, skip, take, FilterQuery
        },
    };
    return await request(config);
};