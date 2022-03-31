import { Button } from "devextreme-react";
import React, { useState, useEffect } from "react";
import ScrollView from "devextreme-react/scroll-view";
import {
    mainPermissionsSelector,
    selectedMainPermission,
} from "../../Store/permissions";
import { getSelectedGroupId } from "../../Store/groups";
import { useSelector, useDispatch } from "react-redux";

function SideBarComponent({
    mainButtons = [],
    selectedMainId,
    enabled = false,
    onOptionClicked,
    keys = { value: "id", display: "name" },
}) {
    return (
        <div className="options-list">
            <ScrollView height="83vh" showScrollbar="onHover">
                <ul>
                    {mainButtons.map((option, index) => {
                        return (
                            <Button
                                key={index}
                                disabled={!enabled}
                                tabIndex={index}
                                className={
                                    "permissionsOption " +
                                    (selectedMainId === option.id
                                        ? " selected-nav-option"
                                        : "")
                                }
                                value={option[keys.value]}
                                // value={option[byan]}
                                // height={83 / mainPermissions.length + "vh"}
                                onClick={() => onOptionClicked(option)}
                            >
                                <span>{option[keys.display]}</span>
                            </Button>
                        );
                    })}
                </ul>
            </ScrollView>
        </div>
    );
}

export default SideBarComponent;

// import { Button } from "devextreme-react";
// import React, { useState, useEffect } from "react";
// import {
//     mainPermissionsSelector,
//     selectedMainPermission,
// } from "../../Store/permissions";
// import { useSelector, useDispatch } from "react-redux";

// function SideBarComponent({ onOptionClicked }) {
//     const mainPermissions = useSelector(mainPermissionsSelector.selectAll);

//     const selectedMainId = useSelector(selectedMainPermission);
//     return (
//         <div className="options-list">
//             <ul>
//                 {mainPermissions.map((option, index) => {
//                     return (
//                         // <li key={index}>
//                         <Button
//                             tabIndex={index}
//                             className={
//                                 "permissionsOption " +
//                                 (selectedMainId === option.id
//                                     ? " selected-nav-option"
//                                     : "")
//                             }
//                             value={option.byan}
//                             height={83 / mainPermissions.length + "vh"}
//                             onClick={() => onOptionClicked(option)}
//                         >
//                             <span>{option.byan}</span>
//                         </Button>
//                         // </li>
//                     );
//                 })}
//             </ul>
//         </div>
//     );
// }

// export default SideBarComponent;
