import { request } from "../../Services/CallAPI";


export const GET_INVOICE = async ( ObjectData) => {
    let config = {
        method: "post",
        url: `/GetInvoices/${ObjectData.Type}`,
        data: ObjectData
        
    };

    return await request(config);
};

