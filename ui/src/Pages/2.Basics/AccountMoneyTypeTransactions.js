import { request } from "../../Services/CallAPI";

export const GEY_ACCOUNT_MONEY_TYPES = async (id) => {
    let config = {
        method: "get",
        url: `/AccountMoneyTypes/${id}`,
    };

    return await request(config);
};

export const UPDATE_ACCOUNT_MONEY_TYPES = async (_data) => {
    let config = {
        method: "post",
        url: `/AccountMoneyTypeTransactions`,
        data: {
            ..._data,
        },
    };

    return await request(config);
};


export const DELETE_ACCOUNT_MONEY_TYPE = async (id) => {
    let config = {
        method: "post",
        url: `/DeleteAccountMoneyType/${id}`,
    };

    return await request(config);
};

