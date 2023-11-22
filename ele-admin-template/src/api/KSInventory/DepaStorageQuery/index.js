import request from '@/utils/request';
import { formdataify, DataToObject} from '@/utils/formdataify';

import { TOKEN_STORE_NAME } from '@/config/setting';


export async function getDeptAuthVarNew(data) {
    data.Token = sessionStorage.getItem(TOKEN_STORE_NAME);
    // var aaa = DataToObject(data,data.where);

    if (data != null) {
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

export async function GetDeptInStockDetail(data) {
    var aaa = DataToObject(data,data.where);
    if(data != null){
        var data2 = formdataify(data);
    }
    const res = await request.post('/AJykDept/GetDeptInStockDetail', data2);
    if (res.data.code == 200) {
        return res.data;
    } else {
        return Promise.reject(new Error(res.data.msg));
    }
}