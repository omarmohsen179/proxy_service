import axios from "axios";

import { getWithExpiry } from "./LocalStorageService";
import config from "../config";

const { localStorageTokenKey, localStorageReadIdKey, apiEndPoint } = config;

let request = async (config) => {
  let readId = getWithExpiry(localStorageReadIdKey);
  let token = getWithExpiry(localStorageTokenKey);

  // !For Debug remove it
  readId = "0";
  token =
    "IAAAADKLnjYQe3Uf4hlz4iGt38liFe+ZCHqRS3qLZR2NZAFscTcjEcPnQiV3zapIBx65mCrxwIoN5+QjbCHhD6xBtgfIg5E+71rCYuBVz9PEepA4kjMWczXgvSLZzt+BuN2B95ODHg5bmR4Z5CJcoEvN+PwBjcIRtc4YXDy0Cp5keFrhtF39INj0btrlhdsWUloRYqhy3TKFMw==";
  //!

  if (!readId || !token) {
    window.location.replace("/guest/login");
    return;
  }

  config.url = `${apiEndPoint}${config.url}`;
  axios.defaults.headers = {
    ...axios.defaults.headers,
    // Authorization: `bearer ${token}`,
  };
  config.data = {
    Read_id: readId,
    // Token: token
    ...config.data,
  };

  let data = await axios(config).then((response) => {
    return JSON.stringify(response.data);
  });

  data = JSON.parse(data);

  return data;
};

export { request };
