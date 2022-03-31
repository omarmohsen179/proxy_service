import React, { useRef } from "react";
import { Button } from "devextreme-react/button";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import useKeyboardShortcut from "use-keyboard-shortcut";
// Components

function ButtonRow({
  submitBehavior = true,
  onUndo,
  onSubmit,
  onNew,
  onEdit,
  onCopy,
  onDelete,
  onExit,
  // defineType,
  isSubmit = true,
  isSimilar = true,
  isExit = true,
  isBack = true,
}) {
  let [flag, setFlag] = useState(true);
  const { t, i18n } = useTranslation();
  useEffect(() => {
    // console.log("ButtonRow-effect");

    !isBack && setFlag(false);
  }, []);

  let handleChange = (func, e) => {
    // console.log("ButtonRow-handleChange");
    if (isBack) {
      setFlag(!flag);
    }
  };

  let isFunction = (functionToCheck) => {
    var getType = {};
    return (
      (functionToCheck &&
        getType.toString.call(functionToCheck) === "[object Function]") ||
      getType.toString.call(functionToCheck) === "[object AsyncFunction]"
    );
  };

  const submitBtn = useRef(null);
  useKeyboardShortcut(
    ["Control", "S"],
    () => isSubmit && flag && submitBtn.current.instance._props.onClick(),
    { overrideSystem: true }
  );

  const backBtn = useRef(null);
  useKeyboardShortcut(
    ["Control", "B"],
    () => isBack && flag && backBtn.current.instance._props.onClick(),
    { overrideSystem: true }
  );

  const newBtn = useRef(null);
  useKeyboardShortcut(
    ["Control", "N"],
    () => !flag && newBtn.current.instance._props.onClick(),
    { overrideSystem: true }
  );

  const editBtn = useRef(null);
  useKeyboardShortcut(
    ["Control", "E"],
    () => !flag && editBtn.current.instance._props.onClick(),
    { overrideSystem: true }
  );

  const deleteBtn = useRef(null);
  useKeyboardShortcut(
    ["Control", "D"],
    () => !flag && deleteBtn.current.instance._props.onClick(),
    { overrideSystem: true }
  );

  // useKeyboardShortcut(['F1'], () => console.log(123), { overrideSystem: true })

  return (
    <div className="w-100 grid-container" dir="auto">
      {isSubmit && (
        <Button
          ref={submitBtn}
          className="mx-1 buttonStyle"
          stylingMode="outlined"
          icon="fas fa-check"
          type="default"
          width={"12%"}
          text={t("Save")}
          useSubmitBehavior={submitBehavior}
          onClick={onSubmit}
          rtlEnabled={true}
          disabled={!flag}
          hint="Ctrl + S"
        />
      )}
      {isBack && (
        <Button
          className="mx-1 buttonStyle"
          ref={backBtn}
          stylingMode="outlined"
          text={t("Back")}
          icon="fas fa-undo"
          width={"12%"}
          onClick={(e) => handleChange(isFunction(onUndo) && onUndo("undo", e))}
          rtlEnabled={true}
          disabled={!flag}
          hint="Ctrl + B"
        />
      )}

      <Button
        className="mx-1 buttonStyle"
        stylingMode="outlined"
        width="12%"
        text={t("New")}
        icon="fas fa-plus"
        type="success"
        rtlEnabled={true}
        onClick={(e) => handleChange(isFunction(onNew) && onNew("new", e))}
        disabled={flag}
        hint="Ctrl + N"
      />
      <Button
        className="mx-1 buttonStyle"
        ref={editBtn}
        stylingMode="outlined"
        width={"12%"}
        text={t("Edit")}
        type="default"
        icon="fas fa-pencil-alt"
        rtlEnabled={true}
        onClick={(e) => handleChange(isFunction(onEdit) && onEdit("edit", e))}
        disabled={flag}
        hint="Ctrl + E"
      />
      {isSimilar && (
        <Button
          className="mx-1 buttonStyle"
          stylingMode="outlined"
          rtlEnabled={true}
          onClick={(e) => handleChange(isFunction(onCopy) && onCopy("copy", e))}
          width={"12%"}
          text={t("Copy")}
          icon="far fa-copy"
          type="success"
          disabled={flag}
        />
      )}
      <Button
        className="mx-1 buttonStyle"
        ref={deleteBtn}
        stylingMode="outlined"
        rtlEnabled={true}
        onClick={(e) =>
          handleChange(isFunction(onDelete) && onDelete("delete", e))
        }
        width={"12%"}
        text={t("Remove")}
        icon="fas fa-trash-alt"
        type="danger"
        disabled={flag}
        hint="Ctrl + D"
      />
      {isExit && (
        <Button
          className="mx-1 buttonStyle"
          stylingMode="outlined"
          rtlEnabled={true}
          onClick={(e) => handleChange(isFunction(onExit) && onExit("exit", e))}
          width={"12%"}
          text={t("Exit")}
          icon="fas fa-sign-out-alt"
        />
      )}
    </div>
  );
}

export default React.memo(ButtonRow);
