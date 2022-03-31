import { request } from "../../../Services/CallAPI";

export const GET_DISCOUNT_INVOICE_ITEMS = async (discountInvoiceId) => {
    let config = {
        method: "post",
        url: `/DiscountInvoiceItems/${discountInvoiceId}`,
    };

    return await request(config);
};

export const INSERT_DISCOUNT_INVOICE = async (_data) => {
    let config = {
        method: "post",
        url: `/DiscountInvoicesTransactions`,
        data: {
            ..._data,
        },
    };

    return await request(config);
};

export const UPDATE_DISCOUNT_INVOICE = async (_data) => {
    let config = {
        method: "post",
        url: `/DiscountInvoicesTransactions`,
        data: {
            ..._data,
        },
    };

    return await request(config);
};

export const DELETE_DISCOUNT_INVOICE_ITEM = async (
    invoiceID,
    invoiceItemID
) => {
    let config = {
        method: "post",
        url: `/DeleteDiscountInvoiceItem/${invoiceID}/${invoiceItemID}`,
    };

    return await request(config);
};