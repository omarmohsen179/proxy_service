import React, { useState, useMemo, useCallback } from "react";
import _ from "lodash";
import DropDownButton from "devextreme-react/drop-down-button";
import { useTranslation } from "react-i18next";

const InvoiceControlPanel = ({
  billInformation,
  items,
  itemEditMode,
  updatedItem,
  errors,
  addItemToInvoice,
  cancelEditItem,
  mergeItemsHandle,
  explodeItamHandle,
}) => {
  //? ────────────────────────────────────────────────────────────────────────────────
  //? ─── STATES ─────────────────────────────────────────────────────────────────────
  //? ────────────────────────────────────────────────────────────────────────────────
  const [explodeButtonId, setExplodeButtonId] = useState(0);
  const [addButtonId, setAddButtonId] = useState(0);
  const { t, i18n } = useTranslation();
  //* ────────────────────────────────────────────────────────────────────────────────
  //* ─── CALLBACKS ──────────────────────────────────────────────────────────────────
  //* ────────────────────────────────────────────────────────────────────────────────
  const handleTest = () => {
    console.log(
      itemEditMode,
      billInformation.storeId,
      billInformation.mosweq_id,
      billInformation.id && !billInformation.readOnly
    );
  };

  //? ────────────────────────────────────────────────────────────────────────────────
  //? ─── EFFECTS ────────────────────────────────────────────────────────────────────
  //? ────────────────────────────────────────────────────────────────────────────────

  //* ────────────────────────────────────────────────────────────────────────────────
  //* ─── MEMOs ──────────────────────────────────────────────────────────────────────
  //* ────────────────────────────────────────────────────────────────────────────────

  const disableButtonOnError = useMemo(() => {
    return !updatedItem.item_name || !_.isEmpty(errors);
  }, [errors, updatedItem.item_name]);

  const mergeButtonIsDisable = useMemo(() => {
    return _.isEmpty(
      items.filter(
        (item) =>
          !itemEditMode &&
          item.item_id === updatedItem.item_id &&
          updatedItem.m_no === item.m_no &&
          (!item.Subject_to_validity || updatedItem.Exp_date === item.Exp_date)
      )
    );
  }, [
    itemEditMode,
    items,
    updatedItem.Exp_date,
    updatedItem.item_id,
    updatedItem.m_no,
  ]);

  const explodeButtonIsDisable = useMemo(() => {
    return !(
      billInformation.id > 0 &&
      updatedItem.Boxs &&
      updatedItem.Boxs.length > 1 &&
      parseFloat(updatedItem.Box_id) > 1 &&
      parseFloat(updatedItem.sum_box) > 1
    );
  }, [
    billInformation.id,
    updatedItem.Boxs,
    updatedItem.Box_id,
    updatedItem.sum_box,
  ]);

  return (
    <div className="row px-3">
      <div className="col-3">
        <DropDownButton
          key="add"
          rtlEnabled={true}
          className="col-12"
          disabled={disableButtonOnError}
          splitButton={true}
          useSelectMode={true}
          selectedItemKey={addButtonId}
          items={[
            {
              id: 0,
              name: itemEditMode ? t("Edit") : t("Add"),
              icon: itemEditMode ? "edit" : "add",
              onClick: () => addItemToInvoice(updatedItem),
            },
            {
              id: 1,
              name: t("Merge"),
              icon: "unselectall",
              onClick: mergeItemsHandle,
              disabled: mergeButtonIsDisable,
            },
            {
              id: 2,
              name: t("Cancel"),
              icon: "clear",
              onClick: cancelEditItem,
              disabled: !updatedItem,
            },
          ]}
          displayExpr="name"
          keyExpr="id"
          onButtonClick={({ selectedItem }) => selectedItem.onClick()}
        />
      </div>

      <div className="col-3">
        <DropDownButton
          stylingMode="outlined"
          key="explode"
          rtlEnabled={true}
          className="col-12"
          disabled={explodeButtonIsDisable}
          splitButton={true}
          useSelectMode={true}
          selectedItemKey={explodeButtonId}
          items={[
            {
              id: 0,
              name: t("disposable inferiority"),
              icon: "rowproperties",
              onClick: ({ itemData }) => explodeItamHandle(itemData.id),
            },
            {
              id: 1,
              name: t("excessive quantity"),
              icon: "smalliconslayout",
              onClick: ({ itemData }) => explodeItamHandle(itemData.id),
            },
          ]}
          displayExpr="name"
          keyExpr="id"
          // on selected button clicked
          onButtonClick={({ selectedItem }) => {
            explodeItamHandle(selectedItem.id);
          }}
          // on option from dropDawn clicked
          onItemClick={({ itemData }) => {
            setExplodeButtonId(itemData.id);
          }}
        />
      </div>

      <div className="col-3">
        <button
          style={{ height: "41px" }}
          className="col-12 btn btn-success d-flex align-items-center justify-content-center"
          onClick={(e) => handleTest(e)}
        >
          <i className="fas fa-file-invoice-dollar px-2 fa-2x"></i>
          <span className="">{t("Information")}</span>
        </button>
      </div>
    </div>
  );
};

export default React.memo(InvoiceControlPanel);
