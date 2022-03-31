import { request } from "../CallAPI";
import axios from "axios";
import config from "../../config";

const { apiEndPoint } = config;

export const SAVE_ITEMS = async (values, image) => {
  let filterdValues = { ...values };
  axios
    .post(`${apiEndPoint}/ItemTransactions`, {
      Token: "7kgPjPiphKa6HiKh1Ct2Xbf6OZ3OnNInUU2BMIpNEYI=",
      Read_id: "0",
      Data: [
        {
          ID: values.id || 0,
          Items: filterdValues,
          Image: values.image,
          Items_s2: values.Items_s2,
          Items_Box: values.Items_Box,
        },
      ],
    })
    .then(({ data }) => {
      // this line should be in one line or make {+} with {''}
      if (data.ImageToken) {
        axios
          .post(
            `${apiEndPoint}/DownloadFile/${0}/${"7kgPjPiphKa6HiKh1Ct2Xbf6OZ3OnNInUU2BMIpNEYI="}/${
              data.id
            }/${data.ImageToken}`,
            image,
            {
              headers: {
                "Content-Type": "image/png",
              },
            }
          )
          .catch((err) => console.log(err));
      }
    })
    .catch((err) => {
      console.log(err);
    });

  // let filterdValues = { ...values };
  // delete filterdValues.Items_Box;
  // delete filterdValues.Items_s2;
  // delete filterdValues.image;
  // console.log(values);
  // let config = {
  //   method: "post",
  //   url: `/ItemTransactions`,
  //   data: {
  //     Data: [
  //       {
  //         ID: values.id || 0,
  //         Items: filterdValues,
  //         Image: values.image,
  //         Items_s2: values.Items_s2,
  //         Items_Box: values.Items_Box,
  //       },
  //     ],
  //   },
  // };
  // return await request(config);
};

export const SAVE_ITEMS2 = async (values) => {
  var newValue = { ...values };
  var id = newValue["id"];
  delete newValue.endservice_date;
  delete newValue.image;
  delete newValue["id"];
  let filterdValues = { ...newValue };
  let config = {
    method: "post",
    url: `/ItemTransactions`,
    data: {
      Data: [
        {
          ID: id || 0,
          Items: filterdValues,
          Image: newValue.image,
          Items_s2: newValue.Items_s2,
          Items_Box: newValue.Items_Box,
        },
      ],
    },
  };
  return await request(config);
};

export const IMAGE = async (data, image) => {
  axios
    .post(
      `${apiEndPoint}/DownloadFile/${0}/${"7kgPjPiphKa6HiKh1Ct2Xbf6OZ3OnNInUU2BMIpNEYI="}/${
        data.id
      }/${data.ImageToken}`,
      image,
      {
        headers: {
          "Content-Type": "image/png",
        },
      }
    )
    .catch((err) => console.log(err));
};
export const GET_ITEM_NAME = async (column, key) => {
  let config = {
    method: "post",
    url: `/SearchInItems`,
    data: {
      SearchData: {
        [column]: key,
      },
    },
  };
  return await request(config);
};

export const GET_LOOKUPS = async () => {
  let config = {
    method: "post",
    url: `/ItemsLookups`,
  };
  return await request(config);
};

export const GET_STORES = async () => {
  let config = {
    method: "post",
    url: "/Stores",
  };
  return await request(config);
};

export const DELETE = async (table, id) => {
  let config = {
    method: "post",
    url: `/${table}/${id}`,
  };
  return await request(config);
};

export const DELETE_ITEM = async (id) => {
  let config = {
    method: "post",
    url: `/DeleteItem/${id}`,
  };
  return await request(config);
};
export const GET_MAIN_CATEGORIES = async () => {
  let config = {
    method: "post",
    url: `/ItemsCategories`,
  };
  return await request(config);
};

export const GET_VISIBLE_PANELS = async () => {
  let config = {
    method: "post",
    url: `/ItemsVisiablesPanels`,
  };
  return await request(config);
};

export const GET_ITEM_BY_ID = async (id) => {
  let config = {
    method: "post",
    url: `/item/${id}`,
  };
  return await request(config);
};

export const QUICK_ITEM_INFO = async (ItemID) => {
  let config = {
    method: "post",
    url: `/QuickItemInfo/${ItemID}`,
  };
  return await request(config);
};

export const CHECK_ITEM_DATA = async ({ Table, ID, CheckData }) => {
  let config = {
    method: "post",
    url: `/CheckItemData`,
    data: {
      Table,
      ID,
      CheckData,
    },
  };
  return await request(config);
};

export const ITEM_MINMUM_LIMIT_QUANTITY = async ({
  StoreID,
  MinimumLimitQuantity,
  Location,
  ItemID,
}) => {
  let config = {
    method: "post",
    url: `/ItemMinimumLimitQuantity`,
    data: {
      Data: {
        StoreID,
        MinimumLimitQuantity,
        Location,
        ItemID,
      },
    },
  };
  return await request(config);
};

export const GET_SEARCH_ITEMS = async ({
  FilterQuery = "",
  ItemNumber = "",
  ItemName = "",
  SearchName = "",
  typ_id = 0,
  code_no = "",
  addres = "",
  qunt = 0,
  m_no = 0,
  PageNumber = 0,
  PageSize = 20,
  state = 0,
  sno_id = 0,
  msdar = "",
  clas = "",
  emp_id = 0,
  skip,
  take,
}) => {
  let config = {
    method: "post",
    url: `/SearchAboutItems`,
    data: {
      ItemNumber,
      ItemName,
      SearchName,
      clas,
      qunt,
      state,
      sno_id,
      msdar,
      addres,
      code_no,
      m_no,
      emp_id,
      typ_id,
      skip,
      take,
      FilterQuery,
      // PageSize,
      // PageNumber,
    },
  };
  try {
    return await request(config);
  } catch (err) {}
};

// idType = "ItemID" || 'ItemBarcode'
export const GET_ITEM_INFO = async (storeId, itemId, idType = "ItemID") => {
  let config = {
    method: "post",
    url: `/ItemInfo/${storeId}`,
    data: {
      [idType]: itemId,
    },
  };

  return await request(config);
};

export const TestReport = async ({ Image }) => {
  let config = {
    method: "post",
    url: `/TestReport`,
    data: {
      Image,
    },
  };
  return await request(config);
};

export const Test_Api = async ({ skip, take, FilterQuery }) => {
  let config = {
    method: "post",
    url: `/TestDataFilter`,
    data: {
      skip,
      take,
      FilterQuery,
    },
  };
  return await request(config);
};

export const SAVE_ITEMS_FORM = async (values) => {
  let formData = new FormData();
  formData.append("k", values.image);

  var config = {
    method: "post",
    url: "http://161.97.167.23:8089/mdfunctions/TestReport",
    headers: {
      // 'Content-Type': 'image/png'
      "Content-Type": "multipart/form-data",
    },
    data: formData,
  };
  await axios(config);
};
