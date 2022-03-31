import { request } from "../CallAPI";

const TransationsList = {
    "حركة المبيعات": "1",
    "حركة المشتريات": "2",
    "إرجاع المبيعات": "3",
    "إرجاع المشتريات": "4",
}

export const GET_GROUPS = async () => {
    let config = {
        method: "post",
        url: `/AllGroups`,
    };
    return await request(config);
};

export const GET_MOVEMENT_TABLE = async (InvoiceType, NodeID, FromDate, ToDate) => {
    let config = {
        method: "post",
        url: "/InvoicesReports/" + TransationsList[InvoiceType],
        data: {
            NodeID: NodeID,
            FromDate: FromDate,
            ToDate: ToDate
        }

    };
    console.log(config)
    return await request(config);
};
