import { request } from "../CallAPI";

export const GET_GROUPS = async () => {
    let config = {
        method: "post",
        url: `/AllGroups`,
    };
    return await request(config);
};

export const ADD_GROUP = async (groupName, permissionsKey) => {
    let config = {
        method: "post",
        url: `/NewGroup`,
        data: { Data: { GroupName: groupName, OtherGroupID: permissionsKey } },
    };
    return await request(config);
};
