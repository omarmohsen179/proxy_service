import { request } from "../../../../../Services/CallAPI";

export const GET_DISCOUNT_INVOICE_NUMBER = async () => {
    let config = {
        method: "post",
        url: `/DiscountInvoiceNumber`,
    };

    return await request(config);
};

export const GET_CASHIERS = async () => {
    let config = {
        method: "post",
        url: "/Staff",
    };

    return await request(config);
};
