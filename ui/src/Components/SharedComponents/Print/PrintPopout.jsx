import React, { useEffect, useState } from "react";
import Popout from "react-popout";
import { GET_PRINT_PDF } from "./API.Print";

const PrintPopout = ({ reportPayload }) => {
  const [file, setFile] = useState(null);
  useEffect(() => {
    GET_PRINT_PDF(reportPayload)
      .then((pdf) => {
        setFile("data:application/pdf;base64," + pdf);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [reportPayload]);

  return (
    <>
      <Popout
        title="Print"
        options={{ left: "0px", top: "0px", width: "750px", height: "750px" }}
        // onClosing={() => setOn(false)}
      >
        <div
          id="pdf-container"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <object
            data={file}
            type="application/pdf"
            name="pdfViewer"
            style={{ width: "100%", height: "97vh" }}
          >
            file
          </object>
        </div>
      </Popout>
    </>
  );
};

export default PrintPopout;
