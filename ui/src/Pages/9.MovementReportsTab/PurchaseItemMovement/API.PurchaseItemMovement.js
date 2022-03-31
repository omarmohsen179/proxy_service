

import { request } from "../../../Services/CallAPI";
export const PURCHASE_TRANSACTION = async ({skip,take,SupplierID,FromDate,ToDate,CategoryID,ItemID,FilterQuery}) => {
	let config = {
		method: "post",
		url: `/PurchasesTransactions`,
        data:{
            skip
            ,take,
			SupplierID,
			FromDate,
			ToDate,
			CategoryID,
			ItemID
			 ,FilterQuery
        }

	};
	return await request(config);
};
//Accounts/Customer/1/Purchases
export const SUPPLIERIES = async () => {
	let config = {
		method: "post",
		url: `/Accounts/Customer/-1/Purchases`,
	};
	return await request(config);
};
