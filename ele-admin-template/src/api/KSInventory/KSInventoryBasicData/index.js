import request from '@/utils/request';
import { formdataify, DataToObject } from '@/utils/formdataify';
import { TOKEN_STORE_NAME, } from '@/config/setting';
import store from '@/store';

export async function getDeptAuthVarNew(data) {
    var data2 = {};
    data2.Token = sessionStorage.getItem(TOKEN_STORE_NAME);
    data2.page = data.page;
    data2.limit = data.limit;
    data2.Varietie_Code_New = data.where.Varietie_Code_New ? data.where.Varietie_Code_New : '';
    data2.Specification_Or_Type = data.where.Specification_Or_Type ? data.where.Specification_Or_Type : '';
    data2.Manufacturing_Ent_Name = data.where.Manufacturing_Ent_Name ? data.where.Manufacturing_Ent_Name : '';
    data2.CLASS_NUM = data.where.CLASS_NUM ? data.where.CLASS_NUM : '';
    data2.DEVICE_REMARK = data.where.DEVICE_REMARK ? data.where.DEVICE_REMARK : '';
    data2.isDeptTwoAuth = data.where.isDeptTwoAuth ? data.where.isDeptTwoAuth : '';
    data2.type = data.where.type ? data.where.type : '';
    data2.order = data.order ? data.order : '';
    // data2.Dept_One_Code = data.where.Dept_One_Code ? data.where.Dept_One_Code : '';
    data2.Dept_One_Code = store.state.user.info.DeptNow.Dept_Two_Code ? store.state.user.info.DeptNow.Dept_Two_Code :""

    DataToObject(data, data2)
    if (data != null) {
        var data3 = formdataify(data);
    }
    const res = await request.post('/VarietieBasicInfo/getDeptAuthVarNew', data3);
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
    if (data != null) {
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
    const res = await request.get(`/AJykDept/GetClassificProp_Jy`, {
        params: {
            Token
        }
    });

    if (res.data.code == 200) {
        return res.data;
    } else {
        return Promise.reject(new Error(res.data.msg));
    }
}

export async function UpdateVarietieBasicJyk(data) {
    data.Token = sessionStorage.getItem(TOKEN_STORE_NAME);
    if (data != null) {
        var data2 = formdataify(data);
    }
    const res = await request.post('/AJykDept/UpdateVarietieBasicJyk', data2);

    return res;

}


export async function UpDownKsQuery(data) {
    var data2 = {};
    data2.json = JSON.stringify(data);
    data2.Token = sessionStorage.getItem(TOKEN_STORE_NAME);

    var rep = formdataify(data2);

    const res = await request.post('/DeptTwoDefNoPackageStock/UpDownKsQuery', rep);
    if (res.data.code == 200) {
        return res.data;
    } else {
        return Promise.reject(new Error(res.data.msg));
    }
}

export async function UpDownKsQueryNew(data) {
    var data2 = {};
    data2.json = JSON.stringify(data);
    data2.Token = sessionStorage.getItem(TOKEN_STORE_NAME);

    var rep = formdataify(data2);

    const res = await request.post('/DeptTwoDefNoPackageStock/UpDownKsQueryNew', rep);
    if (res.data.code == 200) {
        return res.data;
    } else {
        return Promise.reject(new Error(res.data.msg));
    }
}
