import { request } from "../../../../Services/CallAPI";

export const GET_FAST_ITEMS = async ({ CategotyID = 0, skip, take }) => {
    let config = {
        method: "post",
        url: `/ItemsIcones`,
        data: {
            CategotyID, skip, take
        },
    };

    return await request(config);
};