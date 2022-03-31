import { request } from "../../../Services/CallAPI";

export const GET_STAFF_FINANCIAL = async ({ ToDate, FromDate, skip, take, FilterQuery, StaffCategoryID }) => {
    let config = {
        method: "post",
        url: `/StaffFinancialInfo`,
        data: {
            ToDate, FromDate, skip, take, StaffCategoryID, FilterQuery
        }
    };
    return await request(config);
};