import React, { useRef } from "react";
import { useTranslation } from "react-i18next";
import MasterTable from "../../../../Components/SharedComponents/Tables Components/MasterTable";
import { GET_ITEMS_PROFITS_REPORT } from "../API.ProfitsReport";

const ItemsProfitsTable = ({ apiPayload }) => {
  const { t, i18n } = useTranslation();
  const colAttributes = useRef([
    { field: "item_no", caption: "رقم الصنف", captionEn: "Number" },
    { field: "item_name", caption: "اسم الصنف", captionEn: "Name" },
    {
      field: "rbh",
      caption: "الربح",
      captionEn: "Profit",
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
        return t("Total") + `: ${data.value} `;
      },
    },
  ]);

  return (
    <>
      <MasterTable
        filterRow
        remoteOperations={apiPayload.FromDate ? true : false}
        apiPayload={apiPayload}
        apiMethod={GET_ITEMS_PROFITS_REPORT}
        columnChooser={false}
        colAttributes={colAttributes.current}
        height={"300px"}
        summaryItems={tableSummary.current}
      />
    </>
  );
};

export default ItemsProfitsTable;
