import { request } from "../../../Services/CallAPI";

export const COSTS_TYPES = async () => {
  let config = {
    method: "post",
    url: `/CostsTypes`,
  };
  return await request(config);
};
export const COST_TYPE_NEXT_NUMBER = async () => {
  let config = {
    method: "post",
    url: `/CostTypeNextNumber`,
  };
  return await request(config);
};
export const COSTS_TYPES_TRANCATION = async (e) => {
  let config = {
    method: "post",
    url: `/CostsTypesTransactions`,
    data: { Data: [e] },
  };
  return await request(config);
};
export const CHECK_COST_TYPE_DATA = async (e) => {
  let config = {
    method: "post",
    url: `/CheckCostTypeData`,
    data: e,
  };
  return await request(config);
};
export const DELETE_COST_TYPE = async (CostTypeID) => {
  let config = {
    method: "post",
    url: `/DeleteCostType/${CostTypeID}`,
  };
  return await request(config);
};
