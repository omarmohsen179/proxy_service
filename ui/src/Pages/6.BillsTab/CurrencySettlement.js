import React from "react";
// import "devextreme/dist/css/dx.common.css";
// import "devextreme/dist/css/dx.light.css";
import {
    TextBox,
    NumberBox,
    SelectBox,
    DateTime,
} from "../../Components/Inputs";
import useForm from "../../Services/useForm";

import ButtonRow from "../../Components/SharedComponents/buttonsRow";

function CurrencySettlement() {
    let submit = (values) => {
        console.log(values);
    };
    let { values, handleChange, handleSubmit } = useForm(submit);
    return (
        <>
            <div className="container mt-5">
                <div className="mb-5">
                    <div
                        className="mb-5 w-100 d-flex justify-content-center h2 "
                        style={{ fontWeight: "bold" }}
                    >
                        تسوية العملة
                    </div>
                    <div className="double">
                        {/* Row1 */}
                        <NumberBox
                            label="الرقم"
                            value={values["rqm"]}
                            name="rqm"
                            handleChange={handleChange}
                        />
                        <SelectBox
                            label="الزبون "
                            value={values["zbon"]}
                            name="zbon"
                            handleChange={handleChange}
                        />
                        {/* Row2 */}
                        <DateTime label="التاريخ" />
                        <TextBox
                            label="دائن"
                            value={values["dane"]}
                            name="dane"
                            handleChange={handleChange}
                        />
                        <TextBox
                            label="مدين"
                            value={values["mdeb"]}
                            name="mdeb"
                            handleChange={handleChange}
                        />
                        <NumberBox
                            label="معدل التحويل"
                            value={values["dd"]}
                            name="dd"
                            handleChange={handleChange}
                        />
                    </div>
                    <div dir="rtl">
                        <TextBox
                            label="ملاحظات"
                            value={values["dane"]}
                            name="dane"
                            handleChange={handleChange}
                        />
                    </div>
                </div>

                <ButtonRow />
            </div>
        </>
    );
}

export default CurrencySettlement;
