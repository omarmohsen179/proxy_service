import axios from "axios";
import config from "../../config.js";
const { apiEndPoint } = config;
export const LOGIN = async (Username, UserPassword, Serial) => {
  let config = {
    method: "post",
    url: `${apiEndPoint}/Login`,
    data: {
      Username,
      UserPassword,
      Serial,
    },
  };

  let data = await axios(config).then((response) => {
    return JSON.stringify(response.data);
  });

  data = JSON.parse(data);

  return data;
};
