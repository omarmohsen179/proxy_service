import { request } from "../../../Services/CallAPI";

export const GET_ASSETS_TRANSACTIONS = async ({ ToDate, FromDate, skip, take, AssetID }) => {
    let config = {
        method: "post",
        url: `/AllAssetsTransactions`,
        data: {
            ToDate, FromDate, skip, take, AssetID
        }
    };
    return await request(config);
};