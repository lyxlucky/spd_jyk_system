import request from '@/utils/request';
import { formdataify, DataToObject } from '@/utils/formdataify';
import { TOKEN_STORE_NAME } from '@/config/setting';
import store from '@/store/index';

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
    const res = await request.get('/Supplier/GetList', {
        params: formataData
      });
    if (res.data.code == 200) {
        return res.data;
    } else {
        return Promise.reject(new Error(res.data.msg));
    }
}

export async function getRegistrationList(data){
    //console.log(data)
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
    if (res.data.code == 200) {
        return res.data;
    } else {
        return Promise.reject(new Error(res.data.msg));
    }
}

export async function GetIdProdInfo(data) {
    let formataData = {}
    formataData.Token = sessionStorage.getItem(TOKEN_STORE_NAME);
    formataData.id = data ? data : '';
    const res = await request.get('ProdInfo/GetIdProdInfo', {
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
    const res = await request.get('ProdBigClass/GetProTypeList', {
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
    const res = await request.post('BtbGetVarietie/getVarPic',req);
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
    const res = await request.post('BtbGetVarietie/getVarPic',req);
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
    const res = await request.post('BtbGetVarietie/ApproveVarPic',req);
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
    const res = await request.post('BtbGetVarietie/PicVarDiscardUse',req);
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
    const res = await request.post('BtbGetVarietie/deleteVarPic',req);
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
    const res = await request.post('ProdInfo/getMANUFACTURING_ENT',req);
    if (res.data.code == 200) {
        return res.data;
    } else {
        return Promise.reject(new Error(res.data.msg));
    }
}
