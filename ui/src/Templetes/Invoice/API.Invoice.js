import { request } from "../../Services/CallAPI";

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
export const INSERT_INVOICE = async (_data) => {
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

export const ADD_SALES_OFFER_TO_INVOICE = async ({ OfferSaleInvoiceID, UserID = 1, AgentID, AccountID, ListType, InvoiceType }) => {
	let config = {
		method: "post",
		url: `/ImportToSystemInvoice/${InvoiceType}`,
		data: {
			Data: {
				ExportInvoiceID: OfferSaleInvoiceID,
				UserID,
				AgentID,
				AccountID,
				ListType,
				InvoiceType
			}
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

export const GET_INVOICE_ITEMS = async (invoiceType, invoiceId) => {
	let config = {
		method: "post",
		url: `/InvoiceItems/${invoiceType}/${invoiceId}`,
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
