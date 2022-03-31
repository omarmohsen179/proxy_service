import React from "react";
import ButtonRow from "../../Components/SharedComponents/buttonsRow";
import Bill from "../../Components/SharedComponents/Bill";
import BillHeader from "../../Components/SharedComponents/BillHeader";
import { useTranslation } from "react-i18next";
function EmployeeSpendingTransaction() {
  return (
    <>
      <div className="container p-5" style={{ minHeight: "100px" }}>
        <BillHeader billTitle={"Employee voucher"} />
        <Bill billTitle={"سند صرف لموظف"} isType={false} />
      </div>
    </>
  );
}

export default EmployeeSpendingTransaction;
