
import { request } from "../../../Services/CallAPI";
export const GET_STUFF_SALARIES = async (e) => {
	let config = {
		method: "post",
		url: `/StaffSalaries`,
        data:e
	};
	return await request(config);
};
export const EDIT_MEMBER_SALARY = async (e) => {
	let config = {
		method: "post",
		url: `/EditMemeberSalary`,
       data:{Data:[e]}
	};
	return await request(config);
};
export const DELETE_STAFF_SALARIES = async (ApproveStaffSalariesID) => {
	let config = {
		method: "post",
		url: `/DeleteStaffSalaries/${ApproveStaffSalariesID}`,
	};
	return await request(config);
};
export const APPROVE_STUFF_SALARIES = async (e) => {
	let config = {
		method: "post",
		url: `/ApproveStaffSalaries`,
        data:{Data:[e]}
	};
	return await request(config);
};	