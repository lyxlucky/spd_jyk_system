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
    const where = data.where || {};
    var data2 = {};
    data2.VARIETIE_CODE_NEW = where.VARIETIE_CODE_NEW || '';
    data2.PROD_REGISTRATION_NAME = where.PROD_REGISTRATION_NAME || '';
    data2.GG = where.GG || '';
    data2.APPROVAL_NUMBER = where.APPROVAL_NUMBER || '';
    data2.SUP_NAME = where.SUP_NAME || '';
    data2.MANUFACTURING_ENT_NAME = where.MANUFACTURING_ENT_NAME || '';
    data2.USE_DEPT = where.USE_DEPT || '';
    data2.IS_ENABLE = where.IS_ENABLE || '';
    data2.IS_HAVE = where.IS_HAVE || '';
    // 默认只查「使用」中的目录，与老页一致
    data2.IS_USE = where.IS_USE !== undefined && where.IS_USE !== null && where.IS_USE !== ''
      ? where.IS_USE
      : '1';
    data2.IS_IN_COUNTRY_IMPORT = where.IS_IN_COUNTRY_IMPORT || '';
    data2.CONTRACT_CODE = where.CONTRACT_CODE || '';
    data2.CREATE_BATCH = where.CREATE_BATCH || '';
    data2.CREATE_BATCH2 = where.CREATE_BATCH2 || '';
    data2.start_time = where.start_time || '';
    data2.end_time = where.end_time || '';
    data2.HIGH_OR_LOW_CLASS = where.HIGH_OR_LOW_CLASS || '';
    data2.HIGH_CLASS_XH = where.HIGH_CLASS_XH || '';
    data2.IS_PRICE = where.IS_PRICE || '';
    data2.KC = where.KC || '';
    data2.Token = sessionStorage.getItem(TOKEN_STORE_NAME);
    data2.page = data.page ? data.page : 1;
    data2.size = data.limit ? data.limit : 15;
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

/** 申请至在用目录（state=3） */
export async function CreateTempletDeta(data) {
    var data2 = {};
    data2.json = JSON.stringify(data);
    data2.Token = sessionStorage.getItem(TOKEN_STORE_NAME);
    // state=0 为合法值，不能用 truthy 判断
    data2.state =
      data.state !== undefined && data.state !== null && data.state !== ''
        ? data.state
        : '';
    data2.dept_two_code = data.dept_two_code ? data.dept_two_code : '';

    var rep = formdataify(data2);

    const res = await request.post('/VarietieBasicInfo/BID_VAR_INFOIsEnbaleCommit', rep);
    if (res.data.code == 200) {
        return res.data;
    } else {
        return Promise.reject(new Error(res.data.msg));
    }
}

/** 取消申请至在用目录（对齐老页 CancelBID_VAR_INFOIsEnbaleCommit，state=0） */
export async function CancelBID_VAR_INFOIsEnbaleCommit(data) {
    var data2 = {};
    data2.json = JSON.stringify(data);
    data2.Token = sessionStorage.getItem(TOKEN_STORE_NAME);
    data2.state =
      data.state !== undefined && data.state !== null && data.state !== ''
        ? data.state
        : '0';

    var rep = formdataify(data2);

    const res = await request.post(
      '/VarietieBasicInfo/CancelBID_VAR_INFOIsEnbaleCommit',
      rep
    );
    if (res.data.code == 200) {
        return res.data;
    } else {
        return Promise.reject(new Error(res.data.msg));
    }
}
