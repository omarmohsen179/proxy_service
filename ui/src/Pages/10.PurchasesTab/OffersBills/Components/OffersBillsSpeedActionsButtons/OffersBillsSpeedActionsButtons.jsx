import React, { useState, useEffect, useCallback } from "react";
import { SpeedDialAction } from "devextreme-react";
import config from "devextreme/core/config";
import repaintFloatingActionButton from "devextreme/ui/speed_dial_action/repaint_floating_action_button";
import ImportFromExcel from "../ImportFromExcel/ImportFromExcel";
import { useMemo } from "react";
import { isNull } from "lodash";
import { useTranslation } from "react-i18next";
// import OpenPDFWindow from "../../../../Components/SharedComponents/PDFReader/PDFwindowFunction";
// import { GET_PDF_FILE } from "./API.SpeedActionsButtons";

const OffersBillsSpeedActionsButtons = ({
  readOnly,
  showImportFromExcel,
  setNewInvoice,
  openBillsTable,
  addItemsFromExcel,
}) => {
  const inputRef = React.createRef();
  const { t, i18n } = useTranslation();
  const [excelFile, setExcelFile] = useState(null);

  useEffect(() => {
    config({
      floatingActionButtonConfig: {
        icon: "add",
        closeIcon: "close",
        shading: false,
        direction: "up",
        maxSpeedDialActionCount: 15,
        position: {
          my: "right bottom",
          at: "right bottom",
          offset: "-30 -30",
        },
      },
    });
    repaintFloatingActionButton();
  }, []);

  // Print Invoice
  const printInvoice = useCallback(() => {
    // GET_PDF_FILE(billInformation.invoiceType, { id: billInformation.id })
    //   .then((file) => {
    //     OpenPDFWindow(file);
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });
  }, []);

  const importFromExcel = useCallback(
    (e) => {
      inputRef.current.click();
    },
    [inputRef]
  );

  const getDataFromExcelFile = useCallback((e) => {
    const file = e.target.files[0];
    if (file) {
      setExcelFile(file);
    }
  }, []);

  const fileInputClicked = useCallback(() => {
    inputRef.current.value = null;
  }, [inputRef]);

  const freeFile = useCallback(() => {
    setExcelFile(null);
  }, []);

  return (
    <>
      <ImportFromExcel
        file={excelFile}
        addItemsFromExcel={addItemsFromExcel}
        freeFile={freeFile}
      />
      <input
        style={{ display: "none" }}
        ref={inputRef}
        type="file"
        accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
        multiple={false}
        onChange={getDataFromExcelFile}
        onClick={fileInputClicked}
      />
      <SpeedDialAction
        icon="print"
        label={t("Print Invoice")}
        index={4}
        visible={readOnly}
        onClick={printInvoice}
      />
      <SpeedDialAction
        icon="xlsxfile"
        label={t("recover from excel file")}
        index={3}
        visible={showImportFromExcel}
        onClick={importFromExcel}
      />
      <SpeedDialAction
        icon="add"
        label={t("New Invoice")}
        index={2}
        onClick={setNewInvoice}
      />
      <SpeedDialAction
        icon="edit"
        label={t("Update Invoice")}
        index={1}
        visible={true}
        onClick={openBillsTable}
      />
    </>
  );
};

export default React.memo(OffersBillsSpeedActionsButtons);
