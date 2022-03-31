import React, { useState } from "react";

import { Popup } from "devextreme-react/popup";

import ScrollView from "devextreme-react/scroll-view";
import {COST_FOR_PURCHASES,NEXT_COST_PURCHASE_INVOICE,AVAILABLE_COSTS_PURCHASE_INVOICES,COST_INVOICE_TRANSACTION} from '../PurchaseInvoiceExpensesAPI'
import notify from "devextreme/ui/notify";
import InputTableEdit from "../../../../../../Components/SharedComponents/Tables Components/InputTableEdit";
import MasterTable from "../../../../../../Components/SharedComponents/Tables Components/MasterTable";
import { useEffect } from "react";
 function Add({
  visible = true,
  togglePopup,
  onclickRow,

}) {
  let [data, setData] = useState({});
  let col=[
    { caption: "القيمه", field: "kema",readOnly:true   },
    {
      caption: "رقم ",
      field: "num",
      dataType:"number",readOnly:true
    },
    { caption: "الأسم", field: "name",readOnly:true},
    { caption: " اسم الحساب", field: "hesab_name",readOnly:true },
  
    { caption: "القيمه", field: "ehtsab_1",data: 
    [{id:0,name:"سعر الصنف"},
    {id:1,name:"حجم الصنف"},
    {id:2,name:"وزن الصنف"},
 
  ]  },  {dataType:"button",text:"اضافه",func:onclickRow}
  ]
  
  useEffect( async()=>{
 console.log("Re-render");
    await AVAILABLE_COSTS_PURCHASE_INVOICES().then(res => {
     console.log(res)
    setData(res.map(R => {
        R.ehtsab_1=0
        return  R
    }))
    })
    .catch(err =>{
            console.log(err)
      });

  },[visible])


  return (
    <div>
      <Popup
        dir="rtl"
        maxWidth={1000}
        title="فواتير الشرئ المتاحه"
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
				dataSource={data}
				colAttributes={col}
				height={"300px"}
				mode={"cell"}
                canUpdate={true}
                canDelete={false}
                filterRow={false}
                mode
			/>

        </ScrollView>
      </Popup>
    </div>
  );
}   
export default React.memo(Add)