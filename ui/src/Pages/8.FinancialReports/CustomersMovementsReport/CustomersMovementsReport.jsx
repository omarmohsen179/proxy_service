import React, { useState, useEffect, useCallback } from "react";
import { Button, CheckBox, DateBox } from "devextreme-react";
import { SelectBox } from "../../../Components/Inputs";
import { GET_CLASSIFICATIONS } from "../../../Services/ApiServices/General/ReportsAPI";
import CustomersMovementsTable from "./Components/CustomersMovementsTable";
import MovementSheet from "../../FinancialReports/DebtsStatement/MovementSheet";
import { useTranslation } from "react-i18next";

const CustomersMovementsReport = () => {
  const [fromDate, setFromDate] = useState();
  const { t, i18n } = useTranslation();
  const [toDate, setToDate] = useState(new Date());

  const [Categories, setCategories] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState("الكـــــــل");

  const [apiPayload, setApiPayload] = useState({});

  const [movementSheetHeaderData, setMovementSheetHeaderData] = useState({});

  const [popupVisibility, setPopupVisibility] = useState(false);

  const showReportHandle = useCallback(() => {
    setApiPayload((prev) => ({
      ...prev,
      FromDate: fromDate,
      ToDate: toDate,
      AccountType: selectedCategory,
    }));
  }, [fromDate, selectedCategory, toDate]);

  let handlePopupVisibility = useCallback(() => {
    setPopupVisibility((prev) => !prev);
  }, []);

  let handleDoubleClick = useCallback((e) => {
    let { id, s_name, daen, mden, tel } = e.data;
    setMovementSheetHeaderData({ s_no: id, s_name, daen, mden, tel });
    setPopupVisibility((prev) => !prev);
  }, []);

  useEffect(() => {
    let date = new Date();
    date.setMonth(date.getMonth() - 1);
    let from = new Date(date);
    setFromDate(from);
    GET_CLASSIFICATIONS().then((response) => {
      setCategories([...response]);
    });
  }, []);

  return (
    <>
      <MovementSheet
        popupVisibility={popupVisibility}
        handlePopupVisibility={handlePopupVisibility}
        title={t("Motion detection")}
        headerData={movementSheetHeaderData}
      />
      <h1 className="invoiceName">{t("Customer movement detection")}</h1>
      <div className="container-xxl rtlContainer mb-3">
        <div className="card p-3">
          <div className="row">
            <div className="col-4">
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
            <div className="col-4">
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
            <div className="col-4">
              <SelectBox
                label={t("Categorize")}
                dataSource={Categories}
                value={selectedCategory}
                handleChange={(e) => setSelectedCategory(e.value)}
                keys={{ id: "class", name: "class" }}
                name="typ_id"
              />
            </div>

            <div className="row pb-3 ">
              <div className="col-4">
                <button
                  className="col-12 btn btn-outline-success btn-outline"
                  onClick={showReportHandle}
                >
                  <span> {t("View report")}</span>
                </button>
              </div>
            </div>

            <CustomersMovementsTable
              apiPayload={apiPayload}
              handleDoubleClick={handleDoubleClick}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default CustomersMovementsReport;
