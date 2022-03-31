import { request } from "../../../../../Services/CallAPI";


export const GET_OFFERS_BILLS_TRANSACTIONS = async ({
    skip,
    take,
    FilterQuery,
}) => {
    let config = {
        method: "post",
        url: `/OffersBills`,
        data: {
            skip,
            take,
            FilterQuery
        },
    };
    return await request(config);
};

export const REMOVE_OFFERS_BILLS = async ({
    ID,
}) => {
    let config = {
        method: "post",
        url: `/DeleteOfferBill/${ID}`,
    };
    return await request(config);
};

