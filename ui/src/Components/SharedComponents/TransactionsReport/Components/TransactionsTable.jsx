import React, { useRef } from "react";
import MasterTable from "../../Tables Components/MasterTable";
import { GET_ACCOUNT_TRANSACTIONS } from "../API.TransactionsReport";

const TransactionsTable = ({ apiPayload }) => {
  const colAttributes = useRef([
    { field: "docno", caption: "الرقم" },
    { field: "mvType", caption: "نوع العملية" },
    { field: "DateMv", caption: "التاريخ" },
    {
      field: "mden",
      caption: "مدين",
      cssClass: "redCell",
    },
    { field: "daen", caption: "دائن", cssClass: "greenCell" },
    { field: "bal", caption: "الرصيد" },
    { field: "nots", caption: "ملاحظات" },
  ]);

  const tableSummary = useRef([
    {
      column: "daen",
      summaryType: "sum",
      valueFormat: "currency",
      cssClass: "summaryNetSum",
      showInColumn: "daen",
      customizeText: (data) => {
        return `${data.value ?? 0} `;
      },
    },
    {
      column: "mden",
      summaryType: "sum",
      valueFormat: "currency",
      cssClass: "summaryNetSum",
      showInColumn: "mden",
      customizeText: (data) => {
        return `${data.value ?? 0} `;
      },
    },
  ]);

  return (
    <>
      <MasterTable
        key="transactionsTable"
        remoteOperations={apiPayload.MemberID >= 0 ? true : false}
        apiPayload={apiPayload}
        apiMethod={GET_ACCOUNT_TRANSACTIONS}
        columnChooser={false}
        colAttributes={colAttributes.current}
        height={"400px"}
        summaryItems={tableSummary.current}
      />
    </>
  );
};

export default React.memo(TransactionsTable);
