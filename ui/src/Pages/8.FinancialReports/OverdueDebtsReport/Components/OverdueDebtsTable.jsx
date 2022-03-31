import React, { useRef } from "react";
import MasterTable from "../../../../Components/SharedComponents/Tables Components/MasterTable";
import { GET_LATE_DEBITS_REPORT } from "../API.OverdueDebtsReport";

const OverdueDebtsTable = ({ apiPayload, handleDoubleClick }) => {
  const colAttributes = useRef([
    {
      caption: "الرقم",
      captionEn: "Number",
      field: "docno",
    },
    {
      caption: "الاسم",
      captionEn: "Name",
      field: "s_name",
    },
    {
      caption: "مدة الدين",
      captionEn: "Duration Of Debt",
      field: "den_date",
    },
    {
      caption: "الاجمالي",
      field: "mden",
      captionEn: "Total",
      cssClass: "redCell",
    },
    {
      caption: "دين الفترة",
      field: "daen",
      captionEn: "Period Debt",
      cssClass: "greenCell",
    },
    {
      caption: "الهاتف",
      captionEn: "Phone Number",
      field: "tel",
    },
  ]);

  const tableSummary = useRef([
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
  ]);
  return (
    <>
      <MasterTable
        columnChooser={false}
        colAttributes={colAttributes.current}
        height={"300px"}
        remoteOperations={apiPayload.AccountType ? true : false}
        allowExcel
        filterRow
        apiMethod={GET_LATE_DEBITS_REPORT}
        apiPayload={apiPayload}
        summaryItems={tableSummary.current}
        onRowDoubleClick={handleDoubleClick}
      />
    </>
  );
};
export default React.memo(OverdueDebtsTable);
