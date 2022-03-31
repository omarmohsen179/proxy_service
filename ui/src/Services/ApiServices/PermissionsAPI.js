import { request } from "../CallAPI";

export const GET_ALL_MAIN_PERMMISIONS = async () => {
    let config = {
        method: "post",
        url: "/MainPermissions",
    };

    return await request(config);
};

export const GET_ALL_MAIN_PERMMISIONS_DETAILS = async (
    groupId = 1,
    main_Permission
) => {
    let mapper = {
        'الإعدادات': 1,
        'أساسيات': 2,
        'الموظفين': 3,
        'المبيعات': 4,
        'متفرقات': 5,
        'الإيصالات': 6,
        'المصارف': 7,
        'التقارير المالية': 8,
        'تقارير الحركة': 9,
        'المشتريات': 10,
        'خدمات': 11,
        'المخازن والأصناف': 12,
        'الحسابات': 13,
        'الحضور والانصراف': 14,
        'التصنيع': 15,
        'صلاحيات مفصلة': 16
    }

    let config = {
        method: "post",
        url: `/MainPermissionsDetails/${mapper[main_Permission]}/${groupId}`,
    };

    return await request(config);
};

export const UPDATE_SUB_PRSMISSIONS = async (changesArr) => {
    let changes = changesArr.map((change) => {
        return { PermissionID: change.key.id, Changes: { ...change.data } };
    });
    console.log(changes);
    let config = {
        method: "post",
        url: `/UpdatePermissions`,
        data: { Data: changes },
    };

    return await request(config);
};

//
// ─── OTHER PERMISSIONS ──────────────────────────────────────────────────────────
//

export const GET_OTHER_PERMISSIONS_OUT = async (groupId) => {
    let config = {
        method: "post",
        url: `/GroupNotAccesses/${groupId}`,
    };
    return await request(config);
};

export const GET_OTHER_PERMISSIONS_IN = async (groupId) => {
    let config = {
        method: "post",
        url: `/GroupAccesses/${groupId}`,
    };
    return await request(config);
};

export const ASSIGN_PERMISSION = async (groupId, accessType, accessId) => {
    let config = {
        method: "post",
        url: `/NewGroupAccess`,
        data: {
            Data: {
                GroupID: groupId,
                AccessType: accessType,
                AccessID: accessId,
            },
        },
    };
    return await request(config);
};

export const SAVE_ITEMS = async (values) => {
    let config = {
        method: "post",
        url: `/newItem`,
        data: {
            Data: [
                {
                    ID: "0",
                    Changes: values
                }
            ]
        },
    };
    return await request(config);
}

export const FREE_PERMISSION = async (groupId, accessType, accessId) => {
    let config = {
        method: "post",
        url: `/DeleteGroupAccess`,
        data: {
            Data: {
                GroupID: groupId,
                AccessType: accessType,
                AccessID: accessId,
            },
        },
    };
    return await request(config);
};
