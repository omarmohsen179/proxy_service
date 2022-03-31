/*** react , react-redux***/
import React, {
  useEffect,
  useState,
  useCallback,
  useRef,
  useMemo,
} from "react";
import { useSelector, useDispatch } from "react-redux";
/*** dev Extreme ***/
import { Button } from "devextreme-react/button";
import { NumberBox as NumberBoxDev } from "devextreme-react/number-box";
import CheckBoxDev from "devextreme-react/check-box";
import notify from "devextreme/ui/notify";
import Joi from "joi";
/*** custom Inputs ***/
import {
  TextBox,
  NumberBox,
  SelectBox,
  CheckBox,
  TextArea,
  Autocomplete,
  Radio,
} from "../../Components/Inputs";

/*** inner componets ***/
import Items_s2 from "./Items_s2";
import SearchItem from "./SearchItem";
import ButtonRow from "../../Components/SharedComponents/buttonsRow";
/*** api methods ***/
import {
  SAVE_ITEMS,
  GET_ITEM_BY_ID,
  DELETE,
  GET_ITEM_NAME,
  GET_ITEM_report,
  CHECK_ITEM_DATA,
  DELETE_ITEM,
  SAVE_ITEMS2,
  IMAGE,
} from "../../Services/ApiServices/ItemsAPI";
/*** selectors and async actions ***/
import {
  fetchAll,
  selectItemsLookups,
  selectMainUnit,
  fetchPermissions,
  selectElements,
  editMainUnit,
  editMainUnitList,
} from "../../Store/itemsLookups";

import { selectCategories } from "../../Store/Items/CategoriesSlice";

import { selectVisible, setVisible } from "../../Store/Items/ItemsSlice";

import debounce from "debounce";
/*** image for img tag ***/
import noImage from "../../Images/NoImage.png";
import Items_Box from "./Items_Box";
import {
  fileToBase64,
  validateForm,
  editItemInList,
  deleteItemInList,
} from "../../Services/services";
import { useTranslation } from "react-i18next";

const ItemsForm = () => {
  const { t, i18n } = useTranslation();
  let visible = useSelector(selectVisible);
  /*** useDispatch ***/
  let dispatch = useDispatch();

  let showSalesArr = [t("Normal Search"), t("Search on Sales")];
  let showSalesArrEn = ["Normal Search", "Search on Sales"];

  /*** state ***/
  let [values, setValues] = useState({
    Items_s2: [],
    Items_Box: [],
    box: 1,
  });

  let refValues = useRef({
    Items_s2: [],
    Items_Box: [],
  });

  let imageFileForApi = useRef();

  /*** id for set form with intial values to update ***/

  const schemaall = useMemo(() => {
    return {
      item_no: Joi.number().greater(0).empty(0).required().messages({
        "any.required": "Number is Required ",
        "number.greater": "This number must be greater than zero.",
      }),
      item_name: Joi.string().empty("").required().messages({
        "any.required": "This Input is Required",
        "string.empty": "This Input is Required",
      }),
      e_name: Joi.string().empty("").required().messages({
        "any.required": "This Input is Required",
        "string.empty": "This Input is Required",
      }),
      typ_id: Joi.number().required().min(1).messages({
        "number.min": "This Input is Required",
      }),
      unitid: Joi.number().required().min(1).messages({
        "number.min": "This Input is Required",
      }),
      Balita: Joi.number().min(0).messages({
        "number.min": "This number must be greater than zero.",
      }),
      box: Joi.number()
        .min(0)
        .messages({ "number.min": "This number must be greater than zero." }),
      p_gmla: Joi.number()
        .min(0)
        .messages({ "number.min": "This number must be greater than zero." }),
      price: Joi.number()
        .min(0)
        .messages({ "number.min": "This number must be greater than zero." }),
      p_gmla_2: Joi.number()
        .min(0)
        .messages({ "number.min": "This number must be greater than zero." }),
      des: Joi.number()
        .min(0)
        .messages({ "number.min": "This number must be greater than zero." }),
      Image: Joi.any(),
      Items_Box: Joi.any(),
      Items_s2: Joi.any(),
      id: Joi.number(),
      p_tkl_dolar: Joi.number()
        .min(0)
        .messages({ "number.min": "This number must be greater than zero." }),
      dis: Joi.number()
        .min(0)
        .messages({ "number.min": "This number must be greater than zero." }),
      mosawiq_nesba: Joi.number()
        .min(0)
        .messages({ "number.min": "This number must be greater than zero." }),
      unit2: Joi.any(),
      code_no: Joi.any(),
      Subject_to_validity: Joi.any(),
      image: Joi.any(),
      p_tkl: Joi.number().min(0).allow("").messages({
        "any.required": "This number must be greater than zero.",
      }),
    };
  }, []);
  const intailValues = useRef({
    p_tkl: 0,
    item_no: "",
    item_name: "",
    e_name: "",
    typ_id: 0,
    unitid: 0,
    Balita: 0,
    box: 0,
    p_gmla: 0,
    price: 0,
    p_gmla_2: 0,
    des: 0,
    Image: 0,
    Items_Box: 0,
    Items_s2: 0,
    id: 0,
    p_tkl_dolar: 0,
    dis: 0,
    mosawiq_nesba: 0,
    unit2: 0,
    code_no: " ",
    Items_s2: [],
    Items_Box: [],
    box: 1,
    Subject_to_validity: false,
    image: null,
    Subject_to_validity_disable: false,
  });

  /***item name autocomplete list ***/
  let [itemsNames, setItemsNames] = useState([]);
  /*** errors associated with item  ***/
  let [errors, setErrors] = useState({});
  let [updateDelete, setupdateDelete] = useState(false);
  /*** ?????? ***/
  let [searchKey, setSearchKey] = useState("");

  /*** selectors ***/
  // lookups for dropdowns {الوحدات الأساسيه} / {التصنيف الفرعي} / {المصدر}
  let lookups = useSelector(selectItemsLookups);
  let mainUnits = useSelector(selectMainUnit);
  let categories = useSelector(selectCategories);

  // values in store getted one time for the project life cycle
  // for showing or hiding {الباليته} / {Items_Box} / {خاض للصلاحيه}
  let showElement = useSelector(selectElements);

  /*** some handlers ***/
  // method for contolling openning and colseing the search item popup

  // Search items toggle popup
  const togglePopup = useCallback(
    (value) => {
      if (value === false || value === true) {
        dispatch(setVisible(value));
      } else {
        dispatch(setVisible());
      }
      sessionStorage.setItem("backUrl", "items");
      setErrors({});
    },
    [dispatch]
  );

  let callBack = useCallback(
    async (id) => {
      let item = await GET_ITEM_BY_ID(id);
      if (item.image) {
        item.imageProfile = "data:image;base64," + item.image;
      }
      let disabledMainUnitValues = [item.unitid];
      item.Items_Box.forEach((e) => {
        disabledMainUnitValues.push(e.unit_id);
      });
      dispatch(editMainUnitList(disabledMainUnitValues));
      console.log(item);
      setValues({ ...item, Subject_to_validity_disable: true, image: false });
      refValues.current = item;
    },
    [dispatch]
  );

  const onNew = useCallback(() => {
    setValues({ ...intailValues.current });
    setErrors({});
  }, []);
  const onEdit = useCallback(() => {
    setValues({
      Items_s2: [],
      Items_Box: [],
      box: 1,
    });
    setupdateDelete(false);
    togglePopup();
  }, [togglePopup]);
  const onUndo = useCallback(() => {
    setValues({
      Items_s2: [],
      Items_Box: [],
      box: 1,
    });
    setErrors({});
    sessionStorage.setItem("backUrl", "items");
  }, []);
  const onCopy = useCallback(() => {
    setValues({
      Items_s2: [],
      Items_Box: [],
      box: 1,
    });
    togglePopup();
  }, [togglePopup]);
  const onDelete = useCallback(() => {
    setupdateDelete(true);
    setValues({
      Items_s2: [],
      Items_Box: [],
      box: 1,
    });
    togglePopup();
  }, [togglePopup]);

  /*****************/
  /***  Effects  ***/
  /*****************/

  useEffect(async () => {
    //dipatch action for get all Item Lookups for lookups selectors
    dispatch(fetchAll());
    // dipatch action for get all Item Lookups for lookups selectors
    dispatch(fetchPermissions());
    setValues({ ...intailValues.current });
  }, []);
  useEffect(async () => {
    if (searchKey) {
      let data = await GET_ITEM_NAME("item_name", searchKey);
      setItemsNames(data.map((e) => e.item_name));
    }
  }, [searchKey]);

  /*********************/
  /****  handleres  ****/
  /*********************/

  const checkItem = useCallback(
    async (name, message) => {
      if (values[name]) {
        let { Check: notReservedInApi } = await CHECK_ITEM_DATA({
          Table: "Items",
          ID: 0,
          CheckData: { [name]: values[name] },
        });
        if (notReservedInApi) {
          let error = { ...errors };
          delete error[name];
          setErrors(error);
        } else {
          setErrors((prev) => ({
            ...prev,
            [name]: t("This Item already exists"),
          }));
        }
      }
    },
    [errors]
  );

  const handleChange = useCallback(
    ({ name, value }) => {
      setValues((values) => ({ ...values, [name]: value }));
      refValues.current = { ...refValues.current, [name]: value };
    },
    [refValues]
  );

  let handleImageUpload = useCallback(
    async ({ target: input }) => {
      let base64 = await fileToBase64(input.files[0]);

      setValues({ ...values, image: true, imageProfile: base64 });
      // handleChange({ name: "image", value: true });
      //handleChange({ name: "image", value: base64 });
      // let strImage = base64.replace(/^data:image\/[a-z]+;base64,/, "");
      refValues.current = { ...refValues.current, image: true };
      imageFileForApi.current = input.files[0];
    },
    [values, refValues, imageFileForApi]
  );

  let handleNameChange = useCallback(({ name, value }) => {
    handleChange({ name, value });
    handleSearchKey(value);
  }, []);

  let handleSearchKey = debounce((value) => setSearchKey(value), 750);

  let handleChangeList = useCallback(
    ({ name, value }) => {
      // to check if edit one that not existed in data base (item added in front only and user wnat to edit it)
      // api values
      let key = value.id ? "id" : "key";
      let refValue = refValues.current;
      if (value[key]) {
        // edid existed one
        let valuesArr = editItemInList(values[name], value, key);
        let apiValuesArr = editItemInList(refValue[name], value, key);
        setValues((values) => ({ ...values, [name]: valuesArr }));
        refValues.current = { ...refValue, [name]: apiValuesArr };
      } else {
        let newItem = { ...value, key: Math.random() };
        // add new one
        setValues((values) => ({
          ...values,
          [name]: [...values[name], newItem],
        }));
        refValues.current = {
          ...refValue,
          [name]: [...refValue[name], newItem],
        };
      }
      // dependencies here because we read arrayes from values which should be updated
      // and this willn't produce any unnecessary rerenders because we already change the list
    },
    [values]
  );

  let handleRemoveItem = useCallback(
    async ({ name, value, table }) => {
      setValues((values) => ({
        ...values,
        [name]: deleteItemInList(
          refValues.current[name],
          value,
          value.id ? "id" : "key"
        ),
      }));
      refValues.current = {
        ...refValues.current,
        [name]: deleteItemInList(
          refValues.current[name],
          value,
          value.id ? "id" : "key"
        ),
      };
      if (value.id) {
        //remove from api
        try {
          await DELETE(table, value.id);
        } catch (error) {
          handleChangeList({ name, value }); // add again in list
          notify({ message: t("Failed Try again"), width: 600 }, "error", 300);
        }
      }
    },
    [handleChangeList, t]
  );

  let RemoveItem = useCallback(async (e) => {
    await DELETE_ITEM(e.data.id)
      .then((res) => {
        notify(
          { message: t("Deleted Successfully"), width: 600 },
          "success",
          3000
        );
      })
      .catch((err) => {
        notify(
          { message: t("Cannot delete this item"), width: 450 },
          "error",
          2000
        );
      });
  }, [t]);

  let submit = async (e) => {
    e.preventDefault();
    let error = validateForm(values, schemaall);
    console.log(error);
    if (Object.keys(error).length != 0) {
      setErrors(error);
      notify(
        { message: t("Continue the missing data"), width: 600 },
        "error",
        3000
      );
      return;
    }
    setErrors({});
    let val = values;
    await SAVE_ITEMS2(val)
      .then(async (res) => {
        if (res.ImageToken) {
          await IMAGE(res, imageFileForApi.current);
        }
        notify({ message: t("Add Successfully"), width: 450 }, "success", 2000);
        onUndo();
      })
      .catch(
        ({
          response: {
            data: { Errors },
          },
        }) => {
          let responseErrors = {};
          console.log(Errors);
          if (Errors) {
            Errors.forEach(({ Column, Error }) => {
              responseErrors = { ...responseErrors, [Column]: Error };
            });
            setErrors(responseErrors);
          }
          notify({ message: t("Failed Try again"), width: 450 }, "error", 2000);
        }
      );
  };

  return (
    <div className="container-xxl">
      <div className="row">
        <div className="col-lg-9 col-12">
          <form onSubmit={submit} className="custom-card p-4">
            <div className="row">
              <div className="col-lg-3 col-12">
                <div className="image-container">
                  <img
                    src={values["imageProfile"] || noImage}
                    className="image-container__img"
                  />

                  <div className="image-container__link">
                    <input
                      accept="image/*"
                      style={{ display: "none" }}
                      id="contained-button-file"
                      type="file"
                      onChange={handleImageUpload}
                    />

                    <label htmlFor="contained-button-file">
                      <Button
                        width={"100%"}
                        text="Upload"
                        type="default"
                        stylingMode="outlined"
                      />
                    </label>
                  </div>
                </div>
                <div dir="ltr" className="mt-4">
                  <Radio
                    items={showSalesArr}
                    value={
                      showSalesArr[values["show_sales"]] || t("Normal Search")
                    }
                    name="show_sales"
                    handleChange={({ name, value }) => {
                      value = showSalesArr.findIndex((e) => e == value);
                      handleChange({ name, value });
                    }}
                  />
                  {showElement.Work_with_validity && (
                    <div className="mt-4 d-flex">
                      {
                        <CheckBoxDev
                          value={values["Subject_to_validity"] || false}
                          disabled={values["Subject_to_validity_disable"]}
                          onValueChanged={({ value }) =>
                            handleChange({ name: "Subject_to_validity", value })
                          }
                        />
                      }
                      <div className="mx-2">{t("subject to authority")}</div>
                    </div>
                  )}

                  <div className="mt-5">
                    <div className="label mb-2 py-2">{t("Item details")}</div>
                    <TextArea
                      label={t("Details of the item")}
                      value={values["byan_item"]}
                      name="byan_item"
                      handleChange={handleChange}
                      required={false}
                    />
                  </div>
                </div>
              </div>

              <div className="col-lg-9 col-12">
                <div className="double">
                  <SearchItem
                    callBack={callBack}
                    allowDelete={updateDelete}
                    onRowRemoving={RemoveItem}
                    togglePopup={togglePopup}
                    visible={visible}
                  />

                  <div className="input-wrapper">
                    <div className="label">{t("Item Number")}</div>
                    <NumberBoxDev
                      validationStatus={errors["item_no"] ? "invalid" : "valid"}
                      validationErrors={[{ message: t(errors["item_no"]) }]}
                      style={{ direction: "ltr" }}
                      value={values["item_no"]}
                      onInput={({ event }) =>
                        handleChange({
                          name: "item_no",
                          value: event.target.value,
                        })
                      }
                      onFocusOut={() => checkItem("item_no", "الرقم")}
                    />
                  </div>

                  <Autocomplete
                    label={t("Item Name")}
                    value={values["item_name"]}
                    name="item_name"
                    searchTimeout={750}
                    handleChange={({ name, value }) =>
                      handleNameChange({ name, value })
                    }
                    onFocusOut={() => checkItem("item_name", "الإسم")}
                    validationErrorMessage={errors["item_name"]}
                    dataSource={itemsNames}
                    required={false}
                  />

                  <TextBox
                    label={t("English Name")}
                    name="e_name"
                    validationStatus={errors["e_name"] ? "invalid" : "valid"}
                    validationErrors={[{ message: t(errors["e_name"]) }]}
                    value={values["e_name"]}
                    handleChange={handleChange}
                  />

                  <SelectBox
                    label={t("Categorize")}
                    value={values["typ_id"]}
                    name="typ_id"
                    dataSource={categories}
                    handleChange={handleChange}
                    validationErrorMessage={t(errors["typ_id"])}
                    required={false}
                  />

                  <SelectBox
                    label={t("basic unit")}
                    value={values["unitid"]}
                    name="unitid"
                    dataSource={lookups.MainUnit}
                    handleChange={({ name, value }) => {
                      let previous = values["unitid"];
                      dispatch(editMainUnit({ previous, value }));
                      handleChange({ name, value });
                    }}
                    validationErrorMessage={t(errors["unitid"])}
                  />

                  <NumberBox
                    label={t("Package")}
                    value={values["box"]}
                    required={false}
                    name="box"
                    handleChange={handleChange}
                    validationErrorMessage={t(errors["box"])}
                    nonNegative
                  />
                  {showElement.Work_with_Seramik && (
                    <NumberBox
                      label={t("Ballet")}
                      value={values["Balita"]}
                      required={false}
                      name="Balita"
                      handleChange={handleChange}
                      validationErrorMessage={t(errors["Balita"])}
                      nonNegative
                    />
                  )}
                </div>

                <div className="double mt-4">
                  <NumberBox
                    label={t("sectoral price")}
                    value={values["price"]}
                    name="price"
                    handleChange={handleChange}
                    required={false}
                    validationErrorMessage={errors["price"]}
                  />
                  <NumberBox
                    label={t("Wholesale price")}
                    value={values["p_gmla"]}
                    name="p_gmla"
                    handleChange={handleChange}
                    required={false}
                    validationErrorMessage={errors["p_gmla"]}
                  />
                  <NumberBox
                    label={t("wholesale wholesale price")}
                    value={values["p_gmla_2"]}
                    name="p_gmla_2"
                    handleChange={handleChange}
                    required={false}
                    validationErrorMessage={errors["p_gmla_2"]}
                  />
                  <NumberBox
                    label={t("Lowest Price")}
                    value={values["des"]}
                    name="des"
                    handleChange={handleChange}
                    required={false}
                    validationErrorMessage={errors["des"]}
                  />
                  <NumberBox
                    label={t("Cost Price")}
                    value={values["p_tkl"]}
                    name="p_tkl"
                    handleChange={handleChange}
                    required={false}
                    validationErrorMessage={errors["p_tkl"]}
                  />
                  <NumberBox
                    label={t("dollar cost")}
                    value={values["p_tkl_dolar"]}
                    name="p_tkl_dolar"
                    handleChange={handleChange}
                    required={false}
                    validationErrorMessage={errors["p_tkl_dolar"]}
                  />

                  <NumberBox
                    label={t("Discount Percentage")}
                    value={values["dis"]}
                    name="dis"
                    handleChange={handleChange}
                    required={false}
                    validationErrorMessage={errors["dis"]}
                  />
                </div>

                <div className="double mt-4">
                  <NumberBox
                    label={t("Marketer Percentage")}
                    value={values["mosawiq_nesba"]}
                    name="mosawiq_nesba"
                    handleChange={handleChange}
                    required={false}
                    validationErrorMessage={errors["mosawiq_nesba"]}
                  />
                  <SelectBox
                    label={t("virtual unit")}
                    value={values["unit2"]}
                    name="unit2"
                    dataSource={mainUnits}
                    handleChange={handleChange}
                    required={false}
                    keys={{ id: "name", name: "name" }}
                    validationErrorMessage={t(errors["unit2"])}
                  />
                  <TextBox
                    label={t("Part Number")}
                    value={values["code_no"]}
                    name="code_no"
                    handleChange={handleChange}
                    required={false}
                    validationErrorMessage={t(errors["code_no"])}
                  />
                </div>

                <div
                  className="mb-3"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapseExample"
                  aria-expanded="false"
                  aria-controls="collapseExample"
                >
                  <Button
                    width={"100%"}
                    text={t("additional properties")}
                    type="normal"
                    stylingMode="contained"
                  />
                </div>

                <div className="collapse" id="collapseExample">
                  <div className="double">
                    <TextBox
                      label={t("Manufacture Country")}
                      value={values["comp"]}
                      name="comp"
                      handleChange={handleChange}
                      required={false}
                    />
                    <NumberBox
                      label={t("commercial number")}
                      value={values["PARCODE1"]}
                      name="PARCODE1"
                      handleChange={handleChange}
                      required={false}
                      nonNegative
                    />
                    <NumberBox
                      label={t("internal barcode")}
                      value={values["PARCODE2"]}
                      name="PARCODE2"
                      handleChange={handleChange}
                      required={false}
                      nonNegative
                    />
                    <TextBox
                      label={t("Item Location")}
                      value={values["item_place"]}
                      name="item_place"
                      handleChange={handleChange}
                      required={false}
                    />
                  </div>

                  <div className="double  mt-3">
                    <SelectBox
                      label={t("Subclassification")}
                      value={values["cunt"]}
                      name="cunt"
                      dataSource={lookups.OtherCategory}
                      handleChange={handleChange}
                      required={false}
                    />

                    <SelectBox
                      label={t("Source")}
                      value={values["msdar"]}
                      name="msdar"
                      dataSource={lookups.Supplier}
                      handleChange={handleChange}
                      required={false}
                    />

                    <TextBox
                      label={t("Item Name")}
                      value={values["e_name"]}
                      name="e_name"
                      handleChange={handleChange}
                      required={false}
                    />

                    <CheckBox
                      label={t("Allow the item to be displayed on the site")}
                      value={values["show_net"] || false}
                      name="show_net"
                      handleChange={handleChange}
                      required={false}
                    />
                  </div>

                  <div className="double mt-3">
                    <NumberBox
                      label={t("Long")}
                      value={values["tol"]}
                      name="tol"
                      handleChange={handleChange}
                      required={false}
                      nonNegative
                    />
                    <NumberBox
                      label={t("Display")}
                      value={values["ord"]}
                      name="ord"
                      handleChange={handleChange}
                      required={false}
                      nonNegative
                    />
                    <NumberBox
                      label={t("Height")}
                      value={values["ert"]}
                      name="ert"
                      handleChange={handleChange}
                      required={false}
                      nonNegative
                    />
                    <NumberBox
                      label={t("Weight")}
                      label="الوزن"
                      value={values["wazn"]}
                      name="wazn"
                      handleChange={handleChange}
                      required={false}
                      nonNegative
                    />
                  </div>
                </div>
                {
                  // showElement.Cancel_box &&
                  <Items_Box
                    items={values["Items_Box"]}
                    save={handleChangeList}
                    remove={handleRemoveItem}
                    options={lookups.MainUnit}
                    boxValue={values["box"]}
                  />
                }
              </div>
              <ButtonRow
                onNew={onNew}
                onEdit={onEdit}
                onUndo={onUndo}
                onCopy={onCopy}
                onDelete={onDelete}
              />
            </div>
          </form>
        </div>

        <div className="col-lg-3 col-4">
          <Items_s2
            items={values["Items_s2"]}
            save={handleChangeList}
            remove={handleRemoveItem}
          />
        </div>
      </div>
    </div>
  );
};

export default ItemsForm;
