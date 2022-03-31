import React, { useEffect } from "react";
import { Button } from "devextreme-react/button";
import { TextBox, NumberBox, SelectBox, CheckBox } from "../Inputs";
import useForm from "./../../Services/useForm";
import noImage from "../../Images/NoImage.png";
import FileUploader from "devextreme-react/file-uploader";

export const products = [
    {
        ID: 1,
        Name: "HD Video Player",
        Price: 330,
        Current_Inventory: 225,
        Backorder: 0,
        Manufacturing: 10,
        Category: "Video Players",
        ImageSrc: "images/products/1.png",
    },
    {
        ID: 2,
        Name: "SuperHD Video Player",
        Price: 400,
        Current_Inventory: 150,
        Backorder: 0,
        Manufacturing: 25,
        Category: "Video Players",
        ImageSrc: "images/products/2.png",
    },
    {
        ID: 3,
        Name: "SuperPlasma 50",
        Price: 2400,
        Current_Inventory: 0,
        Backorder: 0,
        Manufacturing: 0,
        Category: "Televisions",
        ImageSrc: "images/products/3.png",
    },
    {
        ID: 4,
        Name: "SuperLED 50",
        Price: 1600,
        Current_Inventory: 77,
        Backorder: 0,
        Manufacturing: 55,
        Category: "Televisions",
        ImageSrc: "images/products/4.png",
    },
    {
        ID: 5,
        Name: "SuperLED 42",
        Price: 1450,
        Current_Inventory: 445,
        Backorder: 0,
        Manufacturing: 0,
        Category: "Televisions",
        ImageSrc: "images/products/5.png",
    },
    {
        ID: 6,
        Name: "SuperLCD 55",
        Price: 1350,
        Current_Inventory: 345,
        Backorder: 0,
        Manufacturing: 5,
        Category: "Televisions",
        ImageSrc: "images/products/6.png",
    },
    {
        ID: 7,
        Name: "SuperLCD 42",
        Price: 1200,
        Current_Inventory: 210,
        Backorder: 0,
        Manufacturing: 20,
        Category: "Televisions",
        ImageSrc: "images/products/7.png",
    },
    {
        ID: 8,
        Name: "SuperPlasma 65",
        Price: 3500,
        Current_Inventory: 0,
        Backorder: 0,
        Manufacturing: 0,
        Category: "Televisions",
        ImageSrc: "images/products/8.png",
    },
    {
        ID: 9,
        Name: "SuperLCD 70",
        Price: 4000,
        Current_Inventory: 95,
        Backorder: 0,
        Manufacturing: 5,
        Category: "Televisions",
        ImageSrc: "images/products/9.png",
    },
    {
        ID: 10,
        Name: "DesktopLED 21",
        Price: 175,
        Current_Inventory: null,
        Backorder: 425,
        Manufacturing: 75,
        Category: "Monitors",
        ImageSrc: "images/products/10.png",
    },
    {
        ID: 12,
        Name: "DesktopLCD 21",
        Price: 170,
        Current_Inventory: 210,
        Backorder: 0,
        Manufacturing: 60,
        Category: "Monitors",
        ImageSrc: "images/products/12.png",
    },
    {
        ID: 13,
        Name: "DesktopLCD 19",
        Price: 160,
        Current_Inventory: 150,
        Backorder: 0,
        Manufacturing: 210,
        Category: "Monitors",
        ImageSrc: "images/products/13.png",
    },
    {
        ID: 14,
        Name: "Projector Plus",
        Price: 550,
        Current_Inventory: null,
        Backorder: 55,
        Manufacturing: 10,
        Category: "Projectors",
        ImageSrc: "images/products/14.png",
    },
    {
        ID: 15,
        Name: "Projector PlusHD",
        Price: 750,
        Current_Inventory: 110,
        Backorder: 0,
        Manufacturing: 90,
        Category: "Projectors",
        ImageSrc: "images/products/15.png",
    },
    {
        ID: 16,
        Name: "Projector PlusHT",
        Price: 1050,
        Current_Inventory: 0,
        Backorder: 75,
        Manufacturing: 57,
        Category: "Projectors",
        ImageSrc: "images/products/16.png",
    },
];

const Form = () => {
    useEffect(async () => {}, []);
    let submit = (values) => {
        console.log(values);
    };

    let { handleChange, handleSubmit, values } = useForm(submit);

    return (
        <>
            <div className="right-container__items">
                <form className="" onSubmit={handleSubmit}>
                    <div className="double">
                        <NumberBox
                            label="رقم الصنف"
                            value={values["1"]}
                            name="1"
                            handleChange={handleChange}
                        />
                        <TextBox
                            label="اسم الصنف"
                            value={values["2"]}
                            name="2"
                            handleChange={handleChange}
                        />
                        <SelectBox
                            label="التصنيف"
                            value={values["3"]}
                            name="3"
                            dataSource={products}
                            handleChange={handleChange}
                        />
                        <SelectBox
                            label="الوحده الأساسية"
                            value={values["4"]}
                            name="4"
                            dataSource={products}
                            handleChange={handleChange}
                            keys={{ id: "ID", name: "Name" }}
                        />
                        <NumberBox
                            label="العبوة"
                            value={values["5"]}
                            name="5"
                            handleChange={handleChange}
                        />
                    </div>

                    <div className="double mt-4">
                        <NumberBox
                            label="سعر قطاعي"
                            value={values["6"]}
                            name="6"
                            handleChange={handleChange}
                        />
                        <NumberBox
                            label="سعر الجمله "
                            value={values["7"]}
                            name="7"
                            handleChange={handleChange}
                        />
                        <NumberBox
                            label="جمله الجمله"
                            value={values["8"]}
                            name="8"
                            handleChange={handleChange}
                        />
                        <NumberBox
                            label="أقل سعر"
                            value={values["9"]}
                            name="9"
                            handleChange={handleChange}
                        />
                        <NumberBox
                            label="سعر التكلفه"
                            value={values["10"]}
                            name="10"
                            handleChange={handleChange}
                        />
                        <NumberBox
                            label="تكلفه الدولار"
                            value={values["11"]}
                            name="11"
                            handleChange={handleChange}
                        />
                        <NumberBox
                            label="نسبه التخفيض"
                            value={values["12"]}
                            name="12"
                            handleChange={handleChange}
                        />
                    </div>

                    <div className="double mt-4">
                        <NumberBox
                            label="حصه المسوق"
                            value={values["13"]}
                            name="13"
                            handleChange={handleChange}
                        />
                        <SelectBox
                            label="الوحده الإفتراضيه"
                            value={values["14"]}
                            name="14"
                            dataSource={products}
                            handleChange={handleChange}
                        />
                        <NumberBox
                            label="رقم القطعه"
                            value={values["15"]}
                            name="15"
                            handleChange={handleChange}
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
                            width={375}
                            text="خصائص اضافيه"
                            type="default"
                            stylingMode="contained"
                        />
                    </div>
                    <div className="collapse" id="collapseExample">
                        <div className="double">
                            <SelectBox
                                label="تصنيف فرعي"
                                value={values["16"]}
                                name="16"
                                dataSource={products}
                                handleChange={handleChange}
                            />
                            <SelectBox
                                label="المصدر"
                                value={values["17"]}
                                name="17"
                                dataSource={products}
                                handleChange={handleChange}
                            />
                            <TextBox
                                label="Item Name"
                                value={values["18"]}
                                name="18"
                                handleChange={handleChange}
                            />
                            <CheckBox
                                label="السماح بعرض الصنف علي الموقع"
                                value={values["23"]}
                                name="23"
                                handleChange={handleChange}
                            />
                        </div>

                        <div className="double mt-4">
                            <NumberBox
                                label="الطول"
                                value={values["19"]}
                                name="19"
                                handleChange={handleChange}
                            />
                            <NumberBox
                                label="العرض"
                                value={values["20"]}
                                name="20"
                                handleChange={handleChange}
                            />
                            <NumberBox
                                label="الارتفاع "
                                value={values["21"]}
                                name="21"
                                handleChange={handleChange}
                            />
                            <NumberBox
                                label="الوزن"
                                value={values["22"]}
                                name="22"
                                handleChange={handleChange}
                            />
                        </div>
                    </div>

                    {/* <Button
						width={'10%'}
						text="اضافه"
						type="default"
						stylingMode="outlined"
						useSubmitBehavior={true} /> */}
                </form>
                <div className="image-container">
                    <img src={noImage} className="image-container__img" />
                    <FileUploader
                        className="image-container__link"
                        multiple={true}
                        selectButtonText="Select photo"
                        labelText=""
                        accept="image/*"
                        uploadMode="useForm"
                    />
                </div>
            </div>
        </>
    );
};

export default Form;
