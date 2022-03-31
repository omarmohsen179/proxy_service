import { request } from "../../../Services/CallAPI";

export const GET_LATE_DEBITS_REPORT = async ({ AccountType, DebitTimeRange, AgentID, skip, take, FilterQuery }) => {
    let config = {
        method: "post",
        url: `/LateDebits`,
        data: {
            AccountType, DebitTimeRange, AgentID, skip, take, FilterQuery
        },
    };
    return await request(config);
};
