/*** react , react-redux***/
import React, { useEffect, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
/*** dev Extreme ***/
import { Button } from "devextreme-react/button";
import CheckBoxDev from "devextreme-react/check-box";
import notify from "devextreme/ui/notify";
/*** custom Inputs ***/
import {
    TextBox,
    NumberBox,
    SelectBox,
    CheckBox,
    TextArea,
    Autocomplete,
    Radio,
} from "../Components/Inputs";
/*** custom hooks ***/
import useForm from "../Services/useForm";
/*** inner componets ***/
import ItemNumber from "../Components/Varieties/ItemNumber";
import UnitTable from "../Components/Varieties/UnitTable";
import SearchItem from "./SearchItem";
import ButtonRow from "./../Components/SharedComponents/buttonsRow";
/*** api methods ***/
import {
    GET_MAIN_CATEGORIES,
    SAVE_ITEMS,
    GET_ITEM_BY_ID,
    GET_VISIBLE_PANELS,
    GET_ITEM_NAME,
} from "../Services/ApiServices/ItemsAPI";
/*** selectors and async actions ***/
import {
    fetchAll,
    selectItemsLookups,
    fetchPermissions,
    selectElements,
    editMainUnit,
} from "../Store/itemsLookups";

import debounce from "debounce";
/*** image for img tag ***/
import noImage from "../Images/NoImage.png";

const ItemsForm = ({ match }) => {
    /*** useDispatch ***/
    let dispatch = useDispatch();

    /*** state ***/
    let [intialValues, setIntialValues] = useState({
        Items_s2: [],
        Items_Box: [],
    });
    /*** main categories ?????????? ***/
    let [mainCategories, setMaincategories] = useState([]);
    /***item name autocomplete list ***/
    let [itemsNames, setItemsNames] = useState([]);
    /*** errors associated with item  ***/
    let [errors, setErrors] = useState({});
    /*** ?????? ***/
    let [searchKey, setSearchKey] = useState('');
    let [id, setId] = useState('');

    /*** state for popup visibility for search item page  ***/
    // used in buttons on {حذف} and {تعديل} and {مشابه}
    let [visible, setVisible] = useState(false)

    /*** selectors ***/
    // lookups for dropdowns {الوحدات الأساسيه} / {التصنيف الفرعي} / {المصدر}
    let lookups = useSelector(selectItemsLookups);

    // values in store getted one time for the project life cycle 
    // for showing or hiding {الباليته} / {Items_Box} / {خاض للصلاحيه}
    let showElement = useSelector(selectElements);

    /*** some handlers ***/
    // method for contolling openning and colseing the search item popup
    const togglePopup = () => { setVisible(!visible) }

    /*** Effects  ***/
    useEffect(async () => {
        // dipatch action for get all Item Lookups for lookups selectors
        dispatch(fetchAll());

        // dipatch action for get all Item Lookups for lookups selectors
        // ?????? naming
        dispatch(fetchPermissions());

        let { MainCategory } = await GET_MAIN_CATEGORIES();
        setMaincategories(MainCategory);
    }, [])

    useEffect(async () => {
        let data = await GET_ITEM_NAME('item_name', searchKey);
        setItemsNames(data.map(e => e.item_name));
        console.log(data);
    }, [searchKey])

    useEffect(async () => {
        let item = await GET_ITEM_BY_ID(id)
        console.log(item);
        setIntialValues(item);
    }, [id])


    let submit = async (values) => {
        try {
            let response = await SAVE_ITEMS(values);
            let { id, Items, Items_s2, Items_Box } = response;

            handleChange({ name: 'id', value: id });

            if (id && !Items_s2 && !Items_Box) {
                notify({ message: 'تم حفظ الصنف بنجاح', width: 600 }, "success", 300)
            } else {
                if (Items) {
                    let errors = {};
                    Items.forEach(item => {
                        let key = Object.keys(item)[0];
                        errors[key] = false;
                    })
                    setErrors(errors)
                }

                if (Items_s2) {
                    let ProcessedList = values["Items_s2"];
                    ProcessedList.forEach((e) => {
                        if (Items_s2.some((i) => i.Value == e.parcode_s)) {
                            e.error = true;
                        }
                    });
                    handleChange({ name: "Items_s2", value: ProcessedList });
                }

                if (Items_Box) {
                    let ProcessedList = values["Items_Box"];
                    ProcessedList.forEach((e) => {
                        if (Items_Box.some((i) => i.Value == e.parcodee)) {
                            e.error = true;
                        }
                    });
                    handleChange({ name: "Items_Box", value: ProcessedList });
                }
            }
        } catch (error) {
            console.log(error);
        }
    };

    let handleImageUpload = ({ target: input }) => {
        if (input.files && input.files[0]) {
            const reader = new FileReader();
            //data
            let imageFile = input.files[0];
            reader.readAsDataURL(imageFile);
            reader.onload = (f) => {
                let imagePath = f.target.result;
                handleChange({ name: "image", value: imagePath });
            };
        }
    };

    let handleNameChange = useCallback(({ name, value }) => {
        handleChange({ name, value });
        handleSearchKey(value);
    }, []);

    let handleSearchKey = debounce((value) => setSearchKey(value), 750);

    let {
        handleChange,
        handleSubmit,
        values,
        handleChangeList,
        handleRemoveItem,
    } = useForm(submit, intialValues);

    let callBack = (id) => {
        setId(id);
    };

    return (
        <div className="container" dir="auto">
            <div className="row">
                <div className="col-3">
                    <ItemNumber
                        items={values["Items_s2"]}
                        save={handleChangeList}
                        remove={handleRemoveItem}
                    />
                </div>
                <form onSubmit={handleSubmit} className="custom-card col-9 p-4">
                    <div className="row">
                        <div className="col-9">
                            <div className="double">
                                <SearchItem
                                    visible={visible}
                                    callBack={callBack}
                                    togglePopup={togglePopup}
                                />
                                <NumberBox
                                    label="رقم الصنف"
                                    value={values["item_no"]}
                                    name="item_no"
                                    handleChange={handleChange}
                                    valid={errors["item_no"]}
                                />

                                <Autocomplete
                                    label="اسم الصنف"
                                    value={values["item_name"]}
                                    name="item_name"
                                    searchTimeout={750}
                                    handleChange={({ name, value }) =>
                                        handleNameChange({ name, value })
                                    }
                                    valid={errors["item_name"]}
                                    dataSource={itemsNames}
                                />

                                <SelectBox
                                    label="التصنيف"
                                    value={values["typ_id"]}
                                    name="typ_id"
                                    dataSource={mainCategories}
                                    handleChange={handleChange}
                                />

                                <SelectBox
                                    label="الوحده الأساسية"
                                    value={values["unitid"]}
                                    name="unitid"
                                    dataSource={lookups.MainUnit}
                                    handleChange={({ name, value }) => {
                                        let previous = values["unitid"];
                                        dispatch(
                                            editMainUnit({ previous, value })
                                        );
                                        handleChange({ name, value });
                                    }}
                                />

                                <NumberBox
                                    label="العبوة"
                                    value={values["box"]}
                                    required={false}
                                    name="box"
                                    handleChange={handleChange}
                                />
                                {showElement.Work_with_Seramik && (
                                    <NumberBox
                                        label="الباليته"
                                        value={values["Balita"]}
                                        required={false}
                                        name="Balita"
                                        handleChange={handleChange}
                                    />
                                )}
                            </div>

                            <div className="double mt-4">
                                <NumberBox
                                    label="سعر قطاعي"
                                    value={values["price"]}
                                    name="price"
                                    handleChange={handleChange}
                                    required={false}
                                />
                                <NumberBox
                                    label="سعر الجمله"
                                    value={values["p_gmla"]}
                                    name="p_gmla"
                                    handleChange={handleChange}
                                    required={false}
                                />
                                <NumberBox
                                    label="جمله الجمله"
                                    value={values["p_gmla_2"]}
                                    name="p_gmla_2"
                                    handleChange={handleChange}
                                    required={false}
                                />
                                <NumberBox
                                    label="أقل سعر"
                                    value={values["des"]}
                                    name="des"
                                    handleChange={handleChange}
                                    required={false}
                                />
                                <NumberBox
                                    label="سعر التكلفه"
                                    value={values["p_tkl"]}
                                    name="p_tkl"
                                    handleChange={handleChange}
                                    required={false}
                                />
                                <NumberBox
                                    label="تكلفه الدولار"
                                    value={values["p_tkl_dolar"]}
                                    name="p_tkl_dolar"
                                    handleChange={handleChange}
                                    required={false}
                                />

                                <NumberBox
                                    label="نسبه التخفيض"
                                    value={values["dis"]}
                                    name="dis"
                                    handleChange={handleChange}
                                    required={false}
                                />
                            </div>

                            <div className="double mt-4">
                                <NumberBox
                                    label="حصه المسوق"
                                    value={values["mosawiq_nesba"]}
                                    name="mosawiq_nesba"
                                    handleChange={handleChange}
                                    required={false}
                                />
                                <SelectBox
                                    label="الوحده الإفتراضيه"
                                    value={values["unit2"]}
                                    name="unit2"
                                    dataSource={lookups.MainUnit}
                                    handleChange={handleChange}
                                    required={false}
                                />
                                <NumberBox
                                    label="رقم القطعه"
                                    value={values["code_no"]}
                                    name="code_no"
                                    handleChange={handleChange}
                                    required={false}
                                />
                            </div>

                            <div
                                className="mb-3"
                                data-bs-toggle="collapse"
                                data-bs-target="#collapseExample"
                                aria-expanded="false"
                                aria-controls="collapseExample"
                            >
                                <Button
                                    width={"100%"}
                                    text="خصائص اضافيه"
                                    type="normal"
                                    stylingMode="contained"
                                />
                            </div>

                            <div class="collapse" id="collapseExample">
                                <div className="double">
                                    <TextBox
                                        label="بلد الصنع"
                                        value={values["comp"]}
                                        name="comp"
                                        handleChange={handleChange}
                                        required={false}
                                    />
                                    <NumberBox
                                        label="الرقم التجاري"
                                        value={values["PARCODE1"]}
                                        name="PARCODE1"
                                        handleChange={handleChange}
                                        required={false}
                                    />
                                    <NumberBox
                                        label="باركود داخلي"
                                        value={values["PARCODE2"]}
                                        name="PARCODE2"
                                        handleChange={handleChange}
                                        required={false}
                                    />
                                    <TextBox
                                        label="مكان الصنف"
                                        value={values["item_place"]}
                                        name="item_place"
                                        handleChange={handleChange}
                                        required={false}
                                    />
                                </div>

                                <div className="double  mt-3">
                                    <SelectBox
                                        label="تصنيف فرعي"
                                        value={values["cunt"]}
                                        name="cunt"
                                        dataSource={lookups.OtherCategory}
                                        handleChange={handleChange}
                                        required={false}
                                    />

                                    <SelectBox
                                        label="المصدر"
                                        value={values["msdar"]}
                                        name="msdar"
                                        dataSource={lookups.Supplier}
                                        handleChange={handleChange}
                                        required={false}
                                    />

                                    <TextBox
                                        label="Item Name"
                                        value={values["e_name"]}
                                        name="e_name"
                                        handleChange={handleChange}
                                        required={false}
                                    />

                                    <CheckBox
                                        label="السماح بعرض الصنف علي الموقع"
                                        value={values["show_net"]}
                                        name="show_net"
                                        handleChange={handleChange}
                                        required={false}
                                    />
                                </div>

                                <div className="double mt-3">
                                    <NumberBox
                                        label="الطول"
                                        value={values["tol"]}
                                        name="tol"
                                        handleChange={handleChange}
                                        required={false}
                                    />
                                    <NumberBox
                                        label="العرض"
                                        value={values["ord"]}
                                        name="ord"
                                        handleChange={handleChange}
                                        required={false}
                                    />
                                    <NumberBox
                                        label="الارتفاع "
                                        value={values["ert"]}
                                        name="ert"
                                        handleChange={handleChange}
                                        required={false}
                                    />
                                    <NumberBox
                                        label="الوزن"
                                        value={values["wazn"]}
                                        name="wazn"
                                        handleChange={handleChange}
                                        required={false}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="col-3">
                            <div className="image-container">
                                <img
                                    src={values["image"] || noImage}
                                    className="image-container__img"
                                />
                                <div className="image-container__link">
                                    <input
                                        accept="image/*"
                                        style={{ display: "none" }}
                                        id="contained-button-file"
                                        type="file"
                                        onChange={handleImageUpload}
                                    />

                                    <label htmlFor="contained-button-file">
                                        <Button
                                            width={"100%"}
                                            text="Upload"
                                            type="default"
                                            stylingMode="outlined"
                                        />
                                    </label>
                                </div>
                            </div>
                            <div dir="ltr" className="mt-4">
                                <Radio
                                    items={["بحث عادي", "بحث في شاشه البيع"]}
                                    value={values["show_sales"] || "بحث عادي"}
                                    name="show_sales"
                                    handleChange={handleChange}
                                />

                                <div className="mt-4 d-flex">
                                    <CheckBoxDev
                                        value={
                                            values["Subject_to_validity"] ||
                                            false
                                        }
                                        onValueChanged={({ value }) =>
                                            handleChange({
                                                name: "Subject_to_validity",
                                                value,
                                            })
                                        }
                                    />
                                    <div className="mx-2">خاضع للصلاحيه</div>
                                </div>
                            </div>
                        </div>

                        <div className="col-9">
                            {showElement.Cancel_box && (
                                <UnitTable
                                    save={handleChangeList}
                                    items={values["Items_Box"]}
                                    remove={handleRemoveItem}
                                    options={lookups.MainUnit}
                                />
                            )}
                            <ButtonRow
                                submitBehavior={true}
                                onEdit={togglePopup}
                                onNew={() => {
                                    setIntialValues((v) => ({
                                        Items_s2: [],
                                        Items_Box: [],
                                    }));
                                }}
                            />
                        </div>

                        <div className="col-3">
                            <div className="mt-5">
                                <div className="label mb-2">
                                    تفاصيل عن الصنف
                                </div>
                                <TextArea
                                    label="تفاصيل عن الصنف"
                                    value={values["byan_item"]}
                                    name="byan_item"
                                    handleChange={handleChange}
                                    required={false}
                                />
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ItemsForm;
