import React, { useState, useEffect, useCallback } from "react";
import { Button, CheckBox, DateBox } from "devextreme-react";
import { NumberBox, SelectBox, TextBox } from "../../../Components/Inputs";
import debounce from "lodash.debounce";
import SellingMistakesTable from "./Components/SellingMistakesTable";
import { useTranslation } from "react-i18next";

const SellingMistakesReport = () => {
  const [fromDate, setFromDate] = useState(new Date());
  const { t, i18n } = useTranslation();
  const [toDate, setToDate] = useState(new Date());

  useEffect(() => {
    let date = new Date();
    date.setMonth(date.getMonth() - 1);
    let from = new Date(date);
    setFromDate(from);
  }, []);

  return (
    <>
      <h1 className="invoiceName">{t("Selling errors revealed")}</h1>
      <div className="container-xxl rtlContainer">
        <div className="card p-3">
          <div className="row">
            <div className="col-3">
              <div className="input-wrapper">
                <div className="label">{t("From")}</div>
                <DateBox
                  key="from"
                  name="FromDate"
                  value={fromDate}
                  dateOutOfRangeMessage={t("date past date to")}
                  onValueChanged={(e) => setFromDate(e.value)}
                />
              </div>
            </div>
            <div className="col-3">
              <div className="input-wrapper">
                <div className="label">{t("To")}</div>
                <DateBox
                  key="to"
                  name="ToDate"
                  value={toDate}
                  dateOutOfRangeMessage={t("date past date from")}
                  onValueChanged={(e) => setToDate(e.value)}
                />
              </div>
            </div>
          </div>
          <div className="row py-3">
            <SellingMistakesTable
              apiPayload={{
                ToDate: toDate,
                FromDate: fromDate,
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default SellingMistakesReport;
