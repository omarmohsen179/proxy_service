import { useState, useEffect } from "react";
import axios from "axios";

const useForm = (callBack, intialValues = {}) => {
	let [values, setValues] = useState(intialValues);
	let [apiValues, setApiValues] = useState(intialValues);

	// console.log('useForm');

	useEffect(() => {
		setValues(intialValues);
	}, [intialValues]);

	let handleChange = ({ name, value }) => {
		setValues((values) => ({ ...values, [name]: value }));
		setApiValues((values) => ({ ...values, [name]: value }));
	};

	let editList = (arr, value, key) => {
		let index = arr.findIndex((e) => e[key] === value[key]);
		arr[index] = value;
		return arr;
	};

	let deleteList = (arr, value, key) => {
		let index = arr.findIndex((e) => e[key] === value[key]);
		arr.splice(index, 1);
		return arr;
	};

	let handleChangeList = ({ name, value }) => {
		let key = value.key ? "key" : "id";
		if (value[key]) {
			let valuesArr = editList(values[name], value, key);
			let apiValuesArr = editList(apiValues[name], value, key);
			editList(apiValues[name], name, value);
			setValues((values) => ({ ...values, [name]: valuesArr }));
			setApiValues((values) => ({ ...values, [name]: apiValuesArr }));
		} else {
			setValues((values) => ({
				...values,
				[name]: [...values[name], { ...value, key: Math.random() }],
			}));
			setApiValues((values) => ({
				...values,
				[name]: [...values[name], { ...value, key: Math.random() }],
			}));
		}
	};

	let handleRemoveItem = async ({ name, value }) => {
		let key = value.key ? "key" : "id";
		if (value.id) {
			let data = await axios.post(
				`http://161.97.167.23:8089/mdfunctions/DeleteItem_s2/${value.id}`,
				{
					Token: "7kgPjPiphKa6HiKh1Ct2Xbf6OZ3OnNInUU2BMIpNEYI=",
					Read_id: "0",
				}
			);
			console.log(data);
		}
		let valuesArr = deleteList(values[name], value, key);
		let apiValuesArr = deleteList(apiValues[name], value, key);
		setValues((values) => ({ ...values, [name]: valuesArr }));
		setApiValues((values) => ({ ...values, [name]: apiValuesArr }));
	};

	let handleSubmit = (e) => {
		e.preventDefault();
		callBack(apiValues);
	};

	return {
		handleChange,
		handleSubmit,
		handleChangeList,
		handleRemoveItem,
		values,
	};
};

export default useForm;
