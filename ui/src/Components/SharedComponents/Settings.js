// الرقم - حساب - شفره حساب

import React from 'react';
import { TextBox } from 'devextreme-react/text-box';
const Settings = ({ label }) => {
    return (
        <div>
            <div className="row">
                <div className="input col-12 col-md-3">{label}
                </div>
                <div className="col-12 col-md-9"  >
                    <TextBox
                        placeholder={label}
                        // value={state.text}
                        // onValueChanged={handleTextChange}
                        valueChangeEvent="keyup"
                    />
                </div>
            </div>
            {/* <div className="input">
                <div className="label inputGroupStyle input__label">
                    {label}
                </div>

                <div className="input__field"  >
                    <TextBox
                        placeholder={label}
                        // value={state.text}
                        // onValueChanged={handleTextChange}
                        valueChangeEvent="keyup"
                    />
                </div>
            </div> */}

        </div>
    );
}

export default Settings;