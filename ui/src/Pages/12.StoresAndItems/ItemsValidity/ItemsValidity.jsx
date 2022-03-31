import React, { useEffect, useState, useCallback } from "react";
import { SelectBox } from "../../../Components/Inputs";
import { GET_MAIN_CATEGORIES } from "../../../Services/ApiServices/ItemsAPI";
import ItemsValidityTable from "./Components/ItemsValidityTable/ItemsValidityTable";
import { useTranslation } from "react-i18next";
const ItemsValidity = () => {
  const [categories, setCategories] = useState([]);
  const { t, i18n } = useTranslation();
  const [selectedCategoryId, setSelectedCategoryId] = useState(0);

  useEffect(() => {
    GET_MAIN_CATEGORIES().then(({ MainCategory }) => {
      MainCategory &&
        setCategories([{ id: 0, name: t("All Categories") }, ...MainCategory]);
    });
  }, []);
  return (
    <>
      <h1 className="invoiceName">{t("Validity of Items")}</h1>
      <div className="container rtlContainer">
        <div className="card p-3">
          <div className="row">
            <div className="col-4">
              <SelectBox
                label={t("Categorize")}
                dataSource={categories}
                value={selectedCategoryId}
                handleChange={(e) => setSelectedCategoryId(e.value)}
                name="typ_id"
              />
            </div>
            <div className="col-4">
              <button
                className="col-12 btn btn-outline-info btn-outline"
                // onClick={printHandle}
                // disabled={!selectedSafe}
                style={{ height: "36px" }}
              >
                <span> {t("Print")}</span>
              </button>
            </div>
          </div>
          <div className="row my-2">
            <ItemsValidityTable selectedCategoryId={selectedCategoryId} />
          </div>
        </div>
      </div>
    </>
  );
};

export default ItemsValidity;
