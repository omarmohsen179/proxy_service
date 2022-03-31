import { request } from "../../../Services/CallAPI";
import LookUpsList from "../../../Services/LookUps";
export const GET_STUFF = async () => {
  let config = {
    method: "post",
    url: `/Staff`,
  };
  return await request(config);
};
export const GET_DISCOUNT = async (skip, rtake) => {
  let config = {
    method: "post",
    url: `/StaffSalaryDeductions`,
    data: {
      skip: skip,
      take: rtake,
    },
  };
  return await request(config);
};
export const NEXT_NUMBER = async () => {
  let config = {
    method: "post",
    url: `/StaffSalaryDeductionsNextNumber`,
  };
  return await request(config);
};
export const TRANSACTION = async (ob, id) => {
  let config = {
    method: "post",
    url: "/StaffSalaryDeductionsTransactions",
    data: { Data: [ob] },
  };
  console.log(config.data);
  return await request(config);
};
export const CHECKER = async (col, val) => {
  let config = {
    method: "post",
    url: "/CheckStaffSalaryDeductionsData",
    data: { CheckData: { [col]: val } },
  };
  console.log(config.data);
  return await request(config);
};
export const DELETE = async (id) => {
  let config = {
    method: "post",
    url: "/DeleteStaffSalaryDeductions/" + id,
  };
  return await request(config);
};
export const LOCKUPS = async (name) => {
  console.log(name);
  console.log(LookUpsList);
  let config = {
    method: "post",
    url: "/Lookups/" + LookUpsList.LookUpsList[name],
  };
  return await request(config);
};
