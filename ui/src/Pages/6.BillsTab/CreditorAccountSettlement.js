import React from "react";
import ButtonRow from "../../Components/SharedComponents/buttonsRow";
import Bill from "../../Components/SharedComponents/Bill";
import BillHeader from "../../Components/SharedComponents/BillHeader";
import { useTranslation } from "react-i18next";

function CreditorAccountSettlement() {
  const { t, i18n } = useTranslation();

  return (
    <>
      <div className="container p-5" style={{ minHeight: "100px" }}>
        <BillHeader billTitle={"credit account settlement"} />
        <Bill billTitle={"تسوية حساب دائن"} isType={false} />
      </div>
    </>
  );
}

export default CreditorAccountSettlement;
