import { request } from "../../../../../Services/CallAPI";

export const DELETE_INVOICE_ITEM = async (
    invoiceType = "Sales",
    invoiceID,
    invoiceItemID
) => {
    let config = {
        method: "post",
        url: `/DeleteInvoiceItem/${invoiceType}/${invoiceID}/${invoiceItemID}`,
    };

    return await request(config);
};