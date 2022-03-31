import { request } from "../../../../Services/CallAPI";

export const GET_REPORT_ITEM_STORES_QUANTITY = async (itemId) => {
    let config = {
        method: "post",
        url: `/ReportAboutItemStoresQuantities/${itemId}`,
    };

    return await request(config);
};