import { request } from "../../../Services/CallAPI";

export const GET_STAGNANT_ITEMS_REPORT = async ({ PercentageValue,
    CategoryID,
    ToDate,
    FromDate, skip, take }) => {
    let config = {
        method: "post",
        url: `/StagnantItemsReport`,
        data: {
            PercentageValue,
            CategoryID,
            ToDate,
            FromDate, skip, take
        }
    };
    return await request(config);
};