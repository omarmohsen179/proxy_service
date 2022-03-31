// React
import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";

import useKeyboardShortcut from "use-keyboard-shortcut";

// DevExpress
// import "devextreme/dist/css/dx.common.css";
// import "devextreme/dist/css/dx.light.css";
import { Popup } from "devextreme-react/popup";
import ScrollView from "devextreme-react/scroll-view";
import notify from "devextreme/ui/notify";
import { NumberBox as NumberExpress } from "devextreme-react";
import { Button } from "devextreme-react/button";

// Components
import {
  TextBox,
  NumberBox,
  SelectBox,
  DateBox,
  CheckBox,
  TextArea,
} from "../Inputs";
import FirstSecondParts from "../../Modals/Bills/FirstSecondParts";
import BillHeader from "../../Components/SharedComponents/BillHeader";
import ButtonRow from "../../Components/SharedComponents/buttonsRow";
import EditDelete1 from "./EditDelete1";

// API
import {
  // Gets main parts data "الطرف الأول - الطرف التاني " depending on page name "إيصال قبض، سند صرف"
  //  takse: TransactionName : name of page like : إيصال قبض ...etc
  //  returns:  "moaamla_id" from this which is the id of the page name
  TRANSACTION_TYPE,
  TRANSACTIONS_DATA,
  // Get Next Number : قيمة رقم الإيصال والتي تعتبر مثل  أي دي يزداد بعد التخزين في الداتا بيز مثلًا
  // takes: moaamla_id, the id of the page name for example:  id of إيصال قبض
  TRANSACTIONS_NUMBER,
  INSERT_UPDATE,
  DELETE_TRANSACTION,
} from "../../Services/ApiServices/Bills/BillsTabAPI";

import { GET_CUSTOMERS_MONEY_TYPES } from "../../Templetes/Invoice/Components/InvoiceInformation/API.InvoiceInformation";

// المسوقين
import { GET_MARKETERS as getMarketers } from "../../Services/ApiServices/General/LookupsAPI";
import { INVOICE_CAPTURE_RECEIPT } from "../../Services/ApiServices/Bills/BillsTabAPI";
import { useTranslation } from "react-i18next";

//////////////////////////////////////////////////////-- Main Function --///////////////////////////////////////////////////////
function Bill(props) {
  const { billTitle, isType, outerDataObject, togglePopup } = props;
  // Lists
  // Initial Values
  // Edit and Delete popups columns names
  let initialValue = useRef({
    Ex_rate1: 0,
    Ex_rate2: 0,
    //ID: 0,
    active_phone: "0",
    cust_id1: 0,
    cust_id2: 0,
    date_esthkak: new Date(),
    datee: new Date(),
    decim1: "",
    decim2: "",
    dis1: "0",
    dis2: "0",
    emp_id: 0,
    index_note: "",
    kema1: "0",
    kema2: "0",
    moaamla_id: 0, // نوع المعاملة سواء كانت إيصال قبض أو سند صرف أو أو
    mosweq_id: 0,
    mosweq_name: "",
    name1: "",
    name2: "",
    notes: "",
    num_code_cust1: 0,
    num_code_cust2: 0,
    num_doc: "",
    num_moaamla: 0,
    omla_id1: 0,
    omla_id2: 0,
    omla_name1: "دينار ليبي",
    omla_name2: "دينار ليبي",
    sendName: "",
    st_table1: 0,
    st_table2: 0,
    takseem1: 0,
    takseem2: 0,
    typ: "نقدي",
    Debit: 0,
  });

  // Kind List : النوع
  let typeList = useMemo(() => {
    return [
      { id: 1, description: "نقدي" },
      { id: 2, description: "صك" },
      { id: 3, description: "حوالة" },
    ];
  }, []);

  // Edit and Delete popups columns names
  let columnAttributes = useMemo(() => {
    return [
      { field: "num_moaamla", caption: "الرقم", isVisable: true },
      { field: "datee", caption: "التاريخ", isVisable: true },
      { field: "name1", caption: "الطرف الأول", isVisable: true },
      { field: "name2", caption: "الطرف الثاني", isVisable: true },
      { field: "kema1", caption: "القيمة", isVisable: true },
      { field: "index_note", caption: "ملاحظات", isVisable: true },
    ];
  }, []);

  // State
  // Main Data of the page
  const [data, setData] = useState(initialValue.current);
  // First and second parts data
  const [mainPart, setmainPart] = useState([]);
  // Get Mosaweq data "Lookup"
  const setMarketers = useRef();
  // Determine Value of List of types النوع
  const [typeListValue, setTypeListValue] = useState(1);
  // Determine visibility of first part popup or second part popup
  const [fisrtSecondPartsVisbility, setFisrtSecondPartsVisbility] =
    useState(false);
  // Get Initial ID of Mosaweq  المسوق to use in getting popups data
  const setMarketerInitialId = useRef();
  // Define which part we are opening its popup, we send this data to to the pop up to determine
  const setFisrtOrSecondParts = useRef();
  // Get data on choosing item in firt part pop up or item in second part lookup
  const [fisrtSecondPartsData, setFisrtSecondPartsData] = useState();
  // First and second parts labels determining
  const firstPartLabel = useRef(" ");
  const secondPartLabel = useRef(" ");
  // Define NextNumber
  const nextNumber = useRef("");
  // Handle close and openn delete and edit popups
  const [editDelete, setEditDelete] = useState(false);
  // Edit and delete popup data list
  const [editDeleteData, setEditDeleteData] = useState();
  // Setting errors list to display on submit
  const [error, setError] = useState([]);
  // Check if we pressed edit or delete buttons and pass this to popups
  const [editDeleteStatus, setEditDeleteStatus] = useState("");
  // If submit state
  const [ifSubmit, setIfSubmit] = useState(false);
  const [invoiceDataObject, setInvoiceDataObject] = useState();
  const { t, i18n } = useTranslation();
  const firstSideButtonState = useRef("");

  useEffect(() => {
    // console.log(outerDataObject);
    outerDataObject &&
      INVOICE_CAPTURE_RECEIPT(
        outerDataObject.caption,
        outerDataObject.mosweq_id,
        outerDataObject.accountId
      )
        .then((res) => setInvoiceDataObject(res))
        .catch((err) => console.log(err));
  }, [outerDataObject]);

  // Getting Data APIs
  useEffect(() => {
    if (invoiceDataObject && Object.keys(invoiceDataObject).length > 0) {
      setData(invoiceDataObject[0]);
      firstSideButtonState.current = "d-none";
    } else {
      // Get page data
      // console.log("NOTinvoiceDataObjectEFFECT");
      TRANSACTION_TYPE(billTitle, i18n.language === "en" ? 1 : 0)
        .then((res) => {
          setmainPart(res);
          firstPartLabel.current = res.TransactionInfo[0].byan_F;
          secondPartLabel.current = res.TransactionInfo[0].byan_S;

          if (res.FirstSide.length > 0 && res.SecondSide.length) {
            setData((prevState) => ({
              ...prevState,
              st_table1: res.FirstSide[0].Index,
              st_table2: res.SecondSide[0].Index,
              moaamla_id: res.TransactionInfo[0].moaamla_id,
            }));
            initialValue.current.st_table1 = res.FirstSide[0].Index;
            initialValue.current.st_table2 = res.SecondSide[0].Index;
          }

          initialValue.current.moaamla_id = res.TransactionInfo[0].moaamla_id;
          return res;
        })
        .then((res) => {
          TRANSACTIONS_NUMBER(res.TransactionInfo[0].moaamla_id).then((res) => {
            nextNumber.current = res.NextNumber;
            // console.log("TRANSACTIONS_NUMBER");
            setData((prevState) => ({
              ...prevState,
              num_moaamla: res.NextNumber,
            }));
          });
        })
        .catch((err) => console.log(err));
    }
    getMarketers()
      .then((res) => {
        setMarketers.current = res;
      })
      .catch((err) => console.log(err));
  }, [invoiceDataObject, i18n.language]);

  // // in case of sales bill
  // useEffect(() => {
  // 	console.log("invoiceDataObject", invoiceDataObject);
  // 	console.log("here2");
  // 	TRANSACTION_TYPE(billTitle)
  // 		.then((res) => {
  // 			// console.log(["TRANSACTION_TYPE", res]);
  // 			setData((prevState) => ({
  // 				...prevState,
  // 				...invoiceDataObject,
  // 				st_table1: res.FirstSide[0].Index,
  // 				st_table2: res.FirstSide[0].Index,
  // 				moaamla_id: res.TransactionInfo[0].moaamla_id,
  // 			}));
  // 		})
  // 		.catch((err) => console.log(err));
  // }, []);

  // Setting initial data of المسوق to get popups data
  // this depends on changing selection of drop down list of المسوق
  useEffect(() => {
    if (data["mosweq_id"] != undefined) {
      setMarketerInitialId.current = data["mosweq_id"];
      // console.log(data["mosweq_id"]);
    }
  }, [data["mosweq_id"]]);

  //
  // ──────────────────────────────────────────────────────────────── MONEYTYPE ─────
  //

  const [moneyTypes, setMoneyTypes] = useState([]);
  const [selectedMoneyType1, setSelectedMoneyType1] = useState(0);
  const [selectedMoneyType2, setSelectedMoneyType2] = useState(0);

  const updateBillInformation = useCallback((e) => {
    setData((prevBill) => ({ ...prevBill, [e.name]: e.value }));
  }, []);

  useEffect(() => {
    // console.log(moneyTypes);
  }, [moneyTypes]);

  useEffect(() => {
    // Get Customers Money Types
    GET_CUSTOMERS_MONEY_TYPES().then((response) => {
      if (response) {
        setMoneyTypes(response);
        setSelectedMoneyType1(response[0].omla_id);
        setSelectedMoneyType2(response[0].omla_id);
      }
    });
  }, []);

  useEffect(() => {
    let selected = moneyTypes.find(
      (moneyType) => moneyType.omla_id === selectedMoneyType1
    );

    if (selected) {
      updateBillInformation({
        name: "omla_id1",
        value: selected.omla_id,
      });
      updateBillInformation({
        name: "Ex_rate1",
        value: selected.Ex_Rate,
      });
      updateBillInformation({
        name: "takseem1",
        value: selected.takseem,
      });
    }
  }, [selectedMoneyType1]);

  useEffect(() => {
    let selected = moneyTypes.find(
      (moneyType) => moneyType.omla_id === selectedMoneyType2
    );

    if (selected) {
      updateBillInformation({
        name: "omla_id2",
        value: selected.omla_id,
      });
      updateBillInformation({
        name: "Ex_rate2",
        value: selected.Ex_Rate,
      });
      updateBillInformation({
        name: "takseem2",
        value: selected.takseem,
      });
    }
  }, [selectedMoneyType2]);

  useEffect(() => {
    let value = (data["kema2"] / data["Ex_rate2"]) * data["Ex_rate1"];
    if (isNaN(value)) value = 0;

    if (value != data["kema1"]) setData((prev) => ({ ...prev, kema1: value ?? 0 }));
  }, [data["kema2"], data["Ex_rate2"]]);

  useEffect(() => {
    let value = (data["kema1"] / data["Ex_rate1"]) * data["Ex_rate2"];
    if (isNaN(value)) value = 0;

    if (value != data["kema2"]) setData((prev) => ({ ...prev, kema2: value ?? 0 }));
  }, [data["kema1"], data["Ex_rate1"]]);

  //
  // ──────────────────────────────────────────────────────────────── MONEYTYPE ─────
  //

  // As we get data of this list from database by "selected item name" not index we are managing it like this
  // value of drop down list comes in object of data as a name "نقدي" for example no as an index, so
  // we make this logic to accept this name and turns it into index to enable our dropdown list reading it.
  useEffect(() => {
    if (data["typ"] != undefined) {
      let typeListName = typeList.filter(
        (item) => item.description == data["typ"]
      );
      var typeListId = typeListName[0].id - 1;
      setTypeListValue(typeList[typeListId].id);
    }
  }, [data["typ"]]);

  //Setting data to Model after selecting items from popups
  useEffect(() => {
    if (fisrtSecondPartsData && setFisrtOrSecondParts.current === "FirstSide") {
      let obj = {
        cust_id1: fisrtSecondPartsData.id,
        name1: fisrtSecondPartsData.name,
        omla_id1: fisrtSecondPartsData.omla_id,
        omla_name1: fisrtSecondPartsData.Omla,
        Debit: fisrtSecondPartsData.rased,
      };

      if (obj.cust_id1 != undefined) {
        setSelectedMoneyType1(fisrtSecondPartsData.omla_id);
        // console.log("if (obj.cust_id1 != undefined)");
        setData((prevState) => ({ ...prevState, ...obj }));
      }
    } else if (
      fisrtSecondPartsData &&
      setFisrtOrSecondParts.current === "SecondSide"
    ) {
      let obj = {
        cust_id2: fisrtSecondPartsData.id,
        name2: fisrtSecondPartsData.name,
        omla_id2: fisrtSecondPartsData.omla_id,
        omla_name2: fisrtSecondPartsData.Omla,
      };


      if (obj.cust_id2 != undefined) {
        setSelectedMoneyType2(fisrtSecondPartsData.omla_id);
        // console.log("else if (obj.cust_id1 != undefined)");
        setData((prevState) => ({ ...prevState, ...obj }));
      }
    }
  }, [fisrtSecondPartsData]);

  // Handelers
  // handle Next Number
  let handleNextNumber = useCallback(async () => {
    // console.log("handleNextNumber");
    // console.log(mainPart);
    if (mainPart?.TransactionInfo != undefined) {
      await TRANSACTIONS_NUMBER(mainPart.TransactionInfo[0].moaamla_id).then(
        (res) => {
          nextNumber.current = res.NextNumber;
        }
      );
    }
  }, [mainPart]);

  let handleReset = useCallback(
    async (buttonType) => {
      setError([]);
      await handleNextNumber();
      // setData(prev => ({ ...initialValue.current, num_moaamla: nextNumber.current, omla_id1: prev.omla_id1, Ex_rate1: prev.Ex_rate1, omla_id2: prev.omla_id2, Ex_rate2: prev.Ex_rate2 }));
      setData((prev) => ({
        ...initialValue.current,
        num_moaamla: nextNumber.current,
      }));
      setSelectedMoneyType1(0);
      setSelectedMoneyType2(0);
      setSelectedMoneyType1(moneyTypes[0].omla_id);
      setSelectedMoneyType2(moneyTypes[0].omla_id);
      setTypeListValue(1);
      firstSideButtonState.current = "";
    },
    [handleNextNumber, moneyTypes]
  );

  let handleEditDelete = useCallback(
    async (buttonType) => {
      setError([]);
      setEditDelete((prevState) => !prevState);
      if (mainPart.TransactionInfo != undefined && editDelete == false) {
        await TRANSACTIONS_DATA(mainPart.TransactionInfo[0].moaamla_id)
          .then((res) => {
            setEditDeleteData(res);
          })
          .catch((err) => console.log(err));
      }
    },
    [editDelete, mainPart]
  );

  let handleSubmit = async () => {
    let errArr = [];
    if (data.name1.length === 0)
      errArr.push(`  "${firstPartLabel.current}" ${t("Required")}`);
    if (data.name2.length === 0)
      errArr.push(`"${secondPartLabel.current}"  ${t("Required")} `);

    if (data.kema1.length === 0) {
      errArr.push(`  "القيمة" ${t("Required")} `);
    } else if (parseFloat(data.kema1) <= 0) {
      errArr.push(`  "القيمة" ${t("The value cannot be less than zero.")}`);
    }

    if (data.num_moaamla.length === 0) {
      errArr.push(`هذا الحقل "رقم الإيصال" مطلوب `);
    } else if (parseFloat(data.num_moaamla) <= 0) {
      errArr.push(`هذا الحقل "رقم الإيصال" أقل قيمه يمكن إدخالها فيه هي 1 `);
    }

    if (errArr.length > 0) {
      setError(errArr);
    } else {
      let updateData = data;
      // updateData.kema2 = data.kema1;
      // updateData.Ex_rate2 = data.Ex_rate1;
      setData(updateData);

      var Data = { Data: [updateData] };
      console.log(Data);
      if ("ID" in data) {
        await INSERT_UPDATE(billTitle, Data)
          .then(async (res) => {
            setError([]);
            notify(
              { message: t("Saved Successfully"), width: 600 },
              "success",
              3000
            );
            setIfSubmit(true);
            // Incase of using page as a modal in a popup in another page
            // so after submitting we need to close it
            if (invoiceDataObject != undefined) {
              togglePopup();
            }
            await handleReset();
          })
          .catch((err) => {
            err.response.data.Errors.map((element) => {
              errArr.push(element.Error);
            });
            setError(errArr);
          });
      } else {
        await INSERT_UPDATE(billTitle, Data)
          .then(async (res) => {
            setError([]);
            notify(
              { message: t("Saved Successfully"), width: 600 },
              "success",
              3000
            );
            setIfSubmit(true);
            // Incase of using page as a modal in a popup in another page
            // so after submitting we need to close it
            if (invoiceDataObject != undefined) {
              togglePopup();
            }

            await handleReset();
          })
          .catch((err) => {
            console.log(err.response.data.Errors);
            err.response.data.Errors.map((element) => {
              errArr.push(element.Error);
            });
            setError(errArr);
          });
      }
    }
  };

  let handleChange = useCallback(({ name, value }) => {
    setData((prevState) => ({ ...prevState, [name]: value }));
  }, []);

  let handleTypeChange = useCallback(
    ({ name, value }) => {
      let typeValue = (value - 1).toString();
      setData((prevState) => ({
        ...prevState,
        [name]: typeList[typeValue]["description"],
      }));
    },
    [data["typeValue"]]
  );

  let handleMarketerChange = useCallback(
    ({ name, value }) => {
      setMarketerInitialId.current = value;
      setData((prevState) => ({ ...prevState, [name]: value }));
    },
    [data["mosweq_id"]]
  );

  // Close Popup
  let fisrtSecondPartsVisbilityHandeler = useCallback((part) => {
    // console.log("CLicked");
    setError([]);
    setFisrtOrSecondParts.current = part;
    setFisrtSecondPartsVisbility((prev) => !prev);
    setFisrtSecondPartsData({});
  }, []);

  // First Second Parts Data
  let handleFirstSecondPartsData = useCallback((data) => {
    setFisrtSecondPartsData(data);
  }, []);

  // A function that holds the setState of the submitting state
  // this submiting stat tells if we submited so we need to re call edit data again or not
  let handleSubmitState = useCallback((data) => {
    setIfSubmit(data);
  }, []);

  // Edit Delete POP UP...
  // Holding the API that is sent to the EditDelete popup to make deletes
  let handleDeleteItem = useCallback((id) => {
    return DELETE_TRANSACTION(billTitle, id);
  }, []);

  // Holding the setState that is sent to the EditDelete popup to get data to be edited
  let handleGettingData = useCallback((data) => {
    setData(data);
  }, []);

  let name1TextButtonOptions = useMemo(() => {
    return {
      icon: "upload",
      type: "normal",
      stylingMode: "text",
      disabled: false,
      onClick: () => fisrtSecondPartsVisbilityHandeler("FirstSide"),
    };
  }, [fisrtSecondPartsVisbilityHandeler]);

  let name2TextButtonOptions = useMemo(() => {
    return {
      icon: "upload",
      type: "normal",
      stylingMode: "text",
      disabled: false,
      onClick: () => fisrtSecondPartsVisbilityHandeler("SecondSide"),
    };
  }, [fisrtSecondPartsVisbilityHandeler]);

  const firstSecondPartsCloseHandle = useCallback(
    () => {
      setFisrtSecondPartsData({})
      setFisrtSecondPartsVisbility(false)
    },
    [],
  )

  return (
    <div
      dir="auto"
      className="container mt-2 card  py-4 bill__wrapper"
      style={{ minHeight: "100px" }}
    >
      <div className="triple">
        <NumberBox
          label={t("Receipt number")}
          value={data["num_moaamla"]}
          required={true}
          name="num_moaamla"
          handleChange={handleChange}
        // validationErrorMessage={error["num_moaamla"]}
        />
        <DateBox
          label={t("Date")}
          name="datee"
          value={data["datee"]}
          handleChange={handleChange}
          required={false}
        />
        {/* <CheckBox
          className="col-1"
          label={t("Sales")}
          // value={billInformation.dis_type}
          name="dis_type"
        // onValueChanged={(e) =>
        // 	updateBillInformation({
        // 		name: "dis_type",
        // 		value: !billInformation.dis_type,
        // 	})
        // }
        /> */}
      </div>
      {/* Row2 */}
      <div>
        <div className="row gx-1">
          {/* First Part */}
          <div className="col-4">
            <TextBox
              label={firstPartLabel.current}
              value={data["name1"]}
              name="name1"
              // validationErrorMessage={error["name1"]}
              handleChange={handleChange}
              buttonOptions={name1TextButtonOptions}
              required={false}
              readOnly={true}
            />
          </div>
          <div className="col-3">
            <SelectBox
              label={t("Currency")}
              dataSource={moneyTypes}
              name="omla_id1"
              keys={{ id: "omla_id", name: "description" }}
              value={selectedMoneyType1}
              handleChange={(e) => setSelectedMoneyType1(e.value)}
            />
            {/* <TextBox
              label="العملة"
              value={data["omla_name1"]}
              name="omla_name1"
              handleChange={handleChange}
              readOnly={true}
              required={false}
            /> */}
          </div>
          <div className="col-3">
            <NumberBox
              label={t("Amount")}
              value={data["kema1"]}
              name="kema1"
              // validationErrorMessage={error["kema1"]}
              required={false}
              handleChange={handleChange}
            />
          </div>
          <div className="col-2">
            <NumberBox
              label={t("conversion rate")}
              value={data["Ex_rate1"]}
              name="Ex_rate1"
              handleChange={handleChange}
              required={false}
            />
          </div>
        </div>
        <div className="row gx-1">
          {/* Second Part */}
          <div className="col-4">
            <TextBox
              label={secondPartLabel.current}
              value={data["name2"]}
              name="name2"
              handleChange={handleChange}
              buttonOptions={name2TextButtonOptions}
              // validationErrorMessage={error["name2"]}
              required={false}
              readOnly={true}
            />
          </div>
          <div className="col-3">
            <SelectBox
              label={t("Currency")}
              dataSource={moneyTypes}
              name="omla_id2"
              keys={{ id: "omla_id", name: "description" }}
              value={selectedMoneyType2}
              handleChange={(e) => setSelectedMoneyType2(e.value)}
            />
            {/* <TextBox
              label="العملة"
              value={data["omla_name2"]}
              name="omla_name2"
              handleChange={handleChange}
              readOnly={true}
              required={false}
            /> */}
          </div>
          <div className="col-3">
            <NumberBox
              label={t("Amount")}
              value={data["kema2"]}
              name="kema2"
              // validationErrorMessage={error["kema1"]}
              required={false}
              handleChange={handleChange}
            />
          </div>
          <div className="col-2">
            <NumberBox
              label={t("conversion rate")}
              value={data["Ex_rate2"]}
              name="Ex_rate2"
              handleChange={handleChange}
              required={false}
            />
          </div>
        </div>
      </div>

      <div className="row gx-1">
        <div className="col-4">
          <NumberBox
            label={t("First commission")}
            value={data["dis1"]}
            name="dis1"
            handleChange={handleChange}
            required={false}
          />
        </div>

        <div className="col-4">
          <NumberBox
            label={t("Second commission")}
            value={data["dis2"]}
            name="dis2"
            handleChange={handleChange}
            required={false}
          />
        </div>
      </div>

      {/* Row4 */}
      <div className="row gx-1">
        <div className="col-12">
          <TextBox
            label={t("Note")}
            value={data["index_note"]}
            name="index_note"
            handleChange={handleChange}
            required={false}
          />
        </div>
      </div>

      {/* Row5 */}
      <div className="row gx-1">
        <div className="col-4">
          <SelectBox
            dataSource={setMarketers.current}
            label={t("Employee")}
            name="mosweq_id"
            value={data["mosweq_id"]}
            handleChange={handleMarketerChange}
            required={false}
          />
        </div>
        <div className="col-4">
          <TextBox
            label={t("Document")}
            value={data["num_doc"]}
            name="num_doc"
            handleChange={handleChange}
            required={false}
          />
        </div>
      </div>

      <div className="row gx-1">
        <div className="col-12">
          <TextArea
            label={t("Details")}
            value={data["index_note"]}
            name="index_note"
            handleChange={handleChange}
            required={false}
            height="100px"
          />
        </div>
      </div>

      <div className="error">
        {error && error.map((element) => <li>{element}</li>)}
      </div>
      <div className="mt-2">
        <ButtonRow
          onNew={handleReset}
          onUndo={handleReset}
          onSubmit={handleSubmit}
          onEdit={handleEditDelete}
          onDelete={handleEditDelete}
          isSimilar={false}
          isExit={false}
        />
      </div>
      {fisrtSecondPartsVisbility && <Popup
        id="FirstSecondParts"
        maxWidth={"50%"}
        minWidth={250}
        height={"600px"}
        // minHeight={"50%"}
        closeOnOutsideClick={true}
        visible={fisrtSecondPartsVisbility}
        onHiding={firstSecondPartsCloseHandle}
      >
        <ScrollView>
          <FirstSecondParts
            visable={fisrtSecondPartsVisbility}
            setMainPageData={handleGettingData}
            selectBoxData={mainPart}
            definedPart={setFisrtOrSecondParts.current}
            setFisrtSecondPartsData={handleFirstSecondPartsData}
            marketerInitialId={setMarketerInitialId.current}
            close={firstSecondPartsCloseHandle}
            submitStateHandeler={handleSubmitState}
            submitState={ifSubmit}
          />
        </ScrollView>
      </Popup>}

      <Popup
        maxWidth={"50%"}
        minWidth={250}
        minHeight={"50%"}
        closeOnOutsideClick={true}
        visible={editDelete}
        onHiding={() => setEditDelete(false)}
        title={editDeleteStatus == "edit" ? t("Edit") : t("Delete")}
      >
        <ScrollView>
          {/* Edit and delete Modal  */}
          <EditDelete1
            data={editDeleteData}
            columnAttributes={columnAttributes}
            deleteItem={handleDeleteItem}
            close={handleEditDelete}
            getEditData={handleGettingData}
          />
        </ScrollView>
      </Popup>
    </div>
  );
}

export default React.memo(Bill);
