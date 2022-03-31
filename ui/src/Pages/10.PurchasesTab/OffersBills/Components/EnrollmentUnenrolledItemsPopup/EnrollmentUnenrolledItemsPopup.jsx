import React, { useCallback, useState, useMemo, useEffect } from "react";
import { CheckBox, Popup } from "devextreme-react";
import { SelectBox } from "../../../../../Components/Inputs";
import { Button } from "devextreme-react";
import { GET_MAIN_CATEGORIES } from "../../../../../Services/ApiServices/ItemsAPI";
import { GET_SPECIFIC_LOOKUP } from "../../../../../Services/ApiServices/General/LookupsAPI";
import { ENROLL_ITEMS } from "../../API.OffersBills";
import notify from "devextreme/ui/notify";
import { useTranslation } from "react-i18next";

const EnrollmentUnenrolledItemsPopup = ({
  id,
  visible,
  togglePopup,
  categories,
  units,
}) => {
  const { t, i18n } = useTranslation();
  const [values, setValues] = useState({ 1: false, 2: false, 4: false });

  const [selectedValues, setSelectedValues] = useState({});

  const [areExpiredItems, setAreExpiredItems] = useState(false);

  const checkBoxValueHandle = useCallback((e) => {
    setValues((prev) => ({ ...prev, [parseInt(e.element.id)]: e.value }));
  }, []);

  const selectBoxsValueChange = useCallback((e) => {
    setSelectedValues((prev) => ({ ...prev, [e.name]: e.value }));
  }, []);

  const areExpiredItemsValueHandle = useCallback((e) => {
    setAreExpiredItems(e.value);
  }, []);

  const combinationValue = useMemo(() => {
    return Object.entries(values).reduce((total, [key, value]) => {
      return total + key * value;
    }, 0);
  }, [values]);

  const buttonDisable = useMemo(() => {
    return !(
      Object.entries(values).reduce((total, [key, value]) => {
        return total || value;
      }, false) &&
      selectedValues.category &&
      selectedValues.unit
    );
  }, [selectedValues.category, selectedValues.unit, values]);

  const apiPayload = useMemo(() => {
    return {
      Data: [
        {
          AreExpiredItems: areExpiredItems,
          UnitID: selectedValues.unit,
          CategoryID: selectedValues.category,
          UpdateType: combinationValue,
          OfferBillID: id,
        },
      ],
    };
  }, [
    areExpiredItems,
    combinationValue,
    id,
    selectedValues.category,
    selectedValues.unit,
  ]);

  const enrollItemsHandle = useCallback(() => {
    ENROLL_ITEMS(apiPayload)
      .then((response) => {
        notify({ message: t("Add Successfully"), width: 450 }, "success", 2000);
        togglePopup();
      })
      .catch((error) => {
        notify({ message: t("Failed Try again"), width: 450 }, "error", 2000);
      });
  }, [apiPayload, togglePopup]);

  return (
    <>
      <Popup
        visible={visible}
        onHiding={togglePopup}
        width={"600px"}
        height={"320px"}
      >
        <h5 className="text-center text-bold">ادراج الأصناف الغير مدرجة</h5>
        <div className="row rtlContainer my-2">
          <div className="my-2 d-flex col-6">
            <CheckBox id="1" onValueChanged={checkBoxValueHandle} />
            <span className="mx-2">{t("Agree with the item number")}</span>
          </div>
          <div className="my-2 d-flex col-6">
            <CheckBox id="2" onValueChanged={checkBoxValueHandle} />
            <span className="mx-2">
              {t("Agree with the name of the class")}
            </span>
          </div>
          <div className="my-2 d-flex col-6">
            <CheckBox id="4" onValueChanged={checkBoxValueHandle} />
            <span className="mx-2">{t("Match the part number")}</span>
          </div>
          <div className="my-2 d-flex col-6">
            <CheckBox onValueChanged={areExpiredItemsValueHandle} />
            <span className="mx-2">{t("Items subject to validity")}</span>
          </div>
        </div>
        <div className="row rtlContainer my-3">
          <div className="col-6">
            <SelectBox
              label={t("Categorize")}
              dataSource={categories}
              name="category"
              value={selectedValues.category}
              handleChange={selectBoxsValueChange}
            />
          </div>
          <div className="col-6">
            <SelectBox
              label={t("Unit")}
              dataSource={units}
              name="unit"
              keys={{ id: "id", name: "description" }}
              value={selectedValues.unit}
              handleChange={selectBoxsValueChange}
            />
          </div>

          <div className="d-flex justify-content-center my-3">
            <Button
              disabled={buttonDisable}
              className="btn btn-primary col-4"
              onClick={enrollItemsHandle}
            >
              {t("Insertion")}
            </Button>
          </div>
        </div>
      </Popup>
    </>
  );
};

export default React.memo(EnrollmentUnenrolledItemsPopup);
