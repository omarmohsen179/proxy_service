import React, { useRef } from "react";
import MasterTable from "../../../../Components/SharedComponents/Tables Components/MasterTable";
import { GET_AGENTS_SALES_TRANSACTIONS_REPORT } from "../API.MarketersMovementsReport";

const AgentsSalesTable = ({ apiPayload }) => {
  const colAttributes = useRef([
    { field: "item_no", caption: "رقم الصنف", captionEn: "Number" },
    { field: "name", caption: "اسم الصنف", captionEn: "Name" },
    {
      field: "tottal_qunt",
      caption: "الكمية",
      captionEn: "Quantity",
      cssClass: "greenCell",
    },
    {
      field: "tottal_price",
      caption: "اجمالي المبيعات",
      captionEn: "Total sales",
      cssClass: "greenCell",
    },
    {
      field: "tottal_qunt_1",
      caption: "حصة المسوق",
      captionEn: "share marketer",
      cssClass: "redCell",
    },
  ]);

  const tableSummary = useRef([
    {
      column: "tottal_price",
      summaryType: "sum",
      valueFormat: "currency",
      cssClass: "summaryNetSum",
      showInColumn: "tottal_price",
      customizeText: (data) => {
        return `${data.value ?? 0} `;
      },
    },
    {
      column: "tottal_qunt_1",
      summaryType: "sum",
      valueFormat: "currency",
      cssClass: "summaryNetSum",
      showInColumn: "tottal_qunt_1",
      customizeText: (data) => {
        return `${data.value ?? 0} `;
      },
    },
  ]);

  return (
    <>
      <MasterTable
        remoteOperations={apiPayload.FromDate ? true : false}
        apiPayload={apiPayload}
        apiMethod={GET_AGENTS_SALES_TRANSACTIONS_REPORT}
        columnChooser={false}
        colAttributes={colAttributes.current}
        height={"300px"}
        summaryItems={tableSummary.current}
      />
    </>
  );
};

export default AgentsSalesTable;
