import React, { useState, memo } from "react";
import { NumberBox, SelectBox } from "devextreme-react";
import CellError from "../../Components/SharedComponents/CellError";
import notify from "devextreme/ui/notify";
import { useDispatch } from "react-redux";
import { editMainUnit } from "../../Store/itemsLookups";
import { CHECK_ITEM_DATA } from "../../Services/ApiServices/ItemsAPI";
import Joi from "joi";
import { validateForm } from "../../Services/services";
import { useTranslation } from "react-i18next";

const Items_Box = ({ items = [], save, options = [], remove, boxValue }) => {
  let dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  let columns = [
    t("Part Number"),
    t("Unit"),
    t("Package"),
    t("Item Price"),
    t("Wholesale price"),
    t("wholesale wholesale price"),
    "",
  ];

  let [values, setValues] = useState({});
  let [previous, setPrevious] = useState();

  let [errors, setErrors] = useState({});

  let schema = {
    parcodee: Joi.required().messages({
      "any.required": "Number is Required ",
    }),
    unit_id: Joi.required().messages({
      "any.required": "This Input is Required",
    }),
    box: Joi.number().greater(parseInt(boxValue)).required().messages({
      "any.required": "Number is Required ",
      "number.greater": "This number must be greater than zero.",
    }),
    price1: Joi.allow(),
    p_gmla1: Joi.allow(),
    p_gmla2: Joi.allow(),
    key: Joi.allow(),
    id: Joi.allow(),
  };

  let handleSubmit = async () => {
    // validate
    let errors = validateForm(values, schema);
    setErrors(errors);
    if (Object.keys(errors).length === 0) {
      let isExisted = true;
      let key = items.key ? "key" : "id";

      let inList = items.find(
        (e) => e.parcodee === values.parcodee && e[key] !== values[key]
      );

      if (!inList) {
        let { Check: notReservedInApi } = await CHECK_ITEM_DATA({
          Table: "Items_Box",
          ID: values.id || 0,
          CheckData: { parcodee: values.parcodee },
        });
        isExisted = !notReservedInApi;
      }

      if (!isExisted) {
        dispatch(editMainUnit({ previous, value: values["unit_id"] }));
        save({ name: "Items_Box", value: values });
        setValues({});
      } else {
        notify(
          { message: t("This Number already exists"), width: 600 },
          "error",
          300
        );
      }
    }
  };

  let handleChange = ({ name, value }) => {
    setValues((values) => ({ ...values, [name]: value }));
  };

  let handleEdit = (item) => {
    setValues(item);
    setPrevious(item.unit_id);
    dispatch(editMainUnit({ previous: item.unit_id }));
  };

  let names = ["box", "price1", "p_gmla1", "p_gmla2"];

  let handleDelete = (value) => {
    remove({ name: "Items_Box", value, table: "DeleteItemBox" });
    dispatch(editMainUnit({ previous: value["unit_id"] }));
  };

  let getSelectedLabel = (id) => options.find((e) => e.id == id).name;

  // console.log('items box');

  return (
    <div dir="auto">
      <table className="table table-bordered">
        <thead className="blue">
          <tr>
            {columns.map((c) => (
              <td scope="col">{c}</td>
            ))}
          </tr>
        </thead>
        <tbody>
          {items.map((item, i) => {
            return (
              <tr key={i}>
                <td scope="col" className={item.error && `cell-error`}>
                  <div className="center">
                    {item["parcodee"]}
                    {item.error && (
                      <CellError message={t("This Number already exists")} />
                    )}
                  </div>
                </td>
                <td scope="col">{getSelectedLabel(item["unit_id"])}</td>
                <td scope="col">{item["box"]}</td>
                <td scope="col">{item["price1"]}</td>
                <td scope="col">{item["p_gmla1"]}</td>
                <td scope="col">{item["p_gmla2"]}</td>
                <td className="center">
                  <span className="blue" onClick={() => handleEdit(item)}>
                    <i className="fas fa-pencil-alt"></i>
                  </span>
                  <span
                    className="error"
                    onClick={() => {
                      handleDelete(item);
                    }}
                  >
                    <i className="fas fa-trash"></i>
                  </span>
                </td>
              </tr>
            );
          })}
          {/* form */}

          <tr>
            <td
              style={{ padding: 0 }}
              className={errors["parcodee"] && "cell-error"}
            >
              <div className="center">
                <NumberBox
                  style={{ border: "none" }}
                  value={values["parcodee"]}
                  min={0}
                  onInput={({ event }) =>
                    handleChange({
                      name: "parcodee",
                      value: event.target.value,
                    })
                  }
                />
                {errors["parcodee"] && (
                  <CellError message={errors["parcodee"]} />
                )}
              </div>
            </td>

            <td
              style={{ padding: 0 }}
              className={errors["unit_id"] && "cell-error"}
            >
              <div className="center">
                <SelectBox
                  style={{ border: "none" }}
                  dataSource={options}
                  displayExpr="name"
                  valueExpr="id"
                  value={values["unit_id"]}
                  rtlEnabled={true}
                  onValueChange={(selectedItem) => {
                    handleChange({ name: "unit_id", value: selectedItem });
                  }}
                  searchEnabled={true}
                />
                {errors["unit_id"] && <CellError message={errors["unit_id"]} />}
              </div>
            </td>

            {names.map((name) => {
              return (
                <td
                  style={{ padding: 0 }}
                  className={errors[name] && "cell-error"}
                >
                  <div className="center">
                    <NumberBox
                      style={{ border: "none" }}
                      min={0}
                      value={values[name]}
                      onInput={({ event }) =>
                        handleChange({ name, value: event.target.value })
                      }
                    />
                    {errors[name] && <CellError message={errors[name]} />}
                  </div>
                </td>
              );
            })}

            <td className="center">
              <span className="blue" onClick={handleSubmit}>
                <i className="fas fa-save"></i>
              </span>
              <span
                className="cell-btns"
                onClick={() => {
                  setValues({});
                  setErrors({});
                }}
              >
                <i className="fas fa-undo"></i>
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default memo(Items_Box);
