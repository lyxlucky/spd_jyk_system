import request from '@/utils/request';
import { formdataify, DataToObject } from '@/utils/formdataify';
import { TOKEN_STORE_NAME, } from '@/config/setting';
import store from '@/store';
//日期处理
import moment from 'moment';

export async function AddNaxtDayApplyPlanTemp(data) {
    var data2 = {};
    data2.TEMPLATE_NAME = data.TEMPLATE_NAME ? data.TEMPLATE_NAME : '';
    data2.CREATOR = data.CREATOR ? data.CREATOR : '';
    data2.Token = sessionStorage.getItem(TOKEN_STORE_NAME);

    var rep = formdataify(data2);

    const res = await request.post('/DeptApplyPlan/AddNaxtDayApplyPlanTemp', rep);
    if (res.data.code == 200) {
        return res.data;
    } else {
        return Promise.reject(new Error(res.data.msg));
    }
}

export async function GetNaxtDayApplyPlanTemp(data) {
    var data2 = {};
    data2.TEMPLATE_NAME = data.where.TEMPLATE_NAME ? data.where.TEMPLATE_NAME : '';
    data2.page = data.where.page ? data.where.page : '1';
    data2.size = data.where.limit ? data.where.limit : '99999';
    data2.Token = sessionStorage.getItem(TOKEN_STORE_NAME);

    var rep = formdataify(data2);

    const res = await request.post('/DeptApplyPlan/GetNaxtDayApplyPlanTemp', rep);
    if (res.data.code == 200) {
        return res.data;
    } else {
        return Promise.reject(new Error(res.data.msg));
    }
}

export async function GetNaxtDayApplyPlanDelTemp(data) {
    console.log(data)
    var data2 = {};
    data2.VARIETIE_NAME = data.where.VARIETIE_NAME ? data.where.VARIETIE_NAME : '';
    data2.MAIN_ID = data.where.MAIN_ID ? data.where.MAIN_ID : '';
    data2.page = data.page ? data.page : '1';
    data2.size = data.limit ? data.limit : '10';
    data2.Token = sessionStorage.getItem(TOKEN_STORE_NAME);

    var rep = formdataify(data2);

    const res = await request.post('/DeptApplyPlan/GetNaxtDayApplyPlanDelTemp', rep);
    if (res.data.code == 200) {
        return res.data;
    } else {
        return Promise.reject(new Error(res.data.msg));
    }
}



export async function DeleteNaxtDayApplyPlanDel(data) {
    var data2 = {};
    data2.ID = data.ID ? data.ID : '';
    data2.Token = sessionStorage.getItem(TOKEN_STORE_NAME);

    var rep = formdataify(data2);

    const res = await request.post('/DeptApplyPlan/DeleteNaxtDayApplyPlanDel', rep);
    if (res.data.code == 200) {
        return res.data;
    } else {
        return Promise.reject(new Error(res.data.msg));
    }
}


export async function AddNaxtDayApplyPlanTempDelBatch(data) {
    var data2 = {};
    data2.type = '0';
    data2.json = JSON.stringify(data);
    data2.Token = sessionStorage.getItem(TOKEN_STORE_NAME);

    var rep = formdataify(data2);

    const res = await request.post('/DeptApplyPlan/AddNaxtDayApplyPlanTempDelBatch', rep);
    if (res.data.code == 200) {
        return res.data;
    } else {
        return Promise.reject(new Error(res.data.msg));
    }
}


export async function UpNaxtDayApplyPlanTempDelByapplyQtyBatch(data) {
    var data2 = {};
    data2.type = '0';
    data2.json = JSON.stringify(data);
    data2.Token = sessionStorage.getItem(TOKEN_STORE_NAME);

    var rep = formdataify(data2);

    const res = await request.post('/DeptApplyPlan/UpNaxtDayApplyPlanTempDelByapplyQtyBatch', rep);
    if (res.data.code == 200) {
        return res.data;
    } else {
        return Promise.reject(new Error(res.data.msg));
    }
}

export async function DelNaxtDayApplyPlanTempDel(data) {
    var data2 = {};
    data2.ID = data.ID ? data.ID : '';
    data2.Token = sessionStorage.getItem(TOKEN_STORE_NAME);

    var rep = formdataify(data2);

    const res = await request.post('/DeptApplyPlan/DelNaxtDayApplyPlanTempDel', rep);
    if (res.data.code == 200) {
        return res.data;
    } else {
        return Promise.reject(new Error(res.data.msg));
    }
}



export async function ApplyTempNaxtDayApplyPlanDel(data) {
    var data2 = {};
    data2.ID = data.ID ? data.ID : '';
    data2.MAIN_ID = data.MAIN_ID ? data.MAIN_ID : '';
    data2.Token = sessionStorage.getItem(TOKEN_STORE_NAME);

    var rep = formdataify(data2);

    const res = await request.post('/DeptApplyPlan/ApplyTempNaxtDayApplyPlanDel', rep);
    if (res.data.code == 200) {
        return res.data;
    } else {
        return Promise.reject(new Error(res.data.msg));
    }
}


export async function DeleteNaxtDayApplyPlanTemp(data) {
    var data2 = {};
    data2.ID = data.ID ? data.ID : '';
    data2.Token = sessionStorage.getItem(TOKEN_STORE_NAME);

    var rep = formdataify(data2);

    const res = await request.post('/DeptApplyPlan/DeleteNaxtDayApplyPlanTemp', rep);
    if (res.data.code == 200) {
        return res.data;
    } else {
        return Promise.reject(new Error(res.data.msg));
    }
}