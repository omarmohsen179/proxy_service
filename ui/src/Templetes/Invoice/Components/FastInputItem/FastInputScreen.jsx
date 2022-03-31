import React, { useState, useEffect, useCallback } from "react";
import List from "devextreme-react/list";
import Pagination from "../../../../Components/SharedComponents/Pagination/Pagination";
import { GET_FAST_ITEMS } from "./API.FastInputScreen";
import "./fastInputs.css";
import { GET_MAIN_CATEGORIES } from "../../../../Services/ApiServices/ItemsAPI";
import { useTranslation } from "react-i18next";

const FastInputScreen = ({ itemClickedHandle }) => {
	const [categories, setCategories] = useState([]);
	const [selectedCategoryId, setSelectedCategoryId] = useState(0);
	const [data, setData] = useState([]);
	const [pageCount, setPageCount] = useState(0);
	const { t, i18n } = useTranslation();
	useEffect(() => {
		GET_MAIN_CATEGORIES().then(({ MainCategory }) => {
			MainCategory &&
				setCategories([
					{ id: 0, name: t("All Categories") },
					...MainCategory,
				]);
		});
	}, []);

	useEffect(() => {
		getItemsData({ selected: 0 });
	}, [selectedCategoryId]);

	const getItemsData = useCallback(
		({ selected }) => {
			GET_FAST_ITEMS({
				skip: selected * 8,
				take: 8,
				CategotyID: selectedCategoryId,
			}).then(({ totalcount, data }) => {
				setData(data);
				setPageCount(totalcount / 8);
			});
		},
		[selectedCategoryId]
	);

	const handleSelectedCategory = useCallback(({ itemData }) => {
		setSelectedCategoryId(itemData.id);
	}, []);

	const itemTemplate = useCallback((data) => {
		return <div className="text-center">{data.name}</div>;
	}, []);

	return (
		<>
			<div className="py-2 row ">
				<div
					className="side-menu row col-3 mx-2"
					style={{ height: "270px" }}
				>
					{/* <div className="side-menu__label">{t("Categorize")}</div> */}
					<List
						dataSource={categories}
						itemRender={itemTemplate}
						onItemClick={handleSelectedCategory}
						keyExpr="id"
						selectedItemKeys={[selectedCategoryId]}
						selectionMode="single"
					/>
				</div>
				<div className="row col-9 ">
					{data.length > 0 ? (
						<>
							{data.map((item) => {
								return (
									<div
										onClick={() =>
											itemClickedHandle(item.item_no)
										}
										className="alert alert-secondary m-0 col-3 d-flex justify-content-center align-items-center itemBox"
									>
										<strong>{item.item_name}</strong>
									</div>
								);
							})}
							<Pagination
								pageCount={pageCount}
								onPageChange={getItemsData}
							/>
						</>
					) : (
						<div className="d-flex align-items-center justify-content-center">
							<h1 className="text-info">
								<strong>{t("There are no items")}</strong>
							</h1>
						</div>
					)}
				</div>
			</div>
		</>
	);
};

export default React.memo(FastInputScreen);
