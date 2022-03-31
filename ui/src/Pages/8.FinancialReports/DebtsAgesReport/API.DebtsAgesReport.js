import { request } from "../../../Services/CallAPI";

export const GET_DEBITS_VALUE_REPORT = async ({ AccountType, DebitTime, DebitType, skip, take, FilterQuery }) => {
    let config = {
        method: "post",
        url: `/DebitsValuesInYear`,
        data: {
            AccountType, DebitTime, DebitType, skip, take, FilterQuery
        },
    };
    return await request(config);
};