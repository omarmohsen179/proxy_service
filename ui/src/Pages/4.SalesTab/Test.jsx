import React, {
  createRef,
  useEffect,
  useState,
  useCallback,
  useMemo,
  useRef,
} from "react";
import { Button, NumberBox, SelectBox, TextBox } from "devextreme-react";
import SearchItem from "../Items/SearchItem";
// import { TextBox, NumberBox, SelectBox } from "../../Components/Inputs";
// import { TextBox2, Button as TextBoxButton } from "devextreme-react/text-box";
import DataGrid, {
  Column,
  Editing,
  Paging,
  Texts,
  HeaderFilter,
  Selection,
} from "devextreme-react/data-grid";
import * as AspNetData from "devextreme-aspnet-data-nojquery";
import CustomStore from "devextreme/data/custom_store";
import axios from "axios";
import { request } from "../../Services/CallAPI";
import {
  GET_SEARCH_ITEMS,
  Test_Api,
} from "../../Services/ApiServices/ItemsAPI";
import MasterTable from "../../Components/SharedComponents/Tables Components/MasterTable";
import DropDownButton from "devextreme-react/drop-down-button";
import { Link, Redirect } from "react-router-dom";
import { useHistory } from "react-router-dom";
import Popout from "react-popout";
import List from "devextreme-react/list";
import ReactPaginate from "react-paginate";
import Pagination from "../../Components/SharedComponents/Pagination/Pagination";
import { GET_FAST_ITEMS } from "../../Templetes/Invoice/Components/FastInputItem/API.FastInputScreen";
import "../../Templetes/Invoice/Components/FastInputItem/fastInputs.css";
import FastInputScreen from "../../Templetes/Invoice/Components/FastInputItem/FastInputScreen";
// import DateBox from "devextreme-react/date-box";
import {
  GET_ACCOUNTS,
  GET_CASHIERS,
} from "../../Templetes/Invoice/Components/InvoiceInformation/API.InvoiceInformation";
import { DateBox } from "../../Components/Inputs";
import AutoReport from "../../Templetes/AutoReport/AutoReport";
import debounce from "lodash.debounce";
import { Popup } from "devextreme-react/popup";
import ScrollView from "devextreme-react/scroll-view";
import * as XLSX from "xlsx";
import { exportDataGrid } from "devextreme/excel_exporter";
import "./Test.css";

const Test = () => {
  return (
    <>
      <div className="container-xxl rtlContainer mb-3">
        <div className="card p-3">
          <div className="row">
            <div style={{ display: "flex" }}>
              <div className="col-4 px-2">
                <div className="inputField ar">
                  <NumberBox
                    stylingMode="underlined"
                    defaultValue={120}
                    validationStatus={"invalid"}
                    validationError={{ message: "يوجد خطأ في البيانات" }}
                  />
                  {/* <input type="text" required /> */}
                  <label className="invalidLabel">رقم الفاتورة</label>
                </div>
              </div>
              <div className="col-4 px-2">
                <div className="inputField ar">
                  <TextBox stylingMode="underlined" />
                  {/* <input type="text" required /> */}
                  <label>رقم الفاتورة</label>
                </div>
              </div>
              <div className="col-4 px-2">
                <div className="inputField ar">
                  <SelectBox
                    stylingMode="underlined"
                    placeholder=""
                    dataSource={[1, 2, 3]}
                    defaultValue={120}
                  />
                  {/* <input type="text" required /> */}
                  <label>رقم الفاتورة</label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Test;
