import React, { useState } from "react";

// Import the main component
import { Viewer } from "@react-pdf-viewer/core"; // install this library
// Plugins
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout"; // install this library
// Import the styles
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
// Worker
import { Worker } from "@react-pdf-viewer/core"; // install this library

////////////////////////////////////////////////////////////////////////

import { Document, Page } from "react-pdf";
import { useEffect } from "react";
import axios from "axios";

import { request } from "../../Services/CallAPI";
import { Redirect } from "react-router";

const PdfTrial = ({ id }) => {
  const defaultLayoutPluginInstance = defaultLayoutPlugin();
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [file, setFile] = useState(null);
  console.log(id);
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

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  const clicked = () => {
    window.open("/#/print", "_blank");
  };

  return (
    <div>
      {/* <Document
                file={file}
                onLoadSuccess={onDocumentLoadSuccess}
            >
                <Page pageNumber={pageNumber} />
            </Document>
            <p>Page {pageNumber} of {numPages}</p> */}
      {/* <iframe src={file}
                style={{ width: '600px', height: '500px' }} frameborder="0">
            </iframe> */}

      {
        <object
          data={file}
          type="application/pdf"
          width="1000"
          height="1000"
          name="pdfViewer"
        >
          pdf
        </object>
      }

      {/* <div className='pdf-container'>
                {file && <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.6.347/build/pdf.worker.min.js">
                    <Viewer fileUrl={file}
                        plugins={[defaultLayoutPluginInstance]} />
                </Worker>}

            </div> */}
    </div>
  );
};

export default PdfTrial;
