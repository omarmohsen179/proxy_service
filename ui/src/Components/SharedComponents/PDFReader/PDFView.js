import React, { useEffect, useState } from "react";
import config from "../../../config";
import axios from "axios";
import PDFViewer from "pdf-viewer-reactjs";
import { Document, Page } from "react-pdf";
const { apiEndPoint } = config;
function PDFView(props) {
  let [main, setmain] = useState();
  useEffect(async () => {
    await axios
      .post(apiEndPoint + "/Report/Sales", { id: 25 })
      .then((res) => {
        console.log(res);
        setmain("data:application/pdf;base64," + res.data);
      })
      .catch((err) => window.close());
  }, []);
  function onDocumentLoadSuccess({ numPages }) {}
  return (
    <>
      <Document file={main} onLoadSuccess={onDocumentLoadSuccess}>
        <Page pageNumber={1} />
      </Document>
      <iframe
        src={main}
        style={{ width: "100%", height: "500px" }}
        frameborder="0"
      ></iframe>
    </>
  );
}
export default PDFView;
/* let newDiv = document.createElement("div");
  // and give it some content

  console.log(document.getElementsByClassName("ex")[0])

 let data;
 if(document.getElementsByClassName("ex")[0]){
  mainValue=document.getElementsByClassName("ex")[0]
  console.log(mainValue)
data= document.getElementsByClassName("ex")[0];
 }
 else{
data= mainValue
 }
  const newContent = document.cre("Hi there and greetings!");*/
/* let ob= props.match.params.data.split("`");
        let main={}
        for(let i=0;i<ob.length;i++){
            let temp=ob[i].split("@");
            if(temp[1]){
                //check if it a number value
                if(/^-?\d+$/.test(temp[1])){
                    temp[1]= parseFloat(temp[1]);
                 } 
                 //if string will replace ! with / to return the original value
                if(typeof temp[1]==='string' || temp[1] instanceof String){
                     let te="";
                    for (const j in temp[1]){
                        
                        if(temp[1][j]=="!")
                       te+="/"
                        else 
                         te+=temp[1][j]
                    }
                    temp[1]=te;
                 }
                 main[temp[0]]=temp[1]
            }
        }

        await axios.post(apiEndPoint + main.url,main)
        .then((res) => {
            console.log(res)
            setmain('data:application/pdf;base64,' + res.data)
        })
        .catch((err) =>  window.close())*/
