import { request } from "../../../Services/CallAPI";

export const GET_HAND_HELD_INVOICES = async (InvoiceType) => {
	let config = {
		method: "post",
		url: `/HandHeldInvoices/${InvoiceType}`,
	};
	return await request(config);
};

export const GET_HAND_HELD_INVOICES_ITEMS = async (InvoiceID) => {
	let config = {
		method: "post",
		url: `/HandHeldInvoiceItems/${InvoiceID}`,
	};
	return await request(config);
};

export const IMPORT_FROM_HAND_HELD = async (InvoiceType, data) => {
	let config = {
		method: "post",
		url: `/ImportFromHandHeldInvoicesToShopInvoices/${InvoiceType}`,
		data: data,
	};
	return await request(config);
};
