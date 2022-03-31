import { request } from "../../../Services/CallAPI";

export const GET_AGENTS_TRANSACTIONS_REPORT = async ({ ToDate, FromDate, skip, take }) => {
    let config = {
        method: "post",
        url: `/AgentsTransactionsValues`,
        data: {
            ToDate, FromDate, skip, take
        }
    };
    return await request(config);
};

export const GET_AGENTS_SALES_TRANSACTIONS_REPORT = async ({ ToDate, FromDate, skip, take, AgentID }) => {
    let config = {
        method: "post",
        url: `/AgentsValuesForSalesTransactions`,
        data: {
            ToDate, FromDate, skip, take, AgentID
        }
    };
    return await request(config);
};