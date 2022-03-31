import { request } from "../../Services/CallAPI";
import TransationsName from "../../Services/ApiServices/TransactionName";

const { TransationsList } = TransationsName;

export const GET_RECEIPT_NUMBER = async (transactionCode) => {
    let config = {
        method: "post",
        url: `/OtherTransactionNextNumber/${transactionCode}`,
    };

    return await request(config);
};

export const GET_RECEIPT_CODE = async (TransactionName) => {
    console.log(TransactionName, TransationsList, TransationsList["شراء أصول"])
    let config = {
        method: "post",
        url: `/OtherTransactionType/${TransationsList[TransactionName]}`,
    };

    return await request(config);
};

export const GET_RECEIPT_ACCOUNTS = async (receiptId, transactionCode, accountType) => {
    let config = {
        method: "post",
        url: `/OtherTransactionAccounts/${receiptId}/${transactionCode}/${accountType}`,
    };

    return await request(config);
};


// Data: [
// {
//     ID: bill.id,
//     Receipt : bill
//     ReceiptTransactions: [{ ...item }, ...],
//   },
// ],
export const GET_RECEIPT_TRANSACTIONS = async (transactionCode, data) => {
    let config = {
        method: "post",
        url: `/OtherTransactionTransactions/${transactionCode}`,
        data: {
            ...data
        }
    };

    return await request(config);
};

export const GET_REPORT = async () => {
    let config = {
        method: "post",
        url: `/OtherTransactionTransactions`,
    };

    return await request(config);
};

export const DELETE_RECEIPT_TRANSACTION = async ({ transactionCode, transactionId, transactionTransactionId }) => {
    let config = {
        method: "post",
        url: `/DeleteOtherTransactionTransaction/${transactionCode}/${transactionId}/${transactionTransactionId}`,
    };

    return await request(config);
};


export const GET_SPECIFIC_RECEIPT_TRANSACTIONS = async ({ transactionCode, transactionId }) => {
    let config = {
        method: "post",
        url: `/OtherTransactionTransactions/${transactionCode}/${transactionId}`,
    };

    return await request(config);
};
