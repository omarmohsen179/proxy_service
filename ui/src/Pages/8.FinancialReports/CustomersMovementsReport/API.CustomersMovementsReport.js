import { request } from "../../../Services/CallAPI";

export const GET_CUSTOMERS_TRANSACTIONS = async ({ ToDate, FromDate, AccountType, skip, take, FilterQuery }) => {
    let config = {
        method: "post",
        url: `/CustomersTransactions`,
        data: {
            ToDate, FromDate, AccountType, skip, take, FilterQuery
        }
    };
    return await request(config);
};