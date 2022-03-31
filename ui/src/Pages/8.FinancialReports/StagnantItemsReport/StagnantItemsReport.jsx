import React, { useState, useEffect, useCallback } from "react";
import { Button, CheckBox, DateBox } from "devextreme-react";
import { NumberBox, SelectBox, TextBox } from "../../../Components/Inputs";
import { GET_MAIN_CATEGORIES } from "../../../Services/ApiServices/ItemsAPI";
import { GET_STAGNANT_ITEMS_REPORT } from "./API.StagnantItemsReport";
import StagnantItemsTable from "./Components/StagnantItemsTable";
import debounce from "lodash.debounce";
import ItemMovementsPopup from "../../../Components/ItemMovementsPopup/ItemMovementsPopup";
import { useTranslation } from "react-i18next";

const StagnantItemsReport = () => {
  const { t, i18n } = useTranslation();
  const [fromDate, setFromDate] = useState(new Date());

  const [toDate, setToDate] = useState(new Date());

  const [Categories, setCategories] = useState([]);

  const [selectedCategoryId, setSelectedCategoryId] = useState();

  const [percent, setPercent] = useState(100);

  const [selectedItemId, setSelectedItemId] = useState();

  const [showItemMovementPopup, setShowItemMovementPopup] = useState(false);

  const toggleShowItemMovementPopup = useCallback(() => {
    setShowItemMovementPopup((prev) => !prev);
  }, []);

  const handleRowClicked = useCallback(({ data: { id } }) => {
    setSelectedItemId(id);
    setShowItemMovementPopup(true);
  }, []);

  useEffect(() => {
    let date = new Date();
    date.setMonth(date.getMonth() - 1);
    let from = new Date(date);
    setFromDate(from);

    GET_MAIN_CATEGORIES().then(({ MainCategory }) => {
      MainCategory &&
        setCategories([{ id: 0, name: t("All Categories") }, ...MainCategory]);
    });
  }, []);

  return (
    <>
      {selectedItemId && (
        <ItemMovementsPopup
          itemId={selectedItemId}
          visable={showItemMovementPopup}
          togglePopup={toggleShowItemMovementPopup}
        />
      )}
      <h1 className="invoiceName">{t("Detecting stagnant goods")}</h1>
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
            <div className="col-3">
              <SelectBox
                label={t("Categorize")}
                dataSource={Categories}
                name="categories"
                value={selectedCategoryId}
                handleChange={(e) => setSelectedCategoryId(e.value)}
              />
            </div>
            <div className="col-3">
              <NumberBox
                required={false}
                label={t("Percentage")}
                value={percent ?? 0}
                name="nesba"
                handleChange={debounce((e) => setPercent(e.value), 500)}
              />
            </div>
            <div className="col-3">
              <button
                className="col-12 btn btn-outline-info btn-outline"
                // onClick={printHandle}
                // disabled={!selectedBranch}
              >
                <span> {t("Print")}</span>
              </button>
            </div>
          </div>
          <div className="row py-3">
            <StagnantItemsTable
              handleRowClicked={handleRowClicked}
              apiPayload={{
                PercentageValue: percent,
                CategoryID: selectedCategoryId,
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

export default StagnantItemsReport;
