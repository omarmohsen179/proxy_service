import { request } from "../../../Services/CallAPI";
export const GET_ITEM_INFO = async (storeId, itemId, idType = "ItemID") => {
    let config = {
        method: "post",
        url: `/ItemInfo/${storeId}`,
        data: {
            [idType]: itemId,
        },
    };

    return await request(config);
};
export const GET_STORES = async () => {
    let config = {
        method: "post",
        url: "/Stores",
    };
    // console.log(config.data)
    return await request(config);
};

export const GET_SEARCH_ITEMS = async ({
    FilterQuery = "",
    ItemNumber = "",
    ItemName = "",
    SearchName = "",
    typ_id = 0,
    code_no = "",
    addres = "",
    qunt = 0,
    m_no = 0,
    PageNumber = 0,
    PageSize = 20,
    state = 0,
    sno_id = 0,
    msdar = "",
    clas = "",
    emp_id = 0,
    skip,
    take
  }) => {
    let config = {
      method: "post",
      url: `/SearchAboutItems`,
      data: {
        ItemNumber,
        ItemName,
        SearchName,
        clas,
        qunt,
        state,
        sno_id,
        msdar,
        addres,
        code_no,
        m_no,
        emp_id,
        typ_id,
        skip,
        take,
        FilterQuery,
        // PageSize,
        // PageNumber,
      },
    };
    try {
      return await request(config);
    } catch (err) {
  
    }
  
  };
  export const ALL_STORE_ITEMS = async (e) => {
  
    let config = {
        method: "post",
        url: `/AllStoresItems/${e.ID ? e.ID : 0}/${e.m_no ? e.m_no : 0}`,
        data:{skip:e.skip,take:e.take}
	
    };

    return await request(config);
};
export const RESET_STORE = async (InvoiceID) => {
  
  let config = {
      method: "post",
      url: `/ResetStoreItemsQuantityToZero/${InvoiceID}`,

  };

  return await request(config);
};