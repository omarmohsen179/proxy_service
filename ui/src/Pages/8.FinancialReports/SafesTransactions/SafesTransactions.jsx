import React, { useState, useEffect, useCallback } from "react";
import { Button, DateBox } from "devextreme-react";
import { NumberBox, SelectBox, TextBox } from "../../../Components/Inputs";
import {
  GET_ACCOUNTS,
  GET_CASHIERS,
} from "../../../Templetes/Invoice/Components/InvoiceInformation/API.InvoiceInformation";
import { GET_PDF_FILE, GET_SAFE_INVOICES } from "./API.SafesTransactions";
import InvoicesTable from "./Components/InvoicesTable/InvoicesTable";
import BillDetails from "../../../Modals/SearchBillsTableANDmovements/BillDetails";
import { Popup } from "devextreme-react/popup";
import notify from "devextreme/ui/notify";
import ScrollView from "devextreme-react/scroll-view";
import "./safesTransactions.css";
import TransferBetweenStorages from "../../6.BillsTab/TransferBetweenStorages";
import OpenPDFWindow from "../../../Components/SharedComponents/PDFReader/PDFwindowFunction";
import { useTranslation } from "react-i18next";

const SafesTransactions = () => {
  const [fromDate, setFromDate] = useState(new Date());
  const { t, i18n } = useTranslation();
  const [toDate, setToDate] = useState(new Date());

  const [cashiers, setCashiers] = useState([]);

  const [selectedCashier, setSelectedCashier] = useState(0);

  const [safes, setSafes] = useState([]);

  const [selectedSafe, setSelectedSafe] = useState();

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

  const printHandle = useCallback(() => {
    GET_PDF_FILE({
      FromDate: fromDate,
      ToDate: toDate,
      AgentID: selectedCashier,
      SafeID: selectedSafe,
    })
      .then((file) => {
        console.log("pdf");
        OpenPDFWindow(file);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [fromDate, selectedCashier, selectedSafe, toDate]);

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
    // 1- Get safes
    GET_ACCOUNTS("Safe", selectedCashier, "Sales").then((_accounts) => {
      setSafes(_accounts);
    });
  }, [selectedCashier]);

  return (
    <>
      {showTransferBetweenSafesPopup && (
        <Popup
          maxWidth={"70%"}
          minWidth={250}
          minHeight={"90%"}
          closeOnOutsideClick={true}
          visible={showTransferBetweenSafesPopup}
          onHiding={toggleTransactionBetweenSafesPopup}
          title={false}
        >
          <ScrollView>
            <TransferBetweenStorages
              togglePopup={closePopUp}
              data={{
                accountId: selectedSafe,
                caption: t("move between lockers"),
                mosweq_id: selectedCashier,
              }}
            />
          </ScrollView>
        </Popup>
      )}

      <BillDetails
        Toggle={toggleInvoiceDetails}
        visable={showInvoiceDetailsPopup}
        detailsvalue={detailsData}
      />

      <h1 className="invoiceName">{t("treasury statement")}</h1>
      <div className="container rtlContainer">
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
                label={t("treasury")}
                dataSource={safes}
                name="sno_id"
                value={selectedSafe}
                handleChange={(e) => setSelectedSafe(e.value)}
              />
            </div>
          </div>
          <div className="row py-2">
            <InvoicesTable
              safeId={selectedSafe}
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
                label={t("balance transferred")}
                readOnly
                value={summeryData.TransaferMoney}
                cssClass={
                  summeryData.TransaferMoney < 0 ? "redInput " : "greenInput "
                }
              />
            </div>
            <div className="col-4">
              <NumberBox
                label={t("received")}
                readOnly
                value={summeryData.PayableTotal}
                cssClass="greenInput "
              />
            </div>
            <div className="col-4">
              <NumberBox
                label={t("the outgoing")}
                readOnly
                value={summeryData.DebitTotal}
                cssClass="redInput "
              />
            </div>
          </div>
          <div className="row">
            <div className="col-4">
              <NumberBox
                label={t("total period")}
                readOnly
                value={summeryData.NetPeriodTotal}
                cssClass={
                  summeryData.NetPeriodTotal < 0 ? "redInput " : "greenInput "
                }
              />
            </div>
            <div className="col-4">
              <NumberBox
                label={t("Total")}
                readOnly
                value={summeryData.Total}
                cssClass={summeryData.Total < 0 ? "redInput " : "greenInput "}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-4">
              <button
                className="col-12 btn btn-outline-dark btn-outline"
                onClick={toggleTransactionBetweenSafesPopup}
                disabled={!selectedSafe}
              >
                <span>{t("Transfer between lockers")}</span>
              </button>
            </div>
            <div className="col-4">
              <button
                className="col-12 btn btn-outline-info btn-outline"
                onClick={printHandle}
                disabled={!selectedSafe}
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

export default SafesTransactions;
