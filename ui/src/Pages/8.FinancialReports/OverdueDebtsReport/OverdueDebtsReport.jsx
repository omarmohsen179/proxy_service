import { debounce } from "lodash";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { NumberBox, SelectBox } from "../../../Components/Inputs";
import { GET_CLASSIFICATIONS } from "../../../Services/ApiServices/General/ReportsAPI";
import { GET_CASHIERS } from "../../../Templetes/Invoice/Components/InvoiceInformation/API.InvoiceInformation";
import MovementSheet from "../../FinancialReports/DebtsStatement/MovementSheet";
import OverdueDebtsTable from "./Components/OverdueDebtsTable";

const OverdueDebtsReport = () => {
  const [cashiers, setCashiers] = useState([]);
  const { t, i18n } = useTranslation();
  const [selectedCashierId, setSelectedCashierId] = useState(0);

  const [categories, setCategories] = useState([]);

  const [selectedCategoryId, setSelectedCategoryId] = useState();

  const [debtDuration, setDebtDuration] = useState(7);

  const [movementSheetHeaderData, setMovementSheetHeaderData] = useState({});

  const [popupVisibility, setPopupVisibility] = useState(false);

  let handlePopupVisibility = useCallback(() => {
    setPopupVisibility((prev) => !prev);
  }, []);

  let handleDoubleClick = useCallback((e) => {
    let { s_no, s_name, mden1, daen1, tel } = e.data;
    setMovementSheetHeaderData({
      s_no,
      s_name,
      daen: daen1,
      mden: mden1,
      tel,
    });
    setPopupVisibility((prev) => !prev);
  }, []);

  useEffect(() => {
    GET_CASHIERS().then((cashiers) => {
      setCashiers([{ id: 0, name: t("All") }, ...cashiers]);
    });
    GET_CLASSIFICATIONS().then((response) => {
      setCategories([...response]);
    });
  }, []);

  const apiPayload = useMemo(() => {
    return {
      AccountType: selectedCategoryId,
      DebitTimeRange: debtDuration,
      AgentID: selectedCashierId,
    };
  }, [debtDuration, selectedCashierId, selectedCategoryId]);

  return (
    <>
      <MovementSheet
        popupVisibility={popupVisibility}
        handlePopupVisibility={handlePopupVisibility}
        title="كشف حركة"
        headerData={movementSheetHeaderData}
      />
      <h1 className="invoiceName">{t("Overdue debt disclosure")}</h1>
      <div className="container-xxl rtlContainer mb-3">
        <div className="card p-3">
          <div className="row">
            <div className="col-4">
              <SelectBox
                label={t("Categorize")}
                dataSource={categories}
                value={selectedCategoryId}
                handleChange={(e) => setSelectedCategoryId(e.value)}
                keys={{ id: "class", name: "class" }}
                name="typ_id"
              />
            </div>
            <div className="col-4">
              <SelectBox
                label={t("marketer")}
                dataSource={cashiers}
                name="mosweq_id"
                value={selectedCashierId}
                handleChange={(e) => setSelectedCashierId(e.value)}
              />
            </div>
            <div className="col-4">
              <NumberBox
                required={false}
                label={t("duration of debt")}
                value={debtDuration ?? 0}
                name="debtDuration"
                handleChange={debounce((e) => setDebtDuration(e.value), 500)}
              />
            </div>
          </div>

          <div className="row">
            <OverdueDebtsTable
              apiPayload={apiPayload}
              handleDoubleClick={handleDoubleClick}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default OverdueDebtsReport;
