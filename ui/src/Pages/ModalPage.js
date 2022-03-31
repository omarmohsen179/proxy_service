import React, { useEffect, useState } from "react";
// import PermissionsModal from "../Modals/PermissionsModal";
// import "devextreme/dist/css/dx.common.css";
// import "devextreme/dist/css/dx.light.css";
import { Popup } from "devextreme-react/popup";
import Button from "../Components/SharedComponents/Button";

import ScrollView from "devextreme-react/scroll-view";
// import {
// 	getMainPermissions,
// 	mainPermissionsSelector,
// } from "../Store/permissions";
// import { useSelector, useDispatch } from "react-redux";

function ModalPage({ title, image, Page }) {
    const [isPopupVisible, setIsPopupVisible] = useState(false);

    // const dispatch = useDispatch();

    // const mainPermissions = useSelector(mainPermissionsSelector.selectTotal);

    const renderContent = () => {
        return (
            <ScrollView width="100%" height="100%">
                <Page ColsePopup={onHiding} />
                {/* <PermissionsModal ColsePopup={onHiding} /> */}
            </ScrollView>
        );
    };

    const handleClick = () => {
        // if (mainPermissions === 0) dispatch(getMainPermissions());
        setIsPopupVisible(true);
    };

    const onHiding = () => {
        setIsPopupVisible(false);
    };

    return (
        <>
            <div>
                <Popup
                    title={title}
                    animation={null}
                    rtlEnabled={true}
                    visible={isPopupVisible}
                    contentRender={renderContent}
                    onHiding={onHiding}
                    closeOnOutsideClick={true}
                    showTitle={true}
                    dragEnabled={false}
                    fullScreen={true}
                />
                <Button
                    label={title}
                    image={image}
                    handleClick={handleClick}
                ></Button>
            </div>
        </>
    );
}

export default ModalPage;
