import { request } from "../../../Services/CallAPI";

export const GET_ITEMS_VALIDITY = async ({ skip, take, categoryId, FilterQuery = '' }) => {
    let config = {
        method: "post",
        url: `/ItemsValidity/${categoryId}`,
        data: {
            skip, take, FilterQuery
        }
    };

    return await request(config);
};