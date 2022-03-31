import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";

import { Button } from "devextreme-react/button";
import DateTime from "../../../Components/Inputs/DateTime";
import SelectBox from "../../../Components/Inputs/SelectBox";
import notify from "devextreme/ui/notify";
import MasterTable from "../../../Components/SharedComponents/Tables Components/MasterTable.jsx";
import TextBox from "../../../Components/Inputs/TextBox.js";
import NumberBox from "../../../Components/Inputs/NumberBox.js";
import MiscellaneousButtonBar from "../../../Components/SharedComponents/MiscellaneousButtonBar/MiscellaneousButtonBar.jsx";
import {
  NEXT_NUMBER,
  GET_ITEM_INFO,
  GET_OTHER_INVOICE,
  DELETE_INVOICE,
  INVOICE_TRANSACTION,
  GET_OTHER_INVOICE_ITEM,
  DELETE_INVOICE_ITEM,
} from "./API.ReCredit";
import ButtonRow from "../../../Components/SharedComponents/buttonsRow";
import EditDelete from "../../../Components/SharedComponents/EditDelete1";
import Joi from "joi";
import { SpeedDialAction } from "devextreme-react/speed-dial-action";
import { Popup } from "devextreme-react/popup";
import { validateForm } from "../../../Services/services";
import EditDeleteScroll from "../../../Components/SharedComponents/EditDeleteScroll";
import { t } from "i18next";
import { useTranslation } from "react-i18next";

function ReCredit(props) {
  const { t, i18n } = useTranslation();
  const [data, setData] = useState([]);
  const [errors, setErrors] = useState({});
  const [editDeleteStatus, setEditDeleteStatus] = useState("");
  const [dailog, setdialog] = useState(false);
  const [DisableInputs, setDisableInputs] = useState(false);
  const today = useMemo(() => {
    let defualtdateValue = new Date();
    return (
      (parseInt(defualtdateValue.getMonth()) + 1).toString() +
      "/" +
      defualtdateValue.getDate() +
      "/" +
      defualtdateValue.getFullYear()
    ).toString();
  }, []);
  let initialValueInvoice = useRef({
    e_date: today,
    e_no: 0,
    nots: "",
  });
  let initialValueInvoiceItem = useMemo(() => {
    return {
      m_no: 0,
      item_id: 0,
      item_no: 0,
      item_name: "",
      ActuallyQuantity: 0,
      cse: "زائد",
      Almogod: 0,
      kmea: 0,
      ExpiredDates: [],
      Exp_date: "",
      Exp_data_id: 0,
    };
  }, []);
  const [Invoice, setInvoice] = useState(initialValueInvoice.current);
  const [InvoiceItem, setInvoiceItem] = useState(initialValueInvoiceItem);
  let [InvoiceItemData, setInvoiceItemData] = useState([]);

  const colAttributes = useMemo(() => {
    return [
      {
        caption: "رقم الصنف ",
        captionEn: " Number ",
        field: "item_no",
      },
      { caption: " اسم الصنف", captionEn: " Name ", field: "item_name" },
      { caption: "الصلاحيه", captionEn: " Expairy ", field: "Exp_date" },
      { caption: "  الكميه", captionEn: " Quantity ", field: "kmea" },
      { caption: "+/-", field: "cse" },
      { caption: "السعر", captionEn: " Price ", field: "items_price" },
      { caption: "الأجمالي", captionEn: " Total ", field: "items_pgmla" },
      { caption: "الملاحظه", captionEn: " Note ", field: "nesba" },
    ];
  }, []);
  const columnAttributesEditDelet = useMemo(() => {
    return [
      {
        caption: "رقم  ",
        captionEn: " Number ",
        field: "e_no",
      },
      { caption: "تاريخ  ", captionEn: " Date ", field: "e_date" },
      { caption: "ملاحظه", captionEn: " Note ", field: "nots" },
      { caption: "  أجمالي", captionEn: " Total ", field: "total" },
    ];
  }, []);
  var schema = useMemo(() => {
    return {
      m_no: Joi.number().required().greater(0).required().messages({
        "any.required": "Number is Required ",
        "number.greater": `هذا الحقل مطلوب `,
      }),
      nots: Joi.string().empty("").required().messages({
        "any.required": "This Input is Required",
        "string.empty": "This Input is Required",
      }),
      item_id: Joi.number().required().greater(0).required().messages({
        "any.required": "Number is Required ",
        "number.greater": "This number must be greater than zero.",
      }),
      kmea: Joi.number().required().greater(0).required().messages({
        "any.required": "Number is Required ",
        "number.greater": "This number must be greater than zero.",
      }),
      Almogod: Joi.number().required().greater(-1).required().messages({
        "any.required": "Number is Required ",
        "number.greater": "This number must be greater than zero.",
      }),
      e_date: Joi.date()
        .required()
        .messages({ "any.required": "This Input is Required" }),
      e_no: Joi.number().required().greater(0).required().messages({
        "any.required": "This Input is Required",
        "number.greater": "This number must be greater than zero.",
      }),
    };
  }, []);

  let handleChangeInvoiceItem = useCallback(
    ({ name, value }) => {
      console.log("handleChangeInvoiceItem");

      if (name == "Almogod") {
        if (value > InvoiceItem.ActuallyQuantity) {
          let k =
            parseInt(name == "Almogod" ? value : InvoiceItem.Almogod) +
            parseInt(InvoiceItem.ActuallyQuantity);
          setInvoiceItem((prevState) => ({
            ...prevState,
            [name]: value,
            cse: "زائد",
            kmea: k,
          }));
        } else if (value <= InvoiceItem.ActuallyQuantity) {
          let k =
            parseInt(InvoiceItem.ActuallyQuantity) -
            parseInt(name == "Almogod" ? value : InvoiceItem.Almogod);
          setInvoiceItem((prevState) => ({
            ...prevState,
            [name]: value,
            cse: "ناقص ",
            kmea: k,
          }));
        }
      } else {
        if (name == "Exp_data_id") {
          setInvoiceItem((prevState) => ({
            ...prevState,
            [name]: value,
            Exp_date: InvoiceItem.ExpiredDates.findIndex((x) => x.id === value),
          }));
        } else {
          setInvoiceItem((prevState) => ({ ...prevState, [name]: value }));
        }
      }
    },
    [InvoiceItem]
  );

  let handleChangeInvoice = useCallback(
    ({ name, value }) => {
      console.log("handleChange");
      setInvoice((prevState) => ({ ...prevState, [name]: value }));
    },
    [Invoice]
  );
  useEffect(() => {
    if (Invoice.ID) {
      setDisableInputs(true);
    } else {
      setDisableInputs(false);
    }
  }, [Invoice.ID]);
  const closePopup = useCallback(async () => {
    setdialog(false);
  }, []);
  const onUpdate = useCallback(async () => {
    setEditDeleteStatus("edit");

    setData(
      (await GET_OTHER_INVOICE({ skip: 0, take: 100, FilterQuery: "" })).data
    );
    setdialog(!dailog);
  }, [dailog]);
  const onDelete = useCallback(async () => {
    setEditDeleteStatus("delete");
    setData(
      (await GET_OTHER_INVOICE({ skip: 0, take: 100, FilterQuery: "" })).data
    );
    setdialog(!dailog);
  }, [dailog]);

  const onNew = useCallback(async () => {
    console.log("onNew");

    setInvoice({
      ...initialValueInvoice.current,
      e_no: (await NEXT_NUMBER()).InvoiceNumber,
    });

    setInvoiceItemData([]);
    setInvoiceItem({ ...initialValueInvoiceItem, m_no: InvoiceItem.m_no });
  }, [InvoiceItem]);
  const setValuesEditDelete = useCallback(async (value) => {
    setInvoice(value);
    setInvoiceItemData(await GET_OTHER_INVOICE_ITEM(value.ID));
  }, []);

  useEffect(async () => {
    setInvoice({
      ...initialValueInvoice.current,
      e_no: (await NEXT_NUMBER()).InvoiceNumber,
    });
  }, []);
  let Delete_Invoice_item = useCallback(
    async (data) => {
      return await DELETE_INVOICE_ITEM(Invoice.ID, data.data.ID);
    },
    [Invoice]
  );

  let searchItemCallBackHandleStore = useCallback((res) => {
    setInvoiceItem((prevState) => ({
      ...prevState,
      item_name: res.item_name,
      item_id: res.id,
      item_no: res.item_no,
      ActuallyQuantity: res.ActuallyQuantity,
      ExpiredDates: res.ExpiredDates,
      Exp_date: res.ExpiredDates[0] ? res.ExpiredDates[0].Exp_date : "1/1/2050",
      p_tkl: res.p_tkl,
    }));
  }, []);

  let submit = async (e) => {
    e.preventDefault();
    let { m_no, item_id, Almogod, kmea } = InvoiceItem;
    let { e_date, e_no, nots } = Invoice;

    let err = validateForm(
      { e_date, e_no, item_id, Almogod, m_no, kmea, nots },
      schema
    );
    if (Object.keys(err).length != 0) {
      setErrors(err);
      console.log(err);
      if (err.item_id) {
        notify(
          { message: t("You must enter a category"), width: 600 },
          "error",
          3000
        );
      } else if (err.kmea) {
        notify(
          { message: t("The value cannot be less than zero."), width: 600 },
          "error",
          3000
        );
      } else {
        notify(
          { message: t("Continue the missing data"), width: 600 },
          "error",
          3000
        );
      }
      return;
    }
    let maindata = {
      Invoice: { ...Invoice },
      InvoiceItems: [InvoiceItem],
      StoreID: InvoiceItem.m_no,
      InvoiceType: "ResetProductsQuantities",
      ID: Invoice.ID ? Invoice.ID : 0,
    };
    await INVOICE_TRANSACTION(maindata)
      .then(async (res) => {
        console.log([...InvoiceItemData, res.Item]);
        setInvoiceItemData([...InvoiceItemData, res.Item]);
        setInvoiceItem({ ...initialValueInvoiceItem, m_no: InvoiceItem.m_no });
        setInvoice({ ...Invoice, ID: Invoice.ID ? Invoice.ID : res.id });
        notify({ message: t("Add Successfully"), width: 600 }, "success", 3000);
        setErrors({});
      })
      .catch(
        ({
          response: {
            data: { Errors },
          },
        }) => {
          let responseErrors = {};
          Errors.forEach(({ Column, Error }) => {
            responseErrors = { ...responseErrors, [Column]: Error };
          });

          setErrors(responseErrors);
          notify({ message: t("Failed Try again"), width: 450 }, "error", 2000);
        }
      );
  };
  let onDeleteFun = useCallback(async (id) => {
    onNew();
    return await DELETE_INVOICE(id);
  }, []);
  return (
    <div
      dir="auto"
      className="row"
      style={{ display: "flex", justifyContent: "center", margin: 0 }}
    >
      <h1 style={{ width: "90%", textAlign: "center", padding: "2%" }}>
        {t("Talking Setup")}
      </h1>

      <>
        <SpeedDialAction
          icon="far fa-edit"
          label={t("Edit")}
          index={3}
          visible={true}
          onClick={onUpdate}
        />
        <SpeedDialAction
          icon="far fa-trash-alt"
          label={t("Remove")}
          index={4}
          visible={true}
          onClick={onDelete}
        />

        <SpeedDialAction
          icon="far fa-plus-square"
          label={t("New")}
          index={8}
          visible={true}
          onClick={onNew}
        />
      </>

      <Popup
        maxWidth={1000}
        title={editDeleteStatus == "edit" ? t("Edit") : t("Delete")}
        minWidth={150}
        minHeight={500}
        showTitle={true}
        dragEnabled={false}
        closeOnOutsideClick={true}
        visible={dailog}
        onHiding={closePopup}
      >
        {/*   <EditDeleteScroll
          columnAttributes={columnAttributesEditDelet}
          close={closePopup}
          getEditData={setValuesEditDelete}
          editDeleteStatus={editDeleteStatus}
          APIMethod={GET_OTHER_INVOICE}
          APIPayload={useMemo(() => {
            return {};
          }, [])}
          remoteOperations={true}
          removeApiMethod={DELETE_INVOICE}
          removeApiPayload={useMemo(() => {
            return {};
          }, [])}
        />*/}

        <EditDelete
          data={data}
          columnAttributes={columnAttributesEditDelet}
          deleteItem={onDeleteFun}
          close={closePopup}
          editDeleteStatus={editDeleteStatus}
          getEditData={setValuesEditDelete}
        />
      </Popup>
      <form
        className="row"
        onSubmit={submit}
        style={{ width: "100%", justifyContent: "center" }}
      >
        <div className="col-12 col-md-6 col-lg-3">
          <NumberBox
            label={t("Invoice Number")}
            value={Invoice.e_no}
            name="e_no"
            handleChange={handleChangeInvoice}
            required={false}
            nonNegative
            validationErrorMessage={errors.e_no}
            disabled={DisableInputs}
          />
        </div>
        <div className="col-12 col-md-6 col-lg-3">
          <DateTime
            label={t("Invoice Date")}
            value={Invoice.e_date}
            name="e_date"
            handleChange={handleChangeInvoice}
            required={false}
            validationErrorMessage={errors.e_date}
            disabled={DisableInputs}
          />
        </div>
        <div className="col-12 col-md-6 col-lg-3">
          <TextBox
            label={t("Note")}
            value={Invoice.nots}
            name="nots"
            handleChange={handleChangeInvoice}
            required={false}
            disabled={DisableInputs}
            validationErrorMessage={errors.nots}
          />
        </div>
        <div style={{ width: "95%" }}>
          <MasterTable
            dataSource={InvoiceItemData}
            height="400px"
            colAttributes={colAttributes}
            allowDelete={true}
            onRowRemoving={Delete_Invoice_item}
          />
        </div>
        <div style={{ width: "100%" }}>
          <MiscellaneousButtonBar
            errors={errors}
            searchItemCallBackHandleStore={searchItemCallBackHandleStore}
            values={InvoiceItem}
            Invoice={Invoice.ID}
            handleChange={handleChangeInvoiceItem}
          />
        </div>
      </form>
    </div>
  );
}
export default ReCredit;
