import React, { useRef } from "react";
import { useTranslation } from "react-i18next";
import MasterTable from "../../../../Components/SharedComponents/Tables Components/MasterTable";
import { GET_STAFF_FINANCIAL } from "../API.StaffAccountsReport";

const StaffAccountsTable = ({ apiPayload, handleDoubleClick }) => {
  const { t, i18n } = useTranslation();
  const colAttributes = useRef([
    { field: "docno", caption: "الرقم", captionEn: "Number" },
    { field: "s_name", caption: "الاسم", captionEn: "Name" },
    {
      field: "mden",
      caption: "مدين",
      captionEn: "Debit",
      cssClass: "redCell",
    },
    {
      field: "daen",
      caption: "دائن",
      captionEn: "Creditor",
      cssClass: "greenCell",
    },
    { field: "tel", caption: "الهاتف", captionEn: "Phone Number" },
  ]);

  const tableSummary = useRef([
    {
      column: "mden",
      summaryType: "sum",
      valueFormat: "currency",
      cssClass: "summaryNetSum",
      showInColumn: "mden",
      customizeText: (data) => {
        return t("Total") + ` : ${data.value ?? 0} `;
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
    {
      column: "tel",
      summaryType: "sum",
      valueFormat: "currency",
      cssClass: "summaryNetSum",
      showInColumn: "tel",
      customizeText: (data) => {
        return ` = ${data.value ?? 0} `;
      },
    },
  ]);

  return (
    <>
      <MasterTable
        filterRow
        remoteOperations={apiPayload.StaffCategoryID >= 0 ? true : false}
        apiPayload={apiPayload}
        apiMethod={GET_STAFF_FINANCIAL}
        columnChooser={false}
        colAttributes={colAttributes.current}
        height={"300px"}
        summaryItems={tableSummary.current}
        onRowDoubleClick={handleDoubleClick}
      />
    </>
  );
};

export default React.memo(StaffAccountsTable);
