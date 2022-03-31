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
} from "./API.MaterialDamage";
import EditDelete from "../../../Components/SharedComponents/EditDelete1";
import Joi from "joi";
import { SpeedDialAction } from "devextreme-react/speed-dial-action";
import { Popup } from "devextreme-react/popup";
import { validateForm } from "../../../Services/services";
import InputTableEdit from "../../../Components/SharedComponents/Tables Components/InputTableEdit";
import EditDeleteScroll from "../../../Components/SharedComponents/EditDeleteScroll";
import { useTranslation } from "react-i18next";
function MaterialDamage(props) {
  const [data, setData] = useState([]);
  const [errors, setErrors] = useState({});
  const [editDeleteStatus, setEditDeleteStatus] = useState("");
  const [dailog, setdialog] = useState(false);

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
    sbb: "",
  });
  let initialValueInvoiceItem = useRef({
    m_no: 0,
    item_id: 0,
    item_no: 0,
    item_name: "",
    ActuallyQuantity: 0,
    price: 0,
    kmea: 0,
    ExpiredDates: [],
    Exp_date: "",
    Exp_data_id: 0,
    sum_box: 0,
    box_id: 0,
    unit_id: 0,
  });
  const [Invoice, setInvoice] = useState(initialValueInvoice.current);
  const [Boxs, setBoxs] = useState([]);
  const [InvoiceItem, setInvoiceItem] = useState(
    initialValueInvoiceItem.current
  );
  let [InvoiceItemData, setInvoiceItemData] = useState([]);
  const [DisableInputs, setDisableInputs] = useState(false);
  const { t, i18n } = useTranslation();
  const colAttributes = useMemo(() => {
    return [
      {
        caption: "رقم الصنف ",
        captionEn: "Number",
        field: "item_no",
        readOnly: true,
      },
      {
        caption: " اسم الصنف",
        captionEn: "Name",
        field: "item_name",
        readOnly: true,
      },
      { caption: "الصلاحيه", captionEn: "Expiry", field: "Exp_date" },
      {
        caption: "  الكميه",
        captionEn: "Quantity",
        field: "kmea",
        dataType: "number",
      },
      {
        caption: "السعر",
        captionEn: "Price",
        field: "items_price",
        dataType: "number",
      },
      {
        caption: "الأجمالي",
        captionEn: "Total",
        field: "items_pgmla",
        dataType: "number",
      },
    ];
  }, []);
  const columnAttributesEditDelet = useMemo(() => {
    return [
      {
        caption: "رقم  ",
        captionEn: "Number",
        field: "e_no",
      },
      { caption: "تاريخ  ", captionEn: "Date", field: "e_date" },
      { caption: "ملاحظه", captionEn: "Note", field: "nots" },
      { caption: "  السبب", captionEn: "Reason", field: "sbb" },
    ];
  }, []);
  var schema = useMemo(() => {
    return {
      m_no: Joi.number().required().greater(0).required().messages({
        "any.required": "Number is Required ",
        "number.greater": "This number must be greater than zero.",
      }),

      sbb: Joi.string().empty("").required().messages({
        "any.required": "This Input is Required",
        "string.empty": "This Input is Required",
      }),
      item_id: Joi.number().required().greater(0).required().messages({
        "any.required": "This Input is Required",
        "number.greater": "This number must be greater than zero.",
      }),
      kmea: Joi.number().required().greater(0).required().messages({
        "any.required": "Number is Required ",
        "number.greater": "This number must be greater than zero.",
      }),
      e_date: Joi.date()
        .required()
        .messages({ "any.required": "هذا الحقل مطلوب  " }),
      e_no: Joi.number().required().greater(0).required().messages({
        "any.required": "Number is Required ",
        "number.greater": "This number must be greater than zero.",
      }),
      price: Joi.number().required().greater(-1).required().messages({
        "any.required": "Number is Required ",
        "number.greater": "This number must be greater than zero.",
      }),
      kmea: Joi.number().required().greater(0).required().messages({
        "any.required": "Number is Required ",
        "number.greater": "This number must be greater than zero.",
      }),
      sum_box: Joi.number().required().greater(0).required().messages({
        "any.required": "Number is Required ",
        "number.greater": "This number must be greater than zero.",
      }),
      unit_id: Joi.number().required().greater(0).required().messages({
        "any.required": "This Input is Required",
        "number.greater": "This Input is Required",
      }),
    };
  }, []);

  let handleChangeInvoiceItem = useCallback(
    ({ name, value }) => {
      if (name == "kmea" || name == "sum_box") {
        if (name == "kmea") {
          setInvoiceItem((prevState) => ({
            ...prevState,
            [name]: value,
            sum_box: (
              parseFloat(value) * parseFloat(InvoiceItem.box_id)
            ).toFixed(2),
          }));
        } else {
          setInvoiceItem((prevState) => ({
            ...prevState,
            [name]: value,
            kmea: (parseFloat(value) / parseFloat(InvoiceItem.box_id)).toFixed(
              2
            ),
          }));
        }
      } else if (name == "unit_id") {
        setInvoiceItem((prevState) => ({
          ...prevState,
          [name]: value,
          sum_box:
            parseInt(Boxs.find((item) => item.id === value).box_id) *
            InvoiceItem.kmea,
          box_id: Boxs.find((item) => item.id === value).box_id,
        }));
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
      setInvoice((prevState) => ({ ...prevState, [name]: value }));
    },
    [Invoice]
  );

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
    setInvoice({
      ...initialValueInvoice.current,
      e_no: (await NEXT_NUMBER()).InvoiceNumber,
    });
    setInvoiceItemData([]);
    setInvoiceItem({
      ...initialValueInvoiceItem.current,
      m_no: InvoiceItem.m_no,
    });
  }, []);
  const Delete_Invoice_item = useCallback(
    async (e) => {
      await DELETE_INVOICE_ITEM(Invoice.ID, e.data.ID)
        .then(() => {
          setInvoiceItemData(
            InvoiceItemData.filter((item) => item.ID !== e.ID)
          );
        })
        .catch(() => {
          notify({ message: t("Failed Try again"), width: 600 }, "error", 3000);
        });
    },
    [InvoiceItemData, Invoice]
  );
  const Update_Invoice_item = useCallback(
    (e) => {
      console.log(e.data);
      if (e.data.ExpiredDates.length == 0) {
        e.data.ExpiredDates.push({ Exp_date: "1/1/2050" });
      }
      setInvoiceItem(e.data);
      setInvoiceItemData(
        InvoiceItemData.filter((item) => item.ID !== e.data.ID)
      );
    },
    [InvoiceItemData]
  );
  const setValuesEditDelete = useCallback(async (value) => {
    setInvoice(value);
    setInvoiceItemData(await GET_OTHER_INVOICE_ITEM(value.ID));
    setInvoiceItem({ ...initialValueInvoiceItem.current });
  }, []);
  const Delete_Invoice = useCallback(async (id) => {
    return await DELETE_INVOICE(id);
  }, []);
  useEffect(async () => {
    setInvoice({
      ...initialValueInvoice.current,
      e_no: (await NEXT_NUMBER()).InvoiceNumber,
    });
  }, []);
  useEffect(() => {
    if (Invoice.ID) {
      setDisableInputs(true);
    } else {
      setDisableInputs(false);
    }
  }, [Invoice.ID]);

  let searchItemCallBackHandleStore = useCallback(
    async (itemquantityApi) => {
      let boxs = itemquantityApi.Boxs.map((unit) => {
        return {
          id: unit.unit_id,
          name: unit.description,
          box_id: parseInt(unit.box),
        };
      });
      setBoxs(boxs);
      setInvoiceItem((prevState) => ({
        ...prevState,
        item_name: itemquantityApi.item_name,
        item_id: itemquantityApi.id,
        item_no: itemquantityApi.item_no,
        ActuallyQuantity: itemquantityApi.ActuallyQuantity,
        ExpiredDates: itemquantityApi.ExpiredDates,
        Exp_date: itemquantityApi.ExpiredDates[0]
          ? itemquantityApi.ExpiredDates[0].Exp_date
          : "1/1/2050",
        p_tkl: itemquantityApi.p_tkl,
        unit_id: boxs[0] ? boxs[0].id : 0,
        boxs: boxs,
        box_id: boxs[0] ? boxs[0].box_id : 0,
        sum_box: boxs[0] ? boxs[0].box_id : 0,
        kmea: 1,
        price: 0,
      }));
    },
    [InvoiceItem]
  );
  const submit = async (e) => {
    e.preventDefault();
    if (InvoiceItem.ActuallyQuantity < InvoiceItem.sum_box) {
      notify(
        {
          message: t("The package cannot be bigger than the stock."),
          width: 600,
        },
        "error",
        3000
      );

      return;
    }

    let { m_no, item_id, price, kmea, sum_box, unit_id } = InvoiceItem;
    let { e_date, e_no, sbb } = Invoice;

    let err = validateForm(
      { m_no, item_id, price, kmea, sum_box, unit_id, e_date, e_no, sbb },
      schema
    );
    if (Object.keys(err).length != 0) {
      setErrors(err);
      console.log(err);
      if (err.item_id) {
        notify(
          { message: t("Category must be entered"), width: 600 },
          "error",
          3000
        );
      } else if (err.kmea) {
        notify(
          { message: t("This number must be greater than zero."), width: 600 },
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
    setErrors({});
    let maindata = {
      Invoice: { ...Invoice },
      InvoiceItems: [InvoiceItem],
      StoreID: InvoiceItem.m_no,
      InvoiceType: "ProductsDamage",
      ID: Invoice.ID ? Invoice.ID : 0,
    };
    await INVOICE_TRANSACTION(maindata)
      .then(async (res) => {
        setInvoiceItemData([...InvoiceItemData, res.Item]);
        setInvoice({ ...Invoice, ID: Invoice.ID ? Invoice.ID : res.id });
        setInvoiceItem({
          ...initialValueInvoiceItem.current,
          m_no: InvoiceItem.m_no,
        });
        notify(
          { message: t("Saved Successfully"), width: 600 },
          "success",
          3000
        );
        setErrors({});
      })
      .catch(
        ({
          response: {
            data: { Errors },
          },
        }) => {
          console.log(Errors);
          if (Errors) {
            let responseErrors = {};
            Errors.forEach(({ Column, Error }) => {
              responseErrors = { ...responseErrors, [Column]: Error };
            });

            setErrors(responseErrors);
          }

          notify({ message: t("Failed Try again"), width: 450 }, "error", 2000);
        }
      );
  };
  let onDeleteFun = useCallback(async (e) => {
    onNew();
    return DELETE_INVOICE(e);
  }, []);
  return (
    <div
      dir="auto"
      className="row"
      style={{ display: "flex", justifyContent: "center", margin: 0 }}
    >
      <h1 style={{ width: "90%", textAlign: "center", padding: "2%" }}>
        {t("Destroy the material")}
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
        {/*<EditDeleteScroll
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
            validationErrorMessage={t(errors.e_no)}
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
            validationErrorMessage={t(errors.e_date)}
            disabled={DisableInputs}
          />
        </div>
        <div className="col-12 col-md-6 col-lg-3">
          <TextBox
            label={t("Reason")}
            value={Invoice.sbb}
            name="sbb"
            handleChange={handleChangeInvoice}
            required={false}
            disabled={DisableInputs}
            validationErrorMessage={t(errors.sbb)}
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
            validationErrorMessage={t(errors.nots)}
          />
        </div>
        <div style={{ width: "95%" }}>
          <InputTableEdit
            filterRow={false}
            Uicon
            dataSource={InvoiceItemData}
            height="400px"
            canDelete={true}
            onRowRemoving={Delete_Invoice_item}
            onRowDoubleClick={Update_Invoice_item}
            colAttributes={colAttributes}
          />
        </div>
        <MiscellaneousButtonBar
          type={2}
          submit={submit}
          errors={errors}
          values={InvoiceItem}
          searchItemCallBackHandleStore={searchItemCallBackHandleStore}
          handleChange={handleChangeInvoiceItem}
        />
      </form>
    </div>
  );
}
export default MaterialDamage;
