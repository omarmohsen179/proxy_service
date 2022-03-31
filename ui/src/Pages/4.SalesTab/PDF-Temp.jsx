import React, { createRef, useEffect, useState } from "react";
import { Button } from "devextreme-react";
import SearchItem from "../Items/SearchItem";
import { TextBox2, NumberBox, SelectBox } from "../../Components/Inputs";
import { TextBox, Button as TextBoxButton } from "devextreme-react/text-box";
import DataGrid, {
  Scrolling,
  Paging,
  Column,
  HeaderFilter,
} from "devextreme-react/data-grid";
import * as AspNetData from "devextreme-aspnet-data-nojquery";
import CustomStore from "devextreme/data/custom_store";
import axios from "axios";
import { request } from "../../Services/CallAPI";
import { GET_SEARCH_ITEMS } from "../../Services/ApiServices/ItemsAPI";
import MasterTable from "../../Components/SharedComponents/Tables Components/MasterTable";
import DropDownButton from "devextreme-react/drop-down-button";
import { Link, Redirect } from "react-router-dom";
import { useHistory } from "react-router-dom";
import Popout from "react-popout";
import PdfTrial from "../Items/PdfTraial";

// Import the main component
import { Viewer } from "@react-pdf-viewer/core"; // install this library
// Plugins
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout"; // install this library
// Import the styles
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
// Worker
import { Worker } from "@react-pdf-viewer/core"; // install this library
import PrintPopout from "../../Components/SharedComponents/Print/PrintPopout";

const Test = () => {
  const [on, setOn] = useState(false);
  const printHandler = (e) => {
    console.log("print");
    let printWindow = window.open("", "_blank", "width=1000,height=1000");
    printWindow.document.write(
      `
        <div
          id="pdf-container"
          style="
            display: flex;
            justify-content: center;
            align-items: center;
          "
        >
          <object
            data=${file}
            type="application/pdf"
            name="pdfViewer"
            style="width: 100%; height: 97vh;"
          >
            file
          </object>
        </div>

      `
    );
    printWindow.stop();
    // window.open("", "_blank", "width=1000,height=1000");
    setOn(true);
  };
  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  const [file, setFile] = useState(null);
  useEffect(() => {
    let config = {
      method: "post",
      url: `/Report/Sales`,
      data: {
        id: 25,
      },
    };
    request(config).then((data) => {
      // setFile(data)
      setFile("data:application/pdf;base64," + data);
    });
  }, []);

  return (
    <div>
      {on && (
        <h1>Hi</h1>
        // <PrintPopout reportPayload={{ id: 1 }} />
        // <Popout
        //   containerId="tearoff"
        //   url="/#/user/pdf"
        //   title="Print"
        //   onClosing={() => setOn(false)}
        // >
        //   <div className="pdf-container">
        //     {file && (
        //       <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.6.347/build/pdf.worker.min.js">
        //         <Viewer
        //           fileUrl={file}
        //           plugins={[defaultLayoutPluginInstance]}
        //         />
        //       </Worker>
        //     )}
        //   </div>
        // </Popout>

        // <Popout
        //   title="Print"
        //   options={{ left: "0px", top: "0px", width: "750px", height: "750px" }}
        //   onClosing={() => setOn(false)}
        // >
        //   <div
        //     id="pdf-container"
        //     style={{
        //       display: "flex",
        //       justifyContent: "center",
        //       alignItems: "center",
        //     }}
        //   >
        //     <object
        //       data={file}
        //       type="application/pdf"
        //       // width="720px"
        //       // height="720px"
        //       name="pdfViewer"
        //       style={{ width: "100%", height: "97vh" }}
        //     >
        //       file
        //     </object>
        //   </div>
        // </Popout>
      )}
      <button className="btn btn-success text-center" onClick={printHandler}>
        Print
      </button>
      <object
        data={file}
        type="application/json"
        style={{ width: "100%", height: "97vh" }}
        name="pdfViewer"
      >
        pdf
      </object>
    </div>
  );
};

export default Test;
