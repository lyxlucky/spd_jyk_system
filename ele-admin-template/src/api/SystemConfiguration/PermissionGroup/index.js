import request from '@/utils/request';
import { formdataify } from '@/utils/formdataify';
import { TOKEN_STORE_NAME } from '@/config/setting';


export async function getGroupsList() {
    var Token = sessionStorage.getItem(TOKEN_STORE_NAME);
    // if (data != null) {
    //     var data2 = formdataify(data);
    // }
    const res = await request.request({
        url: '/Commons/getGroupsList',
        method: 'get',
        params: {
            Token: Token
        }
    })
    return res.data;
}

export async function DelGroupByID(ID) {
    var Token = sessionStorage.getItem(TOKEN_STORE_NAME);
    var data = {};
    data.Token = Token;
    data.ID = ID;
    if (data != null) {
        var data2 = formdataify(data);
    }
    const res = await request.post('/Commons/DelGroupByID', data2);
    return res.data;
}

export async function getPermissionList() {
    var Token = sessionStorage.getItem(TOKEN_STORE_NAME);
    var params = {};
    params.Token = Token;
    // if (data != null) {
    //     var data2 = formdataify(data);
    // }
    const res = await request.get('/Commons/getPermissionList', { params });
    return res.data;
}

export async function getPermissionListByGroupsID(ID) {
    var Token = sessionStorage.getItem(TOKEN_STORE_NAME);
    var params = {};
    params.Token = Token;
    params.groupID = ID;
    // if (data != null) {
    //     var data2 = formdataify(data);
    // }
    const res = await request.get('/Commons/getPermissionListByGroupsID', { params });
    return res.data;
}

export async function correlationGroups_Permissions(data) {
    data.Token = sessionStorage.getItem(TOKEN_STORE_NAME);
    var rep = formdataify(data)
    const res = await request.post('/Commons/correlationGroups_Permissions', rep);
    return res.data;
}