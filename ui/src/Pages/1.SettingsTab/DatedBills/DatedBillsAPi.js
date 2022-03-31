import { request } from "../../../Services/CallAPI";

export const CUSTOMERIES = async () => {
  let config = {
    method: "post",
    url: `/Accounts/Customer/-1/Sales`,
  };
  return await request(config);
};
export const CUSTOMER_ITEMS_SALES = async (e) => {
  let config = {
    method: "post",
    url: `/CustomerItemsSales`,
    data: e,
  };
  return await request(config);
};
