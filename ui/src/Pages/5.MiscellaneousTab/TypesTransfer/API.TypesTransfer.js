import { request } from "../../../Services/CallAPI";

export const GET_NEXT_NUMBER = async () => {
  let config = {
    method: "post",
    url: `/TransportItemsInvoiceNextNumber`,
  };
  return await request(config);
};

export const GET_FROM_TO_STORAGE = async (FromToStoreID) => {
  let config = {
    method: "post",
    url: `/CashierStoresWithOutStore/${FromToStoreID}`,
  };

  return await request(config);
};

export const GET_EDIT_DELETE_DATA = async ({
  data,
  skip,
  take,
  FilterQuery,
}) => {
  let config = {
    method: "post",
    url: `/TransportItemsInvoices`,
    data: { ...data, skip, take, FilterQuery },
  };
  return await request(config);
};

export const GET_EDIT_DATA_TABLE_SOURCE = async (TransportItemsInvoiceID) => {
  let config = {
    method: "post",
    url: `/TransportItemsInvoiceItems/${TransportItemsInvoiceID}`,
  };

  return await request(config);
};

export const DELETE_TRANSACTION = async (TransportItemsInvoiceID) => {
  let config = {
    method: "post",
    url: `/DeleteTransportItemsInvoice/${TransportItemsInvoiceID}`,
  };

  return await request(config);
};

export const DELETE_TRANSACTION_ITEM = async (
  TransportItemsInvoiceID,
  TransportItemsInvoiceItemID
) => {
  let config = {
    method: "post",
    url: `/DeleteTransportItemsInvoiceItem/${TransportItemsInvoiceID}/${TransportItemsInvoiceItemID}`,
  };

  return await request(config);
};

export const SUBMIT_DATA = async (data) => {
  let config = {
    method: "post",
    url: `/TransportItemsInvoiceTransactions`,
    data: data,
  };

  return await request(config);
};
