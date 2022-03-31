import { t } from "i18next";
import React, { useRef } from "react";
import { useTranslation } from "react-i18next";
import MasterTable from "../../../../Components/SharedComponents/Tables Components/MasterTable";
import { GET_SALES_PROFITS_REPORT } from "../API.ProfitsReport";

const ProfitsTable = ({ apiPayload }) => {
  const { t, i18n } = useTranslation();
  const colAttributes = useRef([
    { field: "saler_no", caption: "رقم الحساب", captionEn: "Account Number" },
    { field: "name", caption: "اسم الحساب", captionEn: "Account Name" },
    {
      field: "rbh",
      caption: "الربح",
      captionEn: "profit",
      cssClass: "greenCell",
    },
  ]);

  const tableSummary = useRef([
    {
      column: "rbh",
      summaryType: "sum",
      valueFormat: "currency",
      cssClass: "summaryNetSum",
      showInColumn: "rbh",
      customizeText: (data) => {
        return t("Total") + ` : ${data.value} `;
      },
    },
  ]);

  return (
    <>
      <MasterTable
        filterRow
        remoteOperations={apiPayload.FromDate ? true : false}
        apiPayload={apiPayload}
        apiMethod={GET_SALES_PROFITS_REPORT}
        columnChooser={false}
        colAttributes={colAttributes.current}
        height={"300px"}
        summaryItems={tableSummary.current}
      />
    </>
  );
};

export default ProfitsTable;
