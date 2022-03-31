import React, { useRef, useState, useEffect, useCallback } from "react";
import { Popup } from "devextreme-react/popup";
import { SelectBox } from "../../../../../Components/Inputs";
import { Button } from "devextreme-react";
import { useTranslation } from "react-i18next";

const MatchingColumnsPopup = ({
  visible,
  togglePopup,
  toggleNextPopup,
  colNames,
  selectedColumnNames,
  updateSelectedColumnNames,
}) => {
  const { t, i18n } = useTranslation();
  const selectBoxsNames = useRef([
    { name: "item_no", title: "Item Number" },
    { name: "item_name", title: "Item Name" },
    { name: "code_no", title: "Part Number" },
    { name: "item_name_e", title: "Code" },
    { name: "Exp_Date", title: "Expiry" },
    { name: "dess", title: "description" },
    { name: "kmea", title: "Quantity" },
    { name: "price", title: "Price" },
  ]);

  const selectBoxKeys = useRef({ id: "name", name: "name" });

  const handleColumnNamesMatch = useCallback(
    (e) => {
      togglePopup();
      toggleNextPopup();
    },
    [toggleNextPopup, togglePopup]
  );

  return (
    <>
      {visible && (
        <Popup
          visible={visible}
          onHiding={togglePopup}
          rtlEnabled={true}
          height={"450px"}
          width={"800px"}
        >
          <h2
            style={{
              textAlign: "center",
              padding: "15px",
              fontWeight: "900",
              fontSize: "xx-large",
            }}
          >
            {t("Column matching")}
          </h2>
          <div className="row">
            {selectBoxsNames.current.map(({ name, title }, index) => {
              return (
                <div className="col-6">
                  <SelectBox
                    key={index}
                    label={t(title)}
                    dataSource={colNames}
                    name={name}
                    value={selectedColumnNames[name]}
                    keys={selectBoxKeys.current}
                    handleChange={updateSelectedColumnNames}
                  />
                </div>
              );
            })}
          </div>
          <div className="row d-flex justify-content-center">
            <Button
              className="btn btn-success col-4 my-3"
              onClick={handleColumnNamesMatch}
              style={{ height: "45px" }}
            >
              {t("Next")}
            </Button>
          </div>
        </Popup>
      )}
    </>
  );
};

export default React.memo(MatchingColumnsPopup);
