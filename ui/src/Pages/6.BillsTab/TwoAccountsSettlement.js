import React from "react";
import ButtonRow from "../../Components/SharedComponents/buttonsRow";
import Bill from "../../Components/SharedComponents/Bill";
import BillHeader from "../../Components/SharedComponents/BillHeader";
import { useTranslation } from "react-i18next";

function TwoAccountsSettlement() {
  return (
    <>
      <div className="container p-5" style={{ minHeight: "100px" }}>
        <BillHeader billTitle={"Settle two accounts"} />
        <Bill billTitle={"تسوية حسابين"} isType={false} />
      </div>
    </>
  );
}

export default TwoAccountsSettlement;
