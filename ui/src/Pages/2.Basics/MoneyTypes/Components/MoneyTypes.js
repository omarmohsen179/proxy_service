import { request } from "../../../../Services/CallAPI";

export const GET_MONEY_TYPES = async () => {
    let config = {
        method: "post",
        url: `/InvoicesMoneyTypes`,
    };

    return await request(config);
};

export const GET_MAX_NUMBER = async () => {
    let config = {
        method: "post",
        url: `/MoneyTypesNextNumber`,
    };

    return await request(config);
};


export const UPDATE_MONEY_TYPES = async (_data) => {
    let config = {
        method: "post",
        url: `/MoneyTypeTransactions`,
        data: {
            ..._data,
        },
    };

    return await request(config);
};


export const DELETE_MONEY_TYPE = async (id) => {
    let config = {
        method: "post",
        url: `/DeleteMoneyType/${id}`,
    };

    return await request(config);
};

