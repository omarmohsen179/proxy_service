import React, { useState, useCallback, useEffect, useMemo } from "react";
import "./MiscellanStyle.css";
import PropTypes from "prop-types";
import {
	setItem,
	setVisible,
	selectSearchKeys,
	selectVisible,
	setSearchKeys,
} from "../../../Store/Items/ItemsSlice";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedGroupId } from "../../../Store/groups.js";
import {
	getNodesIn,
	getOtherPermissions,
} from "../../../Store/otherPermissions.js";

import notify from "devextreme/ui/notify";
import SearchItem from "../../../Pages/Items/SearchItem";

import TableCell from "../../Items/tableCell";
import {
	GET_ITEM_INFO,
	GET_STORES,
	ALL_STORE_ITEMS,
	RESET_STORE,
} from "./MiscellaneousButtonBarAPI";
import { NumberBox, SelectBox, TextBox } from "../../Inputs";
import { ItemsStorageQuantityTable } from "../Tables Components/ItemsStorageQuantityTable/ItemsStorageQuantityTable";

import ItemsTable from "../../Items/ItemsTable";
import { useRef } from "react";
import { useTranslation } from "react-i18next";

const MiscellaneousButtonBar = ({
	type = 1,
	searchItemCallBackHandleStore,
	handleChange,
	Invoice = 0,
	values = {},
	errors = {},
}) => {
	const { t, i18n } = useTranslation();
	let dispatch = useDispatch();
	let visible = useSelector(selectVisible);
	const [stores, setstores] = useState([]);

	const [inputDisaple, setinputDisaple] = useState(true);
	const store_table_object = useMemo(() => {
		return {
			ID: 0,
			m_no: 0,
		};
	}, []);
	const cols = useMemo(() => {
		return [
			{
				caption: "رقم الصنف",
				captionEn: "Item Number",
				field: "item_no",
				alignment: "center",
			},
			{
				caption: "اسم الصنف",
				captionEn: "Item Name",
				field: "item_name",
				alignment: "center",
			},
			{
				caption: "المخذنت",
				captionEn: "Note",

				field: "StoreName",
				alignment: "center",
			},
			{
				caption: "الكميه",
				field: "qunt",
				captionEn: "Quantity",
				alignment: "center",
			},
			{
				caption: "الصلاحيه",
				captionEn: "Expiry Date",
				field: "exp_date",
				alignment: "center",
			},
		];
	}, []);
	const [buttonDisable, setbuttonDisable] = useState(true);

	const togglePopup = useCallback(
		(value) => {
			if (value === false || value === true) {
				dispatch(setVisible(value));
			} else {
				dispatch(setVisible());
			}
			sessionStorage.setItem("backUrl", "items");
		},
		[dispatch]
	);
	let othervalues = useRef({ item_id: 0, m_no: 0 });
	const all_store = useCallback((e) => {
		return ALL_STORE_ITEMS(e);
	}, []);
	const ResetQuantity = useCallback(async (e) => {
		await RESET_STORE(e)
			.then(() => {
				notify(
					{ message: t("Add Successfully"), width: 600 },
					"success",
					3000
				);
			})
			.catch(() => {
				notify(
					{ message: t("Failed Try again"), width: 450 },
					"error",
					2000
				);
			});
	}, []);
	const StoreHandler = useCallback(
		async ({ value }) => {
			dispatch(setSearchKeys({ m_no: value }));
			await handleChange({ name: "m_no", value: value });
			othervalues.current = { ...othervalues.current, m_no: value };
			if (othervalues.current.item_id > 0) {
				await GET_ITEM_INFO(value, othervalues.current.item_id)
					.then((res) => {
						searchItemCallBackHandleStore(res);
					})
					.catch((err) => {
						console.log(err);
					});
			}
		},
		[othervalues]
	);

	const TableI = useCallback(
		async (id) => {
			othervalues.current = { ...othervalues.current, item_id: id };
			console.log(othervalues);
			await GET_ITEM_INFO(othervalues.current.m_no, id)
				.then((res) => {
					searchItemCallBackHandleStore(res);
				})
				.catch((err) => {
					console.log(err);
				});
		},
		[othervalues]
	);

	const SelectedItem = useCallback(
		async ({ data }) => {
			if (data) {
				await GET_ITEM_INFO(othervalues.current.m_no, data.id)
					.then((res) => {
						searchItemCallBackHandleStore(res);
					})
					.catch((err) => {
						console.log(err);
					});
			}
		},
		[othervalues.current.m_no]
	);

	useEffect(async () => {
		if (values.item_id) {
			setinputDisaple(false);
		} else {
			setinputDisaple(true);
		}
		if (values.m_no > 0) {
			setbuttonDisable(false);
		} else {
			setbuttonDisable(true);
		}
		othervalues.current = { item_id: values.item_id, m_no: values.m_no };
	}, [values.m_no, values.item_id]);
	useEffect(async () => {
		let storeData = await GET_STORES();
		setstores(
			storeData.map((R) => {
				return { ...R, id: R.id, name: R.description };
			})
		);
		handleChange({
			name: "m_no",
			value: storeData.length > 0 ? storeData[0].id : 0,
		});
		othervalues.current = {
			...othervalues.current,
			m_no: storeData.length > 0 ? storeData[0].id : 0,
		};
	}, []);
	return (
		<div style={{ width: "100%" }}>
			<div
				className="row"
				style={{
					width: "100%",
					display: "flex",
					justifyContent: "center",
				}}
			>
				<SearchItem
					visible={visible}
					togglePopup={togglePopup}
					callBack={TableI}
				/>
				<div className={"inputsPad col-12 col-md-6 col-lg-3"}>
					<SelectBox
						label={t("According to the store")}
						dataSource={stores}
						value={values.m_no}
						// keys = {{ id: "id", name: "description" }}
						name="m_no"
						handleChange={StoreHandler}
						required={false}
						validationErrorMessage={errors.m_no}
					/>
				</div>
				<div className="inputsPad col-12 col-md-6 col-lg-3">
					<button
						style={{
							height: "36px",
						}}
						type="button"
						disabled={buttonDisable}
						className="col-12 btn btn-outline-dark btn-outline"
						onClick={togglePopup}
					>
						<span className="">{t("Choose by category")}</span>
					</button>
				</div>
				<div className={"inputsPad col-12 col-md-6 col-lg-1"}>
					<div
						className={`border py-1 `}
						style={{ minHeight: "37px" }}
					>
						{values.item_no}
					</div>
				</div>
				<div className={"inputsPad col-12 col-md-6 col-lg-2"}>
					<div
						className={`border py-1 `}
						style={{ minHeight: "37px" }}
					>
						{values.item_name}
					</div>
				</div>
				{values.ExpiredDates && values.ExpiredDates.length > 0 ? (
					<div className={"inputsPad col-12 col-md-6 col-lg-3"}>
						<SelectBox
							label={t("Expiry")}
							dataSource={values.ExpiredDates}
							value={values.Exp_date}
							name="Exp_date"
							keys={{ id: "Exp_date", name: "Exp_date" }}
							handleChange={handleChange}
							disabled={inputDisaple}
							required={false}
						/>
					</div>
				) : null}

				{type == 1 ? (
					<>
						<div className={" inputsPad col-12 col-md-6 col-lg-2"}>
							<NumberBox
								value={values["Almogod"]}
								name="Almogod"
								handleChange={handleChange}
								label={t("Exist")}
								validationErrorMessage={errors.Almogod}
								disabled={inputDisaple}
								required={false}
							/>
						</div>

						<div className={" inputsPad col-12 col-md-6 col-lg-4"}>
							<TableCell value={values.cse} label={"-/+"} />
						</div>
						<div
							className={
								"inputsPad inputsPad col-12 col-md-6 col-lg-2"
							}
						>
							<div
								className={`border py-1 `}
								style={{ minHeight: "30px" }}
							>
								{values.kmea}
							</div>
						</div>
						<div className={"inputsPad col-12 col-md-6 col-lg-5"}>
							<TextBox
								placeholder={t("Note")}
								value={values["nots"]}
								label={t("Note")}
								name="nots"
								handleChange={handleChange}
								required={false}
							/>
						</div>
					</>
				) : null}
				{type == 2 ? (
					<>
						<div className={" inputsPad col-12 col-md-6 col-lg-3"}>
							<SelectBox
								label={t("Type")}
								dataSource={values.boxs}
								value={values.unit_id}
								name="unit_id"
								handleChange={handleChange}
								disabled={inputDisaple}
								required={false}
							/>
						</div>
						<div className={" inputsPad col-12 col-md-6 col-lg-4"}>
							<NumberBox
								value={values["sum_box"]}
								name="sum_box"
								handleChange={handleChange}
								label={t("Packaging")}
								validationErrorMessage={errors.sum_box}
								disabled={inputDisaple}
								required={false}
							/>
						</div>
						<div className={" inputsPad col-12 col-md-6 col-lg-4"}>
							<NumberBox
								value={values["kmea"]}
								name="kmea"
								handleChange={handleChange}
								label={t("Quantity")}
								validationErrorMessage={errors.kmea}
								disabled={inputDisaple}
								required={false}
							/>
						</div>
						<div className={" inputsPad col-12 col-md-6 col-lg-4"}>
							<NumberBox
								value={values["price"]}
								name="price"
								handleChange={handleChange}
								label={t("Price")}
								validationErrorMessage={errors.price}
								disabled={inputDisaple}
								required={false}
							/>
						</div>
					</>
				) : null}

				{type == 3 ? (
					<>
						<div
							className="col-lg-4 col-md-4  col-sm-12"
							style={{ padding: "5px" }}
						>
							<NumberBox
								value={values["grda"]}
								name="grda"
								handleChange={handleChange}
								label={t("Quantity")}
								validationErrorMessage={errors.grda}
								disabled={inputDisaple}
								required={false}
							/>
							<TableCell value={values.cse} label={"-/+"} />

							<TextBox
								value={values["nots"]}
								label={t("Note")}
								name="nots"
								handleChange={handleChange}
								required={false}
							/>
							<ItemsStorageQuantityTable
								itemId={values.item_id}
							/>
						</div>
						<div
							className="col-lg-8 col-md-8 col-sm-12"
							style={{ padding: "5px" }}
						>
							<div className="row" style={{ padding: "5px" }}>
								<div className="col">
									<button
										style={{
											height: "36px",
										}}
										className="col-12 btn btn-outline-dark btn-outline"
										onClick={ResetQuantity}
										type="button"
										disabled={Invoice > 0 ? false : true}
									>
										<span className="">
											{t("Zero the remaining quantity")}
										</span>
									</button>
								</div>
								<div className="col">
									<button
										style={{
											height: "36px",
										}}
										type="button"
										className="col-12 btn btn-outline-dark btn-outline"
									>
										<span className="">
											{t("Print Not Invented")}
										</span>
									</button>
								</div>
							</div>

							<ItemsTable
								apiMethod={all_store}
								apiPayload={store_table_object}
								colAttributes={cols}
								handleRowClicked={SelectedItem}
								height={"400"}
							/>
						</div>
					</>
				) : null}
				<div className="col-4">
					<button
						style={{
							height: "36px",
						}}
						className="col-12 btn btn-outline-dark btn-outline"
						type="submit"
						value="Submit"
					>
						<span className="">{t("Save")}</span>
					</button>
				</div>
				<div className="col-4">
					<TableCell
						value={values.ActuallyQuantity}
						label={t("Inventory")}
					/>
				</div>
			</div>
		</div>
	);
};

export default React.memo(MiscellaneousButtonBar);
