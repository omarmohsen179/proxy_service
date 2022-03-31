import { request } from "../CallAPI";

export const GET_CASHIER_STORES = async () => {
  let config = {
    method: "post",
    url: "/CashierStores",
  };

  return await request(config);
};

export const GET_CASHIERS = async () => {
  let config = {
    method: "post",
    url: "/Staff",
  };

  return await request(config);
};

// InvoiceType = Sales
export const GET_ACCOUNTS = async (accountType, agentID, invoiceType) => {
  let config = {
    method: "post",
    url: `/Accounts/${accountType}/${agentID}/${invoiceType}`,
  };

  return await request(config);
};

export const GET_INVOICE_NUMBER = async (invoiceType) => {
  let config = {
    method: "post",
    url: `/InvoiceNumber/${invoiceType}`,
  };

  return await request(config);
};

// {
//     "Token": "7kgPjPiphKa6HiKh1Ct2Xbf6OZ3OnNInUU2BMIpNEYI=",
//     "Read_id": "0",
//     "Data": [{"InvoiceType": "Sales",
//         "ID":"0",
//         "AccountID":"7",
//         "StoreID":"1",
//         "Invoice": {
//             e_no:"",
//             e_date:"",
//             Ex_Rate:"",
//             mosweq_id:"",
//             emp_id:"",
//             omla_id:"",
//             sno_id:""
//             tele_nkd: "",
//             nots1: "",
//             nots: "",
//         },
//         "InvoiceItems":[{
//             "item_id":"",
//             "kmea":"",
//             "m_no":""
//             "price":"",
//             "p_tkl":"",
//             "sum_box":"",
//             "dis1":"",
//             "dis1_typ":"",
//             "Box_id":"",
//             "Unit_id":"",
//             "Exp_date":"",
//             "emp_id":"",
//             "mosawiq_nesba":""
//         }]
//     }]
// }
export const INSRET_INVOICE = async (_data) => {
  let config = {
    method: "post",
    url: `/InvoiceTransactions`,
    data: {
      ..._data,
    },
  };

  return await request(config);
};

export const UPDATE_INVOICE = async (_data) => {
  let config = {
    method: "post",
    url: `/InvoiceTransactions`,
    data: {
      ..._data,
    },
  };

  return await request(config);
};

export const GET_INVOICE_ITEMS = async (invoiceType, invoiceId) => {
  let config = {
    method: "post",
    url: `/InvoiceItems/${invoiceType}/${invoiceId}`,
  };

  return await request(config);
};
export const GET_INVOICE_BY_ID = async (invoiceType, invoiceId) => {
  let config = {
    method: "post",
    url: `/GetInvoice/${invoiceType}/${invoiceId}`,
  };

  return await request(config);
};
export const DELETE_INVOICE_ITEM = async (
  invoiceType = "Sales",
  invoiceID,
  invoiceItemID
) => {
  let config = {
    method: "post",
    url: `/DeleteInvoiceItem/${invoiceType}/${invoiceID}/${invoiceItemID}`,
  };

  return await request(config);
};

export const DELETE_INVOICE = async (invoiceType = "Sales", invoiceID) => {
  let config = {
    method: "post",
    url: `/DeleteInvoice/${invoiceType}/${invoiceID}`,
  };

  return await request(config);
};
export const SALES_REPORTS= async (id,type) => {
  let config = {
    method: "post",
    url: `/Report/Sales`,
    data: {
      id:id,
      InvoiceType :type
    },
  };

  return await request(config);
};
export const UPDATE_INVOICE_BASICS = async (_data) => {
  let config = {
    method: "post",
    url: `/InvoiceBasicEdit`,
    data: {
      ..._data,
    },
  };

  return await request(config);
};

export const UPDATE_INVOICE_DISCOUNT = async (_data) => {
  let config = {
    method: "post",
    url: `/InvoiceDiscount`,
    data: {
      ..._data,
    },
  };

  return await request(config);
};

// ID : invoice item id
// item_id : item_id
// InvoiceID : InvoiceID
// sum_box : sum_box
// price : price
// dis1
// m_no
// Subject_to_validity
export const DISTRIBUTE_INVOICE_ITEM_QUANTITY = async (_data) => {
  let config = {
    method: "post",
    url: `/DistributeInvoiceItemQuantity`,
    data: {
      ..._data,
    },
  };

  return await request(config);
};
