import React from "react";
import MasterTable from "../MasterTable";
import { GET_REPORT_ITEM_TRANSACTIONS } from "./API.ItemTransactionsTable";

export const ItemTransactionsTable = React.memo(
  ({ itemTransactionsPayload }) => {
    let transactionsColAttributes = [
      {
        field: "docno",
        caption: "رقم العملية",
        captionEn: "Transaction Number",
      },
      {
        field: "mvType",
        caption: "نوع العملية",
        captionEn: "Transaction Type",
      },
      { field: "DateMv", caption: "التاريخ", captionEn: "Date" },
      { field: "bean", caption: "البيان", captionEn: "Statment" },
      { field: "kmea", caption: "الكمية", captionEn: "Quantity" },
      { field: "bal", caption: "الرصيد", captionEn: "Balance" },
      { field: "price", caption: "السعر", captionEn: "Price" },
    ];
    return (
      <>
        <MasterTable
          columnChooser={false}
          height={"300px"}
          width={"100%"}
          apiMethod={
            itemTransactionsPayload.itemId ? GET_REPORT_ITEM_TRANSACTIONS : null
          }
          apiPayload={itemTransactionsPayload}
          remoteOperations={itemTransactionsPayload.itemId ? true : false}
          colAttributes={transactionsColAttributes}
        />
      </>
    );
  }
);
