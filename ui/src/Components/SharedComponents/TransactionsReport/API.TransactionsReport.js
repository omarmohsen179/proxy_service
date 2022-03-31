import { request } from "../../../Services/CallAPI";

export const GET_ACCOUNT_TRANSACTIONS = async ({ ToDate, FromDate, skip, take, MemberID }) => {
    let config = {
        method: "post",
        url: `/StaffMemberTransactions`,
        data: {
            ToDate, FromDate, skip, take, MemberID
        }
    };
    return await request(config);
};