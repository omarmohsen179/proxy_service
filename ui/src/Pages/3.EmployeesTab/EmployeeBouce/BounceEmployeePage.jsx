import React, {
  useState,
  useCallback,
  useEffect,
  useRef,
  useMemo,
} from "react";

import {
  TextBox,
  NumberBox,
  SelectBox,
  DateTime,
} from "../../../Components/Inputs";
import {
  GET_STUFF,
  NEXT_NUMBER,
  CHECKER,
  DELETE,
  GET_BUONCES,
  TRANSACTION,
  LOCKUPS,
} from "./API.Bouce";
import { Popup } from "devextreme-react/popup";
import notify from "devextreme/ui/notify";
import ButtonRow from "../../../Components/SharedComponents/buttonsRow";
import EditDelete from "../../../Components/SharedComponents/EditDelete1";
import Joi from "joi";

import { validateForm } from "../../../Services/services";
import { useTranslation } from "react-i18next";
function BounceEmployeePage() {
  const { t, i18n } = useTranslation();
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
  let [dailog, setdialog] = useState(false);
  const [errors, setErrors] = useState({});
  let [editDeleteStatus, setEditDeleteStatus] = useState("edit");
  let [employeelist, setemployeelist] = useState([]);
  let [type, settype] = useState([]);
  let [data, setData] = useState([]);
  let initialValue = useRef({
    num: 0,
    emp_id: 0,
    t_date: today,
    alawat_id: 0,
    kema: 0,
    nots: "",
  });
  let [values, setValues] = useState(initialValue.current);
  var ValidationMessage = useMemo(() => {
    return "This Input is Required";
  }, []);
  var schema = useMemo(() => {
    return {
      num: Joi.number().required().greater(0).required().messages({
        "any.required": "Number is Required ",
        "number.greater": "This number must be greater than zero.",
      }),
      emp_id: Joi.number().required().greater(0).required().messages({
        "any.required": ValidationMessage,
        "number.greater": ValidationMessage,
      }),
      t_date: Joi.date().required().messages({
        "any.required": ValidationMessage,
      }),
      alawat_id: Joi.number().required().greater(0).required().messages({
        "any.required": ValidationMessage,
        "number.greater": ValidationMessage,
      }),
      kema: Joi.number().required().greater(0).required().messages({
        "any.required": ValidationMessage,
        "number.greater": "This number must be greater than zero.",
      }),
    };
  }, []);

  // Edit and Delete popups columns names
  let columnAttributes = useMemo(() => {
    return [
      {
        caption: "رقم ",
        captionEn: "Nmber",
        field: "num",
      },
      { caption: "الاسم", captionEn: "Name", field: "MemberName" },
      { caption: "التاريخ", captionEn: "Date", field: "t_date" },
      { caption: "القيمه", captionEn: "Cost", field: "kema" },
    ];
  }, []);

  let handleTitle = useCallback(() => {
    return editDeleteStatus === "edit" ? t("Edit") : t("Remove");
  }, [editDeleteStatus, t]);
  const handleChange = useCallback(
    ({ name, value }) => {
      setValues((values) => ({ ...values, [name]: value }));
    },
    [values]
  );

  let submit = async (e) => {
    e.preventDefault();
    let { num, emp_id, t_date, alawat_id, kema } = values;
    let err = validateForm({ num, emp_id, t_date, alawat_id, kema }, schema);
    if (Object.keys(err).length != 0) {
      setErrors(err);
      notify(
        { message: t("Continue the missing data"), width: 600 },
        "error",
        3000
      );
      return;
    }

    await TRANSACTION(values)
      .then(async () => {
        let id = await NEXT_NUMBER();

        setValues({ ...initialValue.current, num: id.NextNumber });

        setErrors({});
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

  const onDelete = useCallback(
    async (title) => {
      setEditDeleteStatus(title);
      setData(await GET_BUONCES(0, 100));
      setdialog(!dailog);
    },
    [dailog]
  );
  const onUpdate = useCallback(
    async (title) => {
      setEditDeleteStatus(title);
      setData(await GET_BUONCES(0, 100));
      setdialog(!dailog);
    },
    [dailog]
  );
  const onNew = useCallback(
    async (title) => {
      let x = await NEXT_NUMBER();
      setValues({ ...initialValue.current, num: x.NextNumber });
    },
    [initialValue]
  );
  const closePopup = useCallback(async () => {
    setdialog(false);
  }, []);
  useEffect(async () => {
    setValues({
      ...initialValue.current,
      num: (await NEXT_NUMBER()).NextNumber,
    });
    let Lookupdata = await LOCKUPS("أنـــــــواع العـــــــــلاوات");
    settype(
      Lookupdata.map((R) => {
        return { ...R, name: R.description };
      })
    );
    setemployeelist(await GET_STUFF());
  }, []);

  let onUndo = useCallback(() => {
    setValues(initialValue.current);
    setErrors({});
  }, []);
  let onDeleteFun = useCallback(async (id) => {
    await DELETE(id);
    onNew();
  }, []);
  console.log("mypage");
  return (
    <div dir={i18n.language == "en" ? "ltr" : "rtl"}>
      <form onSubmit={submit} className="row PaymentTypemain">
        <h1 style={{ width: "100%", textAlign: "center", padding: "2%" }}>
          {t("Bonuses")}
        </h1>
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
              value={values["num"]}
              name="num"
              handleChange={handleChange}
              required={false}
              nonNegative
              validationErrorMessage={t(errors.num)}
            />
          </div>
          <div className="col-lg-6 col-md-6 col-sm-12">
            <SelectBox
              label={t("Employee")}
              value={values["emp_id"]}
              name="emp_id"
              handleChange={handleChange}
              dataSource={employeelist}
              required={false}
              validationErrorMessage={t(errors.emp_id)}
            />
          </div>
          <div className="col-lg-6 col-md-6 col-sm-12 datein">
            <DateTime
              label={t("Date")}
              value={values["t_date"]}
              name="t_date"
              handleChange={handleChange}
              required={false}
              validationErrorMessage={t(errors.t_date)}
            />
          </div>
          <div className="col-lg-6 col-md-6 col-sm-12">
            <SelectBox
              label={t("Bonuses Types")}
              value={values["alawat_id"]}
              name="alawat_id"
              handleChange={handleChange}
              dataSource={type}
              required={false}
              validationErrorMessage={t(errors.alawat_id)}
            />
          </div>
          <div className="col-lg-6 col-md-6 col-sm-12">
            <NumberBox
              label={t("Bonuses Value")}
              value={values["kema"]}
              name="kema"
              handleChange={handleChange}
              nonNegative
              required={false}
              validationErrorMessage={t(errors.kema)}
            />
          </div>
          <div className="col-lg-6 col-md-6 col-sm-12">
            <TextBox
              label={t("Note")}
              value={values["nots"]}
              name="nots"
              handleChange={handleChange}
              required={false}
            />
          </div>
        </div>

        <ButtonRow
          onNew={onNew}
          onEdit={onUpdate}
          isSimilar={false}
          isExit={false}
          onDelete={onDelete}
          onUndo={onUndo}
        />

        <Popup
          maxWidth={1000}
          title={handleTitle}
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
            deleteItem={onDeleteFun}
            close={closePopup}
            getEditData={setValues}
            editDeleteStatus={editDeleteStatus}
          />
        </Popup>
      </form>
    </div>
  );
}

export default React.memo(BounceEmployeePage);
