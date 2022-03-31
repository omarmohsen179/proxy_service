import React, { useState, useEffect } from "react";
import _, { set } from "lodash";
import notify from "devextreme/ui/notify";
import SideBarComponent from "../Components/Permissions Components/SideBarComponent";
import {
  GET_LOOKUPS,
  GET_MAX_NUMBER,
  REMOVE_LOOKUP,
  UPDATE_LOOKUPS,
} from "../Services/ApiServices/General/LookupsAPI";
import LookupsTable from "../Components/SharedComponents/Tables Components/LookupsTable";
import { useTranslation } from "react-i18next";

const SettingsFilePage = () => {
  let colAttributes = [
    {
      caption: "الرقم",
      captionEn: "Number",
      field: "number",
      alignment: "center",
      widthRatio: 120,
    },
    {
      caption: "الوصف",
      captionEn: "Description ",
      field: "description",
      alignment: "center",
    },
  ];
  const { t, i18n } = useTranslation();
  const [mainLookups, setMainLookups] = useState([]);
  const [selectedMainLookup, setSelectedMainLookup] = useState({});
  const [maxNumber, setMaxNumber] = useState("");

  useEffect(() => {
    async function getInitData() {
      let lookups = await GET_LOOKUPS();
      setMainLookups(lookups);
    }
    getInitData();
  }, []);

  const updateMaxNumber = async () => {
    if (selectedMainLookup && selectedMainLookup.tablename) {
      await GET_MAX_NUMBER({ Table: selectedMainLookup.tablename })
        .then((response) => {
          if (response.MaxNumber) {
            setMaxNumber(response.MaxNumber);
          }
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
    }
  };

  const optionClicked = async (e) => {
    setSelectedMainLookup(e);
  };

  const onInitNewRow = (e) => {
    e.data = { ...e.data, number: maxNumber };
  };

  const onUpdating = async (e) => {
    e.cancel = true;
    if (e.newData) {
      let data = {
        Data: [{ ...e.newData, id: e.key.id }],
        Table: selectedMainLookup.tablename,
      };

      await UPDATE_LOOKUPS(data)
        .then(async () => {
          // Update Data in our state
          let updatedSelectedMainLookup = selectedMainLookup;
          let index = updatedSelectedMainLookup.Data.indexOf(e.oldData);
          if (~index) {
            updatedSelectedMainLookup.Data[index] = {
              ...e.oldData,
              ...e.newData,
            };
          }
          setSelectedMainLookup(updatedSelectedMainLookup);

          // Stop Editing
          await e.component.refresh(true);
          await e.component.cancelEditData();

          // Notify user
          notify(
            {
              message: t("Saved Successfully"),
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
              message: t("Failed Try again"),
              width: 450,
            },
            "error",
            2000
          );
        });
    }
  };

  const onInserting = async (e) => {
    e.cancel = true;

    if (e.data) {
      let data = {
        Data: [{ ...e.data }],
        Table: selectedMainLookup.tablename,
      };

      await UPDATE_LOOKUPS(data)
        .then(async (result) => {
          // Adding new item
          let updatedSelectedMainLookup = selectedMainLookup;
          updatedSelectedMainLookup.Data.push({
            id: result["0"],
            description: e.data.description,
            number: e.data.number,
          });
          setSelectedMainLookup(selectedMainLookup);

          // Stop Editing
          // await e.component.saveEditData();
          await e.component.cancelEditData();
          await e.component.refresh(true);

          // Notify User
          notify(
            {
              message: t("Saved Successfully"),
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
              message: t("Failed Try again"),
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
      let data = {
        ID: e.data.id,
        Table: selectedMainLookup.tablename,
      };

      await REMOVE_LOOKUP(data)
        .then(async (result) => {
          // Adding new item
          let updatedSelectedMainLookup = selectedMainLookup;

          _.remove(updatedSelectedMainLookup.Data, (element) => {
            return element.id === e.data.id;
          });

          setSelectedMainLookup(selectedMainLookup);

          // Stop Editing
          await e.component.saveEditData();
          await e.component.cancelEditData();
          await e.component.refresh(true);

          // Notify User
          notify(
            {
              message: t("Saved Successfully"),
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
              message: t("Saved Successfully"),
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
    <React.Fragment>
      <div dir="auto" className="rtlContainer card w-75 mx-auto">
        {console.log(selectedMainLookup)}
        <div className="row   m-3">
          <div className="col-lg-4 col-md-4">
            <div style={{ height: "85vh" }}>
              <SideBarComponent
                mainButtons={mainLookups}
                keys={{ id: "id", display: "description" }}
                selectedMainId={selectedMainLookup.id}
                enabled={mainLookups}
                onOptionClicked={(value) => optionClicked(value)}
              />
            </div>
          </div>
          <div className="col-lg-8 col-md-8 card py-3">
            <LookupsTable
              dataSource={selectedMainLookup.Data}
              colAttributes={colAttributes}
              disabled={!selectedMainLookup.Data}
              height={80 + "vh"}
              groupPanel
              filterRow
              headerFilter
              onRowInserting={(e) => onInserting(e)}
              onRowRemoving={(e) => OnRemoving(e)}
              onRowUpdating={(e) => onUpdating(e)}
              onInitNewRow={(e) => onInitNewRow(e)}
              onInsertButtonClicked={updateMaxNumber}
            />
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default SettingsFilePage;
