import PDFViewer from "pdf-viewer-reactjs";
import React, { useState } from "react";
import PDFView from "./PDFView";
import OpenPDFWindow from "./PDFwindowFunction";
import { Document, Page } from "react-pdf";
import config from "../../../config";
import axios from "axios";
const { apiEndPoint } = config;
//only example
function PDFReader(props) {
  let mainValue = 5;
  let [ind, setin] = useState("");
  return (
    <>
      <div>
        <input onChange={(e) => setin(e.target.value)} />
        <button
          onClick={() => {
            OpenPDFWindow({
              url: "/Report/Sales",
              id: ind,
              text: "as as",
              date2: "1/2/2012",
              date1: "1/2/2012",
            });
          }}
        >
          get data
        </button>
        <button
          onClick={async () => {
            await axios
              .post(apiEndPoint + "/Report/Sales", { id: 25 })
              .then((res) => {
                console.log(res);
                let main = "data:application/pdf;base64," + res.data;

                OpenPDFWindow(main);
              })
              .catch((err) => window.close());
          }}
        >
          get data
        </button>
      </div>
    </>
  );
}
export default PDFReader;
