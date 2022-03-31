import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedGroupId } from "../../../Store/groups.js";
import {
  getNodesIn,
  getOtherPermissions,
} from "../../../Store/otherPermissions.js";
import { Button } from "devextreme-react/button";
import DateTime from "../../../Components/Inputs/DateTime";
import SelectBox from "../../../Components/Inputs/SelectBox";
import notify from "devextreme/ui/notify";
import MasterTable from "../../../Components/SharedComponents/Tables Components/MasterTable.jsx";
import {
  AGENT,
  SALES_TRANSACTION_DETAILS,
  SEND_EMAIL_SMS,
} from "./API.SalesMovementsDetails";
import { useTranslation } from "react-i18next";

function SalesMovementsDetails(props) {
  const { t, i18n } = useTranslation();
  let nodesIn = useSelector(getNodesIn);
  const [nodes, setNodes] = useState([]);
  let [Agent, setAgent] = useState([]);
  let dispatch = useDispatch();
  var today = new Date();
  today =
    String(today.getMonth() + 1).padStart(2, "0") +
    "/" +
    String(today.getDate()).padStart(2, "0") +
    "/" +
    today.getFullYear();

  let handleChange = useCallback(({ name, value }) => {
    setvalues((values) => ({ ...values, [name]: value }));
  }, []);
  let [values, setvalues] = useState({
    FromDate: today,
    ToDate: today,
    AgentID: 0,
    NodeID: 0,
  });
  useEffect(async () => {
    dispatch(await setSelectedGroupId(1));
    dispatch(await getOtherPermissions());
    setAgent([{ name: t("All"), id: 0 }, ...(await AGENT())]);
  }, []);

  useEffect(async () => {
    if (nodesIn.length > 0) {
      setNodes(
        nodesIn.map((R) => {
          return { id: parseInt(R.num), name: R.name };
        })
      );
      handleChange({ name: "nodeID", value: parseInt(nodesIn[0].num) });
    }
  }, [nodesIn]);
  let send = async (type, Data) => {
    await SEND_EMAIL_SMS(type, Data)
      .then((res) => {
        notify(
          { message: t("Send Successfully"), width: 600 },
          "success",
          3000
        );
      })
      .catch((err) => {
        notify({ message: t("Failed Try again"), width: 450 }, "error", 2000);
      });
  };
  return (
    <div
      dir="auto"
      className="row"
      style={{ display: "flex", justifyContent: "center", margin: 0 }}
    >
      <h1 style={{ width: "90%", textAlign: "center", padding: "2%" }}>
        {t("Sales Detection")}
      </h1>
      <form className="row" style={{ width: "90%", padding: "4px" }}>
        <div className="col-12 col-md-6 col-lg-6">
          <DateTime
            label={t("From")}
            value={values["FromDate"]}
            name="FromDate"
            handleChange={handleChange}
            required={true}
            required={false}
          />
        </div>
        <div className="col-12 col-md-6 col-lg-6">
          <DateTime
            label={t("To")}
            value={values["ToDate"]}
            name="ToDate"
            handleChange={handleChange}
            required={true}
            required={false}
          />
        </div>
      </form>
      <div className="row" style={{ width: "90%", padding: "4px" }}>
        <div className="col-12 col-md-6 col-lg-6">
          <SelectBox
            label={t("Marketers")}
            dataSource={Agent}
            value={values.AgentID}
            name="AgentID"
            handleChange={handleChange}
            required={false}
          />
        </div>
        <div className="col-12 col-md-6 col-lg-6">
          <SelectBox
            label={t("by branch")}
            dataSource={nodes}
            value={values.NodeID}
            name="NodeID"
            handleChange={handleChange}
            required={false}
          />
        </div>
      </div>

      <div style={{ width: "95%" }}>
        <MasterTable
          remoteOperations
          apiMethod={SALES_TRANSACTION_DETAILS}
          apiPayload={values}
          height="400px"
          colAttributes={[
            {
              caption: "لحساب",
              field: "name_cust",
              captionEn: "Account",
            },
            {
              caption: "اجمالي الموباع",
              captionEn: "Total Sold",
              field: "sum_mbe",
            },
            { caption: "العدد", captionEn: "Amount", field: "cunt_inv" },
            {
              caption: "اجمالي النقديه المستلمه",
              captionEn: "total cash received",
              field: "sum_egb",
            },
            { caption: "الفرق", captionEn: "difference", field: "frg" },
            {
              caption: "نسبت التحصيل",
              captionEn: "collection rate",
              field: "nesba",
            },
          ]}
        />
      </div>
      <div
        style={{
          width: "100%",

          padding: "10px",
        }}
      >
        <div>
          <div
            className="w-100 grid-container"
            style={{ padding: "10px" }}
            dir="auto"
          >
            <Button
              className="mx-1 buttonStyle"
              stylingMode="outlined"
              width="30%"
              text={t("Send Scouts to Emails")}
              icon="fas fa-plus"
              type="success"
              rtlEnabled={true}
              onClick={async (e) => {
                await send("AccountTransactions", {
                  AccountCol: "AccountID",
                  SendType: "Email",
                  MessageSubject: "",
                  MessageBody: "",

                  BySystemMoneyType: 0,
                  FromDate: new Date("2010-01-01"),
                  ToDate: new Date(),
                  AccountsIDs: [],
                });
              }}
            />

            <Button
              className="mx-1 buttonStyle"
              stylingMode="outlined"
              width={"30%"}
              text={t("SMS Account Reminder")}
              type="default"
              icon="fas fa-backward"
              rtlEnabled={true}
              onClick={async (e) => {
                await send("AccountTransactions", {
                  AccountCol: "AccountID",
                  SendType: "SMS",
                  MessageSubject: "",
                  MessageBody: "",

                  BySystemMoneyType: 0,
                  FromDate: new Date("2010-01-01"),
                  ToDate: new Date(),
                  AccountsIDs: [],
                });
              }}
            />

            <Button
              className="mx-1 buttonStyle"
              stylingMode="outlined"
              width={"30%"}
              text={t("sms prompt")}
              type="danger"
              icon="fas fa-print"
              rtlEnabled={true}
              onClick={async (e) => {
                await send("AccountTransactions", {
                  AccountCol: "AccountID",
                  SendType: "SMS",
                  MessageSubject: "",
                  MessageBody: "",

                  BySystemMoneyType: 0,
                  FromDate: new Date("2010-01-01"),
                  ToDate: new Date(),
                  AccountsIDs: [],
                });
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
export default SalesMovementsDetails;
