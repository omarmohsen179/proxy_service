import moment from "moment";
import Joi from "joi";
import config from "../config.js";

const { maxFetchTime } = config;

export const checkForCall = (lastFetch) => {
  let result = false;
  let diffInMins = moment().diff(moment(lastFetch), "minutes");
  if (diffInMins > maxFetchTime) {
    result = true;
  }
  return result;
};

//joi validation
export const validateForm = (data, schema) => {
  let formSchema = Joi.object().keys(schema).options({ allowUnknown: true });
  let errors = formSchema.validate(data, { abortEarly: false });
  let error = {};
  if (errors.error) {
    errors.error.details.forEach((err) => {
      let key = err.context.key;
      let message = err.message;

      error[key] = message;
    });
  }
  return error;
};

// upload images
export let fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.onerror = (errors) => {
      reject(errors);
    };
  });
};

export const editItemInList = (arr, value, key) => {
  let arrClone = [...arr];
  // [key] to make it generic
  // find item by it's key
  let index = arrClone.findIndex((e) => e[key] === value[key]);
  // replace the specific item with the new one
  arrClone.splice(index, 1, value);
  return arrClone;
};

export const deleteItemInList = (arr, value, key) => {
  let arrClone = [...arr];
  // [key] to make it generic
  // find item by it's key
  let index = arrClone.findIndex((e) => e[key] === value[key]);
  // remove the specific item
  arrClone.splice(index, 1);
  return arrClone;
};

export const Validation = (data, labelsObject, deleteArray) => {
  let errArr = [];
  var dataObject = { ...data };
  if (deleteArray?.length > 0) {
    deleteArray.forEach((element) => {
      delete dataObject[element];
    });
  }

  for (const [key, value] of Object.entries(dataObject)) {
    if (value === "" || value === null) {
      errArr.push(`هذا الحقل "${labelsObject[key]}" مطلوب`);
    }
  }
  return errArr;
};
