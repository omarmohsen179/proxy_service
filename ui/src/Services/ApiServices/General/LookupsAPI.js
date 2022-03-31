import { request } from "../../CallAPI";
import LookUpsList from "../../../Services/LookUps";
export const GET_LOOKUPS = async () => {
  let config = {
    method: "post",
    url: `/Lookups`,
    data: {},
  };
  return await request(config);
};

export const CHECK_LOOKUP_VALUE = async (_data) => {
  let config = {
    method: "post",
    url: `/CheckLookupsData`,
    data: {
      ..._data,
    },
  };
  return await request(config);
};

export const UPDATE_LOOKUPS = async (_data) => {
  let config = {
    method: "post",
    url: `/LookupsTransactions`,
    data: {
      ..._data,
    },
  };
  return await request(config);
};

export const REMOVE_LOOKUP = async (_data) => {
  let config = {
    method: "post",
    url: `/DeleteLookup`,
    data: {
      ..._data,
    },
  };
  return await request(config);
};

export const GET_MAX_NUMBER = async (_data) => {
  let config = {
    method: "post",
    url: `/LookupMaxNumber`,
    data: {
      ..._data,
    },
  };
  return await request(config);
};

// المسوق
export const GET_MARKETERS = async () => {
  let config = {
    method: "post",
    url: `/Staff`,
  };
  return await request(config);
};

//Money Types العملات
export const GET_MONEYTYPES_LOOKUP = async () => {
  let config = {
    method: "post",
    url: `/MoneyTypes`,
  };
  return await request(config);
};
export const GET_SPECIFIC_LOOKUP = async (name) => {
  let config = {
    method: "post",
    url: "/Lookups/" + LookUpsList.LookUpsList[name],
  };
  return await request(config);
};
