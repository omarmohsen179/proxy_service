import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  TextBox,
  SelectBox,
  NumberBox,
  DateBox,
} from "../../Components/Inputs";
import { GET_REPORT_DATA, GET_REPORT_INFORMATION } from "./API.AutoReport";
import MasterTable from "../../Components/SharedComponents/Tables Components/MasterTable";

const AutoReport = ({ reportKey }) => {
  const [inputs, setInputs] = useState({
    text: [],
    number: [],
    date: [],
    select: [],
  });
  const [inputsCount, setInputsCount] = useState(4);
  const [colAttributes, setColAttributes] = useState([]);
  const [values, setValues] = useState({});
  // const [apiPayload, setApiPayload] = useState({});
  const [errors, setErrors] = useState({});

  const updateValues = useCallback(
    (e) => {
      setValues((prevState) => ({ ...prevState, [e.name]: e.value }));
      if (errors[e.name]) {
        let updatedErrors = { ...errors };
        delete updatedErrors[e.name];
        setErrors(updatedErrors);
      }
    },
    [errors]
  );

  const apiPayload = useMemo(() => {
    return { ...values, reportKey: reportKey };
  }, [reportKey, values]);

  const handleSubmit = useCallback(
    (e) => {
      setValues({ ...values });
      e.preventDefault();
    },
    [values]
  );

  useEffect(() => {
    GET_REPORT_INFORMATION(reportKey).then(
      ({ inputs, inputsCount, tableColumns }) => {
        setColAttributes(tableColumns);
        setInputsCount(inputsCount);
        setInputs(inputs);
        inputs.date.forEach(({ name }) => {
          setValues((prev) => ({ ...prev, [name]: new Date() }));
        });
        inputs.number.forEach(({ name }) => {
          setValues((prev) => ({ ...prev, [name]: 0 }));
        });
      }
    );

    /// ---------------------------------  test --------------------------------- ///
    //#region
    // let apiTestData = {
    //   inputs: {
    //     text: [
    //       {
    //         name: "inputText1",
    //         label: "Text Label1",
    //       },
    //     ],
    //     number: [
    //       {
    //         name: "inputNumber1",
    //         label: "Number Label1",
    //       },
    //     ],
    //     select: [
    //       {
    //         name: "inputSelect1",
    //         label: "Select Label1",
    //         data: [
    //           { id: 1, des: "Option1" },
    //           { id: 2, des: "Option2" },
    //         ],
    //         keys: { id: "id", name: "des" },
    //       },
    //     ],
    //     date: [
    //       {
    //         name: "inputDate1",
    //         label: "Date Label1",
    //       },
    //     ],
    //   },
    //   inputsCount: 4,
    //  colAttributes : [
    //    {
    //     caption: "مكان الصنف",
    //     field: "item_place",
    //     isVisable: false,
    //   },
    //  ]
    // };
    //
    // setInputs(apiTestData.inputs);
    //
    // setInputsCount(apiTestData.inputsCount);
    //
    // apiTestData.inputs.date.forEach(({ name }) => {
    //   setValues((prev) => ({ ...prev, [name]: new Date() }));
    // });
    //
    // apiTestData.inputs.number.forEach(({ name }) => {
    //   setValues((prev) => ({ ...prev, [name]: 0 }));
    // });
    //#endregion
    /// ------------------------------------------------------------------------- ///
  }, []);

  const disableSubmit = useMemo(() => {
    return Object.keys(values).length < inputsCount;
  }, [inputsCount, values]);

  return (
    <>
      <div className="container-xxl rtlContainer">
        <div className="card">
          <form method="post" onSubmit={handleSubmit}>
            <div className="row p-3">
              {inputs.text.map(({ name, label }) => {
                return (
                  <div className="col-3" key={name}>
                    <TextBox
                      name={name}
                      label={label}
                      value={values[name]}
                      handleChange={updateValues}
                      validationErrorMessage={errors[name]}
                    />
                  </div>
                );
              })}
              {inputs.number.map(({ name, label }) => {
                return (
                  <div className="col-3" key={name}>
                    <NumberBox
                      name={name}
                      label={label}
                      value={values[name] ?? 0}
                      handleChange={updateValues}
                      validationErrorMessage={errors[name]}
                    />
                  </div>
                );
              })}
              {inputs.select.map(({ name, label, data, keys }) => {
                return (
                  <div className="col-3" key={name}>
                    <SelectBox
                      name={name}
                      label={label}
                      dataSource={data}
                      value={values[name]}
                      keys={keys}
                      handleChange={updateValues}
                      validationErrorMessage={errors[name]}
                    />
                  </div>
                );
              })}
              {inputs.date.map(({ name, label }) => {
                return (
                  <div className="col-3" key={name}>
                    <DateBox
                      name={name}
                      label={label}
                      value={values[name]}
                      handleChange={updateValues}
                      validationErrorMessage={errors[name]}
                    />
                  </div>
                );
              })}
            </div>
            <div className="row p-3 d-flex justify-content-center">
              <button
                type="submit"
                disabled={disableSubmit}
                className=" col-3 btn btn-dark"
              >
                عرض
              </button>
            </div>
          </form>
          <div className="row p-3">
            <MasterTable
              filterRow
              height={"500px"}
              dataSource={[]}
              colAttributes={colAttributes}
              remoteOperations={!disableSubmit}
              apiMethod={GET_REPORT_DATA}
              apiPayload={apiPayload}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default AutoReport;
