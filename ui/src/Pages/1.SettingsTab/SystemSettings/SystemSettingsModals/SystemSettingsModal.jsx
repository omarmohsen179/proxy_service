import React from "react";
import { useTranslation } from "react-i18next";
import { CheckBox } from "../../../../Components/Inputs";

function SystemSettingsModal(props) {
  const { data, onHandleChange } = props;
  const { t, i18n } = useTranslation();
  return (
    <div className="row">
      {/* 1 */}

      <CheckBox
        label={t("ceramic work")}
        value={data["Work_with_Seramik"]}
        name="Work_with_Seramik"
        handleChange={onHandleChange}
      />
      {/* 2 */}
      <CheckBox
        label={t("Cancellation of additional packaging")}
        value={data["Cancel_box"]}
        name="Cancel_box"
        handleChange={onHandleChange}
      />
      {/* 3 */}
      <CheckBox
        label={t("Fixing the market in receipts")}
        value={data["mosawiq_defolt"]}
        name="mosawiq_defolt"
        handleChange={onHandleChange}
      />
      {/* 4 */}
      <CheckBox
        label={t("Working with the expanded screen for items")}
        value={data["big_showitems"]}
        name="big_showitems"
        handleChange={onHandleChange}
      />
      {/* 5 */}
      <CheckBox
        label={t("Standard Unification")}
        value={data["unification_items"]}
        name="unification_items"
        handleChange={onHandleChange}
      />
      {/* 6 */}
      <CheckBox
        label={t("Unite customers")}
        value={data["unification_cust"]}
        name="unification_cust"
        handleChange={onHandleChange}
      />
      {/* 7 */}
      <CheckBox
        label={t("Unite Stores")}
        value={data["unification_kaz"]}
        name="unification_kaz"
        handleChange={onHandleChange}
      />
      {/* 8 */}
      <CheckBox
        label={t("Fast Sell")}
        value={data["Quick_sale"]}
        name="Quick_sale"
        handleChange={onHandleChange}
      />
      {/* 9 */}
      <CheckBox
        label={t("Suspension work")}
        value={data["Approval_work"]}
        name="Approval_work"
        handleChange={onHandleChange}
      />
      {/* 10 */}
      <CheckBox
        label={t("Change the writing")}
        value={data["Writing_change"]}
        name="Writing_change"
        handleChange={onHandleChange}
      />
      {/* 11 */}
      <CheckBox
        label={t("print part number")}
        value={data["print_code_no"]}
        name="print_code_no"
        handleChange={onHandleChange}
      />
    </div>
  );
}

export default React.memo(SystemSettingsModal);
