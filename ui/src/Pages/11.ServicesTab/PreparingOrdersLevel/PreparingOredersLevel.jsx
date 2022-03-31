import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedGroupId } from "../../../Store/groups.js";
import {
	getNodesIn,
	getOtherPermissions,
} from "../../../Store/otherPermissions.js";
import DateTime from "../../../Components/Inputs/DateTime";
import SelectBox from "../../../Components/Inputs/SelectBox";
import MasterTable from "../../../Components/SharedComponents/Tables Components/MasterTable.jsx";
import { setItem, setVisible } from "../../../Store/Items/ItemsSlice";
import SearchItem from "../../Items/SearchItem";
import {
	selectCategories,
	fetchCategories,
} from "../../../Store/Items/CategoriesSlice";
import { REORDERRPRODUCTS, GET_STORES } from "./API.PreparingOrdersLevel";

import InputTableEdit from "../../../Components/SharedComponents/Tables Components/InputTableEdit.jsx";
import { useTranslation } from "react-i18next";
function PreparingOrdersLevel(props) {
	const { t, i18n } = useTranslation();
	let categories = useSelector(selectCategories);
	let [categoriesList, setcategoriesList] = useState([]);
	let dispatch = useDispatch();
	let tabCol = useMemo(() => {
		return [
			{
				caption: "رقم الصنف ",
				captionEn: "Item No.",
				field: "item_no",
				dataType: "number",
			},
			{
				caption: "أسم الصنف",
				field: "item_name",
				captionEn: "Item Name",
				dataType: "text",
			},
			{
				caption: "الكميه ",
				field: "allqunt",
				captionEn: "Quantity",
				dataType: "number",
			},
			{
				caption: "سعر القطعة",
				field: "price",
				captionEn: "Piece price",
				dataType: "number",
			},
			{
				caption: "سعر الجملة",
				field: "p_gmla",
				captionEn: "Wholesale price",
				dataType: "number",
			},
			{
				caption: "نوع القطعه ",
				captionEn: "Piece category",
				field: "description",
			},
			{
				caption: "وحدت القياس",
				captionEn: "Measruing unit",
				field: "unit1",
			},
			{
				caption: "الأسم الأجنبي",
				captionEn: "English Name",
				field: "e_name",
			},
			{ caption: "شفرة النوع", captionEn: "Type Code", field: "cunt" },
			{
				caption: "نقطة اعادة الطلب",
				captionEn: "Restore Point",
				field: "qunt",
			},
			{
				caption: "الموصفات الفنيه ",
				captionEn: "Technical details",
				field: "des",
			},
			{ caption: "بلد الصنع", captionEn: "C.O.M", field: "comp" },
		];
	}, []);
	let [values, setvalues] = useState({
		FromStoreID: 0,
		FilterQuery: "",
	});
	let handleChange = useCallback(
		({ name, value }) => {
			setvalues({ ...values, [name]: value });
		},
		[values]
	);

	useEffect(async () => {
		dispatch(fetchCategories());
	}, []);
	useEffect(async () => {
		setcategoriesList([{ name: "كل", id: 0 }, ...categories]);
		setvalues({ ...values, CategoryID: 0 });
	}, [categories]);
	let QueryFilter = (query) => {
		setvalues({ ...values, FilterQuery: query });
	};
	return (
		<div
			dir="auto"
			className="row"
			style={{ display: "flex", justifyContent: "center", margin: 0 }}
		>
			<h1 style={{ width: "100%", textAlign: "center", padding: "2%" }}>
				{t("Re-Order Level")}
			</h1>
			<div className="row" style={{ width: "80%", padding: "4px" }}>
				<div className="col-12 col-md-6 col-lg-3">
					<SelectBox
						label={t("By Category")}
						dataSource={categoriesList}
						value={values.CategoryID}
						name="CategoryID"
						handleChange={handleChange}
						required={false}
					/>
				</div>
			</div>
			<div style={{ width: "95%" }}>
				<InputTableEdit
					height="400px"
					style={{ width: "80%" }}
					canDelete={false}
					colAttributes={tabCol}
					remoteOperations
					apiMethod={REORDERRPRODUCTS}
					apiPayload={values}
					optionChanged={QueryFilter}
				/>
			</div>
		</div>
	);
}
export default PreparingOrdersLevel;
