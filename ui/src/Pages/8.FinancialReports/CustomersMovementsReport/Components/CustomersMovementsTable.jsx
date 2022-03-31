import React, { useRef } from "react";
import MasterTable from "../../../../Components/SharedComponents/Tables Components/MasterTable";
import { GET_CUSTOMERS_TRANSACTIONS } from "../API.CustomersMovementsReport";

const CustomersMovementsTable = ({ apiPayload, handleDoubleClick }) => {
  const colAttributes = useRef([
    { field: "s_no", caption: "الرقم", captionEn: "Number" },
    { field: "s_name", caption: " الحساب", captionEn: "Account" },
    { field: "m", caption: "المنقول", captionEn: "movable" },
    {
      field: "mbe",
      caption: "مبيعات",
      cssClass: "redCell",
      captionEn: "sales",
    },
    {
      field: "msh",
      caption: "مشتريات",
      cssClass: "greenCell",
      captionEn: "purchases",
    },
    {
      field: "rmb",
      caption: "ارجاع بيع",
      cssClass: "greenCell",
      captionEn: "return sale",
    },
    {
      field: "rsh",
      caption: "ارجاع شراء",
      cssClass: "redCell",
      captionEn: "return purchase",
    },
    {
      field: "edf",
      caption: "دائن",
      cssClass: "greenCell",
      captionEn: "Creditor",
    },
    { field: "egb", caption: "مدين", cssClass: "redCell", captionEn: "Debit" },
    { field: "egmaly", caption: "الأجمالي", captionEn: "Total" },
  ]);

  const tableSummary = useRef([
    {
      column: "m",
      summaryType: "sum",
      valueFormat: "currency",
      cssClass: "summaryNetSum",
      showInColumn: "m",
      customizeText: (data) => {
        return `${data.value}`;
      },
    },
    {
      column: "mbe",
      summaryType: "sum",
      valueFormat: "currency",
      cssClass: "summaryNetSum",
      showInColumn: "mbe",
      customizeText: (data) => {
        return `${data.value}`;
      },
    },
    {
      column: "msh",
      summaryType: "sum",
      valueFormat: "currency",
      cssClass: "summaryNetSum",
      showInColumn: "msh",
      customizeText: (data) => {
        return `${data.value}`;
      },
    },
    {
      column: "rmb",
      summaryType: "sum",
      valueFormat: "currency",
      cssClass: "summaryNetSum",
      showInColumn: "rmb",
      customizeText: (data) => {
        return `${data.value}`;
      },
    },
    {
      column: "rsh",
      summaryType: "sum",
      valueFormat: "currency",
      cssClass: "summaryNetSum",
      showInColumn: "rsh",
      customizeText: (data) => {
        return `${data.value}`;
      },
    },
    {
      column: "edf",
      summaryType: "sum",
      valueFormat: "currency",
      cssClass: "summaryNetSum",
      showInColumn: "edf",
      customizeText: (data) => {
        return `${data.value}`;
      },
    },
    {
      column: "egb",
      summaryType: "sum",
      valueFormat: "currency",
      cssClass: "summaryNetSum",
      showInColumn: "egb",
      customizeText: (data) => {
        return `${data.value}`;
      },
    },
    {
      column: "egmaly",
      summaryType: "sum",
      valueFormat: "currency",
      cssClass: "summaryNetSum",
      showInColumn: "egmaly",
      customizeText: (data) => {
        return `${data.value}`;
      },
    },
  ]);

  return (
    <>
      <MasterTable
        filterRow
        remoteOperations={apiPayload.FromDate ? true : false}
        apiPayload={apiPayload}
        apiMethod={GET_CUSTOMERS_TRANSACTIONS}
        columnChooser={false}
        colAttributes={colAttributes.current}
        height={"300px"}
        summaryItems={tableSummary.current}
        onRowDoubleClick={handleDoubleClick}
      />
    </>
  );
};

export default React.memo(CustomersMovementsTable);
