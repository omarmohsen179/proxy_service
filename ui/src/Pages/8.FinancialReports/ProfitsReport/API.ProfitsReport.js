import { request } from "../../../Services/CallAPI";

export const GET_PROFITS_REPORT = async ({ ToDate, FromDate, AllNodes }) => {
    let config = {
        method: "post",
        url: `/TheSystemProfits`,
        data: {
            ToDate, FromDate, AllNodes
        }
    };
    return await request(config);
};

export const GET_ITEMS_PROFITS_REPORT = async ({ ToDate, FromDate, AllNodes, skip, take, FilterQuery }) => {
    let config = {
        method: "post",
        url: `/ItemsProfites`,
        data: {
            ToDate, FromDate, AllNodes, skip, take, FilterQuery
        }
    };
    return await request(config);
};

export const GET_ACCOUNTS_PROFITS_REPORT = async ({ ToDate, FromDate, AllNodes, skip, take, FilterQuery }) => {
    let config = {
        method: "post",
        url: `/AccountsProfites`,
        data: {
            ToDate, FromDate, AllNodes, skip, take, FilterQuery
        }
    };
    return await request(config);
};

export const GET_SALES_PROFITS_REPORT = async ({ ToDate, FromDate, AllNodes, skip, take, FilterQuery }) => {
    let config = {
        method: "post",
        url: `/SalesProfites`,
        data: {
            ToDate, FromDate, AllNodes, skip, take, FilterQuery
        }
    };
    return await request(config);
};