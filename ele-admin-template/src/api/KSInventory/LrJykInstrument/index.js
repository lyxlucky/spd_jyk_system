import request from '@/utils/request';
import { formdataify, DataToObject } from '@/utils/formdataify';
import store from '@/store';
import { TOKEN_STORE_NAME } from '@/config/setting';


/* 获取补货数据*/
export async function GetLrJykInstrument(data) {
    var data2 = {};
    data2.Token = sessionStorage.getItem(TOKEN_STORE_NAME);
    data2.page = data.page ? data.page : 1;
    data2.size = data.limit ? data.limit : 9999;
    data2.INSTRUMENT_NAME = data.where.INSTRUMENT_NAME ? data.where.INSTRUMENT_NAME : '';
    data2.WORKING_GROUP = data.where.WORKING_GROUP ? data.where.WORKING_GROUP : '';

    DataToObject(data, data2)
    if (data != null) {
        var data3 = formdataify(data);
    }
    const res = await request.post('/DeptApplyPlan/GetLrJykInstrument', data3);
    if (res.data.code == 200) {
        return res.data;
    } else {
        return Promise.reject(new Error(res.data.msg));
    }
}


export async function GetbindUseMachin(data) {
    var data2 = {};
    data2.Token = sessionStorage.getItem(TOKEN_STORE_NAME);
    data2.page = data.page;
    data2.size = data.limit;
    data2.BIND_MACHINE = data.where.BIND_MACHINE ? data.where.BIND_MACHINE : '';
    data2.BIND_DEF = data.where.BIND_DEF ? data.where.BIND_DEF : '';

    DataToObject(data, data2)
    if (data != null) {
        var data3 = formdataify(data);
    }
    const res = await request.post('/DeptConsume/GetbindUseMachin', data3);
    if (res.data.code == 200) {
        return res.data;
    } else {
        return Promise.reject(new Error(res.data.msg));
    }
}




export async function DelbindUseMachinRecord(data) {
    var data2 = {};
    data2.Token = sessionStorage.getItem(TOKEN_STORE_NAME);
    data2.ID = data.ID ? data.ID : '';

    DataToObject(data, data2)
    if (data != null) {
        var data3 = formdataify(data);
    }
    const res = await request.post('/DeptConsume/DelbindUseMachinRecord', data3);
    if (res.data.code == 200) {
        return res.data;
    } else {
        return Promise.reject(new Error(res.data.msg));
    }
}


export async function bindUseMachin(data) {
    var data2 = {};
    data2.Token = sessionStorage.getItem(TOKEN_STORE_NAME);
    data2.ID = data.ID ? data.ID : '';
    data2.spd = "";
    data2.bindMan = store.state.user.info.Nickname ?? '';
    data2.bindMachine = data.bindMachine ? data.bindMachine : '';
    data2.bindDef = data.bindDef ? data.bindDef : '';
    data2.type = data.type ? data.type : '';

    DataToObject(data, data2)
    if (data != null) {
        var data3 = formdataify(data);
    }
    const res = await request.post('/DeptConsume/bindUseMachin', data3);
    if (res.data.code == 200) {
        return res.data;
    } else {
        return Promise.reject(new Error(res.data.msg));
    }
}

