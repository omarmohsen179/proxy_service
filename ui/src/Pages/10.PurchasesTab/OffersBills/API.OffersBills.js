import { request } from "../../../Services/CallAPI";

export const GET_OFFERS_BILLS_ACCOUNTS = async () => {
    let config = {
        method: "post",
        url: `/Accounts/Customer/1/Purchases`,
    };

    return await request(config);
};

export const GET_OFFERS_BILLS_NEXT_NUMBER = async () => {
    let config = {
        method: "post",
        url: `/OffersBillsNextNumber`,
    };

    return await request(config);
};

export const DELETE_OFFERS_BILL_ITEM = async (offerBillID, offerBillItemId) => {
    let config = {
        method: "post",
        url: `/DeleteOfferBillItem/${offerBillID}/${offerBillItemId}`,
    };

    return await request(config);
};

export const UPDATE_OFFERS_BILL = async (_data) => {
    let config = {
        method: "post",
        url: `/OffersBillsTransactions`,
        data: {
            ..._data,
        },
    };

    return await request(config);
};

export const GET_OFFERS_BILL_ITEMS = async (ID) => {
    let config = {
        method: "post",
        url: `/OfferBillItems/${ID}`
    };

    return await request(config);
};

export const IMPORT_OFFERS_FROM_EXCEL = async (_data) => {
    let config = {
        method: "post",
        url: `/ImportFromExecl`,
        data: {
            ..._data,
        }
    };

    return await request(config);
};

export const ENROLL_ITEMS = async (_data) => {
    let config = {
        method: "post",
        url: `/InsertionNonInsertedItems`,
        data: {
            ..._data,
        }
    };

    return await request(config);
};

export const EXPORT_TO_PURCHASES_INVOICE = async (SroreID, ExportInvoiceID) => {
    let config = {
        method: "post",
        url: `/ImportFromOffersInvoiceToPurchasesInvoice`,
        data: {
            Data: { SroreID, ExportInvoiceID }
        }
    };

    return await request(config);
};



