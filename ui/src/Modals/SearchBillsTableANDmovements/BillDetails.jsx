import React, { useState, useEffect, useCallback } from "react";
import { Button } from "devextreme-react/button";
import MasterTable from "../../Components/SharedComponents/Tables Components/MasterTable.jsx";
import { SelectBox as SelectExpress } from "devextreme-react";
import List from "devextreme-react/list";
import { GET_CHECKS } from "./SearchTableApi";
import { Popup } from "devextreme-react/popup";
import NumberBox from "../../Components/Inputs/NumberBox";
import ScrollView from "devextreme-react/scroll-view";

import {
  DELETE_INVOICE,
  GET_INVOICE_ITEMS,
  SALES_REPORTS,
  GET_INVOICE_BY_ID,
} from "../../Services/ApiServices/SalesBillAPI";

import OpenPDFWindow from "../../Components/SharedComponents/PDFReader/PDFwindowFunction.js";

import TableCell from "../../Components/Items/tableCell.js";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
function BillDetails({ Toggle, visable = false, detailsvalue }) {
  const { t, i18n } = useTranslation();

  let [detailslist, setdetailslist] = useState([]);
  let [values, setvalues] = useState(0);

  const coldetails = useMemo(() => {
    return [
      {
        caption: "رقم الصنف",
        captionEn: "Number",
        field: "item_no",
      },
      { caption: "اسم الصنف", captionEn: "Name", field: "item_name" },
      { caption: "رقم القطعه", captionEn: "Part Number", field: "code_no" },
      { caption: "الكمبه", captionEn: "Quantity", field: "kmea" },
      { caption: "السعر", captionEn: "Price", field: "items_price" },
      { caption: "الأجمالي", captionEn: "Total", field: "egmaly:" },
    ];
  });

  useEffect(async () => {
    if (detailsvalue.invoiceType && detailsvalue.id) {
      let BillDetailsResualt = await GET_INVOICE_BY_ID(
        detailsvalue.invoiceType,
        detailsvalue.id
      );
      let month = (
        parseInt(new Date(BillDetailsResualt.e_date).getMonth()) + 1
      ).toString();
      BillDetailsResualt.e_date = (
        month +
        "/" +
        new Date(BillDetailsResualt.e_date).getDate() +
        "/" +
        new Date(BillDetailsResualt.e_date).getFullYear()
      ).toString();
      setvalues({
        ...BillDetailsResualt,
        discount:
          parseFloat(BillDetailsResualt["tottal"]) -
          parseFloat(BillDetailsResualt["safi"]),
      });
      setdetailslist(
        await GET_INVOICE_ITEMS(detailsvalue.invoiceType, detailsvalue.id)
      );
    }
  }, [detailsvalue]);

  let PDFopen = useCallback(async () => {
    await SALES_REPORTS(detailsvalue.id, detailsvalue.invoiceType)
      .then((res) => {
        OpenPDFWindow(res);
      })
      .then((err) => {
        console.log(err);
      });
  }, []);
  let popupcloser = useCallback(async () => {
    Toggle(false);
  }, []);
  return (
    <Popup
      maxWidth={1000}
      title={t("Bill Information")}
      minWidth={150}
      minHeight={400}
      showTitle={true}
      dragEnabled={false}
      closeOnOutsideClick={true}
      visible={visable}
      onHiding={popupcloser}
    >
      <ScrollView height="100%" scrollByContent={true}>
        <div
          className="row"
          style={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <div className="col">
            <TableCell label={t("Invoice Number")} value={values["e_no"]} />
          </div>
          <div className="col">
            <TableCell label={t("Date")} value={values["e_date"]} />
          </div>
          <div className="col">
            <TableCell label={t("Note")} value={values["nots"]} />
          </div>
        </div>

        <MasterTable
          style={{ width: "80%" }}
          height="300px"
          dataSource={detailslist}
          colAttributes={coldetails}
          columnChooser={false}
          allowExcel={true}
        />
        <div className="row my-2">
          <div className="col">
            <TableCell label={t("Total")} value={values["tottal"]} />
          </div>
          <div className="col">
            <TableCell label={t("Discount")} value={values["discount"]} />
          </div>
          <div className="col">
            <TableCell label={t("Pure")} value={values["safi"]} />
          </div>
        </div>
        <div dir="auto">
          <Button
            className="mx-1 buttonStyle"
            stylingMode="outlined"
            width={"30%"}
            text={t("Print")}
            type="default"
            icon="fas fa-print"
            rtlEnabled={true}
            onClick={PDFopen}
          />
          <Button
            className="mx-1 buttonStyle"
            stylingMode="outlined"
            width={"30%"}
            text={t("To Mail")}
            type="default"
            icon="fas fa-envelope"
            rtlEnabled={true}
            onClick={(e) => {}}
          />
        </div>
      </ScrollView>
    </Popup>
  );
}
export default React.memo(BillDetails);
