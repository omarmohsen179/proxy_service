import { request } from "../../Services/CallAPI";

export const GET_REPORT_INFORMATION = async (reportKey) => {
    let config = {
        method: "post",
        url: `/AutoReportInfo`,
        data: { ReportName: reportKey }
    };

    return await request(config);
};

export const GET_REPORT_DATA = async ({ skip, take, FilterQuery, reportKey }) => {
    console.log(reportKey)
    let config = {
        method: "post",
        url: `/AutoReportData`,
        data: { skip, take, FilterQuery, ReportName: reportKey }
    };

    return await request(config);
};