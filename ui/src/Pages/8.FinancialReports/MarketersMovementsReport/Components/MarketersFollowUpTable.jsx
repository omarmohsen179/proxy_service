import React, { useRef } from "react";
import MasterTable from "../../../../Components/SharedComponents/Tables Components/MasterTable";
import { GET_AGENTS_TRANSACTIONS_REPORT } from "../API.MarketersMovementsReport";

const MarketersFollowUpTable = ({ apiPayload }) => {
  const colAttributes = useRef([
    { field: "num", caption: "الرقم", captionEn: "Number" },
    { field: "name", caption: "اسم المسوق", captionEn: "Markter Name " },
    {
      field: "mbe",
      caption: "المبيعات",
      captionEn: "Salles",
      cssClass: "redCell",
    },
    {
      field: "egb",
      caption: "قبض",
      captionEn: "Recive",
      cssClass: "greenCell",
    },
    { field: "edf", caption: "دفع", captionEn: "Payment", cssClass: "redCell" },
    {
      field: "rmb",
      caption: "ارجاعات بيع",
      captionEn: "sale returns",
      cssClass: "greenCell",
    },
    { field: "tas", caption: "تسوية", captionEn: "", cssClass: "greenCell" },
    {
      field: "safi",
      caption: "صافي المبيع",
      captionEn: "net sales",
      cssClass: "redCell",
    },
    {
      field: "nesba",
      caption: "حصة المسوق",
      captionEn: "share marketer",
      cssClass: "greenCell",
    },
  ]);

  return (
    <>
      <MasterTable
        remoteOperations={apiPayload.FromDate ? true : false}
        apiPayload={apiPayload}
        apiMethod={GET_AGENTS_TRANSACTIONS_REPORT}
        columnChooser={false}
        colAttributes={colAttributes.current}
        height={"300px"}
      />
    </>
  );
};

export default MarketersFollowUpTable;
