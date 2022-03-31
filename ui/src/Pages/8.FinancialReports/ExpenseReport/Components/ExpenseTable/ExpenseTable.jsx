import React, { useRef } from "react";
import MasterTable from "../../../../../Components/SharedComponents/Tables Components/MasterTable";

const ExpenseTable = ({ data }) => {
  const colAttributes = useRef([
    { field: "num", caption: "رقم " },
    { field: "dte", caption: "التاريخ" },
    { field: "description", caption: "الحساب", grouped: true, groupIndex: 1 },
    { field: "kema", caption: "القيمة", cssClass: "redCell" },
    { field: "nots", caption: "ملاحظات" },
  ]);
  const tableSummary = useRef([
    {
      column: "kema",
      summaryType: "sum",
      valueFormat: "currency",
      cssClass: "summaryNetSum",
      showInColumn: "kema",
      customizeText: (data) => {
        return `الاجمالي: ${data.value} `;
      },
    },
  ]);

  const tableGroupSummary = useRef([
    {
      column: "kema",
      summaryType: "sum",
      showInGroupFooter: false,
      displayFormat: "الاجمالي: {0}",
      alignByColumn: true,
      showInColumn: "kema",
    },
  ]);

  return (
    <>
      <MasterTable
        allowExcel
        dataSource={data}
        columnChooser={false}
        colAttributes={colAttributes.current}
        height={"300px"}
        summaryItems={tableSummary.current}
        tableGroupSummary={tableGroupSummary.current}
      />
    </>
  );
};

export default ExpenseTable;
