import React, { useEffect, useState } from "react";
import { Button } from "devextreme-react/button";
import { useSelector, useDispatch } from "react-redux";
import SimpleDropdown from "../../../Components/SharedComponents/Dropdown Components/SimpleDropdown.jsx";
import SideBarComponent from "../../../Components/Permissions Components/SideBarComponent.jsx";
import { useHistory } from "react-router-dom";
import { getSelectedGroupId, setSelectedGroupId } from "../../../Store/groups";
import {
    getSubPermissions,
    mainPermissionsSelector,
    subPermissionsSelector,
    getMainPermissions,
    selectedMainPermission,
} from "../../../Store/permissions.js";
import TableWithCheckBoxs from "../../../Components/SharedComponents/Tables Components/TableWithCheckBoxs.jsx";
import { getGroups, groupsSelector } from "../../../Store/groups.js";
import AssignmentTabPanel from "../../../Components/SharedComponents/TabPanels/AssignmentTabPanel.jsx";
import { getOtherPermissions } from "../../../Store/otherPermissions.js";
import AddGroupPopup from "../../../Components/Permissions Components/AddGroupPopup.jsx";
import { useTranslation } from "react-i18next";

function PermissionsPage() {
    const { t, i18n } = useTranslation();
    //? State
    const [dropdownValue, setDropdownValue] = useState("");
    const [showAddGroupPopup, setShowAddGroupPopup] = useState(false);
    const dispatch = useDispatch();
    const history = useHistory();

    //? Selectors
    const mainPermissions = useSelector(mainPermissionsSelector.selectAll);
    const selectedMainId = useSelector(selectedMainPermission);
    const selectedGroupId = useSelector(getSelectedGroupId);
    const subPermissions = useSelector(subPermissionsSelector);
    const groups = useSelector(groupsSelector.selectAll);
    const mainPermissionsCount = useSelector(
        mainPermissionsSelector.selectTotal
    );
    const groupsCount = useSelector(groupsSelector.selectTotal);

    useEffect(() => {
        if (mainPermissionsCount === 0) dispatch(getMainPermissions());
        if (groupsCount === 0) dispatch(getGroups());
        selectedGroupId && setDropdownValue(selectedGroupId);
        return () => { };
    }, []);

    //? Handlers
    // Data details
    // id => group id
    // [] => permissions detials
    const colAttributes = [
        ["byan", i18n.language === "ar" ? "العملية" : "Title"],
        ["ins", i18n.language === "ar" ? "إضافة" : "Add", "fas fa-plus"],
        ["del", i18n.language === "ar" ? "حذف" : "Remove", "fas fa-trash"],
        ["up", i18n.language === "ar" ? "تعديل" : "Update", "fas fa-far fa-edit"],
        ["show", i18n.language === "ar" ? "عرض" : "Show", "far fa-eye"],
    ];

    const [selectedRow, setSelectedRow] = useState("");
    const optionClicked = (value) => {
        dispatch(
            getSubPermissions({
                mainName: value.byan,
                mainId: value.id,
            })
        );
    };

    const onValueChanged = (e) => {
        dispatch(setSelectedGroupId(e.value));
        dispatch(getOtherPermissions());
        setDropdownValue(e.value);
    };

    const closePageHandle = (e) => {
        history && history.goBack();
    };

    const checkValueChanged = (e) => {
        console.log(e);
        setSelectedRow({
            ...selectedRow,
            [e.element.id]: e.value ? "نعم" : "لا",
        });
    };

    return (
        <>
            <AddGroupPopup
                showPopup={showAddGroupPopup}
                changeShowPopup={() => setShowAddGroupPopup(!showAddGroupPopup)}
            />

            <div className="container card  p-3 mx-3">
                <div className="row">
                    <div className="col-lg-2 col-md-2">
                        <div style={{ height: "83vh" }}>
                            <SideBarComponent
                                mainButtons={mainPermissions}
                                selectedMainId={selectedMainId}
                                enabled={selectedGroupId}
                                keys={{ id: "byan", display: "byan" }}
                                onOptionClicked={(value) =>
                                    optionClicked(value)
                                }
                            />
                        </div>
                    </div>
                    <div className="col-lg-6 col-md-6 card pt-3">
                        <TableWithCheckBoxs
                            data={subPermissions}
                            colAttributes={colAttributes}
                            disable={subPermissions.length < 1}
                            height={83 - 14 + "vh"}
                        />
                        <div className="row py-3">
                            <div className="col-6 h-100">
                                <SimpleDropdown
                                    dropdownValue={dropdownValue}
                                    onValueChanged={(e) => onValueChanged(e)}
                                    placeHolder={t("Select Group")}
                                    data={groups}
                                    showClear={false}
                                />
                            </div>

                            <div className="col-6">
                                <Button
                                    className="send"
                                    icon="plus"
                                    disabled={groups.length < 1}
                                    text={t("Add Group")}
                                    rtlEnabled={true}
                                    width="100%"
                                    onClick={() => setShowAddGroupPopup(true)}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-4 col-md-4">
                        <AssignmentTabPanel />
                    </div>
                </div>
            </div>
        </>
    );
}

export default PermissionsPage;
