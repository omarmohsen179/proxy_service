import React from "react";
import ButtonRow from "../../Components/SharedComponents/buttonsRow";
import Bill from "../../Components/SharedComponents/Bill";
import BillHeader from "../../Components/SharedComponents/BillHeader";
import { useTranslation } from "react-i18next";

function DebitAccountSettlement() {
  return (
    <>
      <div className="container p-5" style={{ minHeight: "100px" }}>
        <BillHeader billTitle={"Reconciliation of a debit account"} />
        <Bill billTitle={"تسوية حساب مدين"} isType={false} />
      </div>
    </>
  );
}

export default DebitAccountSettlement;
