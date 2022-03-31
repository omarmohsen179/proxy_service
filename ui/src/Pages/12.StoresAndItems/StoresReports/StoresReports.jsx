import React, { useEffect, useState, useCallback } from "react";
import { Button } from "devextreme-react";
import { SelectBox } from "../../../Components/Inputs";
import ItemsTable from "../../../Components/Items/ItemsTable";
import { TextBox, CheckBox } from "devextreme-react";
import { GET_CASHIER_STORES } from "../../../Templetes/Invoice/Components/InvoiceInformation/API.InvoiceInformation";
import { GET_MAIN_CATEGORIES } from "../../../Services/ApiServices/ItemsAPI";
import ItemMovementsPopup from "../../../Components/ItemMovementsPopup/ItemMovementsPopup";
import { useTranslation } from "react-i18next";

const StoresReport = () => {
  const [stores, setStores] = useState([]);
  const { t, i18n } = useTranslation();
  const [Categories, setCategories] = useState([]);

  const [apiPayload, setApiPayload] = useState({
    m_no: 0,
    typ_id: 0,
    qunt: false,
  });

  const [selectedItemId, setSelectedItemId] = useState(null);

  const [showItemMovementPopup, setShowItemMovementPopup] = useState(false);

  const updateApiPayload = useCallback((e) => {
    setApiPayload((prevApiPayload) => ({
      ...prevApiPayload,
      [e.name]: e.value,
    }));
  }, []);

  const toggleShowItemMovementPopup = useCallback(() => {
    setShowItemMovementPopup((prev) => !prev);
  }, []);

  const handleRowClicked = useCallback(({ data: { id } }) => {
    setSelectedItemId(id);
    setShowItemMovementPopup(true);
  }, []);

  useEffect(() => {
    GET_CASHIER_STORES().then((stores) => {
      stores && setStores([{ id: 0, name: t("All") }, ...stores]);
    });
    GET_MAIN_CATEGORIES().then(({ MainCategory }) => {
      MainCategory &&
        setCategories([{ id: 0, name: t("All Categories") }, ...MainCategory]);
    });
  }, []);

  return (
    <>
      {selectedItemId && (
        <ItemMovementsPopup
          itemId={selectedItemId}
          visable={showItemMovementPopup}
          togglePopup={toggleShowItemMovementPopup}
        />
      )}
      <h1 className="invoiceName">{t("inventory check")}</h1>
      <div className="container-xxl card py-3 my-3" dir="rtl">
        <div>
          <div className="row">
            <div className="col-4">
              <SelectBox
                label={t("Store")}
                dataSource={stores}
                value={apiPayload.m_no}
                handleChange={updateApiPayload}
                name="m_no"
              />
            </div>

            <div className="col-4">
              <SelectBox
                label={t("Categorize")}
                dataSource={Categories}
                value={apiPayload.typ_id}
                handleChange={updateApiPayload}
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
        </div>
        <div className="row my-2">
          <ItemsTable
            apiPayload={apiPayload}
            handleRowClicked={handleRowClicked}
          />
        </div>

        <div className="row">
          <div className="my-2 d-flex col-3">
            <CheckBox
              value={apiPayload.qunt}
              onValueChanged={({ value }) =>
                updateApiPayload({ name: "qunt", value })
              }
            />
            <div className="mx-2">{t("Show Quantity (0)")}</div>
          </div>

          <div className="my-2 d-flex col-3">
            <CheckBox
              defaultValue={1}
              // onValueChanged={({ value }) =>
              //     changeWithoutDebounce({ name: "qunt", value })
              // }
            />
            <div className="mx-2">{t("Quantity and price")}</div>
          </div>

          <div className="my-2 d-flex col-3">
            <CheckBox
              defaultValue={1}
              // onValueChanged={({ value }) =>
              //     changeWithoutDebounce({ name: "qunt", value })
              // }
            />
            <div className="mx-2">{t("inventory")}</div>
          </div>
          <div className="my-2 d-flex col-3">
            <CheckBox
              defaultValue={1}
              // onValueChanged={({ value }) =>
              //     changeWithoutDebounce({ name: "qunt", value })
              // }
            />
            <div className="mx-2">{t("Quick View Invoice Setup")}</div>
          </div>
          <div className="my-2 d-flex col-3">
            <CheckBox
              defaultValue={1}
              // onValueChanged={({ value }) =>
              //     changeWithoutDebounce({ name: "qunt", value })
              // }
            />
            <div className="mx-2">{t("Show wholesale price")}</div>
          </div>
          <div className="my-2 d-flex col-3">
            <CheckBox
              defaultValue={1}
              // onValueChanged={({ value }) =>
              //     changeWithoutDebounce({ name: "qunt", value })
              // }
            />
            <div className="mx-2">{t("Show item price")}</div>
          </div>
          <div className="my-2 d-flex col-3">
            <CheckBox
              defaultValue={1}
              // onValueChanged={({ value }) =>
              //     changeWithoutDebounce({ name: "qunt", value })
              // }
            />
            <div className="mx-2">{t("Show the part number")}</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default StoresReport;
