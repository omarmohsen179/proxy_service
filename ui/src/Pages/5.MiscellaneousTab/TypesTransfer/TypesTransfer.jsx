// react
import React, {
	useState,
	useEffect,
	useCallback,
	useMemo,
	useRef,
} from "react";

// Components
import {
	TextBox,
	SelectBox,
	DateBox,
	NumberBox,
} from "../../../Components/Inputs";
import MasterTable from "../../../Components/SharedComponents/Tables Components/MasterTable";
import ButtonsRow from "../../../Components/SharedComponents/buttonsRow";
import { ItemsStorageQuantityTable } from "../../../Components/SharedComponents/Tables Components/ItemsStorageQuantityTable/ItemsStorageQuantityTable";
import SearchItem from "../../../Pages/Items/SearchItem";
import EditDeleteInfiniteLoad from "../../../Components/SharedComponents/EditDeleteInfiniteLoad";

// DevExpress
import { Button } from "devextreme-react/button";
import notify from "devextreme/ui/notify";
import { Popup } from "devextreme-react/popup";
import ScrollView from "devextreme-react/scroll-view";
import { confirm } from "devextreme/ui/dialog";

// API
import {
	// Next Number
	GET_NEXT_NUMBER,
	// From Storage من مخزن
	GET_FROM_TO_STORAGE,
	// Getting Edit and delete data
	GET_EDIT_DELETE_DATA,
	// Delete API to be sent to button row
	DELETE_TRANSACTION,
	//  Get data of table by id after getting this id from edit delete table
	GET_EDIT_DATA_TABLE_SOURCE,
	// Submit data API
	SUBMIT_DATA,
	DELETE_TRANSACTION_ITEM,
} from "./API.TypesTransfer";
// API to get info of the selected item when selecting any item from
import { GET_ITEM_INFO } from "../../../Templetes/Invoice/Components/ItemInformation/API.ItemInformation";

// Redux
import { useDispatch, useSelector } from "react-redux";
import { selectVisible, setVisible } from "../../../Store/Items/ItemsSlice";
import { setSearchKeys } from "../../../Store/Items/ItemsSlice";
import { useTranslation } from "react-i18next";

function TypesTransfer() {
	// ============================================================================================================================
	// ================================================= Lists ====================================================================
	// ============================================================================================================================
	const { t, i18n } = useTranslation();
	let visible = useSelector(selectVisible);
	// Column names of the table of the page
	let mainTableColumnAttributes = useMemo(() => {
		return [
			{ field: "item_no", caption: "رقم الصنف", isVisable: true },
			{ field: "item_name", caption: "اسم الصنف", isVisable: true },
			{ field: "Exp_date", caption: "الصلاحية", isVisable: true },
			{ field: "sum_box", caption: "العبوة", isVisable: true },
			{ field: "kmea", caption: "الكمية", isVisable: true },
		];
	}, []);

	// values of the selectBox under table
	const othersSelectBoxList = useMemo(() => {
		return [
			{
				id: 1,
				name: "إيميل",
				icon: "fas fa-envelope-open-text",
			},
			{
				id: 2,
				name: "رسالة نصية",
				icon: "fas fa-sms",
			},
			{
				id: 3,
				name: "توثيق",
				icon: "far fa-save",
			},
		];
	}, []);

	// Initial data of inputs of the page

	const initialData = useRef({
		ID: 0,
		Invoice: {
			e_no: 0,
			nots: "",
			e_date: Date.now(),
			FromStore: "",
			ToStore: "",
			mak1: 1,
			mak2: 2,
		},
		InvoiceItems: [
			{
				ExpiredDates: [],
				Boxs: [],
				m_no1: "", // مخزن 1
				m_no2: "", // مخزن 2
				item_id: "", // الصنف
				kmea: 1, // الكمية
				unit_id: "", // الوحدات
				locate: "",
				sum_box: 1, // كميه العبوات
				Exp_date: new Date(2050, 0, 0), // الصلاحية
				box_id: "",
				selectBoxValue: "",
				ActuallyQuantity: 1,
			},
		],
	});

	// Column Attributes of the edit delete table
	let editDeleteTableColumnAttributes = useMemo(() => {
		return [
			{
				field: "e_no",
				captionEn: "Number",
				caption: "الرقم",
				isVisable: true,
			},
			{
				field: "e_date",
				captionEn: "Date",
				caption: "التاريخ",
				isVisable: true,
			},
			{
				field: "nots",
				captionEn: "Note",
				caption: "ملاحظات",
				isVisable: true,
			},
		];
	}, []);

	// ============================================================================================================================
	// ================================================= States ===================================================================
	// ============================================================================================================================

	let dispatch = useDispatch();

	// ============================================================================================================================
	// ================================================= States ===================================================================
	// ============================================================================================================================
	// Page inputs data object
	const [data, setData] = useState(initialData.current);
	// From to lists data من مخزن إلى مخزن
	const [fromStorageList, setFromStorageList] = useState();
	const [toStorageList, setToStorageList] = useState();

	// Check if we pressed edit or delete buttons and pass this to popups
	const [editDeleteStatus, setEditDeleteStatus] = useState("");

	// Handle close and openn delete and edit popups
	const [editDelete, setEditDelete] = useState(false);
	// Main table data source
	const [tableDataSource, setTableDataSource] = useState([]);
	// prop to deifne if inputs is diabled or not and the become disabled in edit stage
	// if we selected item in edit pop up
	const [isReadOnly, setIsReadOnly] = useState(false);

	// Error Object
	const [errors, setErrors] = useState([]);

	const [invoiceId, setInvoiceId] = useState();

	// ============================================================================================================================
	// ================================================= Effects ==================================================================
	// ============================================================================================================================

	// Initial state
	useEffect(async () => {
		// getting next number and setting it to رقم الفاتورة
		await handleNextNumber();
	}, []);

	// This effect changes data source of "from to" storages on each other selections من مخزن إلى مخزن
	useEffect(() => {
		// API of from storage
		GET_FROM_TO_STORAGE(data.Invoice.mak2)
			.then((res) => setFromStorageList(res))
			.catch((err) => console.log(err));
		// API of to storage
		GET_FROM_TO_STORAGE(data.Invoice.mak1)
			.then((res) => setToStorageList(res))
			.catch((err) => console.log(err));
	}, [data.Invoice.mak1, data.Invoice.mak2]);

	// handler of العبوة to chnage value of العبوة with respect to الكمية and الوحدات
	useEffect(() => {
		if (data.InvoiceItems[0].kmea) {
			// console.log(data.InvoiceItems[0].Boxs);
			setData((prevState) => ({
				...prevState,
				InvoiceItems: [
					{
						...prevState.InvoiceItems[0],

						sum_box:
							parseFloat(data.InvoiceItems[0].kmea) *
							parseFloat(
								data.InvoiceItems[0].Boxs.filter(
									(element) =>
										element.id_s ==
										prevState.InvoiceItems[0].selectBoxValue
								)[0]?.box ?? 1
							),
					},
				],
			}));
		}
	}, [data.InvoiceItems[0].kmea]);

	useEffect(() => {
		// console.log([data.InvoiceItems[0].sum_box, selectBoxValue]);

		if (data.InvoiceItems[0].sum_box != undefined) {
			setData((prevState) => ({
				...prevState,
				InvoiceItems: [
					{
						...prevState.InvoiceItems[0],

						kmea:
							parseFloat(prevState.InvoiceItems[0].sum_box) /
							parseFloat(
								data.InvoiceItems[0].Boxs.filter(
									(element) =>
										element.id_s ==
										prevState.InvoiceItems[0].selectBoxValue
								)[0]?.box ?? 1
							),
					},
				],
			}));
		}
	}, [data.InvoiceItems[0].sum_box]);

	useEffect(() => {
		// console.log([data.InvoiceItems[0].sum_box, selectBoxValue]);

		if (data.InvoiceItems[0].selectBoxValue != undefined) {
			setData((prevState) => ({
				...prevState,
				InvoiceItems: [
					{
						...prevState.InvoiceItems[0],

						sum_box:
							parseInt(prevState.InvoiceItems[0].kmea) *
							parseInt(
								prevState.InvoiceItems[0].Boxs.filter(
									(element) =>
										element.id_s ==
										data.InvoiceItems[0].selectBoxValue
								)[0]?.box ?? 1
							),
					},
				],
			}));
		}
	}, [data.InvoiceItems[0].selectBoxValue]);

	// handler of الكمية to chnage value of الكمية with respect to العبوة and الوحدات

	// Effect to set id of the getting items when clicking on اضغط

	useEffect(() => {
		data.Invoice.mak1 &&
			dispatch(setSearchKeys({ m_no: data.Invoice.mak1 }));
	}, [data.Invoice.mak1]);
	// ============================================================================================================================
	// ================================================= handelers ================================================================
	// ============================================================================================================================

	// Calling Api to get item informations by using id or barcode
	const getItemInfo = useCallback(
		//? idType = "ItemID" || 'ItemBarcode'
		(value, idType = "ItemID") => {
			GET_ITEM_INFO(data.Invoice.mak1, value, idType)
				.then((item) => {
					console.log(item);
					setData((prevState) => ({
						...prevState,
						InvoiceItems: [
							{
								...prevState.InvoiceItems[0],
								ExpiredDates: item.ExpiredDates,
								Boxs: item.Boxs,
								sum_box:
									parseInt(item.Boxs[0].box) *
									parseInt(data.InvoiceItems[0].kmea),
								item_no: item.item_no,
								item_name: item.item_name,
								ActuallyQuantity: item.ActuallyQuantity,
								// Exp_date: new Date("1/1/2050"), // الصلاحية
								item_id: item.id,
								selectBoxValue: item.Boxs[0].id_s,
							},
						],
					}));
				})
				.catch((error) => {
					console.log(error);
					notify(
						{
							message: t("Failed Try again"),
							width: 450,
						},
						"error",
						2000
					);
				});
		},
		[data.Invoice.mak1]
	);

	// Function to send get edit data to edit delete pop up
	const apiMethod = useCallback(async (data) => {
		return GET_EDIT_DELETE_DATA(data);
	}, []);

	// Callback to fire getItemInfo on row doubleClick in searchItemPopup
	const searchItemCallBackHandle = useCallback(
		(id) => {
			getItemInfo(id, "ItemID");
		},
		[getItemInfo]
	);

	let handleEditDelete = useCallback(async (buttonType) => {
		setErrors([]);
		setEditDeleteStatus(buttonType);
		setEditDelete((prevState) => !prevState);
	}, []);

	// Holding the setState that is sent to the EditDelete popup to get data to be edited
	let handleGettingData = useCallback((data1) => {
		setIsReadOnly(true);

		setData((prevState) => ({
			...prevState,
			ID: data1.ID,
			Invoice: { ...prevState.Invoice, ...data1 },
		}));

		setInvoiceId(data1.ID);

		GET_EDIT_DATA_TABLE_SOURCE(data1.ID)
			.then((res) => {
				setTableDataSource(res);
				// console.log(res);
			})
			.catch((err) => console.log(err));
	}, []);

	// Holding the API that is sent to the EditDelete popup to make deletes
	let handleDeleteItem = useCallback((id) => {
		return DELETE_TRANSACTION(id);
	}, []);

	// Handeler to change data of upper inputs above table
	let handleInvoiceChange = ({ name, value }) => {
		setData((prevState) => ({
			...prevState,
			Invoice: {
				...prevState.Invoice,
				[name]: value,
			},
		}));
	};

	// Handeler to change data of bottom inputs under table
	let handleInvoiceItemsChange = ({ name, value }) => {
		console.log([name, value]);
		setData((prevState) => ({
			...prevState,
			InvoiceItems: [
				{
					...prevState.InvoiceItems[0],
					[name]: value,
				},
			],
		}));
	};

	let handleSubmit = async () => {
		let errArr = [];
		console.log(data.InvoiceItems[0].selectBoxValue);
		if (
			data.InvoiceItems[0].ActuallyQuantity &&
			data.InvoiceItems[0].ActuallyQuantity <= 0
		) {
			errArr.push(t("This field 'Inventory' must be greater than 0."));
		}
		if (data.InvoiceItems[0].selectBoxValue == "") {
			errArr.push(t("This field 'Units' is required"));
		}
		if (data.InvoiceItems[0].kmea <= 0) {
			errArr.push(t("This field 'Quantity' must be greater than 0."));
		}
		if (data.InvoiceItems[0].sum_box <= 0) {
			errArr.push(t("This field 'Pack' must be greater than 0"));
		}

		if (errArr.length > 0) {
			setErrors(errArr);
		} else {
			let updatedData = { ...data };
			console.log(updatedData);
			updatedData.Invoice.e_date = new Date(updatedData.Invoice.e_date);

			updatedData.InvoiceItems[0].m_no1 = data.Invoice.mak1; // مخزن 1
			updatedData.InvoiceItems[0].m_no2 = data.Invoice.mak2; // مخزن 2
			updatedData.InvoiceItems[0].locate = "";
			updatedData.InvoiceItems[0].unit_id =
				data.InvoiceItems[0].selectBoxValue; // الوحدات

			updatedData.InvoiceItems[0].box_id =
				data.InvoiceItems[0].Boxs.filter(
					(element) =>
						element.id_s == data.InvoiceItems[0].selectBoxValue
				)[0]?.box;

			if (updatedData.InvoiceItems[0].ExpiredDates.length > 0) {
				updatedData.InvoiceItems[0].Exp_date =
					data.InvoiceItems[0].Exp_date == new Date("01/01/2050")
						? new Date(
								data.InvoiceItems[0].ExpiredDates.filter(
									(element) =>
										element.id ==
										data.InvoiceItems[0].Exp_date
								)[0].Exp_date
						  )
						: new Date("01/01/2050");
			} else {
				updatedData.InvoiceItems[0].Exp_date = new Date("01/01/2050");
			}

			delete updatedData.Invoice.ID;
			delete updatedData.InvoiceItems[0].item_no;
			delete updatedData.InvoiceItems[0].item_name;
			delete updatedData.InvoiceItems[0].ActuallyQuantity;
			delete updatedData.InvoiceItems[0].Boxs;
			delete updatedData.InvoiceItems[0].ExpiredDates;

			var Data = { Data: [updatedData] };

			if (Data.Data[0].ID == 0) {
				await SUBMIT_DATA(Data)
					.then(async (res) => {
						notify(
							{ message: "تم الحفظ بنجاح", width: 600 },
							"success",
							3000
						);
						// Incase of using page as a modal in a popup in another page
						// so after submitting we need to close it
						await handleAfterEditSelection(res.id);
						setInvoiceId(res.id);
						setTableDataSource((prevState) => [
							...prevState,
							res.Item,
						]);
					})
					.catch((err) => {
						console.log(err);
						err.response.data.Errors.map((element) => {
							errArr.push(element.Error);
						});
						setErrors(errArr);
					});
			} else {
				delete Data.Data[0].Invoice;
				await SUBMIT_DATA(Data)
					.then((res) => {
						handleAfterEditSelection();
						setTableDataSource((prevState) => [
							...prevState,
							res.Item,
						]);
						notify(
							{ message: t("Updated Successfully"), width: 600 },
							"success",
							3000
						);
						// Incase of using page as a modal in a popup in another page
						// so after submitting we need to close it
					})
					.catch((err) => {
						console.log(err.response.data.Errors);
						err.response.data.Errors.map((element) => {
							errArr.push(element.Error);
						});
						setErrors(errArr);
					});
			}
		}
	};

	// Search items toggle popup .. Of item info
	const togglePopup = useCallback(() => {
		dispatch(setVisible());
		sessionStorage.setItem("backUrl", "items");
	}, [dispatch]);

	let handleAfterEditSelection = useCallback(async (id) => {
		setErrors([]);
		id === undefined
			? setData((prevState) => ({
					...prevState,
					InvoiceItems: [{ ...initialData.current.InvoiceItems[0] }],
			  }))
			: setData((prevState) => ({
					...prevState,
					ID: id,
					InvoiceItems: [{ ...initialData.current.InvoiceItems[0] }],
			  }));
		setIsReadOnly(true);
	}, []);

	//  getting next number and set it to رقم الفاتورة
	let handleNextNumber = async () => {
		await GET_NEXT_NUMBER()
			.then((res) =>
				setData((prevState) => ({
					...prevState,
					Invoice: { ...prevState.Invoice, e_no: res.NextNumber },
				}))
			)
			.catch((err) => console.log(err));
	};

	// Set title of edit delete popup whether edit تعديل or delete حذف

	let handleReset = () => {
		setErrors([]);
		setData(initialData.current);
		handleNextNumber();
		setTableDataSource([]);
		setIsReadOnly(false);
	};

	// handle delete function depending on id of row "on clicking on recycle bin icon"
	let handleDelete = useCallback(
		async (event) => {
			// console.log("EditDeleteInfiniteLoad-handleDelete");
			event.cancel = true;
			console.log(event);
			await DELETE_TRANSACTION_ITEM(invoiceId, event.data.id)
				.then((res) => {
					deletedPopUp();
					setTableDataSource(
						tableDataSource.filter(
							(element) => element.id != event.data.id
						)
					);
				})
				.catch((err) => {
					notDeletedpopUp();
				});
		},
		[invoiceId, tableDataSource]
	);

	let handleDoubleClick = useCallback(
		async (event) => {
			let result = confirm(
				t("Are you sure you want to delete this check?")
			);
			//	Deleting and closing on pressing ok
			await result.then(async (dialogResult) => {
				if (dialogResult) {
					await DELETE_TRANSACTION_ITEM(invoiceId, event.key.id)
						.then((res) => {
							deletedPopUp();
							setTableDataSource(
								tableDataSource.filter(
									(element) => element.id != event.key.id
								)
							);
						})
						.catch((err) => notDeletedpopUp());
				}
			});
		},
		[invoiceId, tableDataSource]
	);

	// helpers
	// Can delete popup
	let deletedPopUp = () => {
		notify(
			{ message: t("Deleted Successfully"), width: 600 },
			"success",
			3000
		);
	};

	// Canot delete popup

	let notDeletedpopUp = () => {
		notify({ message: t("Failed Try again"), width: 600 }, "error", 3000);
	};

	// ============================================================================================================================
	// ================================================= RETURN ===================================================================
	// ============================================================================================================================

	return (
		<div className="container w-100">
			<SearchItem
				togglePopup={togglePopup}
				callBack={searchItemCallBackHandle}
				visible={visible}
			/>
			<div
				style={{
					fontSize: "50px",
					fontWeight: "bold",
					marginTop: "50px",
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
				}}
			>
				نقل أصناف
			</div>
			{/* Two Tables */}
			<div
				style={{
					width: "100%",
					display: "flex",
					justifyContent: "space-between",
					flexWrap: "wrap",
				}}
			>
				{/* Left Side */}
				<div style={{ width: "68%" }}>
					{/* Inputs */}
					{/* firt inputs row */}
					<div className="double">
						<TextBox
							label={t("Invoice Number")}
							value={data["e_no"]}
							name="e_no"
							value={data.Invoice["e_no"]}
							required={false}
							handleChange={handleInvoiceChange}
							readOnly={isReadOnly}
						/>
						<DateBox
							label={t("Invoice Date")}
							name="e_date"
							value={data.Invoice["e_date"]}
							handleChange={handleInvoiceChange}
							readOnly={isReadOnly}
						/>
					</div>
					<div dir="rtl">
						<TextBox
							label={t("Note")}
							value={data.Invoice["nots"]}
							name="nots"
							required={false}
							handleChange={handleInvoiceChange}
							readOnly={isReadOnly}
						/>
					</div>
					{/* second inputs row */}
					<div className="double ">
						<SelectBox
							label={t("From Store")}
							dataSource={fromStorageList}
							value={data.Invoice["mak1"]}
							name="mak1"
							handleChange={handleInvoiceChange}
							required={false}
							readOnly={isReadOnly}
						/>
						<SelectBox
							label={t("To Store")}
							dataSource={toStorageList}
							value={data.Invoice["mak2"]}
							name="mak2"
							handleChange={handleInvoiceChange}
							required={false}
							readOnly={isReadOnly}
						/>
					</div>

					{/* Main Table */}
					<div>
						<MasterTable
							allowDelete={true}
							dataSource={tableDataSource}
							filterRow
							onRowRemoving={handleDelete}
							onRowDoubleClick={handleDoubleClick}
							colAttributes={mainTableColumnAttributes}
						/>
					</div>

					{/* Bottom Inputs */}
					{/* First Row*/}
					<div className="double mt-3">
						<div className="triple">
							<Button
								text={t("Choose a category")}
								height="36px"
								width="100px"
								stylingMode="contained"
								type="default"
								onClick={togglePopup}
							/>

							<TextBox
								name="item_no"
								value={data.InvoiceItems[0]["item_no"]}
								required={false}
								handleChange={handleInvoiceItemsChange}
							/>

							<TextBox
								name="item_name"
								value={data.InvoiceItems[0]["item_name"]}
								required={false}
								handleChange={handleInvoiceItemsChange}
							/>
						</div>

						<SelectBox
							label={t("Units")}
							dataSource={data.InvoiceItems[0]["Boxs"]}
							name="selectBoxValue"
							keys={{ id: "id_s", name: "description" }}
							value={data.InvoiceItems[0].selectBoxValue}
							handleChange={handleInvoiceItemsChange}
						/>
					</div>
					<div className="double ">
						<NumberBox
							label={t("Package")}
							placeholder={t("Package")}
							name="sum_box"
							value={data.InvoiceItems[0]["sum_box"]}
							handleChange={handleInvoiceItemsChange}
						/>
						<NumberBox
							label={t("Quantity")}
							placeholder={t("Quantity")}
							value={data.InvoiceItems[0]["kmea"]}
							name="kmea"
							handleChange={handleInvoiceItemsChange}
						/>
					</div>

					<div className="double mt-3 mb-3">
						{data.InvoiceItems[0].ExpiredDates?.length > 0 ? (
							<SelectBox
								label={t("Choose Date")}
								dataSource={data.InvoiceItems[0].ExpiredDates}
								handleChange={handleInvoiceItemsChange}
								keys={{ id: "id", name: "Exp_date" }}
								name="Exp_date"
								value={
									data.InvoiceItems[0]["Exp_date"] instanceof
									Date
										? data.InvoiceItems[0].ExpiredDates[0]
												.id
										: data.InvoiceItems[0]["Exp_date"]
								}
							/>
						) : (
							<div
								style={{
									fontSize: "20px",
									fontWeight: "bold",
									textAlign: "center",
								}}
							>
								{t("Without an expiration date")}
							</div>
						)}

						<NumberBox
							label={t("Inventory")}
							name="ActuallyQuantity"
							value={data.InvoiceItems[0]["ActuallyQuantity"]}
							required={false}
							handleChange={handleInvoiceItemsChange}
						/>
					</div>

					<div className="error mb-3" dir="rtl">
						{errors && errors.map((element) => <li>{element}</li>)}
					</div>

					<div className="double">
						<Button
							icon="plus"
							text={t("Add")}
							width="100%"
							className="fs-6"
							stylingMode="contained"
							type="default"
							onClick={handleSubmit}
						/>

						<div>
							<ButtonsRow
								onDelete={handleEditDelete}
								onEdit={handleEditDelete}
								onNew={handleReset}
								isExit={false}
								isSimilar={false}
								isSubmit={false}
								isBack={false}
							/>
						</div>
					</div>
				</div>

				{/* Right Side */}
				<div style={{ width: "28%" }}>
					{/* Title */}
					<div
						style={{
							fontSize: "25px",
							fontWeight: "bold",
							marginTop: "5px",
							marginBottom: "50px",
							display: "flex",
							justifyContent: "center",
							alignItems: "center",
						}}
					>
						{t("Quantity distribution in stock")}
					</div>

					<ItemsStorageQuantityTable
						itemId={data.InvoiceItems[0].item_id}
					/>
				</div>
			</div>
			{/* Button Row */}

			{/* <div className="double" style={{ width: "68%" }}>
        <div className="double">
          <div dir="rtl" style={{ height: "42px" }}>
            <SelectBox label="أخرى" dataSource={othersSelectBoxList} />
          </div>
          <Button text="طباعة" height="40px" width="100px" />
        </div> */}

			{/* </div> */}

			<Popup
				maxWidth={"50%"}
				minWidth={250}
				minHeight={"40%"}
				closeOnOutsideClick={true}
				visible={editDelete}
				onHiding={handleEditDelete}
				title={editDeleteStatus == "edit" ? t("Edit") : t("Delete")}
			>
				<ScrollView>
					{/* Edit and delete Modal  */}
					<EditDeleteInfiniteLoad
						TABLE_DATA_API={apiMethod}
						columnAttributes={editDeleteTableColumnAttributes}
						deleteItem={handleDeleteItem}
						remoteOperationsObject={true}
						close={handleEditDelete}
						editDeleteStatus={editDeleteStatus}
						getEditData={handleGettingData}
					/>
				</ScrollView>
			</Popup>
		</div>
	);
}

export default TypesTransfer;
