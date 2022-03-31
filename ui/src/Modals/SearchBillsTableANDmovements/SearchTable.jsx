import React, { useState } from "react";
import { Button } from "devextreme-react/button";
import { GET_INVOICE } from "./SearchTableApi";
import { Popup } from "devextreme-react/popup";
import RadioGroupList from "../../Components/Inputs/RadioGroupList";
import ScrollView from "devextreme-react/scroll-view";

import { DELETE_INVOICE } from "../../Services/ApiServices/SalesBillAPI";
import BillDetails from "./BillDetails";
import notify from "devextreme/ui/notify";
import InputTableEdit from "../../Components/SharedComponents/Tables Components/InputTableEdit.jsx";
import { useMemo } from "react";
import { useCallback } from "react";
import { useRef } from "react";
import { t } from "i18next";

function Searchtable({
  visible = true,
  togglePopup,
  ob = {},
  allowDelete = true,
  onclickRow,
}) {
  let [detailsvalue, setdetailsvalue] = useState({ number: null });
  let invoice = useRef({});
  let [dataobject, setdataobject] = useState({
    UserID: 0,
    AccountID: 0,
    CustomerName: "",
    Hold: 1,
    ListType: ob.list_type,
    FilterQuery: "",
    Type: ob.Type,
  });
  let [dailog, setdialog] = useState(false);

  let radiodata = useMemo(() => {
    return [
      { id: 1, name: t("Current Invoices") },
      { id: 0, name: t("Invoices Pending") },
      { id: 2, name: t("All Invoices") },
    ];
  });
  const colAttributes = useMemo(() => {
    return [
      {
        caption: "رقم الفتورة",
        captionEn: "Number",
        field: "e_no",
        dataType: "number",
      },
      {
        caption: "التاريخ",
        captionEn: "Date",
        field: "e_date",
        widthRatio: "120",
        dataType: "date",
      },
      {
        caption: "الأجمالي",
        captionEn: "Total",
        field: "tottal",
        dataType: "number",
      },
      { caption: "ملاحلظة", captionEn: "Note", field: "nots" },
    ];
  });
  let onclick = useCallback(
    async (e) => {
      // open dialog details
      if (Object.keys(invoice.current).length === 0) {
        notify({ message: t("Choose Invoices"), width: 450 }, "error", 2000);
        return;
      }
      setdialog(true);
      setdetailsvalue(invoice.current);
    },
    [invoice]
  );
  let Get_invoice = useCallback(async (e) => {
    let res = await GET_INVOICE(e);
    return {
      data: res.data
        ? res.data.map((R) => {
            if (R.Account) R.Invoice.Account = R.Account;
            return R.Invoice;
          })
        : [],
      totalCount: res.totalCount ? res.totalCount : 0,
    };
  }, []);
  let ondelete = useCallback(
    async (e) => {
      await DELETE_INVOICE(e.data.invoiceType, e.data.id)
        .then((res) => {
          notify(
            { message: t("Saved Successfully"), width: 600 },
            "success",
            3000
          );
        })
        .catch((err) => {
          notify(
            { message: t("This Item Can't be deleted"), width: 450 },
            "error",
            2000
          );
        });
    },
    [dataobject]
  );
  let RedioChange = useCallback(
    (e) => {
      setdataobject({ ...dataobject, Hold: e.id });
    },
    [dataobject]
  );
  let RowDoubleClick = useCallback((e) => {
    e.data.Account &&
      onclickRow({
        Invoice: e.data,
        Account: e.data.Account,
      });
  }, []);
  let QueryFilter = useCallback(
    (query) => {
      setdataobject({ ...dataobject, FilterQuery: query });
    },
    [dataobject]
  );
  let SelectedColumn = useCallback((e) => {
    invoice.current = e.selectedRowsData[0];
  }, []);
  return (
    <div>
      <Popup
        id="search_table"
        dir={"auto"}
        maxWidth={1000}
        title={t("Invoices")}
        minWidth={150}
        minHeight={500}
        showTitle={true}
        dragEnabled={false}
        closeOnOutsideClick={true}
        visible={visible}
        onHiding={togglePopup}
      >
        <ScrollView height="100%" scrollByContent={true}>
          <InputTableEdit
            Uicon
            height="400px"
            allowDelete={allowDelete}
            style={{ width: "80%" }}
            onSelectionChanged={SelectedColumn}
            onRowDoubleClick={RowDoubleClick}
            colAttributes={colAttributes}
            onRowRemoving={ondelete}
            remoteOperations
            apiMethod={Get_invoice}
            apiPayload={dataobject}
            optionChanged={QueryFilter}
          />

          <div
            className="row"
            style={{
              justifyContent: "center",
              display: "flex",
              width: "100%",
              marginTop: "10px",
            }}
          >
            <div className="col-4">
              <Button
                style={{ width: "100%" }}
                text={t("Invoices Details")}
                onClick={onclick}
                type="success"
                stylingMode="contained"
              />
            </div>

            <div className="col-8">
              <RadioGroupList
                data={radiodata}
                handleChange={RedioChange}
                layout="horizontal"
                defaultValue={0}
              />
            </div>
          </div>
          <BillDetails
            Toggle={setdialog}
            visable={dailog}
            detailsvalue={detailsvalue}
          />
        </ScrollView>
      </Popup>
    </div>
  );
}
export default React.memo(Searchtable);
