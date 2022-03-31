// React
import React, { useState, useEffect, useCallback, useMemo } from "react";

// DevExpress
// import "devextreme/dist/css/dx.common.css";
// import "devextreme/dist/css/dx.light.css";
import { SelectBox as SelectExpress } from "devextreme-react";
import notify from "devextreme/ui/notify";
import { Popup } from "devextreme-react/popup";
import ScrollView from "devextreme-react/scroll-view";

// Components
import {
  TextBox,
  NumberBox,
  SelectBox,
  DateBox,
} from "../../../Components/Inputs";
import ButtonRow from "../../../Components/SharedComponents/buttonsRow";
import EditDelete1 from "../../../Components/SharedComponents/EditDelete1";
import { Validation } from "../../../Services/services";

// API
import {
  // get data of المصروف
  GET_COSTS_TYPES,
  // get data of last select box in page that one with no label
  GET_OTHER_ACCOUNTS,
  // get Next Number
  GET_NEXT_NUMBER,
  // Geting Data of edit or delete popup
  GET_EDIT_DELETE_DATA,
  // API to delete item in delete pop up
  DELETE_ITEM,
  // API to insert or update data depending on this object has ID or not
  // Has ID : update.
  // No ID : insert.
  INSERT_UPDATE,
} from "./API.BuyingCharges";

import {
  // get data of العملة
  GET_MONEYTYPES_LOOKUP,
} from "../../../Services/ApiServices/General/LookupsAPI";
import { useTranslation } from "react-i18next";

function BuyingCharges() {
  // ============================================================================================================================
  // ================================================= Lists ===================================================================
  // ============================================================================================================================

  // let initialData = {
  // 	ID: 1,
  // 	name: "5454fhgfh", اسم المصروف
  // 	dte: "7/15/2021", التاريخ
  // 	kema: "100", القيمة
  // 	x_rate: "1", معدل التحويل
  // 	omla: "", العملة
  // 	nots: "", الملاحظات
  // 	typ_id: 4, المصروف
  // 	cust_id: 2, الدروب التانية
  // 	state_1: 0, الحسابات
  // 	hesab_name: "خزينة المنزل", اسم الدروب التانية
  // 	num: 1,الرقم,
  // };
  const { t, i18n } = useTranslation();
  let columnAttributes = useMemo(() => {
    return [
      { field: "num", captionEn: "Number", caption: "الرقم", isVisable: true },
      { field: "dte", captionEn: "Date", caption: "التاريخ", isVisable: true },
      {
        field: "name",
        captionEn: " expense",
        caption: "المصروف",
        isVisable: true,
      },
      {
        field: "kema",
        captionEn: " value",
        caption: "القيمة",
        isVisable: true,
      },
    ];
  }, []);

  // Initial data of the page
  let initialData = {
    name: "",
    dte: Date.now(),
    kema: 0,
    x_rate: 1,
    omla: "",
    nots: "",
    typ_id: "",
    cust_id: "",
    state_1: "",
    hesab_name: "",
    num: 0,
  };

  // List of accounts الحسابات
  let accountsData = [
    { id: 0, name: t("treasury") },
    { id: 1, name: t("other accounts") },
    { id: 2, name: t("Banks") },
  ];

  // ============================================================================================================================
  // ================================================= States ===================================================================
  // ============================================================================================================================
  // Main data of the form
  const [data, setData] = useState(initialData);
  // List state of المصروف
  const [expensesList, setExpensesList] = useState([]);
  // List state of العملة
  const [currencyList, setCurrencyList] = useState([]);
  // List state of the last drop down list of page that one with no label
  const [otherAccountsList, setOtherAccountsList] = useState([]);
  // Handle close and openn delete and edit popups
  const [editDelete, setEditDelete] = useState(false);
  // Check if we pressed edit or delete buttons and pass this to popups
  const [editDeleteStatus, setEditDeleteStatus] = useState("");
  // Edit and delete popup data list
  const [editDeleteData, setEditDeleteData] = useState();
  // Error Object
  const [errors, setErrors] = useState([]);

  // ============================================================================================================================
  // ================================================= Effects ==================================================================
  // ============================================================================================================================

  useEffect(async () => {
    // Getting Next Number
    await handleNextNumber();
    // Getting Expens Data list المصروف
    await GET_COSTS_TYPES()
      .then((res) => setExpensesList(res))
      .catch((err) => console.log(err));

    // Getting Expens Data list العملة
    await GET_MONEYTYPES_LOOKUP()
      .then((res) => {
        setCurrencyList(res);
      })
      .catch((err) => console.log(err));
  }, []);

  // Effect that get data source of last drop dwon list with no label
  // which changes on change of الحسابات
  useEffect(() => {
    if (data.state_1 !== "") {
      GET_OTHER_ACCOUNTS(data.state_1)
        .then((res) => setOtherAccountsList(res))
        .catch((err) => console.log(err));
    }
  }, [data.state_1]);

  useEffect(() => {
    if (data.typ_id !== "") {
      let expensesName = expensesList.filter(
        (element) => element.id == data.typ_id
      )[0];

      expensesName &&
        setData((prevState) => ({
          ...prevState,
          name: expensesName.description,
        }));
    }
  }, [data.typ_id]);

  useEffect(() => {
    if (data.cust_id != "") {
      let otherAccountsName = otherAccountsList.filter(
        (element) => element.cust_id == data.cust_id
      )[0];

      otherAccountsName &&
        setData((prevState) => ({
          ...prevState,
          hesab_name: otherAccountsName.hesab_name,
        }));
    }
  }, [data.cust_id]);
  // ============================================================================================================================
  // ================================================= handelers ================================================================
  // ============================================================================================================================

  // Handle Change
  let handleChange = ({ name, value }) => {
    setData((prevState) => ({ ...prevState, [name]: value }));
  };

  let handleEditDelete = useCallback(
    async (buttonType) => {
      setErrors([]);
      setEditDeleteStatus(buttonType);
      setEditDelete((prevState) => !prevState);
      await GET_EDIT_DELETE_DATA()
        .then((res) => {
          setEditDeleteData(res);
        })
        .catch((err) => console.log(err));
    },
    [editDelete]
  );

  // Reseting Form
  let handleReset = useCallback(async () => {
    setErrors([]);
    setData({ ...initialData });
    await handleNextNumber();
  });

  let handleNextNumber = async () => {
    await GET_NEXT_NUMBER()
      .then((res) => {
        setData((prevState) => ({ ...prevState, num: res.NextNumber }));
      })
      .catch((err) => console.log(err));
  };

  let handleSubmit = async () => {
    let labelsObject = {
      name: "الرقم",
      typ_id: "المصروف",
      dte: "التاريخ",
      kema: "القيمة",
      x_rate: "معدل التحويل",
      omla: "العملة",
      state_1: "الحسابات",
      cust_id: "الحسابات الأخرى",
    };

    let errArr = Validation(data, labelsObject, ["nots", "hesab_name"]);

    if (errArr.length > 0) {
      setErrors(errArr);
    } else {
      let updateData = data;
      updateData.dte = new Date(data.dte);
      var Data = { Data: [updateData] };

      if ("ID" in data) {
        await INSERT_UPDATE(Data)
          .then(async (res) => {
            setErrors([]);
            notify(
              { message: t("Saved Successfully"), width: 600 },
              "success",
              3000
            );

            await handleReset();
          })
          .catch((err) => {
            err.response.data.Errors.map((element) => {
              errArr.push(element.Error);
            });
            setErrors(errArr);
          });
      } else {
        await INSERT_UPDATE(Data)
          .then(async (res) => {
            setErrors([]);
            notify(
              { message: t("Saved Successfully"), width: 600 },
              "success",
              3000
            );
            await handleReset();
          })
          .catch((err) => {
            console.log(err.response.data.Errors);
            err.response.data.Errors.map((element) => {
              errArr.push(element.Error);
            });
            setErrors(errArr);
          });
      }
    }
  };

  let handleTitle = useCallback(() => {
    return editDeleteStatus === "edit" ? t("Edit") : t("Remove");
  }, [editDeleteStatus, t]);

  // Holding the setState that is sent to the EditDelete popup to get data to be edited
  let handleGettingData = useCallback((data) => {
    setData({ ...data, omla: parseInt(data.omla) });
  }, []);

  // Edit Delete POP UP...
  // Holding the API that is sent to the EditDelete popup to make deletes
  let handleDeleteItem = useCallback((id) => {
    return DELETE_ITEM(id);
  }, []);

  return (
    <>
      <div className="container mt-5">
        <div className="mb-2">
          <div
            className="mb-5 w-100 d-flex justify-content-center h2"
            style={{ fontWeight: "bold" }}
          >
            {t("purchase expenses")}
          </div>
          {/* Row1 */}
          <div className="double">
            <NumberBox
              label={t("Number")}
              value={data["num"]}
              name="num"
              handleChange={handleChange}
            />
            <SelectBox
              label={t("Expense")}
              dataSource={expensesList}
              keys={{ id: "id", name: "description" }}
              value={data["typ_id"]}
              name="typ_id"
              handleChange={handleChange}
            />
          </div>
          {/* Row2 */}
          <div className="double">
            <DateBox
              label={t("Expense")}
              name="dte"
              value={data["dte"]}
              handleChange={handleChange}
            />
            <div className="double">
              <NumberBox
                label={t("Cost")}
                value={data["kema"]}
                name="kema"
                handleChange={handleChange}
              />
              <NumberBox
                label={t("conversion rate")}
                value={data["x_rate"]}
                name="x_rate"
                handleChange={handleChange}
              />
            </div>
          </div>
          {/* Row3 */}
          <div className="double">
            <SelectBox
              label={t("the currency")}
              keys={{ id: "id", name: "description" }}
              dataSource={currencyList}
              value={data["omla"]}
              name="omla"
              handleChange={handleChange}
            />
            <TextBox
              label={t("Note")}
              value={data["nots"]}
              name="nots"
              handleChange={handleChange}
              required={false}
            />
          </div>
          {/* Row4 */}
          <div className="double">
            <SelectBox
              label={t("Accounts")}
              dataSource={accountsData}
              value={data["state_1"]}
              name="state_1"
              handleChange={handleChange}
            />
            <SelectExpress
              dataSource={otherAccountsList}
              displayExpr="hesab_name"
              valueExpr="cust_id"
              className="input-wrapper"
              name="cust_id"
              value={data["cust_id"]}
              readOnly={data["state_1"] === "" ? true : false}
              onValueChange={(selectedItem) =>
                handleChange({
                  name: "cust_id",
                  value: selectedItem,
                })
              }
            />
          </div>
        </div>
        {/* Row5 */}
        <div className="error mb-3" dir="rtl">
          {errors && errors.map((element) => <li>{element}</li>)}
        </div>
        <ButtonRow
          isSimilar={false}
          isExit={false}
          onNew={handleReset}
          onUndo={handleReset}
          onSubmit={handleSubmit}
          onEdit={handleEditDelete}
          onDelete={handleEditDelete}
        />

        <Popup
          maxWidth={"50%"}
          minWidth={250}
          minHeight={"50%"}
          closeOnOutsideClick={true}
          visible={editDelete}
          onHiding={handleEditDelete}
          title={handleTitle}
        >
          <ScrollView>
            {/* Edit and delete Modal  */}
            <EditDelete1
              data={editDeleteData}
              columnAttributes={columnAttributes}
              deleteItem={handleDeleteItem}
              close={handleEditDelete}
              getEditData={handleGettingData}
              editDeleteStatus={editDeleteStatus}
            />
          </ScrollView>
        </Popup>
      </div>
    </>
  );
}

export default BuyingCharges;
