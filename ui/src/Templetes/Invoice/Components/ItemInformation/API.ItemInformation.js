import { request } from "../../../../Services/CallAPI";


// idType = "ItemID" || 'ItemBarcode'
export const GET_ITEM_INFO = async (storeId, itemId, idType = "ItemID") => {
    let config = {
        method: "post",
        url: `/ItemInfo/${storeId}`,
        data: {
            [idType]: itemId,
        },
    };

    return await request(config);
};

export const UPDATE_INVOICE_DISCOUNT = async (_data) => {
    let config = {
        method: "post",
        url: `/InvoiceDiscount`,
        data: {
            ..._data,
        },
    };

    return await request(config);
};