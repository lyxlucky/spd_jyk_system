import request from '@/utils/request';
import { formdataify, DataToObject } from '@/utils/formdataify';

import { TOKEN_STORE_NAME } from '@/config/setting';


export async function getDeptAuthVarNew(data) {
    data.Token = sessionStorage.getItem(TOKEN_STORE_NAME);

    if (data != null) {
        var data2 = formdataify(data);
    }
    const res = await request.post('/VarietieBasicInfo/searchBID_VAR_INFO', data2);
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

export async function searchBID_VAR_INFO(data) {
    // data.Token = sessionStorage.getItem(TOKEN_STORE_NAME);
    var data2 = {};
    data2.VARIETIE_CODE_NEW = data.where.VARIETIE_CODE_NEW ? data.where.VARIETIE_CODE_NEW : '';
    data2.PROD_REGISTRATION_NAME = data.where.PROD_REGISTRATION_NAME ? data.where.PROD_REGISTRATION_NAME : '';
    data2.GG = data.where.GG ? data.where.GG : '';
    data2.APPROVAL_NUMBER = data.where.APPROVAL_NUMBER ? data.where.APPROVAL_NUMBER : '';
    data2.SUP_NAME = data.where.SUP_NAME ? data.where.SUP_NAME : '';
    data2.MANUFACTURING_ENT_NAME = data.where.MANUFACTURING_ENT_NAME ? data.where.MANUFACTURING_ENT_NAME : '';
    data2.USE_DEPT = data.where.USE_DEPT ? data.where.USE_DEPT : '';
    data2.IS_ENABLE = data.where.IS_ENABLE ? data.where.IS_ENABLE : '';
    data2.IS_HAVE = data.where.IS_HAVE ? data.where.IS_HAVE : '';
    data2.IS_USE = data.where.IS_USE ? data.where.IS_USE : '1';
    data2.IS_IN_COUNTRY_IMPORT = data.where.IS_IN_COUNTRY_IMPORT ? data.where.IS_IN_COUNTRY_IMPORT : '';
    data2.CONTRACT_CODE = data.where.CONTRACT_CODE ? data.where.CONTRACT_CODE : '';
    data2.CREATE_BATCH = data.where.CREATE_BATCH ? data.where.CREATE_BATCH : '';
    data2.CREATE_BATCH2 = data.where.CREATE_BATCH2 ? data.where.CREATE_BATCH2 : '';
    data2.start_time = data.where.start_time ? data.where.start_time : '';
    data2.HIGH_OR_LOW_CLASS = data.where.HIGH_OR_LOW_CLASS ? data.where.HIGH_OR_LOW_CLASS : '';
    data2.HIGH_CLASS_XH = data.where.HIGH_CLASS_XH ? data.where.HIGH_CLASS_XH : '';
    data2.IS_PRICE = data.where.IS_PRICE ? data.where.IS_PRICE : '';
    data2.KC = data.where.KC ? data.where.KC : '';
    data2.end_time = data.where.end_time ? data.where.end_time : '';
    data2.Token = sessionStorage.getItem(TOKEN_STORE_NAME);
    data2.page = data.page ? data.page : 1;
    data2.size = data.limit ? data.limit : 15;
    // var data3 = DataToObject(data2, data.where)
    if (data2 != null) {
        var rep = formdataify(data2);
    }
    const res = await request.post('/VarietieBasicInfo/searchBID_VAR_INFO', rep);


    if (res.data.code == 200) {
        return res.data;
    } else {
        return Promise.reject(new Error(res.data.msg));
    }
}

export async function CreateTempletDeta(data) {
    var data2 = {};
    data2.json = JSON.stringify(data);
    data2.Token = sessionStorage.getItem(TOKEN_STORE_NAME);
    data2.state = data.state ? data.state : '';
    data2.dept_two_code = data.dept_two_code ? data.dept_two_code : '';

    var rep = formdataify(data2);

    const res = await request.post('/VarietieBasicInfo/BID_VAR_INFOIsEnbaleCommit', rep);
    if (res.data.code == 200) {
        return res.data;
    } else {
        return Promise.reject(new Error(res.data.msg));
    }
}
