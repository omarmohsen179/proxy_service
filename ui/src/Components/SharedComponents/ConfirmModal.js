import React, { useState } from 'react';
import { Popup } from "devextreme-react/popup";
import { Button } from 'devextreme-react/button';


const ConfirmModal = ({ message, callBack, popupVisible, togglePopup, item }) => {
    let handleOK = () => {
        togglePopup();
        callBack(item);
    }
    console.log('confirm');
    return (
        <Popup
            rtlEnabled={true}
            visible={popupVisible}
            onHiding={togglePopup}
            closeOnOutsideClick={true}
            dragEnabled={false}
            width={250}
            height={200}
        >

            <div style={{ height: '40%' }}>
                {message}
            </div>
            <div className='center' style={{ height: '50%' }}>
                <Button
                    width={'49%'}
                    text="OK"
                    type="normal"
                    stylingMode="contained"
                    onClick={handleOK}
                />
                <Button
                    width={'49%'}
                    text="Cancel"
                    type="danger"
                    stylingMode="contained"
                    onClick={togglePopup}
                />
            </div>
        </Popup>
    );
}

export default React.memo(ConfirmModal);