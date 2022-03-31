import { request } from "../../../Services/CallAPI";

export const GET_NODES = async () => {
    let config = {
        method: "post",
        url: `/Nodes`,
    };
    return await request(config);
};

export const GET_PURCHASES_COSTS = async () => {
    let config = {
        method: "post",
        url: `/AllCostsTypes`,
    };
    return await request(config);
};

export const GET_ACCOUNTS_COSTS_REPORT = async ({ NodeID,
    CostID,
    ToDate,
    FromDate, IsForPurchaseInvoice }) => {
    let config = {
        method: "post",
        url: `/AccountsCostsReport`,
        data: {
            NodeID,
            CostID,
            ToDate,
            FromDate,
            IsForPurchaseInvoice
        }
    };
    return await request(config);
};