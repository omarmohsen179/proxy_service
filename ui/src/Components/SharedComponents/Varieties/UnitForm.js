import React, { useState, useEffect } from "react";
import { NumberBox, SelectBox } from "../Inputs";
import useForm from "../../Services/useForm";
import { Popup } from "devextreme-react/popup";

const UnitForm = ({ popupVisible, togglePopup }) => {
    let submit = (values) => {
        console.log(values);
    };
    let { handleChange, handleSubmit, values } = useForm(submit);
    return (
        <Popup
            rtlEnabled={true}
            visible={popupVisible}
            onHiding={togglePopup}
            closeOnOutsideClick={true}
            dragEnabled={false}
            width={700}
            height={500}
        >
            <form onSubmit={handleSubmit}>
                <NumberBox
                    label="رقم القطعه"
                    value={values["parcodee"]}
                    name="parcodee"
                    handleChange={handleChange}
                />
                <SelectBox
                    label="الوحده"
                    value={values["unit_id"]}
                    name="unit_id"
                    handleChange={handleChange}
                />
                <NumberBox
                    label="العبوه"
                    value={values["box"]}
                    name="box"
                    handleChange={handleChange}
                />
                <NumberBox
                    label="سعر قطاعي"
                    value={values["price1"]}
                    name="price1"
                    handleChange={handleChange}
                />
                <NumberBox
                    label="سعر الجمله "
                    value={values["p_gmla1"]}
                    name="p_gmla1"
                    handleChange={handleChange}
                />
                <NumberBox
                    label="جمله الجمله"
                    value={values["p_gmla2"]}
                    name="p_gmla2"
                    handleChange={handleChange}
                />
            </form>
        </Popup>
    );
};

export default UnitForm;
