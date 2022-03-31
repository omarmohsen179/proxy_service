import React, { useCallback, useMemo, useState } from "react";
import MasterTable from "../../Components/SharedComponents/Tables Components/MasterTable.jsx";
import DateTime from "../../Components/Inputs/DateTime";
import SelectBox from "../../Components/Inputs/SelectBox";
import { Button } from "devextreme-react/button";
import BillDetails from "./BillDetails";
import { GET_MOVEMENT_TABLE } from "../../Services/ApiServices/MovementApi";
import { validateForm } from "../../Services/services";
import notify from "devextreme/ui/notify";
import { GET_INVOICE_ITEMS } from "../../Services/ApiServices/SalesBillAPI";
import { GET_PDF_FILE } from "../../Templetes/Invoice/Components/SpeedActionsButtons/API.SpeedActionsButtons";
import OpenPDFWindow from "../../Components/SharedComponents/PDFReader/PDFwindowFunction";
import Joi from "joi";
import { t } from "i18next";
function Movements({
  values,
  handleChange,
  pageDataType,
  data,
  setData,
  apipay,
  nodes,
}) {
  let [dialog, setdialog] = useState(false);
  let [detailsvalue, setdetailsvalue] = useState({ number: null });
  const colAttributes = useMemo(() => {
    return [
      {
        caption: "رقم الفاتوره",
        field: "e_no",
        captionEn: "Invoice Number",
      },
      {
        caption: "التاريخ",
        captionEn: "Date",
        field: "e_date",
        widthRatio: "120",
      },
      { caption: "البيان", captionEn: "Statement", field: "name" },
      { caption: "الأجمالي", captionEn: "Total", field: "egmaly" },
      { caption: "التخفيض", captionEn: "Discount", field: "dis" },
      { caption: "الصافي", captionEn: "Net", field: "tottal" },
    ];
  }, []);

  let [mainsearchobject, setmainsearchobject] = useState({});
  const [errors, setErrors] = useState({});
  async function onclickRow(e) {
    console.log(e);
    setdialog(true);
    setdetailsvalue({ id: e.data.id, invoiceType: pageDataType.invokestype });
  }

  var schema = {
    from: Joi.date()
      .required()
      .messages({ "any.required": "Number is Required " }),
    to: Joi.date()
      .required()
      .messages({ "any.required": "This Input is Required" }),
    branch: Joi.number().required().messages({
      "any.required": "This Input is Required",
    }),
  };

  let submit = useCallback(
    async (e) => {
      e.preventDefault();
      let { from, to, branch } = values;
      let err = validateForm({ from, to, branch }, schema);
      if (Object.keys(err).length != 0) {
        setErrors(err);
        notify(
          { message: t("Continue the missing data"), width: 600 },
          "error",
          3000
        );
        return;
      }
      GET_MOVEMENT_TABLE(pageDataType.type, values.branch, values.from, values.to)
        .then((res) => {
          console.log(res)
          setmainsearchobject({
            type: pageDataType.type,
            values,
          });
          setData(res);
          setErrors({});
          notify(
            { message: t("Searched Successfully"), width: 600 },
            "success",
            3000
          );
        })
        .catch((err) => {
          console.log(err);
        });
    },
    [values, schema, pageDataType.type, setData]
  );
  const printHandle = useCallback(async () => {
    await GET_PDF_FILE(pageDataType.invokestype, {
      ...values,
    })
      .then((file) => {
        OpenPDFWindow(file);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [values]);
  return (
    <div
      dir={"auto"}
      className="row"
      style={{ display: "flex", justifyContent: "center", margin: 0 }}
    >
      <h1 style={{ width: "100%", textAlign: "center", padding: "2%" }}>
        {t(pageDataType.typeText)}
      </h1>
      <form
        onSubmit={submit}
        className="row"
        style={{ width: "80%", padding: "4px" }}
      >
        <div className="col-12 col-md-6 col-lg-3">
          <SelectBox
            label={t("by branch")}
            dataSource={nodes}
            value={values.branch}
            name="branch"
            handleChange={handleChange}
            required={false}
            validationErrorMessage={t(errors.branch)}
          />
        </div>
        <div className="col-12 col-md-6 col-lg-3">
          <DateTime
            label={t("From")}
            value={values["from"]}
            name="from"
            handleChange={handleChange}
            required={true}
            required={false}
            validationErrorMessage={t(errors.from)}
          />
        </div>
        <div className="col-12 col-md-6 col-lg-3">
          <DateTime
            label={t("To")}
            value={values["to"]}
            name="to"
            handleChange={handleChange}
            required={true}
            required={false}
            validationErrorMessage={t(errors.to)}
          />
        </div>
        <div className="col-12 col-md-6 col-lg-3">
          <Button
            style={{ width: "100%" }}
            type="submit"
            text={t("Search")}
            useSubmitBehavior={true}
            stylingMode="contained"
          />
        </div>
        <div className="col-12 col-md-6 col-lg-3">
          <Button
            style={{ width: "100%" }}
            type={"button"}
            text={t("Print")}
            onClick={printHandle}
            stylingMode="contained"
          />
        </div>
      </form>
      <div style={{ width: "95%" }}>
        <MasterTable
          apiKey={"e_no"}
          apiMethod={mainsearchobject}
          apiPayload={apipay}
          height="500px"
          dataSource={data}
          colAttributes={colAttributes}
          onRowDoubleClick={onclickRow}
        />
      </div>
      <BillDetails
        Toggle={setdialog}
        visable={dialog}
        detailsvalue={detailsvalue}
      />
    </div>
  );
}
export default Movements;
