import React from "react";
import MasterTable from "../SharedComponents/Tables Components/MasterTable";
import {
  GET_CUSTOMER_LAST_TRANSACTION,
  GET_REPORT_ITEM_STORES_QUANTITY,
  GET_REPORT_ITEM_TRANSACTIONS,
} from "../../Services/ApiServices/General/ReportsAPI";

export const ItemsTable = React.memo(
  ({
    dataSource,
    rowDoubleClickHandle,
    rowRemovingHandle,
    discount = 0,
    disabled,
  }) => {
    const itemColAttributes = [
      {
        field: "m_name",
        caption: "المخزن",
      },
      {
        field: "item_no",
        caption: "رقم الصنف",
        alignment: "center",
      },
      { field: "item_name", caption: "اسم الصنف" },
      { field: "code_no", caption: "رقم القطعة" },
      { field: "kmea", caption: "الكمية" },
      { field: "price", caption: "السعر", format: "currency" },
      {
        field: "TotalAfterDiscount",
        caption: "الإجمالي بعد الخصم",
        format: "currency",
      },
    ];
    const itemSummaryItems = [
      {
        column: "TotalAfterDiscount",
        summaryType: "sum",
        valueFormat: "currency",
        cssClass: "summaryNetSum",
        showInColumn: "TotalAfterDiscount",
        customizeText: (data) => {
          return `المجموع: ${data.value} `;
        },
      },
      {
        column: "TotalAfterDiscount",
        summaryType: "sum",
        valueFormat: "currency",
        cssClass: "summaryNetSum",
        showInColumn: "TotalAfterDiscount",
        customizeText: (data) => {
          return `الخصم:  ${discount}    `;
        },
      },
      {
        column: "TotalAfterDiscount",
        summaryType: "sum",
        valueFormat: "currency",
        cssClass: "summaryNetSum",
        showInColumn: "TotalAfterDiscount",
        customizeText: (data) => {
          let value = data.value - discount;

          return `الصافي: ${value} `;
        },
      },
    ];

    return (
      <>
        <MasterTable
          disabled={disabled}
          allowDelete
          allowExcel
          dataSource={dataSource}
          colAttributes={itemColAttributes}
          summaryItems={itemSummaryItems}
          onRowDoubleClick={rowDoubleClickHandle}
          onRowRemoving={(e) => rowRemovingHandle(e)}
        />
      </>
    );
  }
);

export const ItemTransactionsTable = React.memo(
  ({ itemTransactionsPayload }) => {
    let transactionsColAttributes = [
      { field: "docno", caption: "رقم العملية" },
      { field: "mvType", caption: "نوع العملية" },
      { field: "DateMv", caption: "التاريخ" },
      { field: "bean", caption: "البيان" },
      { field: "kmea", caption: "الكمية" },
      { field: "bal", caption: "الرصيد" },
      { field: "price", caption: "السعر" },
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

export const ItemsStorageQuantityTable = React.memo(({ dataSource }) => {
  let storageQuantityColAttributes = [
    { field: "m_name", caption: "المخزن" },
    { field: "kmea", caption: "الكمية" },
  ];
  return (
    <MasterTable
      dataSource={dataSource}
      height={"300px"}
      columnChooser={false}
      colAttributes={storageQuantityColAttributes}
    />
  );
});
