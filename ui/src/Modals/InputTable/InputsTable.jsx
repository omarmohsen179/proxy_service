import React, { useState } from "react";
import { Popup } from "devextreme-react/popup";
import ScrollView from "devextreme-react/scroll-view";
import { GET_INVOICE_DISCOUNT, DELETE } from "./APi";
import AdvancedTable from "../../Components/SharedComponents/Tables Components/AdvancedTable";
import notify from "devextreme/ui/notify";
import InputTableEdit from "../../Components/SharedComponents/Tables Components/InputTableEdit";
export default function InputTable({
	visible = true,
	togglePopup,
	allowDelete = true,
	onclickRow,
}) {
	let [dataobject, setdataobject] = useState({
		FilterQuery: "",
	});

	let Get_invoice = async ({ obj, skip, take }) => {
		let returnObj = {};
		obj.skip = skip;
		obj.take = take;
		await GET_INVOICE_DISCOUNT(obj)
			.then((res) => {
				console.log(res.data);
				returnObj = {
					data: res.data.map((R) => {
						let r = {
							e_no: R.Invoice.e_no,
							e_date: R.Invoice.e_date,
							"cust~name": R.Invoice["cust~name"],
						};
						delete R.Invoice.Account;
						r.Invoice = R.Invoice;
						r.Account = R.Account;

						return r;
					}),
					totalCount: res.totalCount ? res.totalCount : 0,
				};
			})
			.catch((err) => {
				console.log(err);
				returnObj = {
					data: [],
					totalCount: 0,
				};
			});
		return returnObj;
	};

	async function ondelete(e) {
		await DELETE(e.key.ID)
			.then((res) => {
				notify(
					{ message: "تم الحذف بنجاح", width: 600 },
					"success",
					3000
				);
			})
			.catch((err) => {
				notify(
					{ message: "لا يمكنك مسح هذا العنصر", width: 450 },
					"error",
					2000
				);
			});
	}
	let QueryFilter = (query) => {
		let QueryF = dataobject;
		QueryF["FilterQuery"] = query;
		setdataobject(QueryF);
	};
	return (
		<div>
			<Popup
				dir="rtl"
				maxWidth={1000}
				title="تعديل"
				minWidth={150}
				minHeight={500}
				showTitle={true}
				dragEnabled={false}
				closeOnOutsideClick={true}
				visible={visible}
				onHiding={togglePopup}
			>
				<ScrollView height="100%" scrollByContent={true}>
					<InputTableEdit
						Uicon
						height="450px"
						allowDelete={allowDelete}
						style={{ width: "80%" }}
						onRowDoubleClick={(e) => {
							onclickRow(e.data);
						}}
						colAttributes={[
							{
								caption: "رقم الفاتورة",
								captionEn: "Invoice Number",
								field: "e_no",
								readOnly: true,
								dataType: "number",
							},
							{
								caption: "التأريخ ",
								captionEn: "History",
								field: "e_date",
								readOnly: true,
								dataType: "date",
							},
							{
								caption: "الذبون",
								captionEn: "Customer",
								field: "cust~name",
								readOnly: true,
							},
						]}
						onRowRemoving={(e) => {
							ondelete(e);
						}}
						remoteOperations
						apiMethod={Get_invoice}
						apiPayload={{ obj: dataobject }}
						optionChanged={QueryFilter}
					/>
				</ScrollView>
			</Popup>
		</div>
	);
}
