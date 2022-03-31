// React
import React, { useState, useEffect, useCallback } from "react";

// DevExpress
// import "devextreme/dist/css/dx.common.css";
// import "devextreme/dist/css/dx.light.css";
import notify from "devextreme/ui/notify";

// Components
import {
  TextBox,
  NumberBox,
  SelectBox,
  CheckBox,
} from "../../../Components/Inputs";
import { Button } from "devextreme-react/button";
import TableModal from "./Components/TableModal";

// APIs
import {
  // API to get value of chnaging currency to dollars
  GET_DOLLAR_CHANGE_RATE,
  // API to get data of drop down list التصنيف
  GET_MAIN_CATEGORIES,
  // API to Submit -- in button تعديل
  SUBMIT_EDITS,
} from "./API.SellingPricesModifications";

import { debounce } from "lodash";
import { useTranslation } from "react-i18next";

function SellingPricesModifications() {
  const { t, i18n } = useTranslation();
  // ============================================================================================================================
  // ================================================= States ===================================================================
  // ============================================================================================================================
  // 1- Set Dollar Change Rate سعر تغير الدولار
  const [dollarChangeRate, setDollarChangeRate] = useState();
  // 2- Set ClassificationList الليست الخاصة بالتصنيف
  const [classificationList, setClassificationList] = useState([]);
  // 3-	Setting value of classification قيمة التصنيف
  const [classificationValue, setClassificationValue] = useState();
  // 4-	Setting value of category searching  بحث باسم الصنف
  const [SearchNameValue, setSearchNameValue] = useState("");
  // 5-	Setting value of changing value  قيمة التعديل
  const [changeValue, setChangeValue] = useState(0);
  // 6-	Setting value of CheckBoxes of 	 Selling Prices Modifications الخاصة بتعديل أسعار البيع
  const [checkBoxesValues, setCheckBoxesValues] = useState({
    wholeWholeSalePrice: false,
    wholeSalePrice: false,
    piecePrice: false,
  });
  // 7- We set here value of checkboxes as every checkbox has specific value
  // sent to it in its handlechange and we collect here their values depending on
  // checkboxes are selected or not.
  let [updateType, setUpdateType] = useState(0);
  // Error Object
  const [errors, setErrors] = useState([]);
  // 8- This state, We send this state to the table component
  // and its only use is to chnge its value after submiting so value change happen
  // so sent value to table change so table re renders after submiting
  const [renderTable, setRenderTable] = useState(false);

  // ============================================================================================================================
  // ================================================= Effects ==================================================================
  // ============================================================================================================================
  // Initial Effect
  useEffect(async () => {
    // Getting value of dollar changing rate api
    await GET_DOLLAR_CHANGE_RATE()
      .then((res) => setDollarChangeRate(res.DollarChangeRate))
      .catch((err) => console.log(err));
    // Getting list of categories  api
    await GET_MAIN_CATEGORIES()
      .then((res) => {
        setClassificationList(res.MainCategory);
        console.log(res);
      })
      .catch();
    // Setting initial value of classififcation
    setClassificationValue(0);
  }, []);

  // ============================================================================================================================
  // ================================================= handelers ================================================================
  // ============================================================================================================================

  // Handle Category Change
  let handleCategoriesChange = ({ value }) => {
    setClassificationValue(value);
  };
  // handle changing value of بحث باسم الصنف
  let handleSearchNameValue = ({ value }) => {
    setSearchNameValue(value);
  };
  // handle changing value of قيمة التعديل
  let handleChangevalue = ({ value }) => {
    setChangeValue(value);
  };

  // Handle Checkboxes values if true or false and setting updating type depending on
  // values given to each checkbox on handle change
  let handleCheckBoxesValue = (val, { name, value }) => {
    setCheckBoxesValues((prevState) => ({ ...prevState, [name]: value }));
    setUpdateType((prevState) => {
      if (value) {
        return (prevState = prevState + val);
      } else {
        return (prevState = prevState - val);
      }
    });
  };
  // Chnaging dollar rate handelr
  let handleDollarChangeRate = ({ value }) => {
    setDollarChangeRate(value);
  };

  // Submit button functions
  let handleEditButtonSubmit = useCallback(async () => {
    let errArr = [];

    if (
      checkBoxesValues.piecePrice === false &&
      checkBoxesValues.wholeSalePrice === false &&
      checkBoxesValues.wholeWholeSalePrice === false
    ) {
      errArr.push(
        t("Selling is choosing one of the price adjustment options.")
      );
    }
    if (
      dollarChangeRate == 0 ||
      ((dollarChangeRate == null) == dollarChangeRate) == undefined
    ) {
      errArr.push(
        t("The 'dollar rate' value must be entered and be greater than 0.")
      );
    }
    if (
      changeValue == 0 ||
      ((changeValue == null) == changeValue) == undefined
    ) {
      errArr.push(
        t(
          "The value of 'modification value' must be entered and be greater than 0."
        )
      );
    }

    if (errArr.length > 0) {
      setErrors(errArr);
    } else {
      var Data = {
        Data: {
          UpdateType: updateType,
          DollarChangeRate: dollarChangeRate,
          ChangeValue: changeValue,
          Name: SearchNameValue,
          CategoryID: classificationValue,
        },
      };

      await SUBMIT_EDITS(Data)
        .then((res) => {
          setErrors([]);
          notify({ message: "تم التعديل بنجاح", width: 600 }, "success", 3000);
          setRenderTable(!renderTable);
        })
        .catch((err) => {
          err.response.data.Errors.map((element) => {
            errArr.push(element.Error);
          });
          setErrors(errArr);
        });
    }
  }, [
    updateType,
    dollarChangeRate,
    changeValue,
    SearchNameValue,
    classificationValue,
    renderTable,
  ]);

  return (
    <>
      <div
        className="container"
        style={{ direction: i18n.language == "en" ? "ltr" : "rtl" }}
      >
        <div className="mb-3">
          <div
            className="mb-5 w-100 d-flex justify-content-center h2 mt-5"
            style={{ fontWeight: "bold" }}
          >
            {t("Update sell prices")}
          </div>
          <div className="w-50" style={{ marginLeft: "auto" }}>
            <SelectBox
              label={t("Categorize")}
              dataSource={classificationList}
              value={classificationValue}
              handleChange={handleCategoriesChange}
              required={false}
            />
          </div>

          <div className="mt-3">
            <TableModal
              classificationValue={classificationValue}
              SearchNameValue={SearchNameValue}
              renderTable={renderTable}
            />
          </div>
          <div
            className="w-50"
            style={{ marginLeft: "auto", marginTop: "20px" }}
          >
            <TextBox
              label={t("Search by item name")}
              value={SearchNameValue}
              handleChange={debounce((e) => handleSearchNameValue(e), 500)}
              required={false}
            />
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "20px",
            }}
          >
            <div
              style={{
                fontSize: "20px",
                fontWeight: "bold",
              }}
            >
              {t("Update sell prices")}
            </div>

            <div className="triple w-75 ">
              <CheckBox
                label={t("wholesale wholesale price")}
                value={checkBoxesValues["wholeWholeSalePrice"]}
                name="wholeWholeSalePrice"
                handleChange={(e) => handleCheckBoxesValue(1, e)}
              />
              <CheckBox
                label={t("Wholesale price")}
                value={checkBoxesValues["wholeSalePrice"]}
                name="wholeSalePrice"
                handleChange={(e) => handleCheckBoxesValue(2, e)}
              />
              <CheckBox
                label={t("Unit price")}
                value={checkBoxesValues["piecePrice"]}
                name="piecePrice"
                handleChange={(e) => handleCheckBoxesValue(4, e)}
              />
            </div>
          </div>

          <div className="double mt-4">
            <NumberBox
              label={t("dollar price")}
              value={dollarChangeRate}
              name="DollarChangeRate"
              handleChange={handleDollarChangeRate}
              required={false}
            />
            <NumberBox
              label={t("Adjustment value")}
              value={changeValue}
              name="num"
              handleChange={handleChangevalue}
              required={false}
            />
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Button
              text={t("Edit")}
              stylingMode="contained"
              height="40px"
              type="default"
              width="100px"
              onClick={handleEditButtonSubmit}
            />
            <div className="error mb-3">
              {errors && errors.map((element) => <li>{element}</li>)}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default SellingPricesModifications;
