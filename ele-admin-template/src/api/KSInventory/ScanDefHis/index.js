import request from '@/utils/request';
import { formdataify, DataToObject, GetGuid } from '@/utils/formdataify';
import { TOKEN_STORE_NAME, } from '@/config/setting';

export async function SerachDef2Consume4PDA(data) {
    var data2 = {};
    data2.page = data.page;
    data2.size = data.limit;
    data2.Token = sessionStorage.getItem(TOKEN_STORE_NAME);
    data2.deptTwoName = data.where.deptTwoName ? data.where.deptTwoName : '';
    data2.varietie = data.where.varietie ? data.where.varietie : '';
    data2.specType = data.where.specType ? data.where.specType : '';
    data2.defNoPkgCode = data.where.defNoPkgCode ? data.where.defNoPkgCode : '';
    data2.contractCode = data.where.contractCode ? data.where.contractCode : '';
    data2.supplierName = data.where.supplierName ? data.where.supplierName : '';
    

    DataToObject(data, data2)
    if (data != null) {
        var data3 = formdataify(data);
    }
    const res = await request.post('/DeptConsume/SerachDef2Consume4PDA', data3);
    if (res.data.code == 200) {
        return res.data;
    } else {
        return Promise.reject(new Error(res.data.msg));
    }
}

export async function insertScanDef(data) {
    var data2 = {};
    data2.Token = sessionStorage.getItem(TOKEN_STORE_NAME);
    data2.DEF_NO_PKG_CODE = data.defNoPkgCode ? data.defNoPkgCode : '';
    const [code, description] = data.bindMachine.split("/");
    data2.INSTRUMENT_CODE = code ? code : '';
    data2.INSTRUMENT_NAME = description ? description : '';
    if (data2 != null) {
        var data3 = formdataify(data2);
    }
    const res = await request.post('/DeptConsume/insertScanDef', data3);
    if (res.data.code == 200) {
        return res.data;
    } else {
        return Promise.reject(new Error(res.data.msg));
    }
}

export async function delScanDef(data) {
    var data2 = {};
    data2.idJosn = data.idJosn ? data.idJosn : '';
    data2.staff = data.staff ? data.staff : '';
    data2.Token = sessionStorage.getItem(TOKEN_STORE_NAME);

    var rep = formdataify(data2)
    const res = await request.post('/DeptConsume/delScanDef', rep);
    if (res.data.code == 200) {
        return res.data;
    } else {
        return Promise.reject(new Error(res.data.msg));
    }
}

export async function spdScanConsume(data) {
    var data2 = {};
    data2.idJosn = data.idJosn ? data.idJosn : '';
    data2.staff = data.staff ? data.staff : '';
    data2.deptTwoCode = data.deptTwoCode ? data.deptTwoCode : '';
    data2.user = data.user ? data.user : '';
    data2.password = data.password ? data.password : '';
    // data2.AesKey = data.AesKey ? data.AesKey : GetGuid();
    data2.AesKey = data.AesKey ? data.AesKey : '';
    data2.hp = data.hp ? data.hp : 'bd';
    data2.Token = sessionStorage.getItem(TOKEN_STORE_NAME);
    var rep = formdataify(data2)
    const res = await request.post('/DeptConsume/spdScanConsume', rep);
    if (res.data.code == 200) {
        return res.data;
    } else {
        return Promise.reject(new Error(res.data.msg));
    }
}