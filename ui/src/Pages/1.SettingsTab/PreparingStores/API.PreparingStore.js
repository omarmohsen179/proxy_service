import { request } from "../../../Services/CallAPI";


export const GET_STORES = async () => {
    let config = {
        method: "post",
        url: "/Stores",
    };
    console.log(config.data)
    return await request(config);
};
export const GET_STORES_ID = async (id) => {
    let config = {
        method: "post",
        url: "/Store/"+id,
    };
    console.log(config.data)
    return await request(config);
};

export const TRANSACTION = async (ob) => {
    let config = {
        method: "post",
        url: "/StoreTransactions",
        data:{Data:[ob]}
    };
    console.log(config.data)
    return await request(config);
};
export const NEXT_NUMBER = async () => {
    let config = {
        method: "post",
        url: "/StoreNextNumber",
    };
    console.log(config.data)
    return await request(config);
};
export const CHECKER = async (col,val) => {
    let config = {
        method: "post",
        url: "/CheckStoreData",
        data:{CheckData: { [col]: val}
        }
    };
    console.log(config.data)
    return await request(config);
};

export const DELETE = async (CostTypeID) => {

    let config = {
        method: "post",
        url: `/DeleteStore/${CostTypeID}`,
      
  
    };
    console.log(config)
    return await request(config);
  };