import { request } from "../../../Services/CallAPI";
import LookUpsList from "../../../Services/LookUps";
export const GET_STUFF = async () => {
  let config = {
    method: "post",
    url: `/Staff`,
  };
  return await request(config);
};
export const NEXT_NUMBER = async () => {
  let config = {
    method: "post",
    url: `/StaffNextNumber`,
  };
  return await request(config);
};
export const TRANSACTION = async (ob, id) => {
  let config = {
    method: "post",
    url: "/StaffTransactions",
    data: { Data: [ob] },
  };
  console.log(config.data);
  return await request(config);
};
export const CHECKER = async (col, val) => {
  let config = {
    method: "post",
    url: "/CheckStaffData",
    data: { CheckData: { [col]: val } },
  };
  console.log(config.data);
  return await request(config);
};
export const DELETE = async (id) => {
  console.log(id);
  let config = {
    method: "post",
    url: "/DeleteStaffMember/" + id,
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
