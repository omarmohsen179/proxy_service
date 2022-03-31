import React, { useState, memo } from "react";
import { NumberBox } from "devextreme-react";
import notify from "devextreme/ui/notify";
import CellError from "../../Components/SharedComponents/CellError";
import { CHECK_ITEM_DATA } from "../../Services/ApiServices/ItemsAPI";
import { useTranslation } from "react-i18next";

const ItemNumber = ({ items, save, remove }) => {
  let [item, setItem] = useState({ parcode_s: "" });
  const { t, i18n } = useTranslation();
  let handleAddItem = async () => {
    if (item) {
      let isExisted = true;
      let inList = items.find((e) => e.parcode_s === item);
      if (!inList) {
        let { Check: notReservedInApi } = await CHECK_ITEM_DATA({
          Table: "Items_s2",
          ID: 0,
          CheckData: { parcode_s: item.parcode_s },
        });
        isExisted = !notReservedInApi;
      }
      if (!isExisted) {
        save({ name: "Items_s2", value: item });
        setItem({ parcode_s: "" });
      } else {
        notify(
          { message: t("This Item already exists"), width: 600 },
          "error",
          300
        );
      }
    }
  };

  let handleEdit = (item) => {
    setItem(item);
  };

  let removeItem = (item) => {
    remove({ name: "Items_s2", value: item, table: "DeleteItem_s2" });
  };

  return (
    <div className="custom-card">
      <div className="side-menu__label">{t("Item Number")}</div>
      <div className="side-menu__body">
        <ul className="list-group list-group-flush ">
          {items.map((item, i) => {
            return (
              <li
                key={i}
                className={
                  item.error
                    ? `list-group-item try cell-error`
                    : `list-group-item `
                }
              >
                <div className="center">
                  <div>
                    {item.error && (
                      <CellError message={t("This Item already exists")} />
                    )}
                    {item.parcode_s}
                  </div>
                  <div>
                    <button
                      className="btn btn-sm"
                      style={{ borderRadius: "50%", color: "#2d6da3" }}
                      onClick={() => handleEdit(item)}
                    >
                      <i className="fas fa-pencil-alt"></i>
                    </button>
                    <button
                      className="btn error btn-sm "
                      style={{ borderRadius: "50%" }}
                      onClick={() => removeItem(item)}
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
      <div className="side-menu__input ">
        <NumberBox
          value={item.parcode_s}
          onEnterKey={handleAddItem}
          onValueChange={(e) => setItem((prev) => ({ ...prev, parcode_s: e }))}
        />
      </div>
    </div>
  );
};

export default memo(ItemNumber);
