import React, { useState,useCallback,useRef } from "react";
import TextBox from "../Components/Inputs/TextBox";
import NumberBox from "../Components/Inputs/NumberBox";
import useForm from "../Services/useForm";
import ButtonRow from "../Components/SharedComponents/buttonsRow";
import { Button } from "devextreme-react";
function SystemStore() {
    let handleSubmit = (values) => {
        console.log(values);        //submit logic
    };
    let [values,setValues]=useState({})
    // Update reference value:
    const reference = useRef({});
    const handleChange = useCallback(({ name, value }) => {
        reference.current[name]=value;
        //setValues((values) => ({ ...values, [name]: value }));
    }, []);
  console.log(
    "in"
  )
    return (
        <div dir="rtl">
            <div
                style={{
                    width: "100%",
                    height: "60px",
                    backgroundColor: "black",
                }}
            ></div>

            <form onSubmit={handleSubmit} className="row PaymentTypemain  ">
                <div
                    className="row"
                    style={{
                        padding: "2%",
                        display: "flex",
                        justifyContent: "center",
                    }}
                >
                    {" "}
                    <div className="col-lg-6 col-md-6 col-sm-12">
                        <NumberBox
                            label="الرقم"
                            value={reference.current.accountNumber}
                            name="accountNumber"
                        
                            handleChange={handleChange}
                        />
                    </div>
                    <div className="col-lg-6 col-md-6 col-sm-12">
                        <TextBox
                            label="اسم الحساب"
                            value={reference.current["accountName"]}
                            name="accountName"
                            handleChange={handleChange}
                        />
                    </div>
                    <div className="col-lg-6 col-md-6 col-sm-12">
                        <TextBox
                            label="شفرة الحساب"
                        
                            handleChange={({ name, value })=>{setValues((values) => ({ ...values, [name]: value }));}}
                        />
                    </div>
                    <div className="col-lg-6 col-md-6 col-sm-12"></div>
                </div>

                <Button onClick={()=>{console.log(reference.current)}} />
            </form>
        </div>
    );
}

export default SystemStore;
