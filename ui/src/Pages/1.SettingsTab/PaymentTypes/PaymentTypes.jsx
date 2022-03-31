import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import TextBox from "../../../Components/Inputs/TextBox";
import NumberBox from "../../../Components/Inputs/NumberBox";
import Input from "../../../Components/SharedComponents/Input";
import CheckBox from "../../../Components/Inputs/CheckBox";
import ButtonRow from "../../../Components/SharedComponents/buttonsRow";
import EditDelete from "../../../Components/SharedComponents/EditDelete1";
import { validateForm } from "../../../Services/services";
import notify from "devextreme/ui/notify";
import { Popup } from "devextreme-react/popup";
import Joi from "joi";
import {
  COSTS_TYPES,
  COSTS_TYPES_TRANCATION,
  CHECK_COST_TYPE_DATA,
  DELETE_COST_TYPE,
  COST_TYPE_NEXT_NUMBER,
} from "./API.PaymentTypes";
import { useTranslation } from "react-i18next";

function PaymentTypes() {
  const { t, i18n } = useTranslation();

  const [errors, setErrors] = useState({});
  let [dailog, setdialog] = useState(false);
  let [data, setData] = useState([]);
  const IntialValues = useRef({
    number: 0,
    description: "",
    code: "",
    st_tas: true,
  });
  let [values, setValues] = useState({});
  const columnAttributes = useMemo(() => {
    return [
      { caption: "الرقم", captionEn: "Number", field: "number" },
      { caption: "الحساب", captionEn: "Account", field: "description" },
      { caption: "الشفره", caption: "Code", field: "code" },
    ];
  }, []);
  let [editDeleteStatus, setEditDeleteStatus] = useState("");
  //joi validation
  const schema = useMemo(() => {
    return {
      number: Joi.number().greater(0).required().messages({
        "any.required": "Number is Required ",
        "number.greater": "This number must be greater than zero.",
      }),
      code: Joi.number().required().messages({
        "any.required": "Code is Required",
      }),
      description: Joi.string().empty("").required().messages({
        "any.required": "This Input is Required",
        "string.empty": "This Input is Required",
      }),
    };
  }, []);
  let onDeleteFun = useCallback(async (id) => {
    onNew();
    return await DELETE_COST_TYPE(id);
  }, []);
  const handleChange = useCallback(
    ({ name, value }) => {
      setValues((values) => ({ ...values, [name]: value }));
    },
    [values]
  );
  useEffect(async () => {
    setValues({
      ...IntialValues.current,
      number: (await COST_TYPE_NEXT_NUMBER()).NextNumber,
    });
  }, []);

  const onUndo = useCallback(() => {
    setValues({});
    setErrors({});
  }, []);
  const onDelete = useCallback(
    async (title) => {
      setData(
        (await COSTS_TYPES()).map((R) => {
          return { ...R, ID: R.id };
        })
      );
      setEditDeleteStatus(title);
      setdialog(!dailog);
    },
    [dailog]
  );
  const onUpdate = useCallback(
    async (title) => {
      setData(
        (await COSTS_TYPES()).map((R) => {
          return { ...R, ID: R.id };
        })
      );
      setEditDeleteStatus(title);
      setdialog(!dailog);
    },
    [dailog]
  );
  const onNew = useCallback(async () => {
    setValues({
      ...IntialValues.current,
      number: (await COST_TYPE_NEXT_NUMBER()).NextNumber,
    });
  }, [values]);

  let submit = async (e) => {
    e.preventDefault();
    let err = validateForm(values, schema);
    if (Object.keys(err).length != 0) {
      setErrors(err);
      notify({ message: t("Failed Try again"), width: 600 }, "error", 3000);
      return;
    }
    if (values.id) {
      values.ID = values.id;
    }

    await COSTS_TYPES_TRANCATION({ ...values, st_tas: values.st_tas ? 0 : 1 })
      .then(() => {
        setErrors({});
        onNew();
        notify(
          { message: t("Saved Successfully"), width: 600 },
          "success",
          3000
        );
      })
      .catch(
        ({
          response: {
            data: { Errors },
          },
        }) => {
          console.log(Errors);

          let responseErrors = {};
          if (Errors) {
            Errors.forEach(({ Column, Error }) => {
              responseErrors = { ...responseErrors, [Column]: Error };
            });
          }
          setErrors(responseErrors);
          notify({ message: t("Failed Try again"), width: 450 }, "error", 2000);
        }
      );
  };

  return (
    <div style={{ direction: i18n.langue == "en" ? "ltr" : "rtl" }}>
      <form onSubmit={submit} className="row Discountmain">
        <div
          className="row"
          style={{
            padding: "2%",
            display: "flex",
            justifyContent: "center",
          }}
        >
          {" "}
          <div className="col-lg-6 col-md-6 col-sm-12">
            <NumberBox
              label={t("Number")}
              value={values["number"]}
              name="number"
              handleChange={handleChange}
              validationErrorMessage={t(errors.number)}
              required={false}
            />
          </div>
          <div className="col-lg-6 col-md-6 col-sm-12">
            <TextBox
              label={t("Account name")}
              value={values["description"]}
              name="description"
              handleChange={handleChange}
              required={false}
              validationErrorMessage={t(errors.description)}
            />
          </div>
          <div className="col-lg-6 col-md-6 col-sm-12">
            <NumberBox
              label={t("Account code")}
              value={values["code"]}
              name="code"
              handleChange={(e) => handleChange(e)}
              validationErrorMessage={t(errors.code)}
              required={false}
            />
          </div>
          <div className="col-lg-6 col-md-6 col-sm-12">
            <CheckBox
              label={t("Loaded to manufacture")}
              value={values["st_tas"]}
              name="st_tas"
              handleChange={handleChange}
              required={false}
            />
          </div>
        </div>{" "}
        <ButtonRow
          onNew={onNew}
          onEdit={onUpdate}
          onDelete={onDelete}
          onUndo={onUndo}
          isSimilar={false}
          isExit={false}
        />
        <Popup
          maxWidth={2000}
          title={editDeleteStatus == "edit" ? t("Edit") : t("Delete")}
          minWidth={150}
          minHeight={500}
          showTitle={true}
          dragEnabled={false}
          closeOnOutsideClick={true}
          visible={dailog}
          onHiding={() => setdialog(false)}
        >
          <EditDelete
            data={data}
            columnAttributes={columnAttributes}
            isExit={false}
            deleteItem={onDeleteFun}
            close={() => setdialog(false)}
            getEditData={setValues}
            editDeleteStatus={editDeleteStatus}
          />
        </Popup>
      </form>
    </div>
  );
}

export default PaymentTypes;
