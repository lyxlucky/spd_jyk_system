import request from '@/utils/request';
import { formdataify, DataToObject } from '@/utils/formdataify';
import { TOKEN_STORE_NAME, } from '@/config/setting';
import store from '@/store';
//日期处理
import moment from 'moment';

export async function GetNaxtDayApplyPlanMain(data){
    var authorities = store.state.user.authorities;
    if(authorities.indexOf("ApplyPlan_搜索权限") !== -1){  
        data.where.CREATE_MAN = ""
    }
    var data2 = {};
    data2.Token = sessionStorage.getItem(TOKEN_STORE_NAME);
    data2.NAXT_DAT_PLAN_NUM = data.where.NAXT_DAT_PLAN_NUM ? data.where.NAXT_DAT_PLAN_NUM : '';
    data2.CREATE_MAN = data.where.CREATE_MAN ? data.where.CREATE_MAN : '';
    data2.START_TIME = data.where.date[0] ? data.where.date[0] : '';
    data2.END_TIME = data.where.date[1] ? data.where.date[1] : '';
    data2.page = data.page ? data.page : 1;
    data2.size = data.limit ? data.limit : 10;

    var data3 = formdataify(data2);
    const res = await request.post('/DeptApplyPlan/GetNaxtDayApplyPlanMain', data3);
    if (res.data.code == 200) {
        return res.data;
    } else {
        return Promise.reject(new Error(res.data.msg));
    }
}

export async function AddNaxtDayApplyPlanMain(data){
    var data2 = {};
    data2.Token = sessionStorage.getItem(TOKEN_STORE_NAME);
    data2.REMARK = data.REMARK ? data.REMARK : '';
    data2.SURGICAL_SCHEDULING_ID = data.SURGICAL_SCHEDULING_ID ? data.SURGICAL_SCHEDULING_ID : '';
    data2.SURGICAL_ROOM = data.SURGICAL_ROOM ? data.SURGICAL_ROOM : '';
    data2.SURGICAL_PLACE = data.SURGICAL_PLACE ? data.SURGICAL_PLACE : '';
    data2.CREATE_MAN = data.CREATE_MAN ? data.CREATE_MAN : '';

    var data3 = formdataify(data2);
    const res = await request.post('/DeptApplyPlan/AddNaxtDayApplyPlanMain', data3);
    if (res.data.code == 200) {
        return res.data;
    } else {
        return Promise.reject(new Error(res.data.msg));
    }
}


export async function GetNaxtDayApplyPlanDel(data){
    var data2 = {};
    data2.Token = sessionStorage.getItem(TOKEN_STORE_NAME);
    data2.VARIETIE_NAME = data.where.VARIETIE_NAME ? data.where.VARIETIE_NAME : '';
    data2.CREATE_MAN = data.where.CREATE_MAN ? data.where.CREATE_MAN : '';
    data2.MAIN_ID = data.where.MAIN_ID ? data.where.MAIN_ID : '-1';
    data2.page = data.page ? data.page : 1;
    data2.size = data.limit ? data.limit : 10;

    var data3 = formdataify(data2);
    const res = await request.post('/DeptApplyPlan/GetNaxtDayApplyPlanDel', data3);
    if (res.data.code == 200) {
        return res.data;
    } else {
        return Promise.reject(new Error(res.data.msg));
    }
}

export async function AddNaxtDayApplyPlanDel(data){
    console.log(data)
    var data2 = {};
    data2.Token = sessionStorage.getItem(TOKEN_STORE_NAME);
    data2.MAIN_ID = data.ID ? data.ID : '';
    data2.VARIETIE_CODE = data.VARIETIE_CODE ? data.VARIETIE_CODE : '';
    data2.VARIETIE_NAME = data.VARIETIE_NAME ? data.VARIETIE_NAME : '';
    data2.SPECIFICATION_OR_TYPE = data.SPECIFICATION_OR_TYPE ? data.SPECIFICATION_OR_TYPE : '';
    data2.UNIT = data.UNIT ? data.UNIT : '';
    data2.MANUFACTURING_ENT_NAME = data.MANUFACTURING_ENT_NAME ? data.MANUFACTURING_ENT_NAME : '';
    data2.APPLY_QTY = data.APPLY_QTY ? data.APPLY_QTY : '';
    data2.JP_APPLY_QTY = data.JP_APPLY_QTY ? data.JP_APPLY_QTY : '';
    data2.REMARK = data.REMARK ? data.REMARK : '';
    data2.CREATE_MAN = data.CREATE_MAN ? data.CREATE_MAN : '';

    var data3 = formdataify(data2);
    const res = await request.post('/DeptApplyPlan/AddNaxtDayApplyPlanDel', data3);
    if (res.data.code == 200) {
        return res.data;
    } else {
        return Promise.reject(new Error(res.data.msg));
    }
}

export async function AddNaxtDayApplyPlanDelBatch(data) {
    var data2 = {};
    data2.type = '0';
    data2.json = JSON.stringify(data);
    data2.Token = sessionStorage.getItem(TOKEN_STORE_NAME);

    var rep = formdataify(data2);

    const res = await request.post('/DeptApplyPlan/AddNaxtDayApplyPlanDelBatch', rep);
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


export async function upNaxtDayApplyPlanMainByState(data) {
    var data2 = {};
    data2.ID = data.ID ? data.ID : '';
    data2.STATE = data.STATE ? data.STATE : '';
    data2.Token = sessionStorage.getItem(TOKEN_STORE_NAME);

    var rep = formdataify(data2);

    const res = await request.post('/DeptApplyPlan/upNaxtDayApplyPlanMainByState', rep);
    if (res.data.code == 200) {
        return res.data;
    } else {
        return Promise.reject(new Error(res.data.msg));
    }
}


export async function UpNaxtDayApplyPlanDel(data) {
    var data2 = {};
    data2.json = JSON.stringify(data);
    data2.Token = sessionStorage.getItem(TOKEN_STORE_NAME);

    var rep = formdataify(data2);

    const res = await request.post('/DeptApplyPlan/UpNaxtDayApplyPlanDel', rep);
    if (res.data.code == 200) {
        return res.data;
    } else {
        return Promise.reject(new Error(res.data.msg));
    }
}

export async function DeleteNaxtDayApplyPlanMain(data) {
    var data2 = {};
    data2.ID = data.ID ? data.ID : '';
    data2.Token = sessionStorage.getItem(TOKEN_STORE_NAME);

    var rep = formdataify(data2);

    const res = await request.post('/DeptApplyPlan/DeleteNaxtDayApplyPlanMain', rep);
    if (res.data.code == 200) {
        return res.data;
    } else {
        return Promise.reject(new Error(res.data.msg));
    }
}


export async function CreatePperationExcel(data) {
    var data2 = {};
    data2.ID = data.ID ? data.ID : '';
    data2.NAXT_DAT_PLAN_NUM = data.NAXT_DAT_PLAN_NUM ? data.NAXT_DAT_PLAN_NUM : '';
    data2.SURGICAL_DEPT = data.SURGICAL_DEPT ? data.SURGICAL_DEPT : '';
    data2.MAIN_ID = data.MAIN_ID ? data.MAIN_ID : '';
    data2.CREATE_MAN_MAIN = data.CREATE_MAN_MAIN ? data.CREATE_MAN_MAIN : '';

    data2.VARIETIE_NAME = data.VARIETIE_NAME ? data.VARIETIE_NAME : '';
    data2.CREATE_MAN = data.CREATE_MAN ? data.CREATE_MAN : '';
    data2.page = data.page ? data.page : '1';
    data2.size = data.limit ? data.limit : '999999';
    data2.Token = sessionStorage.getItem(TOKEN_STORE_NAME);

    var rep = formdataify(data2);

    const res = await request.post('/DeptApplyPlan/CreatePperationExcel', rep);
    if (res.data.code == 200) {
        return res.data;
    } else {
        return Promise.reject(new Error(res.data.msg));
    }
}


