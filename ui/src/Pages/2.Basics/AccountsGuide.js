import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from "react";
// APIs
import {
  GET_MARKETERS,
  GET_ACCOUNT_TYPE,
  GET_EDIT_LIST,
  POST_ACCOUNTS_GUIDE_DATA,
  DELETE_ROW,
} from "../../Services/ApiServices/Basics/AccountsGuide";
import { GET_SYSTEMSETTINGS_MONEYTYPES_LOOKUPS } from "../../Services/ApiServices/Settings/SystemSettingsAPI";
// Components
import {
  TextBox,
  NumberBox,
  SelectBox,
  CheckBox,
} from "../../Components/Inputs";
import ButtonRow from "../../Components/SharedComponents/buttonsRow";
// Devexpress
import DateBox from "../../Components/Inputs/DateBox";
import { Popup } from "devextreme-react/popup";
import ScrollView from "devextreme-react/scroll-view";
import { SelectBox as SelectExpress } from "devextreme-react";
import notify from "devextreme/ui/notify";
// Modals
import AccountsGuideEditDelete from "../../Modals/AccountsGuide/AccountsGuideEditDelete";
import ValidationSummary from "devextreme-react/validation-summary";
import { useTranslation } from "react-i18next";
import AccountsGuideMoneyTypesTable from "./AccountsGuideMoneyTypesTable";
function AccountsGuide() {
  const { t, i18n } = useTranslation();

  // ============================================================================================================================
  // ================================================= Lists ====================================================================
  // ============================================================================================================================

  // Main list that defines types of the page -- List on top left of the page --
  // When Changing items of this left other things change :
  //   1- Title became same selected value of dropdownlist
  //   2-  الرقم والتصنيف أيضًا يتغيران
  let titleList = [
    { id: "0", description: t("Customer Profile") },
    { id: "1", description: t("Supplier Profile") },
    { id: "2", description: t("Treasuries and the Covenant") },
    { id: "3", description: t("Capital Accounts") },
    { id: "4", description: t("Combined Accounts") },
    { id: "5", description: t("Other accounts") },
  ];

  // سعر البيع الافتراضي
  let assumedSellingPrice = [
    { id: "0", description: t("Sectoral Price") },
    { id: "1", description: t("Wholesale price") },
    { id: "2", description: t("Cost price") },
  ];

  // Columns of the table of the edit and delete pop up
  // Columns of the table of the edit and delete pop up
  let columnAttributes = useMemo(() => {
    return [
      { field: "num", caption: "الرقم", captionEn: "Number", isVisable: true },
      { field: "name", caption: "الاسم", captionEn: "Name", isVisable: true },
      {
        field: "e_name_cust",
        caption: "الإسم الأجنبي",
        captionEn: "English Name",
        isVisable: true,
      },
      {
        field: "hesab",
        captionEn: "Balance",
        caption: "الرصيد",
        isVisable: true,
      },
      {
        field: "tel",
        captionEn: "Phone Number",
        caption: "الهاتف",
        isVisable: true,
      },
      {
        field: "class",
        caption: "التصنيف",
        captionEn: "Category",
        isVisable: false,
      },
      {
        field: "mosweq_name",
        captionEn: "Markter",
        caption: "المسوق",
        isVisable: false,
      },
    ];
  }, []);

  // Initial list of the page that page start with and return to when clicking new button "جديد"
  let initialData = {
    addres: "",
    aksa: 0,
    amla: "دينار ليبي",
    class: "",
    cust_mail: "",
    cust_pass: "",
    cust_user: "",
    daen: 0,
    daen_end: "0",
    day_kest: "0",
    defult_price: "0",
    den_date: 0,
    e_name_cust: "",
    edf: 0,
    endservice_date: null,
    ex_rate: 1,
    // id: "0",
    kest: 0,
    kiod_id: 0,
    mden: 0,
    mden_end: 0,
    mord: false,
    mosweq_id: 1,
    mosweq_name: "",
    name: "",
    num: 0,
    omla_id: "1",
    open1: false,
    phone_active: "",
    point: 0,
    price_cust: 0,
    read_date: new Date(),
    read_id: "0",
    rem: "",
    replace_name: "",
    s_date: new Date(),
    show: true,
    state_phone: false,
    string1: "0",
    string2: "0",
    taamol: "0",
    tel: "",
    typ_class: "0",
    zbon: false,
    zbonState: false,
    mordState: false,
  };

  // ============================================================================================================================
  // ================================================= States ===================================================================
  // ============================================================================================================================
  // Page state
  // 1- Main object of the page that defines all inputs values.
  let [accountsGuideData, setAccountsGuideData] = useState({});
  // 2- Page title that is defined by main drop down list of the page.
  // const [title, setTitle] = useState("");
  const [Title, setTitle] = useState("");
  // 3- Main dropdown list corresponding selection values 0:5
  // const [titleListValue, setTitleListValue] = useState();
  const [titleListValue, setTitleListValue] = useState();
  // 4- Currency drop downlist values that comes from "GET_SYSTEMSETTINGS_MONEYTYPES_LOOKUPS" API. عملة الحساب
  const setCurrencyLookup = useRef([]);
  // 5- Marketers dropdown list values that comes from "GET_MARKETERS" API. المسوق
  const setmarketers = useRef({});
  // 6- Main configuration of page { NextNumber, Class, ClassEnable} That defines الرقم - التصنيف
  // and defines if Class input is disabled التصنيف
  // This values come from "GET_ACCOUNT_TYPE" API.
  const [accountType, setAccountType] = useState({});
  // 7- Boolean for opening and closing edit or delete modals
  const [editDelete, setEditDelete] = useState(false);
  // 8- Data container for Edit buttonm that comes from "GET_EDIT_LIST" API when clicking edit  زرار التعديل
  const [editData, setEditData] = useState({});
  // 9- Defines if we want to open delete or edit modal as i use one modal for both.
  const [editDeleteStatus, setEditDeleteStatus] = useState("");
  // 10- Defines errors and setting them to the form.
  const [errors, setErrors] = useState({});
  // 11- value of the main select box that gets its list from titleList
  const [mainSelectBox, setMainSelectBox] = useState();
  // Chnage state of inputs to read only like main select box that gets its list from titleList
  const setTypeClassListStatus = useRef(false);

  // ============================================================================================================================
  // ================================================= Effects ==================================================================
  // ============================================================================================================================

  // On Start Setting Data of the page.
  useEffect(() => {
    (async () => {
      // setting initial data to state.
      setAccountsGuideData(initialData);
      // Getting currency data from API.
      var currency = await GET_SYSTEMSETTINGS_MONEYTYPES_LOOKUPS();
      // Settings currency data to state.
      setCurrencyLookup.current = currency;
      handleChange({ name: "omla_id", value: currency[0].id })
      handleChange({ name: "amla", value: currency[0].description })
      // Getting Markets data from API.
      var market = await GET_MARKETERS();
      // settings marketeres data to state
      handleChange({ name: "mosweq_id", value: market[0].id })
      setmarketers.current = market;
      // setting title depending on main drop down list to state.
      setTitle(titleList[initialData["typ_class"]].description);
      // stting value of drop down list to state.
      setTitleListValue(initialData["typ_class"]);

      // console.log(initialData["typ_class"]);
      GET_ACCOUNT_TYPE(initialData["typ_class"]).then((res) => {
        setAccountsGuideData((prevState) => ({
          ...prevState,
          num: res.NextNumber,
          class: res.Class,
          zbon: res.zbon,
          mord: res.mord,
          zbonState: res.zbon,
          mordState: res.mord,
        }));
        // Setting to state changed data on typ_class
        setAccountType(res.ClassEnable);
      });
    })();
  }, []);

  useEffect(() => {
    if (accountsGuideData["omla_id"] && setCurrencyLookup.current.length > 0) {
      var value = setCurrencyLookup.current.findIndex(c => c.id == accountsGuideData["omla_id"]);
      if (value > 0) handleChange({ name: "amla", value: setCurrencyLookup.current[value].description })
    }
  }, [accountsGuideData["omla_id"]])

  // Handling changes on page due to chnaging selection of main drop down list
  useEffect(() => {
    // Getting changed value of typ_class to use after its change.
    let value = accountsGuideData["typ_class"];

    // console.log(value);
    // this check to avoid on load firing function as account gude is undefined
    if (value !== undefined) {
      // Getting  { NextNumber, Class, ClassEnable}  from AccountType API.
      GET_ACCOUNT_TYPE(value)
        .then((res) => {
          // Setting new data due to change
          setAccountsGuideData((prevState) => ({
            ...prevState,
            typ_class: value,
            num: res.NextNumber,
            class: res.Class,
            zbon: res.zbon,
            mord: res.mord,
            zbonState: res.zbon,
            mordState: res.mord,
            omla_id: setCurrencyLookup.current[0].id,
            amla: setCurrencyLookup.current[0].description,
            mosweq_id: setmarketers.current[0].id,
          }));
          // console.log(res);
          // Setting to state changed data on typ_class
          setAccountType(res.ClassEnable);
          setTitle(titleList[value].description);

          //setNumber(NextNumber);
          //setClass(Class);

          setTitleListValue(value);
          // console.log("here");

          return res;
        })
        .catch((err) => console.log(err));
    }
  }, [mainSelectBox]);

  // Handling Chnages in inputs function
  let handleChange = useCallback(({ name, value }) => {
    setAccountsGuideData((prevState) => ({ ...prevState, [name]: value }));
  }, []);

  // Handling edit and delete modals, Iam using on modal for both so i handle here
  // which function shall show in the modal due to selected button
  let handleEditDelete = useCallback(
    async (title) => {
      if (editDelete) {
        setEditDelete(!editDelete);
      } else {
        setEditDelete(!editDelete);
        setEditDeleteStatus(title);
        var editDataObject = await GET_EDIT_LIST(titleListValue, false);
        setEditData(editDataObject);
      }
    },
    [editDelete, titleListValue]
  );

  // handling pressing new button
  let handleReset = useCallback(() => {
    setTypeClassListStatus.current = false;
    let value = accountsGuideData["typ_class"];
    GET_ACCOUNT_TYPE(value)
      .then((res) => {
        setAccountsGuideData({
          ...initialData,
          typ_class: value,
          num: res.NextNumber,
          class: res.Class,
          zbon: res.zbon,
          zbonState: res.zbon,
          mord: res.mord,
          mordState: res.mord,
          omla_id: setCurrencyLookup.current[0].id,
          amla: setCurrencyLookup.current[0].description,
          mosweq_id: setmarketers.current[0].id,
        });
        setAccountType(res.ClassEnable);
      })
      .catch((errors) => {
        console.log(errors);
      });
  }, [accountsGuideData, initialData]);

  // Handling Submit Function
  let handleSubmit = () => {
    // Deleting those props from object due to backend demand.

    // console.log(accountsGuideData);
    // delete accountsGuideData.id;
    delete accountsGuideData.read_id;
    delete accountsGuideData.read_date;
    delete accountsGuideData.endservice_date;

    // Saving data returns ID of the saved data
    // we store thid ID in the data object
    // when ID is saved to data object and we save again back end accepts this as an update not save

    POST_ACCOUNTS_GUIDE_DATA(titleListValue, accountsGuideData)
      .then((res1) => {
        if (res1.ID !== undefined) {
          setAccountsGuideData((prevState) => ({
            ...prevState,
            ["ID"]: res1.ID,
          }));

          notify(
            { message: t("Saved Successfully"), width: 600 },
            "success",
            3000
          );

          // GET_ACCOUNT_TYPE(accountsGuideData["typ_class"]).then((res2) =>
          // 	setAccountsGuideData({
          // 		...accountsGuideData,
          // 		num: res2.NextNumber,
          // 	})
          // );

          handleReset();
        } else {
          notify(
            { message: t("Updated Successfully"), width: 600 },
            "success",
            3000
          );
          handleReset();
        }
      })
      .catch((err) => {
        if (err.response.status === 400) {
          let errObj = {};
          console.log(err.response.status);

          err.response.data.Errors.forEach((element) => {
            errObj[element.Column] = element.Error;
          });
          console.log(errObj);
          setErrors(errObj);
        } else {
          console.log(err);
          return;
        }
      });
  };

  // Account Guide Edit Delete handlers
  // getting edit data
  let handleSettingAcountGuideEditDelete = useCallback((data) => {
    return setAccountsGuideData(data);
  }, []);

  // Calling delete api
  let handleDeleteRow = useCallback((id) => {
    return DELETE_ROW(id);
  }, []);

  return (
    <>
      <div className="container mt-5" dir="auto">
        {/* Part 1  */}
        <div className="mb-5 d-flex justify-content-between align-items-center">
          <h2 className="mt-0">{t(Title)}</h2>

          <SelectExpress
            dataSource={titleList}
            hoverStateEnabled={true}
            valueExpr={"id"}
            required={false}
            readOnly={setTypeClassListStatus.current}
            displayExpr={"description"}
            name="typ_class"
            value={`${accountsGuideData["typ_class"]}`}
            onValueChange={(selectedItem) => {
              handleChange({
                name: "typ_class",
                value: selectedItem,
              });
              setMainSelectBox(selectedItem);
            }}
            searchEnabled={true}
          />
        </div>

        {/* Part 2 */}
        <div className="p-3 mb-2 card">
          <h3 className="mb-3 ">{t("Basic Information")}</h3>
          <div className="double">
            <NumberBox
              label={t("Number")}
              value={accountsGuideData["num"]}
              name="num"
              handleChange={handleChange}
              required={true}
              validationErrorMessage={errors["num"]}
            />
            <TextBox
              label={t("Name")}
              value={accountsGuideData["name"]}
              name="name"
              handleChange={handleChange}
              required={true}
              validationErrorMessage={errors["name"]}
            />
            <TextBox
              label={t("English Name")}
              value={accountsGuideData["e_name_cust"]}
              name="e_name_cust"
              handleChange={handleChange}
              required={true}
              validationErrorMessage={errors["e_name_cust"]}
            />
            <NumberBox
              label={t("Phone Number")}
              value={accountsGuideData["tel"]}
              name="tel"
              handleChange={handleChange}
              required={false}
            />
            <TextBox
              label={t("Address")}
              value={accountsGuideData["addres"]}
              name="addres"
              handleChange={handleChange}
              required={false}
            />
          </div>
        </div>

        {/* Part 3  */}
        <div className="p-3 mb-2 card">
          <h3 className="mb-3 ">{t("Account opening balance")}</h3>
          {/* </div> */}
          <div className="double">
            <DateBox
              label={t("Date")}
              name="s_date"
              value={accountsGuideData["s_date"]}
              handleChange={handleChange}
              required={false}
            />
            <div className="double">
              <NumberBox
                label={t("Creditor")}
                value={accountsGuideData["daen"]}
                name="daen"
                handleChange={handleChange}
                required={true}
                validationErrorMessage={errors["daen"]}
              />
              <NumberBox
                label={t("Debit")}
                value={accountsGuideData["mden"]}
                name="mden"
                handleChange={handleChange}
                required={true}
                validationErrorMessage={errors["mden"]}
              />
            </div>
          </div>

          <div className="double ">
            <SelectBox
              label={t("Account currency")}
              dataSource={setCurrencyLookup.current}
              keys={{ id: "id", name: "description" }}
              name="omla_id"
              value={accountsGuideData["omla_id"]}
              handleChange={handleChange}
              required={false}
            />
            <NumberBox
              label={t("conversion rate")}
              value={accountsGuideData["ex_rate"]}
              name="ex_rate"
              handleChange={handleChange}
              required={false}
            />
          </div>
        </div>

        {/* Part4 */}
        <div className="p-3 mb-2 card">
          <h3 className="mb-3 ">
            {t("Terms of dealing and account classification")}
          </h3>
          <div className="double">
            <TextBox
              label={t("Categorize")}
              name="class"
              value={accountsGuideData["class"]}
              readOnly={accountType} // we get read only value from api that tells if this value is true or false that "ClassEnable" determines
              handleChange={handleChange}
              required={false}
            />
            <SelectBox
              dataSource={setmarketers.current}
              label={t("Marketer")}
              value={accountsGuideData["mosweq_id"]}
              name="mosweq_id"
              handleChange={handleChange}
              required={false}
            />
            <NumberBox
              label={t("Maximum Debt")}
              value={accountsGuideData["aksa"]}
              name="aksa"
              handleChange={handleChange}
              required={false}
            />
            <NumberBox
              label={t("Maximum Duration of Debt")}
              value={accountsGuideData["den_date"]}
              name="den_date"
              handleChange={handleChange}
              required={false}
            />
          </div>
          <div className="double">
            <SelectBox
              dataSource={assumedSellingPrice}
              keys={{ id: "id", name: "description" }}
              label={t("default selling price")}
              name="defult_price"
              value={`${accountsGuideData["defult_price"]}`}
              handleChange={handleChange}
              required={false}
            />
          </div>
          <div className="double">
            <CheckBox
              label={t("Cutsomer")}
              value={accountsGuideData["zbon"]}
              name="zbon"
              handleChange={handleChange}
              required={accountsGuideData["zbonState"]}
              readOnly={accountsGuideData["zbonState"]}
              validationErrorMessage={errors["zbon"]}
            />
            <CheckBox
              label={t("Supplier")}
              value={accountsGuideData["mord"]}
              name="mord"
              handleChange={handleChange}
              required={accountsGuideData["mordState"]}
              readOnly={accountsGuideData["mordState"]}
              validationErrorMessage={errors["mord"]}
            />
            <CheckBox
              label={t("Open")}
              value={accountsGuideData["open1"]}
              name="open1"
              handleChange={handleChange}
              required={false}
            />
            <CheckBox
              label={t("Show")}
              value={accountsGuideData["show"]}
              name="show"
              handleChange={handleChange}
              required={false}
            />
          </div>
        </div>

        {/* Part5 */}
        <div className="p-3 mb-2 card">
          <h3 className="mb-3 ">{t("Customize")}</h3>
          <div className="double ">
            <TextBox
              label={t("English")}
              value={accountsGuideData["e_name_cust"]}
              name="e_name_cust"
              handleChange={handleChange}
              required={false}
            />
            <NumberBox
              label={t("Phone Number")}
              value={accountsGuideData["phone_active"]}
              name="phone_active"
              handleChange={handleChange}
              required={false}
            />
            <TextBox
              label={t("Note")}
              value={accountsGuideData["rem"]}
              name="rem"
              handleChange={handleChange}
              required={false}
            />
            <TextBox
              label={t("E-mail")}
              value={accountsGuideData["cust_mail"]}
              name="cust_mail"
              handleChange={handleChange}
              required={false}
            />
            <TextBox
              label={t("User")}
              value={accountsGuideData["cust_user"]}
              name="cust_user"
              handleChange={handleChange}
              required={false}
            />
            <TextBox
              mode="password"
              label={t("Password")}
              value={accountsGuideData["cust_pass"]}
              name="cust_pass"
              handleChange={handleChange}
              required={false}
            />
          </div>
        </div>

        {accountsGuideData.ID && (
          <div className="p-3 card">
            <div className="p-3 mb-2 card">
              <AccountsGuideMoneyTypesTable userId={accountsGuideData.ID} />
            </div>
          </div>
        )}

        <div className="d-flex flex-column justify-content-center align-content-center">
          <div className="dx-fieldset" style={{ width: "15%" }}>
            <ValidationSummary id="summary"></ValidationSummary>
          </div>
          <ButtonRow
            onSubmit={handleSubmit}
            onEdit={handleEditDelete}
            onUndo={handleReset}
            onNew={handleReset}
            onDelete={handleEditDelete}
            isSimilar={false}
            isExit={false}
          />
        </div>

        {/* Edit and Delete Popup */}
        {editDelete && (
          <Popup
            maxWidth={"100%"}
            minWidth={250}
            minHeight={"50%"}
            closeOnOutsideClick={true}
            visible={editDelete}
            onHiding={handleEditDelete}
            title={editDeleteStatus == "edit" ? t("Edit") : t("Delete")}
          >
            <ScrollView>
              <AccountsGuideEditDelete
                data={editData}
                close={handleEditDelete}
                getEditData={handleSettingAcountGuideEditDelete}
                listItem={accountsGuideData["typ_class"]}
                dataList={titleList}
                editDeleteStatus={editDeleteStatus}
                columnAttributes={columnAttributes}
                deleteItem={handleDeleteRow}
                typeClassStatus={setTypeClassListStatus}
              />
            </ScrollView>
          </Popup>
        )}
        {/* </Profiler> */}
      </div>
    </>
  );
}

export default AccountsGuide;
