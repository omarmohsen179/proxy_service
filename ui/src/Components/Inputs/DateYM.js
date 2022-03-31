import React, { useEffect, useState } from "react";
import DateBox from "devextreme-react/date-box";
import withLabel from "./withLabel";
import { Validator, RequiredRule } from "devextreme-react/validator";

const DateTime = ({
    def,
    label,
    name,
    value,
    handleChange,
    required = true,
}) => {
    function onValueChanged(e) {
        let dateType = new Date(e.value);
        let month = (parseInt(dateType.getMonth()) + 1).toString();
        let finalFormat = (
            month +
            "/" +
            dateType.getDate() +
            "/" +
            dateType.getFullYear()
        ).toString();
        handleChange({
            value: finalFormat,
            dateD: { MonthIndex: month, Year: dateType.getFullYear() },
        });
        // }
    }

    return (
        <div>
            <DateBox
                name={name}
                value={value}
                onValueChanged={onValueChanged}
                displayFormat="MM-yyyy"
                pickerType="rollers"
            >
                {required && (
                    <Validator>
                        <RequiredRule message="هذا الحقل مطلوب" />
                    </Validator>
                )}
            </DateBox>
        </div>
    );
};

export default withLabel(DateTime);
