import { request } from "../../../Services/CallAPI";

export const GET_SELLING_MISTAKES_REPORT = async ({ ToDate,
    FromDate, skip, take, FilterQuery }) => {
    let config = {
        method: "post",
        url: `/SellingMistakesReport`,
        data: {
            ToDate,
            FromDate,
            skip,
            take,
            FilterQuery
        }
    };
    return await request(config);
};