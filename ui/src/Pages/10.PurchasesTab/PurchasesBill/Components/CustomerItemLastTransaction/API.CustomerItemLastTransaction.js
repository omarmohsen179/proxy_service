import { request } from "../../../../../Services/CallAPI";

export const GET_CUSTOMER_LAST_TRANSACTION = async (itemID, customerID) => {
    let config = {
        method: "post",
        url: `/CustomerLastItemTransaction/${customerID}/${itemID}`,
    };

    return await request(config);
};
