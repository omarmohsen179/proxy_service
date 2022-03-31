import React, { useEffect, useState } from "react";
import { Button } from "devextreme-react/button";
import { Popup } from "devextreme-react/popup";
import { useSelector, useDispatch } from "react-redux";
import SimpleDropdown from "../Components/SharedComponents/Dropdown Components/SimpleDropdown.jsx";
import TextBox from "devextreme-react/text-box";
import { CheckBox } from "devextreme-react/check-box";
import SideBarComponent from "../Components/Permissions Components/SideBarComponent.jsx";
import ScrollView from "devextreme-react/scroll-view";
import { setSelectedGroupId } from "../Store/groups";

import {
    getSubPermissions,
    mainPermissionsSelector,
    subPermissionsSelector,
    getMainPermissions,
} from "../Store/permissions.js";
import TableWithCheckBoxs from "../Components/SharedComponents/Tables Components/TableWithCheckBoxs.jsx";
import { getGroups, groupsSelector, addNewGroup } from "../Store/groups.js";
// import AssignmentTabPanel from "../Components/SharedComponents/TabPanels/AssignmentTabPanel.jsx";
import { getOtherPermissions } from "../Store/otherPermissions.js";
import notify from "devextreme/ui/notify";
import { Options } from "devextreme-react/select-box";

function PermissionsModal({ ClosePopup }) {
    const [dropdownValue, setDropdownValue] = useState("");
    const [addGroupForm, setAddGroupForm] = useState({
        groupName: "",
        getFromId: "-1",
    });
    const [showAddGroupPopup, setShowAddGroupPopup] = useState(false);
    const dispatch = useDispatch();

    // Selectors
    const subPermissions = useSelector(subPermissionsSelector);
    const groups = useSelector(groupsSelector.selectAll);
    const mainPermissionsCount = useSelector(
        mainPermissionsSelector.selectTotal
    );
    const groupsCount = useSelector(groupsSelector.selectTotal);

    useEffect(() => {
        if (mainPermissionsCount === 0) dispatch(getMainPermissions());
        if (groupsCount === 0) dispatch(getGroups());
        return () => {};
    }, []);

    // Data details
    // id => group id
    // [] => permissions detials
    const colAttributes = [
        ["byan", "العملية"],
        ["ins", "إضافة"],
        ["del", "حذف"],
        ["up", "تعديل"],
        ["show", "عرض"],
    ];

    const [selectedRow, setSelectedRow] = useState("");
    const optionClicked = (value) => {
        dispatch(
            getSubPermissions({
                groupId: 1,
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

    const getPermissionsFromGroupHandle = (e) => {
        console.log(e.value);
        setAddGroupForm({ ...addGroupForm, getFromId: e.value });
    };

    const addGroupHandle = (e) => {
        const isNewName = groups.find(
            (group) => group.name == addGroupForm.groupName
        );
        if (!isNewName) {
            dispatch(addNewGroup(addGroupForm));
        } else {
            notify(
                {
                    message: "هذا الإسم موجود من قبل",
                    width: 450,
                },
                "error",
                2000
            );
        }
        console.log(addGroupForm);
    };

    const insertValueChanged = (e) => {
        console.log(e);
        console.log(selectedRow);
        setSelectedRow({ ...selectedRow, ins: e ? "نعم" : "لا" });
    };

    const updateValueChanged = (e) => {
        console.log(e);
        console.log(selectedRow);
        setSelectedRow({ ...selectedRow, up: e ? "نعم" : "لا" });
    };

    const deleteValueChanged = (e) => {
        console.log(e);
        console.log(selectedRow);
        setSelectedRow({ ...selectedRow, del: e ? "نعم" : "لا" });
    };

    const showValueChanged = (e) => {
        console.log(e);
        console.log(selectedRow);
        setSelectedRow({ ...selectedRow, show: e ? "نعم" : "لا" });
    };

    return (
        <>
            <Popup
                visible={showAddGroupPopup}
                onHiding={() => setShowAddGroupPopup(false)}
                dragEnabled={false}
                showTitle={true}
                title="إضافة مجموعة"
                rtlEnabled={true}
                width={500}
                height={300}
            >
                <div className="contianer">
                    <div className="p-3 row">
                        <div className="col-4 align-self-center">
                            اسم المجموعة
                        </div>
                        <div className="col-8">
                            <TextBox
                                placeholder="اسم  المجموعة "
                                onInput={({ event }) => {
                                    setAddGroupForm({
                                        ...addGroupForm,
                                        groupName: event.target.value,
                                    });
                                }}
                            />
                        </div>
                    </div>
                    <div className="p-3 row">
                        <div className="col-4 align-self-center">
                            الصلاحيات الإبتدائية
                        </div>
                        <div className="col-8">
                            <SimpleDropdown
                                dropdownValue={addGroupForm.getFromId}
                                onValueChanged={(e) =>
                                    getPermissionsFromGroupHandle(e)
                                }
                                data={[
                                    { id: "-1", name: "بدون صلاحيات" },
                                    { id: "0", name: "جميع الصلاحيات" },
                                ].concat(groups)}
                            />
                        </div>
                    </div>
                    <div className="formButtons d-flex justify-content-around pt-3">
                        <Button
                            disabled={addGroupForm.groupName ? false : true}
                            text="تأكيد"
                            icon="check"
                            type="success"
                            rtlEnabled={true}
                            width={"33%"}
                            onClick={addGroupHandle}
                        />
                        <Button
                            text="إلغاء"
                            icon="close"
                            type="danger"
                            rtlEnabled={true}
                            width={"33%"}
                            onClick={() => setShowAddGroupPopup(false)}
                        />
                    </div>
                </div>
            </Popup>

            <div className="contianer card p-3">
                <div className="row">
                    <div className="col-2">
                        <ScrollView
                            style={{ border: "1px rgb(231, 228, 228) solid" }}
                            width="100%"
                            height="83vh"
                        >
                            <div>
                                <SideBarComponent
                                    onOptionClicked={(value) =>
                                        optionClicked(value)
                                    }
                                />
                            </div>
                        </ScrollView>
                    </div>
                    <div className="col-6 card pt-3">
                        <TableWithCheckBoxs
                            data={subPermissions}
                            colAttributes={colAttributes}
                            height="350px"
                        />
                        <div className="row py-3">
                            <div className="col-6">
                                <SimpleDropdown
                                    dropdownValue={dropdownValue}
                                    onValueChanged={(e) => onValueChanged(e)}
                                    placeHolder="اختر المجموعة "
                                    data={groups}
                                    showClear={false}
                                />
                            </div>

                            <div className="col-6">
                                <Button
                                    className="send"
                                    icon="plus"
                                    text="إضافة مجموعة"
                                    rtlEnabled={true}
                                    width="100%"
                                    onClick={() => setShowAddGroupPopup(true)}
                                />
                            </div>

                            <div className="col-6 pt-3">
                                <TextBox
                                    readOnly={true}
                                    hoverStateEnabled={false}
                                    value={selectedRow.byan}
                                    rtlEnabled={false}
                                />
                            </div>
                            <div className="col-6 pt-4">
                                <CheckBox
                                    disabled={!selectedRow}
                                    value={
                                        selectedRow.ins === "نعم" ? true : false
                                    }
                                    onValueChange={insertValueChanged}
                                    width={"25%"}
                                    text="إضافة"
                                    rtlEnabled={false}
                                />
                                <CheckBox
                                    disabled={!selectedRow}
                                    value={
                                        selectedRow.del === "نعم" ? true : false
                                    }
                                    width={"25%"}
                                    onValueChange={deleteValueChanged}
                                    text="حذف"
                                    rtlEnabled={false}
                                />
                                <CheckBox
                                    disabled={!selectedRow}
                                    value={
                                        selectedRow.up === "نعم" ? true : false
                                    }
                                    width={"25%"}
                                    onValueChange={updateValueChanged}
                                    text="تعديل"
                                    rtlEnabled={false}
                                />
                                <CheckBox
                                    disabled={!selectedRow}
                                    value={
                                        selectedRow.show === "نعم"
                                            ? true
                                            : false
                                    }
                                    width={"25%"}
                                    onValueChange={showValueChanged}
                                    text="عرض"
                                    rtlEnabled={false}
                                />
                            </div>
                        </div>

                        <div className="formButtons row pb-3">
                            <div className="col-6">
                                <Button
                                    text="تــــــــأكـــــيـــــــد"
                                    icon="check"
                                    type="success"
                                    rtlEnabled={true}
                                    width={"100%"}
                                />
                            </div>
                            <div className="col-6">
                                <Button
                                    text="خــــــروج"
                                    icon="close"
                                    type="danger"
                                    rtlEnabled={true}
                                    width={"100%"}
                                    onClick={ClosePopup}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="col-4 ">{/* <AssignmentTabPanel /> */}</div>
                </div>
            </div>
        </>
    );
}

export default PermissionsModal;
