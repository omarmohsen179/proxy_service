import { request } from "../../../Services/CallAPI";

export const GET_ITEMS_NEAR_EXPIRED = async ({ RangTypeValue, RangValue, skip, take, FilterQuery }) => {
    let config = {
        method: "post",
        url: `/ItemsNearExpired`,
        data: {
            RangTypeValue, RangValue, skip, take, FilterQuery
        },
    };
    return await request(config);
};