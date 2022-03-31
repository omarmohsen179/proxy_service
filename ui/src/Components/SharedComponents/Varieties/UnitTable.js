// import React from 'react';

// import DataGrid, {
//     Column,
//     Editing,
//     Lookup,
//     Texts,
//     RequiredRule,
// } from 'devextreme-react/data-grid';

// let rows = [
//     { caption: 'العبوه', dataField: 'box' },
//     { caption: 'سعر قطاعي', dataField: 'price1' },
//     { caption: 'سعر الجمله', dataField: 'p_gmla1' },
//     { caption: 'جمله الجمله', dataField: 'p_gmla2' },
// ];
// const UnitTable = ({ items = [], save, options = [] }) => {

//     let handleSave = () => {
//         save('Items_Box', items)
//     }

//     return (
//         <DataGrid
//             dataSource={items}
//             hoverStateEnabled={true}
//             onRowUpdated={({ data }) => console.log(data)}
//             onRowInserted={({ data }) => console.log(data)}
//             onRowRemoved={() => handleSave()}

//         >
//             <Editing
//                 mode="row"
//                 allowUpdating={true}
//                 allowDeleting={true}
//                 allowAdding={true}
//                 useIcons={true}
//             >
//                 <Texts
//                     addRow="إضافة جديد"
//                     editRow="تعديل"
//                     saveRowChanges="حفظ"
//                     cancelRowChanges="إلغاء"
//                     deleteRow="حذف"
//                     confirmDeleteMessage="هل انت متأكد من حذف هذا الاختيار ؟"
//                 />
//             </Editing>
//             <Column dataField="parcodee" dataType="number" caption='رقم القطعه'
//             // cellRender={<div>hello</div>}
//             >
//                 <RequiredRule message={'هذا الحقل مطلوب'} />
//             </Column>
//             {/* <Column dataField="unit_id" dataType="" caption='الوحده'>
//                 <RequiredRule message={'هذا الحقل مطلوب'} />
//                 <Lookup dataSource={options} displayExpr="description" valueExpr="id" />
//             </Column> */}
//             {
//                 rows.map(e => {
//                     return (
//                         <Column dataField={e.dataField} dataType="number" caption={e.caption}>
//                             <RequiredRule message={'هذا الحقل مطلوب'} />
//                         </Column>
//                     )
//                 })
//             }
//         </DataGrid >
//     );
// };

// export default React.memo(UnitTable);

import React, { useState } from "react";
import { NumberBox, SelectBox } from "devextreme-react";
import { Validator, RequiredRule } from "devextreme-react/validator";
import notify from "devextreme/ui/notify";
import CellError from "../SharedComponents/CellError";
import { Button } from "devextreme-react/button";
import useForm from "./../../Services/useForm";
import { useDispatch } from "react-redux";
import { editMainUnit } from "../../Store/itemsLookups";

const Items_Box = ({ items = [], save, options = [], remove }) => {
	let dispatch = useDispatch();
	let columns = [
		"رقم القطعه",
		"الوحده",
		"العبوه",
		"سعر قطاعي",
		"سعر الجمله",
		"جمله الجمله",
		"",
	];

	const tdMapper = (obj) => {
		for (const key in obj) {
			console.log(obj[key]);
			return <td>{obj[key]}</td>;
		}
	};
	let [intialValues, setIntialValues] = useState({});

	let addItem = (value) => {
		if (Object.keys(values).length < 6) return;
		save({ name: "Items_Box", value });
		setIntialValues({});
	};

	let { values, handleChange, handleSubmit } = useForm(addItem, intialValues);
	let names = ["box", "price1", "p_gmla1", "p_gmla2"];

	let handleDelete = (value) => {
		remove({ name: "Items_Box", value });
	};

	let getSelectedLabel = (id) => options.find((e) => e.id == id).name;

	return (
		<>
			<table class="table table-bordered">
				<thead>
					<tr>
						{columns.map((c) => (
							<td scope="col">{c}</td>
						))}
					</tr>
				</thead>
				<tbody>
					{items.map((item, i) => {
						return (
							<tr key={i}>
								<td scope="col" className={item.error && `cell-error`}>
									<div className="center">
										{item["parcodee"]}
										{item.error && (
											<CellError message="هذا الرقم موجود مسبقا" />
										)}
									</div>
								</td>
								<td scope="col">{getSelectedLabel(item["unit_id"])}</td>
								<td scope="col">{item["box"]}</td>
								<td scope="col">{item["price1"]}</td>
								<td scope="col">{item["p_gmla1"]}</td>
								<td scope="col">{item["p_gmla2"]}</td>
								<td className="center">
									<span
										style={{ color: "red" }}
										onClick={() => handleDelete(item)}
									>
										<i class="fas fa-times"></i>
									</span>
								</td>
							</tr>
						);
					})}
					<tr>
						<td style={{ padding: 0 }}>
							<NumberBox
								style={{ border: "none" }}
								value={values["parcodee"]}
								min={0}
								onInput={({ event }) =>
									handleChange({ name: "parcodee", value: event.target.value })
								}
							>
								{/* <Validator>
                                    <RequiredRule message="هذا الحقل مطلوب" />
                                </Validator> */}
							</NumberBox>
						</td>
						<td style={{ padding: 0 }}>
							<SelectBox
								style={{ border: "none" }}
								dataSource={options}
								displayExpr="name"
								valueExpr="id"
								value={values["unit_id"]}
								rtlEnabled={true}
								onValueChange={(selectedItem) => {
									let previous = values["unit_id"];
									dispatch(editMainUnit({ previous, value: selectedItem }));
									handleChange({ name: "unit_id", value: selectedItem });
								}}
								searchEnabled={true}
							>
								{/* <Validator>
                                    <RequiredRule message="هذا الحقل مطلوب" />
                                </Validator> */}
							</SelectBox>
						</td>

						{names.map((name) => {
							return (
								<td style={{ padding: 0 }}>
									<NumberBox
										style={{ border: "none" }}
										min={0}
										value={values[name]}
										onInput={({ event }) =>
											handleChange({ name, value: event.target.value })
										}
									>
										{/* <Validator>
                                                <RequiredRule message="هذا الحقل مطلوب" />
                                            </Validator> */}
									</NumberBox>
								</td>
							);
						})}
						<td className="center">
							<span style={{ color: "green" }} onClick={handleSubmit}>
								<i className="fas fa-save"></i>
							</span>
						</td>
					</tr>
				</tbody>
			</table>
		</>
	);
};

export default Items_Box;
