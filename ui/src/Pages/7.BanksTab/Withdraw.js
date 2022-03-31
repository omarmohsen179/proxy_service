import React from "react";
import ButtonRow from "../../Components/SharedComponents/buttonsRow";
import Bill from "../../Components/SharedComponents/Bill";
import BillHeader from "../../Components/SharedComponents/BillHeader";
import { useTranslation } from "react-i18next";
function Withdraw() {
  const { t, i18n } = useTranslation();
  return (
    <>
      <div className="container p-5" style={{ minHeight: "100px" }}>
        <BillHeader billTitle={t("Withdraw")} />
        <Bill billTitle={"سحب"} isType={false} />
      </div>
    </>
  );
}

export default Withdraw;
