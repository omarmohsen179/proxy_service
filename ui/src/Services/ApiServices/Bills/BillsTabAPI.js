import { request } from "../../CallAPI";
import TransactionName from "../../ApiServices/TransactionName.js";

const { TransationsList } = TransactionName;

// Gets main parts data "الطرف الأول - الطرف التاني " depending on page name "إيصال قبض، سند صرف"
// TransactionName : name of page like : إيصال قبض ...etc
// We get "moaamla_id" from this which is the id of the page name
export const TRANSACTION_TYPE = async (TransactionName, LanguageID) => {
  // console.log(["TransactionName", TransactionName]);

  let config = {
    method: "post",
    url: `/TransactionType/${TransationsList[TransactionName]}/${LanguageID}`,
  };
  return await request(config);
};

// Get edit list depending on page name
// TransactionType: moaamla_id
export const TRANSACTIONS_DATA = async (TransactionType) => {
  let config = {
    method: "post",
    url: `/Transactions/${TransactionType}`,
  };
  return await request(config);
};

// Gets first and second parts data طرف أول أو طرف تاني
// StaffAccount : this is the value of mosaaeq_id رقم الهوية الخاص بالمسوق
// الذي يتحدد بناء على الدروب داون ليست الخاصة بالمسوق
// AccountType: Index of the dropdown list of first or second parts
export const TRANSACTIONS_PARTS_DATA = async (StaffAccount, AccountsType) => {
  let config = {
    method: "post",
    url: `/TransactionAccounts/${StaffAccount}/${AccountsType}`,
  };
  return await request(config);
};

// Get Next Number
// TransactionType: moaamla_id
export const TRANSACTIONS_NUMBER = async (TransactionType) => {
  let config = {
    method: "post",
    url: `/TransactionNextNumber/${TransactionType}`,
  };
  return await request(config);
};

// Check Next Number
export const VAIDATE_NEXT_NUMBER = async (TransactionType, Data) => {
  let config = {
    method: "post",
    url: `/CheckTransactionData/${TransactionType}`,
    data: Data,
  };
  return await request(config);
};

// Insert and update
export const INSERT_UPDATE = async (TransactionName, Data) => {
  let config = {
    method: "post",
    url: `/TransactionTransactions/${TransationsList[TransactionName]}`,
    data: Data,
  };
  return await request(config);
};

// Delete item
export const DELETE_TRANSACTION = async (TransactionName, TransactionID) => {
  let config = {
    method: "post",
    url: `/DeleteTransactions/${TransationsList[TransactionName]}/${TransactionID}`,
  };
  return await request(config);
};

// Invoice section

export const INVOICE_CAPTURE_RECEIPT = async (
  TransactionName,
  CasherID,
  ClientID
) => {
  let config = {
    method: "post",
    url: `/InvoiceWithTransaction/${TransationsList[TransactionName]}/${CasherID}/${ClientID}`,
  };
  return await request(config);
};
