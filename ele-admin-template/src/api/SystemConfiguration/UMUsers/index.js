import request from '@/utils/request';
import { formdataify } from '@/utils/formdataify';
import { TOKEN_STORE_NAME } from '@/config/setting';


export async function getUserList(data) {
    data.Token = sessionStorage.getItem(TOKEN_STORE_NAME);
    if (data != null) {
        var data2 = formdataify(data);
    }
    const res = await request.request({
        url: '/Commons/getUserList',
        method: 'get',
        params: {
            username: data.where.username ? data.where.username : '',
            dept: data.where.dept ? data.where.dept : '',
            qx: data.where.qx ? data.where.qx : '',
            sup: data.where.sup ? data.where.sup : '',
            page: data.page ? data.page : '',
            size: data.limit ? data.limit : '',
            Token: sessionStorage.getItem(TOKEN_STORE_NAME)
        }
    });

    if (res.data.code == 200) {
        return res.data;
    } else {
        return Promise.reject(new Error(res.data.msg));
    }
}

export async function DelUserByID(ID) {
    var data = {};
    data.Token = sessionStorage.getItem(TOKEN_STORE_NAME);
    data.ID = ID;
    if (data != null) {
        var data2 = formdataify(data);
    }
    const res = await request.post('/Commons/DelUserByID', data2);
    return res.data;
}

/* 修改密码 */
export async function UpdateUserPassword(data) {
    data.Token = sessionStorage.getItem(TOKEN_STORE_NAME);
    data.Password = data.Password ? data.Password : '';
    data.AesKey = data.AesKey ? data.AesKey : '';
    data.Token = data.Token ? data.Token : '';
    data.user = data.user ? data.user : '';
    data.jypass = data.jypass ? data.jypass : '';
    if (data != null) {
        var data2 = formdataify(data);
    }
    const res = await request.post('/Commons/DelUserByID', data2);
    return res.data;
}



export async function getGroupsList() {
    var data = {
        Token: sessionStorage.getItem(TOKEN_STORE_NAME)
    };
    const res = await request.get('/Commons/getGroupsList', {
        params: data
    });
    if (res.data.code == 200) {
        return res.data;
    } else {
        return Promise.reject(new Error(res.data.msg));
    }
}


export async function correlationUser_Groups(data) {
    data.Token = sessionStorage.getItem(TOKEN_STORE_NAME)
    data.userID = data.userID ? data.userID : '';
    data.groupID = data.groupID ? data.groupID : '';
    var data2 = formdataify(data);
    const res = await request.post('/Commons/correlationUser_Groups', data2);

    return res.data;
    // if (res.data.code == 200) {
    //     return res.data;
    // } else {
    //     return Promise.reject(new Error(res.data.msg));
    // }
}