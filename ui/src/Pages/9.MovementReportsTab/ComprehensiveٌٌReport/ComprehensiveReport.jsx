import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedGroupId } from "../../../Store/groups.js";
import {
  getNodesIn,
  getOtherPermissions,
} from "../../../Store/otherPermissions.js";
import { Button } from "devextreme-react/button";
import DateTime from "../../../Components/Inputs/DateTime";
import CheckBox from "../../../Components/Inputs/CheckBox";
import SelectBox from "../../../Components/Inputs/SelectBox";
import notify from "devextreme/ui/notify";
import MasterTable from "../../../Components/SharedComponents/Tables Components/MasterTable.jsx";
import TableCell from "../../../Components/Items/tableCell.js";
import RadioGroupList from "../../../Components/Inputs/RadioGroupList.js";
import { TRANSATION_VALUES, ALL_TRANSATION } from "./ComprehensiveReportApi";
import { useTranslation } from "react-i18next";
function ComprehensiveReport(props) {
  let nodesIn = useSelector(getNodesIn);
  const [nodes, setNodes] = useState([]);
  let [Process, setProcess] = useState([]);
  let dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  let today = useMemo(() => {
    let defualtdateValue = new Date();
    return (
      (parseInt(defualtdateValue.getMonth()) + 1).toString() +
      "/" +
      defualtdateValue.getDate() +
      "/" +
      defualtdateValue.getFullYear()
    ).toString();
  }, []);
  const MainTableCol = useMemo(() => {
    return [
      {
        caption: "الرقم",
        captionEn: "Number",
        field: "e_no",
      },
      { caption: "العمليه", captionEn: "Transaction", field: "byan" },
      { caption: "التاريخ", captionEn: "Date", field: "e_date" },
      { caption: "الحساب", captionEn: "Account", field: "byan2" },
      { caption: "مدين", captionEn: "Debit", field: "mden" },
      { caption: "دائن", captionEn: "Creditor", field: "daen" },
      { caption: "ملاحظه", captionEn: "Note", field: "nots" },
    ];
  }, []);
  const SideTableCol = useMemo(() => {
    return [
      {
        caption: "العمليه",
        captionEn: "Transaction",
        field: "name",
      },
      {
        caption: "اجمالي الرصيد",
        captionEn: "Total Balance",
        field: "sum_hesab",
        HideFilter: true,
      },
    ];
  }, []);
  const summaryData = useRef([
    {
      column: "daen",
      summaryType: "sum",
      valueFormat: "currency",
      showInColumn: "daen",
      customizeText: (data) => {
        return ` ${data.value ?? 0} `;
      },
    },
    {
      column: "mden",
      summaryType: "sum",
      valueFormat: "currency",
      showInColumn: "mden",
      customizeText: (data) => {
        return `   ${data.value ?? 0} `;
      },
    },
    {
      column: "byan2",
      summaryType: "sum",
      valueFormat: "currency",
      showInColumn: "byan2",
      customizeText: (data) => {
        return ` ${t("Total")}  : ${data.value ?? 0} `;
      },
    },
  ]);
  let handleChange = useCallback(({ name, value }) => {
    setvalues((values) => ({ ...values, [name]: value }));
  }, []);
  let [values, setvalues] = useState({
    FromDate: today,
    ToDate: today,
    NodeID: 0,
    TrasactionType: "",
    TrasactionsTypes: "= byan",
    IsArchived: false,
  });
  useEffect(async () => {
    dispatch(await setSelectedGroupId(1));
    dispatch(await getOtherPermissions());
    setProcess((await TRANSATION_VALUES(values)).data);
  }, []);
  useEffect(async () => {
    console.log(Process);
  }, [Process]);
  async function RedioChange(e) {
    setvalues({ ...values, Hold: e.id });
  }
  useEffect(async () => {
    if (nodesIn.length > 0) {
      setNodes(
        nodesIn.map((R) => {
          return { id: parseInt(R.num), name: R.name };
        })
      );
      handleChange({ name: "NodeID", value: parseInt(nodesIn[0].num) });
    }
  }, [nodesIn]);
  let Rowchange = (e) => {
    console.log(e);
    handleChange({
      name: "TrasactionsTypes",
      value: e.selectedRowsData[0].name,
    });
  };
  let RowchangeFilter = (e) => {
    if (e && e.length > 0) {
      let mainText = " in (";
      for (let i = 0; i < e.length; i++) {
        mainText += "'" + e[i] + "',";
      }
      mainText = mainText.slice(0, -1);
      mainText += ")";
      console.log(mainText);
      handleChange({ name: "TrasactionsTypes", value: mainText });
    } else {
      handleChange({ name: "TrasactionsTypes", value: " = byan " });
    }
  };
  return (
    <div className="row" style={{ margin: "0" }}>
      <h1 style={{ width: "90%", textAlign: "center", padding: "2%" }}>
        {t("Comprehensive Report")}
      </h1>
      <div className="col-10">
        <div
          dir="rtl"
          className="row"
          style={{
            display: "flex",
            justifyContent: "center",
            margin: 0,
            width: "100%",
          }}
        >
          <form className="row" style={{ width: "90%", padding: "4px" }}>
            <div className="col-12 col-md-6 col-lg-4">
              <DateTime
                label={t("From")}
                value={values["FromDate"]}
                name="FromDate"
                handleChange={handleChange}
                required={true}
                required={false}
              />
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <DateTime
                label={t("To")}
                value={values["ToDate"]}
                name="ToDate"
                handleChange={handleChange}
                required={true}
                required={false}
              />
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <SelectBox
                label={t("by branch")}
                dataSource={nodes}
                value={values.NodeID}
                name="NodeID"
                handleChange={handleChange}
                required={false}
              />
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <RadioGroupList
                data={[
                  { id: 1, name: t("By operation") },
                  { id: 0, name: t("Full Day") },
                ]}
                style={{ width: "100%" }}
                handleChange={RedioChange}
                layout="horizontal"
                defaultValue={0}
              />
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <CheckBox
                label={t("not archived")}
                value={values["IsArchived"]}
                name="IsArchived"
                handleChange={handleChange}
              />
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <DateTime
                label={t("Close to date")}
                value={values["ToDate"]}
                name="ToDate"
                handleChange={handleChange}
                required={true}
                required={false}
              />
            </div>
          </form>

          <div style={{ width: "95%" }}>
            <MasterTable
              remoteOperations
              apiMethod={ALL_TRANSATION}
              apiPayload={values}
              summaryItems={summaryData.current}
              height="400px"
              colAttributes={MainTableCol}
            />
          </div>
        </div>
      </div>
      <div className="col" style={{ width: "100%" }}>
        <MasterTable
          headerFilter
          columnChooser={false}
          height={"500px"}
          dataSource={Process}
          onSelectionChanged={Rowchange}
          onFilterValuesChange={RowchangeFilter}
          colAttributes={SideTableCol}
        />
      </div>
    </div>
  );
}
export default ComprehensiveReport;
/** 
 * 
 *       <div className='input-wrapper' style={{width:"50%",direction:"rtl",float:"left",padding:"10px"}}>
                <div className='label' >
                {"اجمالي"}
            </div>
            <div className="row" style={{margin: "0"}}>
            <div className={`border py-1 col`} style={{ minHeight: '30px',    margin: "0 5px 0 5px" }}>
                {0}
            </div>
            <div className={`border py-1 col`} style={{ minHeight: '30px',    margin: "0 5px 0 5px"}}>
                {0}
            </div>
            <div className={`border py-1 col`} style={{ minHeight: '30px',    margin: "0 5px 0 5px"}}>
                {0}
            </div>
            </div>
 


        </div>
 
*/
