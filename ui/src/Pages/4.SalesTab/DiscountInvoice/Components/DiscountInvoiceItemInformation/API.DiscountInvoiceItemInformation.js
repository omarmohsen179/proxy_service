import { request } from "../../../../../Services/CallAPI";

export const GET_DISCOUNT_INVOICE_ITEM_INFO = async (accountId, itemId) => {
    let config = {
        method: "post",
        url: `/DiscountInvoiceItemLastInvoiceInfo/${accountId}/${itemId}`,
    };

    return await request(config);
};