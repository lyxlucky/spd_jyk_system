import request from '@/utils/request';
import { formdataify, DataToObject } from '@/utils/formdataify';
import { B2B_BASE_CODE, B2B_BASE_URL,HOME_HP } from '@/config/setting';
import { TOKEN_STORE_NAME } from '@/config/setting';
import { toDateString } from 'ele-admin';
import store from '@/store/index';
import { Decrypt } from '@/utils/aes-util.js';

export async function getSupplierList(data) {
    let formataData = {}
    formataData.Token = sessionStorage.getItem(TOKEN_STORE_NAME);
    formataData.page = data.page;
    formataData.size = data.limit;
    formataData.keyword = data.where.search ? data.where.search : '';
    formataData.state = '';
    formataData.field = '';
    formataData.order = '';
    formataData.enable = data.where.value ? data.where.value : '1';
    formataData.supZzState = data.where.supplierValue ? data.where.supplierValue : '0';
    formataData.varZzState = data.where.varietieValue ? data.where.varietieValue : '';
    let req = formdataify(formataData);
    const res = await request.post('/Supplier/GetListZzsh',req);
    const isEncrypt = store.state.user.isEncrypt;
    if(isEncrypt){
        const devData = JSON.parse(Decrypt(res.data.devData))
        if (devData.code == 200) {
            return devData;
        } else {
            return Promise.reject(new Error(devData.msg));
        }
    }else{

        if (res.data.code == 200) {
            return res.data;
        } else {
            return Promise.reject(new Error(res.data.msg));
        }

    }
}

export async function getRegistrationList(data){
    let formataData = {}
    formataData.Token = sessionStorage.getItem(TOKEN_STORE_NAME);
    formataData.page = data.page;
    formataData.size = data.limit;
    formataData.APPROVAL_NUMBER = data.where.registrationNumber ? data.where.registrationNumber : '';
    formataData.PROD_REGISTRATION_NAME = data.where.registrationName ? data.where.registrationName : '';
    formataData.SB_SH_STATE = data.where.isEquipmentCheck ? data.where.isEquipmentCheck : '';
    formataData.YG_SH_STATE = data.where.isHospitalAudioCheck ? data.where.isHospitalAudioCheck : '';
    formataData.SUPPLIER_CODE = data.where.Supplier_Code ? data.where.Supplier_Code : '';
    formataData.XZ_COUNT = data.where.isIncludeNewParticulars ? data.where.isIncludeNewParticulars : '1';
    let req = formdataify(formataData);
    const res = await request.post('/VarietieBasicInfo/getPROD_REGISTRATION_BA_INFO',req);
    const isEncrypt = store.state.user.isEncrypt;
    if(isEncrypt){
        
        const devData = JSON.parse(Decrypt(res.data.devData))
        if (devData.code == 200) {
            return devData;
        } else {
            return Promise.reject(new Error(devData.msg));
        }

    }else{

        if (res.data.code == 200) {
            return res.data;
        } else {
            return Promise.reject(new Error(res.data.msg));
        }

    }
}

export async function GetIdProdInfo(data) {
    let formataData = {}
    formataData.Token = sessionStorage.getItem(TOKEN_STORE_NAME);
    formataData.id = data ? data : '';
    const res = await request.get('/ProdInfo/GetIdProdInfo', {
        params: formataData
      });
    if (res.data.code == 200) {
        return res.data;
    } else {
        return Promise.reject(new Error(res.data.msg));
    }
}

export async function GetProTypeList() {
    let formataData = {}
    formataData.Token = sessionStorage.getItem(TOKEN_STORE_NAME);
    const res = await request.get('/ProdBigClass/GetProTypeList', {
        params: formataData
      });
    if (res.data.code == 200) {
        return res.data;
    } else {
        return Promise.reject(new Error(res.data.msg));
    }
}

export async function getVarPic(data) {
    let formataData = {}
    formataData.Token = sessionStorage.getItem(TOKEN_STORE_NAME);
    formataData.VARIETIE_CODE = '';
    formataData.PROD_REGISTRATION_CODE = data;
    formataData.isUse = '1';
    formataData.page = 1;
    formataData.size = 99999;
    let req = formdataify(formataData);
    const res = await request.post('/BtbGetVarietie/getVarPic',req);
    if (res.data.code == 200) {
        return res.data;
    } else {
        return Promise.reject(new Error(res.data.msg));
    }
}

export async function getVarPic2(data) {
    let formataData = {}
    formataData.Token = sessionStorage.getItem(TOKEN_STORE_NAME);
    formataData.page = data.page;
    formataData.size = data.limit;
    formataData.PROD_REGISTRATION_CODE = data.code ? data.code : '';
    formataData.TYPE = data.where.type ? data.where.type : '';
    formataData.SUPPLIER_CODE = '';
    formataData.STATE = data.where.state ? data.where.state : '';
    let req = formdataify(formataData);
    const res = await request.post('/BtbGetVarietie/getVarPic',req);
    if (res.data.code == 200) {
        return res.data;
    } else {
        return Promise.reject(new Error(res.data.msg));
    }
}

export async function ApproveVarPic(data) {
    let formataData = {}
    formataData.Token = sessionStorage.getItem(TOKEN_STORE_NAME);
    formataData.json = data.json ? data.json : '';
    formataData.appman = store.state.user.info.Nickname;
    formataData.appstate = data.appstate;
    if(data.appstate && data.appstate == 2){
        formataData.PASS_REASON = data.PASS_REASON ? data.PASS_REASON : '';
    }
    let req = formdataify(formataData);
    const res = await request.post('/BtbGetVarietie/ApproveVarPic',req);
    if (res.data.code == 200) {
        return res.data;
    } else {
        return Promise.reject(new Error(res.data.msg));
    }
}

export async function PicVarDiscardUse(data) {
    let formataData = {}
    formataData.Token = sessionStorage.getItem(TOKEN_STORE_NAME);
    formataData.IDS = data.ids;
    let req = formdataify(formataData);
    const res = await request.post('/BtbGetVarietie/PicVarDiscardUse',req);
    if (res.data.code == 200) {
        return res.data;
    } else {
        return Promise.reject(new Error(res.data.msg));
    }
}

export async function deleteVarPic(data) {
    let formataData = {}
    formataData.Token = sessionStorage.getItem(TOKEN_STORE_NAME);
    formataData.ID = data.id;
    formataData.TYPE = '1';
    let req = formdataify(formataData);
    const res = await request.post('/BtbGetVarietie/deleteVarPic',req);
    if (res.data.code == 200) {
        return res.data;
    } else {
        return Promise.reject(new Error(res.data.msg));
    }
}

export async function getFactory(data) {
    let formataData = {}
    formataData.Token = sessionStorage.getItem(TOKEN_STORE_NAME);
    formataData.page = data.page;
    formataData.size = data.limit;
    formataData.MANUFACTURING_ENT_NAME = data.where.MANUFACTURING_ENT_NAME ? data.where.MANUFACTURING_ENT_NAME : '';
    const [startTime, endTime] = data.where.date ? data.where.date : ['', ''];
    formataData.startTime = startTime;
    formataData.endTime = endTime;
    let req = formdataify(formataData);
    const res = await request.post('/ProdInfo/getMANUFACTURING_ENT',req);
    if (res.data.code == 200) {
        return res.data;
    } else {
        return Promise.reject(new Error(res.data.msg));
    }
}

export async function GetMgmtListByProTypeID(data) {
    let formataData = {}
    formataData.Token = sessionStorage.getItem(TOKEN_STORE_NAME);
    formataData.Prod_Big_Class_Code = data ? data : '';
    const res = await request.get('/ProdBigClass/GetMgmtListByProTypeID', {
        params: formataData
      });
    if (res.data.code == 200) {
        return res.data;
    } else {
        return Promise.reject(new Error(res.data.msg));
    }
}


export async function GetRegulatoryListByMgmnID(data) {
    let formataData = {}
    formataData.Token = sessionStorage.getItem(TOKEN_STORE_NAME);
    formataData.Mgmt_Cat_Code = data;
    formataData.page = 1;
    formataData.size = 9999;
    formataData.keyword = '';
    const res = await request.get('/ProdBigClass/GetRegulatoryListByMgmnID', {
        params: formataData
      });
    if (res.data.code == 200) {
        return res.data;
    } else {
        return Promise.reject(new Error(res.data.msg));
    }
}

export async function UpDateProdInfo(data) {
    let formataData = {}
    formataData.Token = sessionStorage.getItem(TOKEN_STORE_NAME);
    formataData.PROD_REGISTRATION_CODE = data.where.current.PROD_REGISTRATION_CODE ?? '';
    formataData.PROD_REGISTRATION_NAME = data.where.current.PROD_REGISTRATION_NAME ?? '';
    formataData.MANUFACTURING_ENT_NAME = data.where.current.MANUFACTURING_ENT_NAME ?? '';
    formataData.ST_MANUFACTURING_ENT_NAME = data.where.current.ST_MANUFACTURING_ENT_NAME ?? '';
    formataData.APPROVAL_NUMBER = data.where.current.APPROVAL_NUMBER ?? '';
    formataData.REGISTRATION_ISSUING_DATE = toDateString(data.where.current.REGISTRATION_ISSUING_DATE,'yyyy-MM-dd')
    formataData.REGISTRATION_VALID_DATE = toDateString(data.where.current.REGISTRATION_VALID_DATE,'yyyy-MM-dd')
    formataData.REGULATORY_CAT_CODE = data.where.current.SUPERVISE_CAT_CODE ?? '';
    formataData.NOTE_DESCRIPTION = data.where.current.NOTE_DESCRIPTION ?? '';
    formataData.OLD_PROD_REGISTRATION_CODE = data.where.current.OLD_PROD_REGISTRATION_CODE ?? '';
    formataData.LICENCE_FILE_PATH = data.where.current.LICENCE_FILE_PATH ?? '';
    formataData.TRADE_TYPE = data.where.current.TRADE_TYPE ?? '';
    formataData.FOREIGN_REGIST_NAME = data.where.current.FOREIGN_REGIST_NAME ?? '';
    formataData.MANUFACTURING_LICENSE = data.where.current.MANUFACTURING_LICENSE ?? '';
    formataData.Brand = data.where.current.Brand ?? '';
    formataData.MEDICAL_CODE = data.where.current.MEDICAL_CODE ?? '';
    formataData.ChangVarName = data.where.current.ChangVarName ?? '';
    formataData.QXBZ = data.where.current.QXBZ ?? '';
    formataData.Nickname = store.state.user.info.Nickname ?? '';
    formataData.PRODUCTION_SITE = data.where.current.PRODUCTION_SITE ?? '';
    formataData.LEGAL_PERSON = data.where.current.LEGAL_PERSON ?? '';
    formataData.STRUCTURE_COMPOSITION = data.where.current.STRUCTURE_COMPOSITION ?? '';
    formataData.HIS_PROD_END_TIME = data.where.current.HIS_PROD_END_TIME ? toDateString(data.where.current.HIS_PROD_END_TIME,"yyyy-MM-dd") : '1970-01-01'
    formataData.SCOPE_APPLICATION = data.where.current.SCOPE_APPLICATION ?? '';
    formataData.STORAGE_CONDITION = data.where.current.STORAGE_CONDITION ?? '';
    formataData.EDITPROD_PROD = data.EDITPROD_PROD ?? '';
    formataData.EDITPROD_MGMT = data.EDITPROD_MGMT ?? '';
    formataData.EDITPROD_REG = data.EDITPROD_REG ?? '';
    let req = formdataify(formataData);
    const res = await request.post('/ProdInfo/UpDateProdInfo',req);
    return res;
}

export async function upPROD_REGISTRATION_BA_INFO(data) {
    let formataData = {}
    formataData.Token = sessionStorage.getItem(TOKEN_STORE_NAME);
    formataData.type = data.type;
    formataData.json = data.json;
    let req = formdataify(formataData);
    const res = await request.post('/VarietieBasicInfo/upPROD_REGISTRATION_BA_INFO',req);
    if (res.data.code == 200) {
        return res.data;
    } else {
        return Promise.reject(new Error(res.data.msg));
    }
}

export async function spdGetSupplierInfoForZong(data) {
    let formataData = {}
    formataData.page = data.page;
    formataData.size = data.limit;
    formataData.supName = data.where.supName ? data.where.supName : '';
    formataData.hospitalName = data.where.hospitalName ? data.where.hospitalName : '';
    formataData.hospitalId = B2B_BASE_CODE;
    const res = await fetch(`${B2B_BASE_URL}/api/Supplier/spdGetSupplierInfoForZong`,{
        method: 'POST',
        body:formdataify(formataData)
    }).then(response => response.json())
    if (res.code == 200) {
        return res;
    } else {
        return Promise.reject(new Error(res.msg));
    }
}

export async function DownZmlSup(data) {
    let formataData = {}
    formataData.Token = sessionStorage.getItem(TOKEN_STORE_NAME);
    formataData.hp = HOME_HP;
    formataData.json = data.json;
    let req = formdataify(formataData);
    const res = await request.post('/BtbGetVarietie/DownZmlSup',req);
    if (res.data.code == 200) {
        return res.data;
    } else {
        return Promise.reject(new Error(res.data.msg));
    }
}

export async function DownZmlSupJyk(data) {
    let formataData = {}
    formataData.Token = sessionStorage.getItem(TOKEN_STORE_NAME);
    formataData.hp = HOME_HP;
    formataData.json = data.json;
    let req = formdataify(formataData);
    const res = await request.post('/BtbGetVarietie/DownZmlSupJyk',req);
    if (res.data.code == 200) {
        return res.data;
    } else {
        return Promise.reject(new Error(res.data.msg));
    }
}

export async function appZongSupInfo(data) {
    let formataData = {}
    formataData.Token = sessionStorage.getItem(TOKEN_STORE_NAME);
    formataData.state = data.state;
    formataData.SUPPLIER_CODE = data.code;
    formataData.mark = data.mark;
    let req = formdataify(formataData);
    const res = await request.post('/Supplier/appZongSupInfo',req);
    if (res.data.code == 200) {
        return res.data;
    } else {
        return Promise.reject(new Error(res.data.msg));
    }
}

export async function getNewList(data) {
    const formatData = {
        Token: sessionStorage.getItem(TOKEN_STORE_NAME),
        page: data.page,
        size: data.limit,
        supCode: data.where.code,
    }
    let req = formdataify(formatData);
    const res = await request.post('/Supplier/GetNewList',req);
    if (res.data.code == 200) {
        return res.data;
    } else {
        return Promise.reject(new Error(res.data.msg));
    }
}

export async function updatePushSupplierStatu(data) {
    const formatData = {
        Token: sessionStorage.getItem(TOKEN_STORE_NAME),
        ids: data.ids,
        type: data.type,
    }
    let req = formdataify(formatData);
    const res = await request.post('/Supplier/updatePushSupplierStatu',req);
    if (res.data.code == 200) {
        return res.data;
    } else {
        return Promise.reject(new Error(res.data.msg));
    }
}

export async function GetLogInfoList(data) {
    const formatData = {
        Token: sessionStorage.getItem(TOKEN_STORE_NAME),
        page: data.page,
        size: data.limit,
        value: data.where.value,
    }
    let req = formdataify(formatData);
    const res = await request.post('/Supplier/GetLogInfoList',req);
    if (res.data.code == 200) {
        return res.data;
    } else {
        return Promise.reject(new Error(res.data.msg));
    }
}

export async function updateQxbz(data) {
    const formatData = {
        Token: sessionStorage.getItem(TOKEN_STORE_NAME),
        id: data.id,
        qxbz: data.qxbz,
    }
    let req = formdataify(formatData);
    const res = await request.post('/Supplier/updateQxbz',req);
    if (res.data.code == 200) {
        return res.data;
    } else {
        return Promise.reject(new Error(res.data.msg));
    }
}