import React, { useCallback } from "react";
import { Popup } from "devextreme-react/popup";
import { SelectBox } from "../../../../../Components/Inputs";
import { Button } from "devextreme-react";

import { useMemo } from "react";
import ExcelTable from "./ExcelTable";
import { useTranslation } from "react-i18next";

const ExcelEditTablePopup = ({
  visible,
  togglePopup,
  dataSource,
  selectedColumnNames,
  storeDataHandle,
}) => {
  const storePossibleDataHandle = useCallback(() => {
    storeDataHandle(false);
  }, [storeDataHandle]);

  const storeAllDataHandle = useCallback(() => {
    storeDataHandle(true);
  }, [storeDataHandle]);
  const { t, i18n } = useTranslation();
  return (
    <>
      {visible && (
        <Popup visible={visible} height={"700px"} onHiding={togglePopup}>
          <h2
            style={{
              textAlign: "center",
              padding: "10px",
              fontWeight: "900",
              fontSize: "xx-large",
            }}
          >
            {t("Update data")}
          </h2>
          <ExcelTable
            dataSource={dataSource}
            selectedColumnNames={selectedColumnNames}
          />
          <div className="d-flex justify-content-center">
            <Button
              className="btn btn-success col-4 mx-3 my-3"
              onClick={storeAllDataHandle}
              style={{ height: "45px" }}
            >
              {t("Store all data")}
            </Button>
            <Button
              className="btn btn-secondary col-4 mx-3 my-3"
              onClick={storePossibleDataHandle}
              style={{ height: "45px" }}
            >
              {t("Available data storage")}
            </Button>
          </div>
        </Popup>
      )}
    </>
  );
};

export default ExcelEditTablePopup;
