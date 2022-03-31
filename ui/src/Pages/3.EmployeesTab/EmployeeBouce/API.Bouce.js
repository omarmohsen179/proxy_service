import { request } from "../../../Services/CallAPI";
import LookUpsList from "../../../Services/LookUps";
export const GET_STUFF = async () => {
  let config = {
    method: "post",
    url: `/Staff`,
  };
  return await request(config);
};
export const GET_BUONCES = async (skip, rtake) => {
  let config = {
    method: "post",
    url: `/StaffSalaryBonuses`,
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
    url: `/StaffSalaryBonusesNextNumber`,
  };
  return await request(config);
};
export const TRANSACTION = async (ob, id) => {
  let config = {
    method: "post",
    url: "/StaffSalaryBonusesTransactions",
    data: { Data: [ob] },
  };
  console.log(config.data);
  return await request(config);
};
export const CHECKER = async (col, val) => {
  let config = {
    method: "post",
    url: "/CheckStaffSalaryBonusesData",
    data: { CheckData: { [col]: val } },
  };
  console.log(config.data);
  return await request(config);
};
export const DELETE = async (id) => {
  let config = {
    method: "post",
    url: "/DeleteStaffSalaryBonuses/" + id,
  };
  return await request(config);
};
export const LOCKUPS = async (name) => {
  let config = {
    method: "post",
    url: "/Lookups/" + LookUpsList.LookUpsList[name],
  };
  return await request(config);
};
