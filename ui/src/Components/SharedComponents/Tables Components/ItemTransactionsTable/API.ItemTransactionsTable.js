import { request } from "../../../../Services/CallAPI";

export const GET_REPORT_ITEM_TRANSACTIONS = async ({
	itemId,
	skip,
	take,
	storeID = "0",
	fromDate = "01/01/2010",
	toDate = "01/01/2050",
}) => {
	let config = {
		method: "post",
		url: `/ReportAboutItemTransactions`,
		data: {
			FromDate: fromDate,
			ToDate: toDate,
			skip,
			take,
			StoreID: storeID,
			InputQuantity: 0,
			ItemID: itemId,
		},
	};

	return await request(config);
};
