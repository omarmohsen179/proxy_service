// React
import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  useMemo,
} from "react";

// DevExpress
import { Popup } from "devextreme-react/popup";
import ScrollView from "devextreme-react/scroll-view";
import { SelectBox as SelectExpress } from "devextreme-react";
import { TextBox as TextExpress } from "devextreme-react";
import { Button as ButtonExpress } from "devextreme-react/button";
import notify from "devextreme/ui/notify";

// Components
import SystemSettingsModal from "./SystemSettingsModals/SystemSettingsModal";
import {
  TextBox,
  NumberBox,
  SelectBox,
  CheckBox,
  FileUploader,
} from "../../../Components/Inputs";
import SimpleDeal from "./SystemSettingsModals/SimpleDeal";
import SetFinancialTransaction from "./SystemSettingsModals/SetFinancialTransaction";

// API
import {
  GET_SYSTEM_SETTINGS,
  POST_SYSTEM_SETTINGS,
  CHECK_OTHER_SETTINGS,
  GET_SYSTEMSETTINGS_ALLGROUPS_LOOKUPS,
  GET_SYSTEMSETTINGS_MONEYTYPES_LOOKUPS,
  GET_SYSTEMSETTINGS_NODES_LOOKUPS,
} from "./API.SystemSettings";
import { useTranslation } from "react-i18next";
import "./SystemSetting.css";
function SystemSettings() {
  // ============================================================================================================================
  // ================================================= State ====================================================================
  // ============================================================================================================================
  const { t, i18n } = useTranslation();
  // Main Data of page Inputs
  let [data, setData] = useState({});
  // Data of input الفرع
  let [branchLookupList, setBranchLookupList] = useState({});
  // Data of input العملة
  let [currencyLookupList, setCurrencyLookupList] = useState({});
  // Data of input المدير
  let [managerLookupList, setManagerLookupList] = useState({});
  // Setting of password of Other Settings which opens a modal of check boxes
  let [otherSettingsPass, setOtherSettingsPass] = useState();
  // Showing and hiding other  settings pop up
  let [otherSettingsVisibility, setOtherSettingsVisibility] = useState(false);
  // Showing and hiding Simple deal pop up المعاملة البسيطة
  let [simpleDealVisibility, setSimpleDealVisibility] = useState(false);
  // Showing and hiding SetFinancialTransaction pop up إعداد المعاملات المالية
  let [addMoreSystemDealsVisibility, setAddMoreSystemDealsVisibility] =
    useState(false);

  // ============================================================================================================================
  // ================================================= Effects ==================================================================
  // ============================================================================================================================
  // Initial Effect
  useEffect(() => {
    // Gets Page Data
    (async () => {
      await GET_SYSTEM_SETTINGS()
        .then((res) => {
          setData(res[0])
        })
        .catch((err) => console.log(err));
      //Getting الفروع
      await GET_SYSTEMSETTINGS_ALLGROUPS_LOOKUPS()
        .then((res) => setBranchLookupList(res))
        .catch((err) => console.log(err));

      //Getting العملة
      await GET_SYSTEMSETTINGS_MONEYTYPES_LOOKUPS()
        .then((res) => setCurrencyLookupList(res))
        .catch((err) => console.log(err));

      //Getting المدير
      await GET_SYSTEMSETTINGS_NODES_LOOKUPS()
        .then((res) => setManagerLookupList(res))
        .catch((err) => console.log(err));
    })();
  }, []);

  // ============================================================================================================================
  // ================================================= Handlers =================================================================
  // ============================================================================================================================

  // handlere of password that opens or not the other settings modal
  let handleOtherSettingsPass = ({ event }) => {
    setOtherSettingsPass(event.target.value);
  };

  // Validation of password of other settings and if true open the modal popup
  let showotherSettings = useCallback(async () => {
    if (!otherSettingsPass) {
      notify({ message: t("Password required"), width: 600 }, "error", 3000);

      return;
    }

    await CHECK_OTHER_SETTINGS(otherSettingsPass)
      .then((res) => setOtherSettingsVisibility(true))
      .catch((err) =>
        notify({ message: t("Wrong Password"), width: 600 }, "error", 3000)
      );
  }, [otherSettingsPass]);

  // Show or close handeler of SimpleDeal إنشاء معاملة مالية
  let handleShowSimpleDeal = useCallback(() => {
    setSimpleDealVisibility((prevState) => !prevState);
  }, []);

  let showAddMoreSystemDeals = useCallback(() => {
    setAddMoreSystemDealsVisibility((prevState) => !prevState);
  }, []);

  let handleChange = useCallback(
    ({ name, value }) => {
      // Check  تثبيت البائع

      if (name == "mosweq") {
        if (value == true) {
          setData({ ...data, [name]: "1" });
        } else {
          setData({ ...data, [name]: "0" });
        }
      }
      // Check عرض الكميات الصفرية
      else if (name == "down0") {
        if (value == true) {
          setData({ ...data, [name]: "0" });
        } else {
          setData({ ...data, [name]: "-1000000" });
        }
      }
      // Check  مدين أحمر
      else if (name == "color_mden") {
        if (value == true) {
          setData({ ...data, [name]: "-1" });
        } else {
          setData({ ...data, [name]: "0" });
        }
      } else if (
        name == "omla_system" ||
        name == "read_id" ||
        name == "admin_name"
      ) {
        setData({ ...data, [name]: value - 1 });
      } else {
        setData({ ...data, [name]: value });
      }
    },
    [data]
  );

  let handleSubmit = useCallback(async () => {
    console.log("Submit");
    await POST_SYSTEM_SETTINGS(data)
      .then((res) =>
        notify({ message: "تم التخزين بنجاح", width: 600 }, "success", 3000)
      )
      .catch((err) => console.log(err));
  }, [data]);
  let GridDisplayCols = "col-lg-4 col-md-6 col-sm-12";
  return (
    <>
      {/* {console.log(data)} */}
      <form dir="auto" className="container mt-5">
        <div className="card">
          <div className="system-card row ">
            {/* 1 */}
            <div className="col-12">
              <p className="card-header-title">{t("Company Information")}</p>
            </div>
            <div className={GridDisplayCols}>
              <TextBox
                label={t("Company Name")}
                value={data["name1"]}
                name="name1"
                handleChange={handleChange}
                required={false}
              />
            </div>
            <div className={GridDisplayCols}>
              <TextBox
                label={t("Company Type")}
                value={data["name2"]}
                name="name2"
                handleChange={handleChange}
                required={false}
              />
            </div>
            <div className={GridDisplayCols}>
              <TextBox
                label={t("Address")}
                value={data["addres"]}
                name="addres"
                handleChange={handleChange}
              />
            </div>
            {/* 2 */}
            <div className={GridDisplayCols}>
              <NumberBox
                label={t("Phone Number") + " 1"}
                value={data["tele"]}
                name="tele"
                handleChange={handleChange}
              />
            </div>
            <div className={GridDisplayCols}>
              <NumberBox
                label={t("Phone Number") + " 2"}
                value={data["tele2"]}
                name="tele2"
                handleChange={handleChange}
              />
            </div>
            {/* 3 */}
            <div className={GridDisplayCols}>
              <NumberBox
                label={t("Phone Number") + " 3"}
                value={data["tele3"]}
                name="tele3"
                handleChange={handleChange}
              />
            </div>

            {/* 4 */}
            <div className={GridDisplayCols}>
              <NumberBox
                label={t("Phone Number") + " 4"}
                value={data["tele4"]}
                name="tele4"
                handleChange={handleChange}
              />
            </div>
            <div className={GridDisplayCols}>
              <TextBox
                label={t("E-mail")}
                value={data["email"]}
                name="email"
                handleChange={handleChange}
              />
            </div>
            <div className={GridDisplayCols}>
              <CheckBox
                label={t("Vendor Install")}
                value={data["mosweq"] == 1 ? true : false}
                name="mosweq"
                handleChange={handleChange}
              />
            </div>
            {/* 5 */}
            <div className={"col-lg-6 col-md-6 col-sm-12"}>
              <TextBox
                label={t("Website")}
                value={data["website"]}
                name="website"
                handleChange={handleChange}
              />
            </div>
            <div className={"col-lg-6 col-md-6 col-sm-12"}>
              <FileUploader
                label={t("Choose a logo")}
                value={data["pic"]}
                name="pic"
                required={false}
                handleChange={handleChange}
              />
            </div>
            {/* 6 */}
            <div className={GridDisplayCols}>
              <SelectBox
                label={t("the currency")}
                dataSource={currencyLookupList}
                keys={{ id: "id", name: "description" }}
                name="omla_system"
                value={(parseInt(data["omla_system"]) + 1).toString()}
                handleChange={handleChange}
              />
            </div>

            <div className={GridDisplayCols}>
              <CheckBox

                label={t("Multi Currency")}
                value={data["MultiCurrency"] ? true : false}
                name="MultiCurrency"
                handleChange={handleChange}
              />
            </div>

            <div className={GridDisplayCols}>
              <SelectBox
                label={t("Branches")}
                dataSource={branchLookupList}
                keys={{ id: "id", name: "name" }}
                name="read_id"
                value={(parseInt(data["read_id"]) + 1).toString()}
                handleChange={handleChange}
                required={false}
              />
            </div>
            {/* 7 */}

            <div className={GridDisplayCols}>
              <SelectBox
                label={t("The Manager")}
                dataSource={managerLookupList}
                keys={{ id: "id", name: "description" }}
                name="admin_name"
                value={(parseInt(data["admin_name"]) + 1).toString()}
                handleChange={handleChange}
              />
            </div>
            <div className={GridDisplayCols}>
              <FileUploader
                label={t("Backup")}
                value={data["backup_path"]}
                name="backup_path"
                handleChange={handleChange}
                required={false}
              />
            </div>
            {/* 8 */}
            <div className={GridDisplayCols}>
              <CheckBox
                label={t("Display Zero Quantities")}
                value={data["down0"] == 0 ? true : false}
                name="down0"
                handleChange={handleChange}
              />
            </div>
            <div className={GridDisplayCols}>
              <SelectBox
                label={t("Select a store for the invoice")}
                dataSource={[
                  { id: "1", description: t("One Store") },
                  { id: "2", description: t("More than One") },
                ]}
                keys={{ id: "id", name: "description" }}
                name="stock_acount"
                value={data["stock_acount"]}
                handleChange={handleChange}
                required={false}
              />
            </div>
            {/* 9 */}
            <div className={GridDisplayCols}>
              <SelectBox
                label={t("Print Exchange Order")}
                dataSource={[
                  { id: "1", description: t("One sheet printing") },
                  { id: "2", description: t("Print each store on a sheet") },
                ]}
                keys={{ id: "id", name: "description" }}
                name="SRF_STATE"
                value={data["SRF_STATE"]}
                handleChange={handleChange}
              />
            </div>
            <div className={GridDisplayCols}>
              <FileUploader
                label={t("Email files")}
                value={data["TempFastReportImage"]}
                name="TempFastReportImage"
                handleChange={handleChange}
                required={false}
              />
            </div>
          </div>
        </div>
        {/* 10 */}

        {/* 11 */}

        {/* جهاز البصمة */}
        {/* <div className="card" style={{ marginTop: "20px" }}>
          <div className="system-card row ">
            <div className="col-12">
              <p className="card-header-title"> {t("Fingerprint device")}</p>
            </div>
            <div className={GridDisplayCols}>
              <TextBox
                label={t("IP")}
                value={data["ip_finger"]}
                name="ip_finger"
                handleChange={handleChange}
              />
            </div>
            <div className={GridDisplayCols}>
              <TextBox
                label={t("Port")}
                value={data["port_finger"]}
                name="port_finger"
                handleChange={handleChange}
              />
            </div>
            <div className={GridDisplayCols}>
              <TextBox
                mode="email"
                label={t("E-mail")}
                value={data["login"]}
                name="login"
                handleChange={handleChange}
              />
            </div>
            <div className={GridDisplayCols}>
              <TextBox
                mode="password"
                label={t("Password")}
                value={data["pass"]}
                name="pass"
                handleChange={handleChange}
              />
            </div>
            <div className={GridDisplayCols}>
              <TextBox
                label="Server"
                label={t("Server")}
                value={data["Mail_Server"]}
                name="Mail_Server"
                handleChange={handleChange}
              />
            </div>
            <div className={GridDisplayCols}>
              <TextBox
                label={t("Port")}
                value={data["PortNum"]}
                name="PortNum"
                handleChange={handleChange}
              />
            </div>
            <div className={GridDisplayCols}>
              <CheckBox
                label={t("Debit")}
                value={data["color_mden"] == -1 ? true : false}
                name="color_mden"
                handleChange={handleChange}
              />
            </div>
            <div className={GridDisplayCols}>
              <CheckBox
                label={t("Inventory Cancellation")}
                value={data["qunt"]}
                name="qunt"
                handleChange={handleChange}
              />
            </div>
            <div className={GridDisplayCols}>
              <CheckBox
                label={t("Verify Entry")}
                value={data["code_no"]}
                name="code_no"
                handleChange={handleChange}
              />
            </div>
            <div className={GridDisplayCols}>
              <CheckBox
                label={t("bar code sale")}
                value={data["typ_box"]}
                name="typ_box"
                handleChange={handleChange}
              />
            </div>
            <div className={GridDisplayCols}>
              <CheckBox
                label={t("Activate the scale")}
                value={data["mizan_type"]}
                name="mizan_type"
                handleChange={handleChange}
              />
            </div>
            <div className={GridDisplayCols}>
              <NumberBox
                label={t("Balance")}
                value={data["mizan"]}
                name="mizan"
                handleChange={handleChange}
              />
            </div>
            <div className={GridDisplayCols}>
              <NumberBox
                label={t("Port")}
                value={data["jram"]}
                name="jram"
                handleChange={handleChange}
              />
            </div>
            <div className={GridDisplayCols}>
              <CheckBox
                label={t("View Item Units")}
                value={data["view_units"]}
                name="view_units"
                handleChange={handleChange}
              />
            </div>
            <div className={GridDisplayCols}>
              <NumberBox
                label={t("dollar conversion rate")}
                value={data["dolar_exrate"]}
                name="dolar_exrate"
                handleChange={handleChange}
              />
            </div>
            <div className={GridDisplayCols}>
              <CheckBox
                label={t("Working with Validity of Items")}
                value={data["Work_with_validity"]}
                name="Work_with_validity"
                handleChange={handleChange}
              />
            </div>
            <div className={GridDisplayCols}>
              <CheckBox
                label={t("Validity alert")}
                value={data["Check_exp_date"]}
                name="Check_exp_date"
                handleChange={handleChange}
              />
            </div>
            <div className={GridDisplayCols}>
              <CheckBox
                label={t("appearance report")}
                value={data["exp_alarm"]}
                name="exp_alarm"
                handleChange={handleChange}
              />
            </div>
            <div className={GridDisplayCols}>
              <NumberBox
                label={t("Duration")}
                value={data["exp_alarm_interval"]}
                name="exp_alarm_interval"
                handleChange={handleChange}
              />
            </div>
            <div className={GridDisplayCols}>
              <SelectExpress
                dataSource={[
                  { id: "1", description: t("day") },
                  { id: "2", description: t("month") },
                  { id: "3", description: t("year") },
                ]}
                valueExpr={"id"}
                displayExpr={"description"}
                name="exp_alarm_interval_type"
                value={data["exp_alarm_interval_type"]}
                onValueChange={(selectedItem) =>
                  handleChange({
                    name: "exp_alarm_interval_type",
                    value: selectedItem,
                  })
                }
                searchEnabled={true}
                hoverStateEnabled={true}
              />
            </div>
            <div className={GridDisplayCols}>
              <div className="d-flex">
                <ButtonExpress
                  className="label"
                  height={"38px"}
                  text={t("Settings")}
                  type="default"
                  stylingMode="contained"
                  onClick={showotherSettings}
                  style={{ margin: "0 5px" }}
                />
                <TextExpress
                  mode="password"
                  value={otherSettingsPass}
                  onInput={handleOtherSettingsPass}
                  width="100%"
                  height={"38px"}
                />
              </div>
            </div>
            <div className={GridDisplayCols}>
              <CheckBox
                label={t("Same as basic default")}
                value={data["default_as_basic_unit"]}
                name="default_as_basic_unit"
                handleChange={handleChange}
              />
            </div>
          </div>
        </div> */}

        <div className="my-5 d-flex justify-content-between">
          <ButtonExpress
            width={"30%"}
            text={t("Save")}
            type="default"
            stylingMode="contained"
            onClick={handleSubmit}
          />
          {/* <ButtonExpress
            width={"30%"}
            text={t("Add other system parameters")}
            type="default"
            stylingMode="contained"
            onClick={showAddMoreSystemDeals}
          /> */}

          <ButtonExpress
            width={"30%"}
            text={t("simple transaction")}
            type="default"
            stylingMode="contained"
            onClick={handleShowSimpleDeal}
          />
        </div>
        <Popup
          // width={"100%"}
          maxWidth={250}
          minWidth={250}
          minHeight={540}
          showTitle={true}
          dragEnabled={false}
          closeOnOutsideClick={true}
          visible={otherSettingsVisibility}
          onHiding={() => setOtherSettingsVisibility(false)}
        >
          <ScrollView>
            <SystemSettingsModal data={data} onHandleChange={handleChange} />
          </ScrollView>
        </Popup>
        <Popup
          maxWidth={"70%"}
          title={t("Create a financial transaction")}
          minWidth={250}
          // minHeight={"50%"}
          showTitle={true}
          dragEnabled={false}
          closeOnOutsideClick={true}
          visible={simpleDealVisibility}
          onHiding={handleShowSimpleDeal}
        >
          <ScrollView>
            <SimpleDeal closeModal={handleShowSimpleDeal} />
          </ScrollView>
        </Popup>
        <Popup
          maxWidth={"70%"}
          title={t("Preparing financial transactions")}
          minWidth={250}
          minHeight={"50%"}
          showTitle={true}
          dragEnabled={false}
          closeOnOutsideClick={true}
          visible={addMoreSystemDealsVisibility}
          onHiding={showAddMoreSystemDeals}
        >
          <ScrollView>
            <SetFinancialTransaction />
          </ScrollView>
        </Popup>
      </form>
    </>
  );
}

export default SystemSettings;
