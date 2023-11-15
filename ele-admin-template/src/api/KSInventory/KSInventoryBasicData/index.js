import request from '@/utils/request';
import { formdataify } from '@/utils/formdataify';
import { TOKEN_STORE_NAME } from '@/config/setting';

export async function getDeptAuthVarNew(data) {
    data.Token = sessionStorage.getItem(TOKEN_STORE_NAME);
    if(data != null){
        var data2 = formdataify(data);
    }
    const res = await request.post('/VarietieBasicInfo/getDeptAuthVarNew', data2);
    // const res = await request.post('/VarietieBasicInfo/getVar', {
    //     username,
    //     password,
    //     Token
    // });

    if (res.data.code == 200) {
        return res.data;
    } else {
        return Promise.reject(new Error(res.data.msg));
    }
}


export async function getUnreadNotice() {
    const res = await request.post('/VarietieBasicInfo/getDeptAuthVarNew');
    return res.data.result;
}

export async function UpdateVarietieBasic(data) {
    if(data != null){
        var data2 = formdataify(data);
    }
    const res = await request.post('/AJykDept/UpdateVarietieBasic', data2);
    // const res = await request.post('/VarietieBasicInfo/getVar', {
    //     username,
    //     password,
    //     Token
    // });
    return res;
    // if (res.data.code == 200) {
    //     return res.msg;
    // } else {
    //     return Promise.reject(new Error(res.msg));
    // }
}

export async function GetClassificProp_Jy() {
    var Token = sessionStorage.getItem(TOKEN_STORE_NAME);
    // const res = await request.get(`/AJykDept/GetClassificProp_Jy?Token=${Token}`);
    const res = await request.get(`/AJykDept/GetClassificProp_Jy`,{
        params:{
            Token
        }
    });

    if (res.data.code == 200) {
        return res.data;
    } else {
        return Promise.reject(new Error(res.data.msg));
    }
}