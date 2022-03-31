import React, { useState, useEffect, useCallback } from "react";
import { Button, DateBox } from "devextreme-react";
import { NumberBox, SelectBox, TextBox } from "../../../Components/Inputs";
import {
  GET_ACCOUNTS,
  GET_CASHIERS,
} from "../../../Templetes/Invoice/Components/InvoiceInformation/API.InvoiceInformation";
import InvoicesTable from "./Components/InvoicesTable/InvoicesTable";
import BillDetails from "../../../Modals/SearchBillsTableANDmovements/BillDetails";
import { Popup } from "devextreme-react/popup";
import notify from "devextreme/ui/notify";
import ScrollView from "devextreme-react/scroll-view";
import TransferBetweenStorages from "../../6.BillsTab/TransferBetweenStorages";
import OpenPDFWindow from "../../../Components/SharedComponents/PDFReader/PDFwindowFunction";
import { GET_MONEY_TYPES } from "./../../2.Basics/MoneyTypes/Components/MoneyTypes";
import { useTranslation } from "react-i18next";

const CurrencyReport = () => {
  const { t, i18n } = useTranslation();
  const [fromDate, setFromDate] = useState(new Date());

  const [toDate, setToDate] = useState(new Date());

  const [cashiers, setCashiers] = useState([]);

  const [selectedCashier, setSelectedCashier] = useState(0);

  const [moneyTypes, setMoneyTypes] = useState([]);

  const [selectedMoneyType, setSelectedMoneyType] = useState();

  const [showTransferBetweenSafesPopup, setShowTransferBetweenSafesPopup] =
    useState();

  const [summeryData, setSummeryData] = useState({
    TransaferMoney: 0,
    PayableTotal: 0,
    DebitTotal: 0,
    NetPeriodTotal: 0,
    Total: 0,
  });

  const [showInvoiceDetailsPopup, setShowInvoiceDetailsPopup] = useState(false);

  const [detailsData, setDetailsData] = useState({});

  const updateSummeryData = useCallback(
    ({ TransaferMoney, PayableTotal, DebitTotal }) => {
      setSummeryData({
        TransaferMoney,
        PayableTotal,
        DebitTotal,
        NetPeriodTotal: parseFloat(PayableTotal) - parseFloat(DebitTotal),
        Total:
          parseFloat(TransaferMoney) +
          parseFloat(PayableTotal) -
          parseFloat(DebitTotal),
      });
    },
    []
  );

  const closePopUp = useCallback(() => {
    setShowTransferBetweenSafesPopup((prev) => !prev);
  }, []);

  const onRowDoubleClickHandle = useCallback(({ data }) => {
    if (data.des_id !== 0) {
      setDetailsData({ invoiceType: data.InvoiceType, id: data.des_id });
      setShowInvoiceDetailsPopup(true);
    }
  }, []);

  const toggleTransactionBetweenSafesPopup = useCallback(() => {
    setShowTransferBetweenSafesPopup((prev) => !prev);
  }, []);

  const toggleInvoiceDetails = useCallback(() => {
    setShowInvoiceDetailsPopup((prev) => !prev);
  }, []);

  //   const printHandle = useCallback(() => {
  //     GET_PDF_FILE({
  //       FromDate: fromDate,
  //       ToDate: toDate,
  //       AgentID: selectedCashier,
  //       SafeID: selectedMoneyType,
  //     })
  //       .then((file) => {
  //         console.log("pdf");
  //         OpenPDFWindow(file);
  //       })
  //       .catch((error) => {
  //         console.log(error);
  //       });
  //   }, [fromDate, selectedCashier, selectedMoneyType, toDate]);

  useEffect(() => {
    let date = new Date();
    date.setMonth(date.getMonth() - 1);
    let from = new Date(date);
    setFromDate(from);

    // 2- Get Cashers
    GET_CASHIERS().then((cashiers) => {
      setCashiers([{ id: 0, name: t("All") }, ...cashiers]);
    });
  }, []);

  useEffect(() => {
    // 1- Get moneyTypes
    GET_MONEY_TYPES().then((_moneyTypes) => {
      setMoneyTypes(_moneyTypes);
    });
  }, [selectedCashier]);

  return (
    <>
      <BillDetails
        Toggle={toggleInvoiceDetails}
        visable={showInvoiceDetailsPopup}
        detailsvalue={detailsData}
      />

      <h1 className="invoiceName">{t("Currency Report")}</h1>
      <div className="container" dir="auto">
        <div className="card p-3">
          <div className="row">
            <div className="col-3">
              <div className="input-wrapper">
                <div className="label">{t("From")}</div>
                <DateBox
                  key="from"
                  name="FromDate"
                  value={fromDate}
                  max={toDate}
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
                  max={new Date()}
                  dateOutOfRangeMessage={t("date past date from")}
                  onValueChanged={(e) => setToDate(e.value)}
                />
              </div>
            </div>
            <div className="col-3">
              <SelectBox
                label={t("Employee")}
                dataSource={cashiers}
                name="mosweq_id"
                value={selectedCashier}
                handleChange={(e) => setSelectedCashier(e.value)}
              />
            </div>
            <div className="col-3">
              <SelectBox
                label={t("Currency")}
                dataSource={moneyTypes}
                name="sno_id"
                value={selectedMoneyType}
                keys={{ id: "id", name: "description" }}
                handleChange={(e) => setSelectedMoneyType(e.value)}
              />
            </div>
          </div>
          <div className="row py-2">
            <InvoicesTable
              moneyId={selectedMoneyType}
              mosweq_id={selectedCashier}
              fromDate={fromDate}
              toDate={toDate}
              updateSummeryData={updateSummeryData}
              onRowDoubleClickHandle={onRowDoubleClickHandle}
            />
          </div>
          <div className="row">
            <div className="col-4">
              <NumberBox
                label={t("Transferred Balance")}
                readOnly
                value={summeryData.TransaferMoney ?? 0}
                cssClass={
                  summeryData.TransaferMoney < 0 ? "redInput " : "greenInput "
                }
              />
            </div>
            <div className="col-4">
              <NumberBox
                label={t("Incomes")}
                readOnly
                value={summeryData.PayableTotal ?? 0}
                cssClass="greenInput "
              />
            </div>
            <div className="col-4">
              <NumberBox
                label={t("Outcomes")}
                readOnly
                value={summeryData.DebitTotal ?? 0}
                cssClass="redInput "
              />
            </div>
          </div>
          <div className="row">
            <div className="col-4">
              <NumberBox
                label={t("Total Duration")}
                readOnly
                value={summeryData.NetPeriodTotal ?? 0}
                cssClass={
                  summeryData.NetPeriodTotal < 0 ? "redInput " : "greenInput "
                }
              />
            </div>
            <div className="col-4">
              <NumberBox
                label={t("Total")}
                readOnly
                value={summeryData.Total ?? 0}
                cssClass={summeryData.Total < 0 ? "redInput " : "greenInput "}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-4">
              <button
                className="col-12 btn btn-outline-info btn-outline"
                // onClick={printHandle}
                disabled={!selectedMoneyType}
              >
                <span> {t("Print")}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CurrencyReport;
