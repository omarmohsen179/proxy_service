import React, {
	useState,
	useEffect,
	useCallback,
	useMemo,
	useRef,
} from "react";
import { useTranslation } from "react-i18next";
import BillHeader from "../../../Components/SharedComponents/BillHeader";
import ButtonsRow from "../../../Components/SharedComponents/buttonsRow";
import "./moneyTypes.css";

import * as Inputs from "../../../Components/Inputs";
import CurrencyFileTable from "./Components/CurrencyFileTable";
import {
	DELETE_MONEY_TYPE,
	GET_MAX_NUMBER,
	GET_MONEY_TYPES,
	UPDATE_MONEY_TYPES,
} from "./Components/MoneyTypes";
import notify from "devextreme/ui/notify";
import _ from "lodash";

let { TextBox, NumberBox, CheckBox } = Inputs;

const MoneyTypes = () => {
	let initialValue = useRef({
		number: 0,
		description: "",
		code: "",
		id: 0,
		year_id: 0,
		nationall: 0,
		decim: "",
		numericc: 0,
		takseem: 0,
		p_tkl: 0,
		Ex_Rate: "1",
	});

	const { t, i18n } = useTranslation();
	const [error, setError] = useState([]);
	const [data, setData] = useState(initialValue.current);

	const handleChange = useCallback((e) => {
		setData((prevBill) => ({ ...prevBill, [e.name]: e.value }));
	}, []);

	const [dataSource, setDataSource] = useState([]);
	const [maxNumber, setMaxNumber] = useState("");

	useEffect(() => {
		async function getInitData() {
			let data = await GET_MONEY_TYPES();
			setDataSource(data);
		}
		getInitData();
	}, []);

	const updateMaxNumber = async () => {
		await GET_MAX_NUMBER()
			.then((response) => {
				if (response.NextNumber) {
					setMaxNumber(response.NextNumber);
				}
			})
			.catch((error) => {
				console.log(error);
				notify(
					{
						message: `Error ${error}`,
						width: 450,
					},
					"error",
					2000
				);
			});
	};

	const onInitNewRow = (e) => {
		e.data = { ...e.data, number: maxNumber, takseem: 1 };
	};

	const onInserting = async (e) => {
		e.cancel = true;
		if (e.data) {
			e.data.takseem = e.data.takseem ? 1 : 0;
			let data = {
				Data: [{ ...e.data }],
			};

			await UPDATE_MONEY_TYPES(data)
				.then(async (result) => {
					// Adding new item
					e.data.id = result;
					setDataSource((prev) => [...prev, { ...e.data }]);

					// Stop Editing
					// await e.component.saveEditData();
					await e.component.cancelEditData();
					await e.component.refresh(true);

					// Notify User
					notify(
						{
							message: `Added Successfully`,
							width: 450,
						},
						"success",
						2000
					);
				})
				.catch(async (error) => {
					console.log(error);
					await e.component.refresh(true);
					e.component.cancelEditData();
					notify(
						{
							message: `${error}`,
							width: 450,
						},
						"error",
						2000
					);
				});
		}
	};

	const onUpdating = async (e) => {
		e.cancel = true;
		if (e.newData) {
			if (e.newData.takseem) {
				e.newData.takseem = e.newData.takseem ? 1 : 0;
			}

			let data = {
				Data: [{ ...e.oldData, ...e.newData }],
			};

			await UPDATE_MONEY_TYPES(data)
				.then(async () => {
					// Update Data in our state
					let updatedData = dataSource;
					let index = updatedData.indexOf(e.oldData);
					if (~index) {
						updatedData[index] = {
							...e.oldData,
							...e.newData,
						};
					}
					setDataSource(updatedData);

					// Stop Editing
					await e.component.refresh(true);
					await e.component.cancelEditData();

					// Notify user
					notify(
						{
							message: `Updated Successfully`,
							width: 450,
						},
						"success",
						2000
					);
				})
				.catch(async (error) => {
					console.log(error);
					await e.component.refresh(true);
					e.component.cancelEditData();
					notify(
						{
							message: `${error}`,
							width: 450,
						},
						"error",
						2000
					);
				});
		}
	};

	const OnRemoving = async (e) => {
		e.cancel = true;

		if (e.data) {
			await DELETE_MONEY_TYPE(e.data.id)
				.then(async (result) => {
					// // Adding new item
					// let updatedSelectedMainLookup = selectedMainLookup;

					_.remove(dataSource, (element) => {
						return element.id === e.data.id;
					});

					// setSelectedMainLookup(selectedMainLookup);

					// Stop Editing
					await e.component.saveEditData();
					await e.component.cancelEditData();
					await e.component.refresh(true);

					// Notify User
					notify(
						{
							message: `Deleted Successfully`,
							width: 450,
						},
						"success",
						2000
					);
				})
				.catch(async (error) => {
					console.log(error);
					await e.component.refresh(true);
					e.component.cancelEditData();
					notify(
						{
							message: `${error}`,
							width: 450,
						},
						"error",
						2000
					);
				});
		}
		console.log(e);
	};

	return (
		<>
			<div className="container">
				<BillHeader billTitle={t("Currency File")} />
				<div
					dir="auto"
					className="mt-2 card  p-4 money__types__wrapper"
					style={{ minHeight: "100px" }}
				>
					<CurrencyFileTable
						dataSource={dataSource}
						onRowInserting={(e) => onInserting(e)}
						onRowRemoving={(e) => OnRemoving(e)}
						onRowUpdating={(e) => onUpdating(e)}
						onInitNewRow={(e) => onInitNewRow(e)}
						onInsertButtonClicked={updateMaxNumber}
					/>
				</div>
			</div>
		</>
	);
};

export default MoneyTypes;
