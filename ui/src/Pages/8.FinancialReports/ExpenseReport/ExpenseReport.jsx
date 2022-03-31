import React, { useState, useEffect, useCallback } from "react";
import { Button, CheckBox, DateBox } from "devextreme-react";
import {
  DateTime,
  NumberBox,
  SelectBox,
  TextBox,
} from "../../../Components/Inputs";
import ExpenseTable from "./Components/ExpenseTable/ExpenseTable";
import {
  GET_ACCOUNTS_COSTS_REPORT,
  GET_NODES,
  GET_PURCHASES_COSTS,
} from "./API.ExpenseReport";
import { GET_PDF_FILE } from "../../../Templetes/Invoice/Components/SpeedActionsButtons/API.SpeedActionsButtons";
import OpenPDFWindow from "../../../Components/SharedComponents/PDFReader/PDFwindowFunction";
import { useTranslation } from "react-i18next";

const ExpenseReport = () => {
  const [fromDate, setFromDate] = useState();
  const { t, i18n } = useTranslation();
  const [toDate, setToDate] = useState();

  const [branches, setBranches] = useState([]);

  const [selectedBranch, setSelectedBranch] = useState("-1");

  const [costs, setCosts] = useState([]);

  const [selectedCost, setSelectedCost] = useState(0);

  const [isForPurchaseInvoice, setIsForPurchaseInvoice] = useState(false);

  const [tableData, setTableData] = useState([]);

  const showReportHandle = useCallback(() => {
    GET_ACCOUNTS_COSTS_REPORT({
      NodeID: selectedBranch,
      CostID: selectedCost,
      ToDate: toDate,
      FromDate: fromDate,
      IsForPurchaseInvoice: isForPurchaseInvoice,
    }).then((response) => {
      setTableData(response);
    });
  }, [fromDate, isForPurchaseInvoice, selectedBranch, selectedCost, toDate]);
  const printHandle = useCallback(async () => {
    await GET_PDF_FILE("ExpenseReport", {
      NodeID: selectedBranch,
      CostID: selectedCost,
      ToDate: toDate,
      FromDate: fromDate,
      IsForPurchaseInvoice: isForPurchaseInvoice,
    })
      .then((file) => {
        console.log("pdf");
        OpenPDFWindow(file);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [
    fromDate,
    toDate,
    selectedCost,
    GET_PDF_FILE,
    selectedBranch,
    OpenPDFWindow,
  ]);
  useEffect(() => {
    let dateType = new Date();
    let month = (parseInt(dateType.getMonth()) + 1).toString();
    let finalFormat = (
      month +
      "/" +
      dateType.getDate() +
      "/" +
      dateType.getFullYear()
    ).toString();
    console.log(finalFormat);
    setFromDate(finalFormat);
    setToDate(finalFormat);
    GET_NODES().then((nodes) => {
      setBranches([{ number: "-1", description: t("All") }, ...nodes] ?? []);
    });
    GET_PURCHASES_COSTS().then((costs) => {
      setCosts([{ id: 0, description: t("All") }, ...costs] ?? []);
    });
  }, [t]);

  return (
    <>
      <h1 className="invoiceName">{t("expense statement")}</h1>
      <div className="container-xxl rtlContainer">
        <div className="card p-3">
          <div className="row">
            <div className="col-3">
              <DateTime
                key="from"
                label={t("From")}
                name="FromDate"
                value={fromDate}
                max={toDate}
                dateOutOfRangeMessage={t("date past date to")}
                handleChange={({ name, value }) => setFromDate(value)}
              />
            </div>
            <div className="col-3">
              <DateTime
                value={toDate}
                label={t("To")}
                max={new Date()}
                name="ToDate"
                handleChange={({ name, value }) => {
                  setToDate(value);
                }}
                dateOutOfRangeMessage={t("date past date from")}
              />
            </div>
            <div className="col-3">
              <SelectBox
                label={t("Branch")}
                dataSource={branches}
                name="sales_points"
                value={selectedBranch}
                keys={{ id: "number", name: "description" }}
                handleChange={(e) => setSelectedBranch(e.value)}
              />
            </div>
            <div className="col-3">
              <SelectBox
                label="مصروف"
                dataSource={costs}
                name="cost"
                value={selectedCost}
                keys={{ id: "id", name: "description" }}
                handleChange={(e) => setSelectedCost(e.value)}
              />
            </div>
            <div className="my-2 d-flex col-3">
              <CheckBox
                value={isForPurchaseInvoice}
                onValueChanged={({ value }) => setIsForPurchaseInvoice(value)}
              />
              <div className="mx-2">{t("For purchase")}</div>
            </div>
            <div className="col-3">
              <button
                className="col-12 btn btn-outline-success btn-outline"
                onClick={showReportHandle}
              >
                <span> {t("Display")}</span>
              </button>
            </div>
            <div className="col-3">
              <button
                className="col-12 btn btn-outline-info btn-outline"
                onClick={printHandle}
                disabled={!selectedBranch}
              >
                <span> {t("Print")}</span>
              </button>
            </div>
          </div>
          <div className="row py-3">
            <ExpenseTable data={tableData} />
          </div>
        </div>
      </div>
    </>
  );
};

export default ExpenseReport;
