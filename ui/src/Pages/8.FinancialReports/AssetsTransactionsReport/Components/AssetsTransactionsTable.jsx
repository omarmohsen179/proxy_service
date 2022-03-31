import React, { useRef } from "react";
import { useTranslation } from "react-i18next";
import MasterTable from "../../../../Components/SharedComponents/Tables Components/MasterTable";
import { GET_ASSETS_TRANSACTIONS } from "../API.AssetsTransactionsReport";

const AssetsTransactionsTable = ({ apiPayload }) => {
  const { t, i18n } = useTranslation();
  const colAttributes = useRef([
    { field: "num", caption: "الرقم", captionEn: "Number" },
    { field: "mv_typ", caption: "نوع العملية", captionEn: "Transaction Type" },
    { field: "datee", caption: "التاريخ", captionEn: "Date" },
    {
      field: "mden",
      caption: "مدين",
      captionEn: "Debit",
      cssClass: "redCell",
    },
    {
      field: "daen",
      captionEn: "Creditor",
      caption: "دائن",
      cssClass: "greenCell",
    },
    { field: "nots", caption: "ملاحظات" },
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
  ]);

  return (
    <>
      <MasterTable
        remoteOperations={apiPayload.AssetID >= 0 ? true : false}
        apiPayload={apiPayload}
        apiMethod={GET_ASSETS_TRANSACTIONS}
        columnChooser={false}
        colAttributes={colAttributes.current}
        height={"300px"}
        summaryItems={tableSummary.current}
      />
    </>
  );
};

export default React.memo(AssetsTransactionsTable);
