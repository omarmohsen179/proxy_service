import { request } from "../../../Services/CallAPI";

export const GET_PRINT_PDF = async (_data) => {
    let config = {
        method: "post",
        url: `/Report/Sales`,
        data: {
            ..._data,
        },
    };
    return await request(config);
}