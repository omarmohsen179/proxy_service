import { request } from "../../../../Services/CallAPI";

export const GET_OTHER_TRANSACTIONS_TRANSACTIONS = async ({
    skip,
    take,
    FilterQuery,
    transactionCode
}) => {
    let config = {
        method: "post",
        url: `/OtherTransactions/${transactionCode}`,
        data: {
            skip,
            take,
            FilterQuery
        },
    };
    return await request(config);
};

export const REMOVE_OTHER_TRANSACTION = async ({
    ID,
    transactionCode
}) => {
    let config = {
        method: "post",
        url: `/DeleteOtherTransactions/${transactionCode}/${ID}`,
    };
    return await request(config);
};

