import React, { useState, useEffect, useCallback, useMemo } from "react";
import TextBox from "../../../Components/Inputs/TextBox";
import NumberBox from "../../../Components/Inputs/NumberBox";
import ButtonRow from "../../../Components/SharedComponents/buttonsRow";
import { Popup } from "devextreme-react/popup";
import EditDelete from "../../../Components/SharedComponents/EditDelete1";
import { validateForm } from "../../../Services/services";
import Joi from "joi";
import notify from "devextreme/ui/notify";
import {
  GET_STORES,
  TRANSACTION,
  NEXT_NUMBER,
  DELETE,
} from "./API.PreparingStore";
import { useTranslation } from "react-i18next";
function PreperingStore() {
  const { t, i18n } = useTranslation();
  const [errors, setErrors] = useState({});
  const [dailog, setdialog] = useState(false);
  const [data, setData] = useState([]);
  const [values, setvalues] = useState({});
  const [editDeleteStatus, setEditDeleteStatus] = useState("");
  const schema = useMemo(() => {
    return {
      number: Joi.number()
        .greater(0)
        .required()
        .messages({
          "any.required": t("Number is Required "),
          "number.greater": t("This number must be greater than zero."),
        }),
      code: Joi.number().messages({
        "any.required": t("Code is Required"),
      }),
      description: Joi.string()
        .required()
        .messages({
          "any.required": t("This Input is Required"),
        }),
    };
  }, []);
  const columnAttributes = useMemo(() => {
    return [
      {
        caption: "الرقم",
        captionEn: "Number",
        field: "number",
      },
      {
        caption: "الاسم",
        field: "description",
        captionEn: "Name",
        widthRatio: "120",
      },
      { caption: "شفره", captionEn: "Code", field: "code" },
    ];
  }, []);

  let submit = async (e) => {
    e.preventDefault();
    let { number, code, description } = values;
    let err = validateForm({ number, code, description }, schema);

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
        setvalues({ number: id.NextNumber });
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

  const handleChange = useCallback(
    ({ name, value }) => {
      setvalues((prev) => {
        return { ...prev, [name]: value };
      });
    },
    [values]
  );
  useEffect(async () => {
    setvalues({ number: (await NEXT_NUMBER()).NextNumber });
  }, []);

  const onDelete = useCallback(
    async (title) => {
      let data = await GET_STORES();
      setData(
        data.map((R) => {
          return { ...R, ID: R.id };
        })
      );
      setEditDeleteStatus(title);
      setdialog(!dailog);
    },
    [data, editDeleteStatus, dailog]
  );

  const onUpdate = useCallback(
    async (title) => {
      let data = await GET_STORES();
      setData(
        data.map((R) => {
          return { ...R, ID: R.id };
        })
      );
      setEditDeleteStatus(title);
      setdialog(!dailog);
    },
    [data, editDeleteStatus, dailog]
  );
  const onNew = useCallback(async () => {
    setvalues({ number: (await NEXT_NUMBER()).NextNumber });
  }, []);
  const onUndo = useCallback(async () => {
    setvalues({});
    setErrors({});
  }, []);
  let onDeleteFun = useCallback(async (id) => {
    onNew();
    return await DELETE(id);
  }, []);
  let ClosePopUp = useCallback(async (id) => {
    setdialog(false);
  }, []);
  return (
    <div dir={i18n.language == "en" ? "ltr" : "rtl"}>
      <form onSubmit={submit} className="row Discountmain">
        <h1 style={{ width: "100%", textAlign: "center", padding: "2%" }}>
          {t("Store preparation")}
        </h1>
        <div
          className="row"
          style={{
            padding: "2%",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <div className="col-lg-6 col-md-6 col-sm-12">
            <NumberBox
              label={t("Number")}
              value={values["number"]}
              name="number"
              handleChange={handleChange}
              validationErrorMessage={errors.number}
              required={false}
              nonNegative
            />
          </div>
          <div className="col-lg-6 col-md-6 col-sm-12">
            <TextBox
              label={t("Account name")}
              value={values["description"]}
              name="description"
              handleChange={handleChange}
              required={false}
              validationErrorMessage={errors.description}
            />
          </div>
          <div className="col-lg-6 col-md-6 col-sm-12">
            <NumberBox
              label={t("Code")}
              value={values["code"]}
              name="code"
              handleChange={(e) => handleChange(e)}
              required={false}
              validationErrorMessage={errors.code}
              nonNegative
            />
          </div>
          <div className="col-lg-6 col-md-6 col-sm-12"></div>
        </div>{" "}
        <ButtonRow
          onNew={onNew}
          onEdit={onUpdate}
          onCopy={null}
          onDelete={onDelete}
          onUndo={onUndo}
          isSimilar={false}
          isExit={false}
        />
        <Popup
          maxWidth={1000}
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
            deleteItem={onDeleteFun}
            close={ClosePopUp}
            getEditData={setvalues}
            editDeleteStatus={editDeleteStatus}
          />
        </Popup>
      </form>
    </div>
  );
}

export default PreperingStore;
