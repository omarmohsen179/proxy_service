import { request } from "../../../Services/CallAPI";
export const NEXT_NUMBER = async () => {
	let config = {
		method: "post",
		url: `/OtherInvoiceNumber/ProductsInventory`,
	};
	return await request(config);
};
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
export const GET_OTHER_INVOICE = async (e) => {
	let config = {
		method: "post",
		url: `/GetOtherInvoices/ProductsInventory`,   
		data:e
	};
	console.log(config)
    //,Invoice,InvoiceItem,StoreID
	return await request(config);
};
export const GET_OTHER_INVOICE_ID = async (InvoiceID,e) => {
	let config = {
		method: "post",
		url: `/GetOtherInvoice/ProductsInventory/${InvoiceID}`,   

	};
    //,Invoice,InvoiceItem,StoreID
	return await request(config);
};
export const GET_OTHER_INVOICE_ITEM = async (InvoiceID,e) => {
	let config = {
		method: "post",
		url: `/OtherInvoiceItems/ProductsInventory/${InvoiceID}`,   

	};
    //,Invoice,InvoiceItem,StoreID
	return await request(config);
};
export const INVOICE_TRANSACTION = async (ob) => {
	let config = {
		method: "post",
		url: `/OtherInvoiceTransactions`,   
        data:{Data:[ob]}
	};
    //,Invoice,InvoiceItem,StoreID
	return await request(config);
};

export const DELETE_INVOICE = async (InvoiceID) => {
	let config = {
		method: "post",
		url: `/DeleteOtherInvoice/ProductsInventory/${InvoiceID}`,
	};
	return await request(config);
};
export const DELETE_INVOICE_ITEM = async (InvoiceID,InvoiceItemID) => {
	let config = {
		method: "post",
		url: `/DeleteOtherInvoiceItem/ProductsInventory/${InvoiceID}/${InvoiceItemID}`,
	};
	return await request(config);
};
export const GET_ACCOUNTS = async () => {
    let config = {
        method: "post",
        url: `/Accounts/Customer/1/OldPurchases`,
    };

    return await request(config);
};
export const IMPORT_FROM_PRODUCTS = async (ImportInvoiceType,ob) => {
    let config = {
        method: "post",
        url: `/ImportFromProductsInventoryToInventoryInvoice/${ImportInvoiceType}`,
		data:{Data:{
			ExportInvoiceID:ob.Iid,
			AccountID:ob.Aid,
		
		}}
	
    };
	console.log(config)
    return await request(config);
};

//ImportFromProductsInventoryToInventoryInvoice/{ImportInvoiceType}