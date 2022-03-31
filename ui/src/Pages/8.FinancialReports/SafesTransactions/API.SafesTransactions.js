import { request } from "../../../Services/CallAPI";

export const GET_SAFE_INVOICES = async ({ safeId, mosweq_id, fromDate, toDate, skip, take }) => {
    let config = {
        method: "post",
        url: `/SafeTransactions/${safeId}/${mosweq_id}`,
        data: {
            FromDate: fromDate,
            ToDate: toDate,
            skip,
            take
        }
    };

    return await request(config);
};

export const GET_PDF_FILE = async (_data) => {
    let config = {
        method: "post",
        url: `/Report/SafeTransactions`,
        data: {
            ..._data
        },
    };

    return await request(config);
};