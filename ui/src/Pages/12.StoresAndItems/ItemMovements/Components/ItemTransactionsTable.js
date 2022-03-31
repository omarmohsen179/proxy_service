import React from "react";
import MasterTable from "../../../../Components/SharedComponents/Tables Components/MasterTable";
//'../../Components/SharedComponents/Tables Components/MasterTable';

const ItemTransactionsTable = React.memo(({ apiPayload, API }) => {
  let transactionsColAttributes = [
    { field: "docno", caption: "رقم العملية", captionEn: "Transacion Number" },
    { field: "mvType", caption: "نوع العملية", captionEn: "Transaction Type" },
    { field: "DateMv", caption: "التاريخ", captionEn: "Date" },
    { field: "bean", caption: "البيان", captionEn: "Statement" },
    { field: "kmea", caption: "الكمية", captionEn: "Quantity" },
    { field: "bal", caption: "الرصيد", captionEn: "Balance" },
    { field: "price", caption: "السعر", captionEn: "Price" },
    { field: "kema", caption: "القيمه", captionEn: "Value" },
    { field: "nots", caption: "ملاحظات", captionEn: "Note" },
  ];

  return (
    <>
      <MasterTable
        columnChooser={false}
        height={"300px"}
        width={"100%"}
        remoteOperations
        apiMethod={API}
        apiPayload={apiPayload}
        colAttributes={transactionsColAttributes}
      />
    </>
  );
});

export default ItemTransactionsTable;
