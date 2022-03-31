import React, {
  useEffect,
  useCallback,
  useMemo,
  useState,
  useRef,
} from "react";

import { Button } from "devextreme-react";
import { Popup } from "devextreme-react/popup";
import { isNull } from "lodash";
import * as XLSX from "xlsx";
import { SelectBox } from "../../../../../Components/Inputs";
import MatchingColumnsPopup from "./MatchingColumnsPopup";
import ExcelEditTablePopup from "./ExcelEditTablePopup";
import { IMPORT_OFFERS_FROM_EXCEL } from "../../API.OffersBills";

const ImportFromExcel = ({ file, addItemsFromExcel, freeFile }) => {
  // Excel initial data
  const [items, setItems] = useState([]);

  // Excel data columns name
  const [colNames, setColNames] = useState([]);

  // Matched Column data [{name: excelName}, ...]  => [{ "item_no": "رقم الصنف" }, ...]
  const [selectedColumnNames, setSelectedColumnNames] = useState({});

  //  Popup Step 1
  const [showMatchingColumnsPopup, setShowMatchingColumnsPopup] =
    useState(false);

  // Popup Step 2
  const [showExcelTablePopup, setShowExcelTablePopup] = useState(false);

  // Toggles
  const toggleShowExcelTablePopup = useCallback(() => {
    setShowExcelTablePopup((prev) => !prev);
  }, []);

  const toggleShowMatchingColumnsPopup = useCallback(() => {
    freeFile();
    setShowMatchingColumnsPopup((prev) => !prev);
  }, [freeFile]);

  const updateSelectedColumnNames = useCallback((e) => {
    setSelectedColumnNames((prev) => ({ ...prev, [e.name]: e.value }));
  }, []);

  const getColumnNamesFromExcelJSON = useCallback((json) => {
    let colNames = [];
    for (const key of Object.keys(json)) {
      colNames.push({ name: key });
    }
    return colNames;
  }, []);

  const excelOffersData = useMemo(() => {
    // let data = [];
    let data = items
      .filter((item) => item[selectedColumnNames["item_no"]])
      .map((item, index) => {
        let date =
          item[selectedColumnNames["Exp_Date"]] < 100000
            ? new Date(
                (item[selectedColumnNames["Exp_Date"]] - (25567 + 1)) *
                  86400 *
                  1000
              )
            : item[selectedColumnNames["Exp_Date"]];

        return {
          ExcelID: index,
          item_no: item[selectedColumnNames["item_no"]],
          item_name: item[selectedColumnNames["item_name"]],
          code_no: item[selectedColumnNames["code_no"]],
          item_name_e: item[selectedColumnNames["item_name_e"]],
          Exp_Date: date,
          dess: item[selectedColumnNames["dess"]],
          kmea: item[selectedColumnNames["kmea"]],
          price: item[selectedColumnNames["price"]],
        };
      });
    return data;
  }, [items, selectedColumnNames]);

  const storeDataHandle = useCallback(
    (allData) => {
      addItemsFromExcel(excelOffersData, allData).then((result) => {
        console.log(result);
        if (result.done === "pending") {
          setItems((prev) => {
            return prev.filter((row, index) => {
              return result.NonValidIDs.includes(index);
            });
          });
        } else if (result.done === "success") {
          setShowExcelTablePopup(false);
          freeFile();
        }
      });
    },
    [addItemsFromExcel, excelOffersData, freeFile]
  );

  const readExcel = useCallback(
    (file) => {
      const promise = new Promise((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.readAsArrayBuffer(file);

        fileReader.onload = (e) => {
          const bufferArray = e.target.result;

          const wb = XLSX.read(bufferArray, { type: "buffer" });

          const wsname = wb.SheetNames[0];

          const ws = wb.Sheets[wsname];

          const data = XLSX.utils.sheet_to_json(ws);

          resolve(data);
        };

        fileReader.onerror = (error) => {
          reject(error);
        };
      });

      promise.then((d) => {
        if (d.length > 0) {
          setColNames(getColumnNamesFromExcelJSON(d[0]));
          setShowMatchingColumnsPopup(true);
        }
        setItems(d);
      });
    },
    [getColumnNamesFromExcelJSON]
  );

  useEffect(() => {
    if (!isNull(file)) {
      readExcel(file);
    }
  }, [file]);

  return (
    <>
      <MatchingColumnsPopup
        visible={showMatchingColumnsPopup}
        togglePopup={toggleShowMatchingColumnsPopup}
        toggleNextPopup={toggleShowExcelTablePopup}
        colNames={colNames}
        selectedColumnNames={selectedColumnNames}
        updateSelectedColumnNames={updateSelectedColumnNames}
      />
      <ExcelEditTablePopup
        visible={showExcelTablePopup}
        togglePopup={toggleShowExcelTablePopup}
        dataSource={excelOffersData}
        selectedColumnNames={selectedColumnNames}
        storeDataHandle={storeDataHandle}
      />
    </>
  );
};

export default React.memo(ImportFromExcel);
