import { request } from "../../Services/CallAPI";


export const GET_INVOICE_DISCOUNT = async (ObjectData) => {
    let config = {
        method: "post",
        url: "/DiscountInvoices",
        data:ObjectData
    };
    console.log(config.data)
    return await request(config);
};

export const DELETE = async (id) => {
    let config = {
        method: "post", 
        url: "/DeleteDiscountInvoice/"+id
        
      
    };
    return await request(config);
};