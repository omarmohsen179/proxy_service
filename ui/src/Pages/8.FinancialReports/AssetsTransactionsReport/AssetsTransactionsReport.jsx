import React, { useRef, useState, useEffect, useCallback } from "react";
import { Button, CheckBox, DateBox } from "devextreme-react";
import { SelectBox } from "../../../Components/Inputs";
import AssetsTransactionsTable from "./Components/AssetsTransactionsTable";
import { GET_ASSETS } from "../../../Services/ApiServices/General/ReportsAPI";
import { useTranslation } from "react-i18next";

const AssetsTransactionsReport = () => {
  const { t, i18n } = useTranslation();
  const [fromDate, setFromDate] = useState();

  const [toDate, setToDate] = useState(new Date());

  const [assets, setAssets] = useState([]);

  const [selectedAsset, setSelectedAsset] = useState();

  useEffect(() => {
    let date = new Date();
    date.setMonth(date.getMonth() - 1);
    let from = new Date(date);
    setFromDate(from);
    GET_ASSETS().then((cashiers) => {
      setAssets([{ asl_id: 0, description: t("All") }, ...cashiers]);
    });
  }, []);

  return (
    <>
      <h1 className="invoiceName">{t("Asset movement")}</h1>
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
                  dateOutOfRangeMessage="التاريخ تجاوز تاريخ الى"
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
                label={t("the origin")}
                dataSource={assets}
                name="asset"
                value={selectedAsset}
                keys={{ id: "asl_id", name: "description" }}
                handleChange={(e) => setSelectedAsset(e.value)}
              />
            </div>
          </div>

          <div className="row py-3">
            <AssetsTransactionsTable
              apiPayload={{
                AssetID: selectedAsset,
                FromDate: fromDate,
                ToDate: toDate,
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default AssetsTransactionsReport;
