import { request } from "../../../../Services/CallAPI";

export const GET_PDF_FILE = async (type, data) => {
  let config = {
    method: "post",
    url: `/Report/${type}`,
    data: data,
  };

  return await request(config);
};
