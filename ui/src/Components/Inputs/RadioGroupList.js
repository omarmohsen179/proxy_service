import React, { useEffect, useState } from "react";
import RadioGroup from "devextreme-react/radio-group";

const RadioGroupList = ({
    data,
    Value,
    defaultValue=0 ,
    layout = "vertical",
    handleChange,
}) => {
    let stdata = [];
    let [get, setget] = useState([]);
    let [defai,setdef]= useState()
    useEffect(() => {
        if (get.length == 0) {
            for (let i = 0; i < data.length; i++) {
                stdata.push(data[i].name);
            }
            setget(stdata);
            setdef(stdata[defaultValue])
            Value = stdata[0];
        }
       
    },[0]);
    return (
        <div dir={"rtl"} style={{width:"100%",display: "flex"}} className="dx-field-value">
            <RadioGroup
                items={get}
            
                layout={layout}
                value={defai}
                onValueChanged={changeSelectionPriority}
            />
        </div>
    );

    function changeSelectionPriority(e) {
        setdef(e.value)
        for (let i = 0; i < data.length; i++) {
            if (e.value === data[i].name) {
                handleChange(data[i]);
            }
        }
    }
};

export default RadioGroupList;
