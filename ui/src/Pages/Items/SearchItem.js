import React, { useCallback, useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import { GET_SEARCH_ITEMS } from "../../Services/ApiServices/ItemsAPI";
import {
  selectCategories,
  fetchCategories,
} from "../../Store/Items/CategoriesSlice";

import {
  selectSearchKeys,
  selectVisible,
  setSearchKeys,
} from "../../Store/Items/ItemsSlice";

import List from "devextreme-react/list";
import { CheckBox, TextBox } from "devextreme-react";
import { Popup } from "devextreme-react/popup";
import debounce from "debounce";
import ScrollView from "devextreme-react/scroll-view";
import FModal from "../../Components/Items/fModal";
import ItemsTable from "./../../Components/Items/ItemsTable";
import { useTranslation } from "react-i18next";

const SearchItem = ({
  callBack,
  togglePopup,
  Title,
  allowDelete,
  onRowRemoving,
  ReturnData = false,
  visible,
}) => {
  /*** useDispatch ***/
  let dispatch = useDispatch();
  let [categoryFilter, setCategpryFilter] = useState("");
  let [toggleBtns, setToggleBtns] = useState(false);
  let [item, setItem] = useState({});
  let categories = useSelector(selectCategories);
  let searchKeys = useSelector(selectSearchKeys);

  const popupRef = useRef();
  const { t, i18n } = useTranslation();
  useEffect(async () => {
    dispatch(fetchCategories());
  }, []);

  let handleChange = useCallback(
    debounce(({ value, name }) => {
      dispatch(setSearchKeys({ [name]: value }));
    }, 700),
    []
  );

  let filterdCategories =
    categoryFilter !== ""
      ? categories.filter((e) => e.name.includes(categoryFilter))
      : [{ id: 0, name: t("All Categories") }, ...categories];

  const handleSelectType = useCallback(({ itemData }) => {
    const { id: typ_id } = itemData;
    dispatch(setSearchKeys({ typ_id }));
  }, []);

  const changeWithoutDebounce = useCallback(({ name, value }) => {
    dispatch(setSearchKeys({ [name]: value }));
  }, []);

  function ItemTemplate(data) {
    return <div className="text-center">{data.name}</div>;
  }

  const handleRowClicked = useCallback(
    ({ data }) => {
      if (data) {
        if (ReturnData) {
          callBack(data);
        } else {
          callBack(data.id);
        }
        popupRef.current.props.onHiding();
      }
    },
    [ReturnData, callBack]
  );

  const handleRowSelected = useCallback(({ selectedRowsData }) => {
    if (selectedRowsData && selectedRowsData.length > 0) {
      setItem({
        name: selectedRowsData[0].item_name,
        quantity: selectedRowsData[0].qunt,
        itemId: selectedRowsData[0].id,
      });
      setToggleBtns(true);
    }
  }, []);

  const toggleVisibility = useCallback(
    (e) => {
      if (visible) {
        togglePopup(false);
      }
    },
    [togglePopup, visible]
  );

  return (
    <Popup
      ref={popupRef}
      visible={visible}
      dragEnabled={false}
      // width={"90%"}
      onHiding={toggleVisibility}
      height={"90%"}
      closeOnOutsideClick={true}
    >
      <FModal opened={toggleBtns} id={item?.itemId} />
      <ScrollView height="100%" width="100%">
        <div className="">
          <div className="row">
            <div className="col-9">
              <div className="custom-card p-3" style={{ height: "100%" }}>
                {visible && (
                  <ItemsTable
                    // items={items}
                    allowDelete={allowDelete}
                    onRowRemoving={onRowRemoving}
                    apiPayload={searchKeys}
                    handleRowClicked={handleRowClicked}
                    handleRowSelected={handleRowSelected}
                  />
                )}

                <div className="four-in-row">
                  <TextBox
                    style={{ marginTop: "20px" }}
                    placeholder={t("Number")}
                    rtlEnabled={true}
                    value={searchKeys.ItemNumber}
                    onInput={({ event }) =>
                      handleChange({
                        name: "ItemNumber",
                        value: event.target.value,
                      })
                    }
                  />

                  <TextBox
                    style={{ marginTop: "20px" }}
                    placeholder={t("Name")}
                    rtlEnabled={true}
                    value={searchKeys.ItemName}
                    onInput={({ event }) =>
                      handleChange({
                        name: "ItemName",
                        value: event.target.value,
                      })
                    }
                  />

                  <TextBox
                    style={{ marginTop: "20px" }}
                    placeholder={t("Part Number")}
                    rtlEnabled={true}
                    value={searchKeys.code_no}
                    onInput={({ event }) =>
                      handleChange({
                        name: "code_no",
                        value: event.target.value,
                      })
                    }
                  />

                  <TextBox
                    style={{ marginTop: "20px" }}
                    placeholder={t("Categorize")}
                    rtlEnabled={true}
                    value={searchKeys.addres}
                    onInput={({ event }) =>
                      handleChange({
                        name: "addres",
                        value: event.target.value,
                      })
                    }
                  />

                  <TextBox
                    style={{ marginTop: "20px" }}
                    value={searchKeys.SerachName}
                    onInput={({ event }) =>
                      handleChange({
                        name: "SerachName",
                        value: event.target.value,
                      })
                    }
                  />
                </div>
              </div>
            </div>

            <div className="col-3">
              <div className="side-menu custom-card">
                <div className="side-menu__label">{t("Categorize")}</div>
                <List
                  dataSource={filterdCategories}
                  itemRender={ItemTemplate}
                  onItemClick={handleSelectType}
                  height="50vh"
                  selectedItems={[
                    filterdCategories.find((e) => e.id == searchKeys.typ_id),
                  ]}
                  selectionMode="single"
                />
              </div>

              <TextBox
                style={{ marginTop: "20px" }}
                placeholder={t("Categorize")}
                rtlEnabled={true}
                onInput={({ event }) => setCategpryFilter(event.target.value)}
              />

              <div className="my-2 d-flex">
                <CheckBox
                  value={searchKeys.qunt == 1 ? true : false}
                  onValueChanged={({ value }) =>
                    changeWithoutDebounce({ name: "qunt", value })
                  }
                />
                <div className="mx-2">{t("show quantity (0)")}</div>
              </div>

              <div className="d-flex">
                <CheckBox
                  value={false}
                  onValueChanged={({ value }) =>
                    handleChange({ name: "Subject_to_validity", value })
                  }
                />
                <div className="mx-2">
                  {t("Enlarge the image in the search")}
                </div>
              </div>
            </div>
          </div>
        </div>
      </ScrollView>
    </Popup>
  );
};

export default React.memo(SearchItem);
