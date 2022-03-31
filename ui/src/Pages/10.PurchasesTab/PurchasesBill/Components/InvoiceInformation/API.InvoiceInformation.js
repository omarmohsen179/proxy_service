import { request } from "../../../../../Services/CallAPI";

export const GET_CASHIER_STORES = async () => {
    let config = {
        method: "post",
        url: "/CashierStores",
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

export const GET_ACCOUNTS = async (accountType, agentID, invoiceType) => {
    let config = {
        method: "post",
        url: `/Accounts/${accountType}/${agentID}/${invoiceType}`,
    };

    return await request(config);
};

export const GET_INVOICE_NUMBER = async (invoiceType) => {
    let config = {
        method: "post",
        url: `/InvoiceNumber/${invoiceType}`,
    };

    return await request(config);
};

