import request from '@/utils/request';
import { formdataify, DataToObject } from '@/utils/formdataify';
import { TOKEN_STORE_NAME, } from '@/config/setting';
import { Encrypt } from '@/utils/aes-util';
import store from '@/store';
//日期处理
import moment from 'moment';

export async function QueryPageLayUI(data) {

    console.log(data)

    var data2 = {};
    data2.Token = sessionStorage.getItem(TOKEN_STORE_NAME);
    data2.varietieCode = data.where.varietieCode ? data.where.varietieCode : '';
    data2.enable = data.where.enable ? data.where.enable : '';
    data2.varietieName = data.where.varietieName ? data.where.varietieName : '';
    data2.enable = data.where.enable ? data.where.enable : '';
    data2.state = data.where.state ? data.where.state : '';

    data2.IS_CHARGE = data.where.IS_CHARGE ? data.where.IS_CHARGE : '-1';
    data2.HIGH_OR_LOW_CLASS = data.where.HIGH_OR_LOW_CLASS ? data.where.HIGH_OR_LOW_CLASS : '-1';
    data2.IS_BIDDING = data.where.IS_BIDDING ? data.where.IS_BIDDING : '-1';
    data2.SPECIAL_PURCHASE = data.where.SPECIAL_PURCHASE ? data.where.SPECIAL_PURCHASE : '-1';
    data2.ONEOFF_STERILIZATION_PACKAGING = data.where.ONEOFF_STERILIZATION_PACKAGING ? data.where.ONEOFF_STERILIZATION_PACKAGING : '-1';
    data2.STORAGE_TYPE = data.where.STORAGE_TYPE ? data.where.STORAGE_TYPE : '-1';
    data2.IS_EMBEDDED = data.where.IS_EMBEDDED ? data.where.IS_EMBEDDED : '-1';
    data2.IS_SERIAL_NUMBER = data.where.IS_SERIAL_NUMBER ? data.where.IS_SERIAL_NUMBER : '-1';
    data2.IS_INTERVENED = data.where.IS_INTERVENED ? data.where.IS_INTERVENED : '-1';
    data2.IS_PROTECT = data.where.IS_PROTECT ? data.where.IS_PROTECT : '-1';
    data2.HIGH_OR_LOW_CLASS_TWO = data.where.HIGH_OR_LOW_CLASS_TWO ? data.where.HIGH_OR_LOW_CLASS_TWO : '-1';
    data2.IS_EQUIPMENT_CHANGE = data.where.IS_EQUIPMENT_CHANGE ? data.where.IS_EQUIPMENT_CHANGE : '-1';
    data2.PRICE_CHANGE_TIME = data.where.PRICE_CHANGE_TIME ? data.where.PRICE_CHANGE_TIME : '';
    data2.priceChangeTimeStart = data.where.priceChangeTimeStart ? data.where.priceChangeTimeStart : '';
    data2.priceChangeTimeEnd = data.where.priceChangeTimeEnd ? data.where.priceChangeTimeEnd : '';
    data2.updateTime = data.where.updateTime ? data.where.updateTime : '';
    data2.APPROVAL_STATE = data.where.APPROVAL_STATE ? data.where.APPROVAL_STATE : '';
    data2.HIGH_CLASS_XH = data.where.HIGH_CLASS_XH ? data.where.HIGH_CLASS_XH : '';
    data2.SENDYB_STATE = data.where.SENDYB_STATE ? data.where.SENDYB_STATE : '';
    data2.SCQY = data.where.SCQY ? data.where.SCQY : '';
    data2.ZCZ = data.where.ZCZ ? data.where.ZCZ : '';
    data2.SUP = data.where.SUP ? data.where.SUP : '';
    data2.vdzh_sx = data.where.vdzh_sx ? data.where.vdzh_sx : '';
    data2.VARSB_STATE = data.where.VARSB_STATE ? data.where.VARSB_STATE : '';
    data2.VARYB_STATE = data.where.VARYB_STATE ? data.where.VARYB_STATE : '';
    data2.VARJF_STATE = data.where.VARJF_STATE ? data.where.VARJF_STATE : '';
    data2.VARSPD_STATE = data.where.VARSPD_STATE ? data.where.VARSPD_STATE : '';
    data2.Specification_Or_Type = data.where.Specification_Or_Type ? data.where.Specification_Or_Type : '';
    data2.VARBZ_STATE = data.where.VARBZ_STATE ? data.where.VARBZ_STATE : '';
    data2.VAROES_STATE = data.where.VAROES_STATE ? data.where.VAROES_STATE : '';
    data2.FSWY_STATE = data.where.FSWY_STATE ? data.where.FSWY_STATE : '';
    data2.enableChargingCode = data.where.enableChargingCode ? data.where.enableChargingCode : '';
    data2.YG_CODE = data.where.YG_CODE ? data.where.YG_CODE : '';
    data2.MEDICAL_CODE = data.where.MEDICAL_CODE ? data.where.MEDICAL_CODE : '';
    data2.PROVINCE_PLATFORM_CODE = data.where.PROVINCE_PLATFORM_CODE ? data.where.PROVINCE_PLATFORM_CODE : '';
    data2.UDI_TOP = data.where.UDI_TOP ? data.where.UDI_TOP : '';
    data2.BZ_TI = data.where.BZ_TI ? data.where.BZ_TI : '';
    data2.JF_BJ = data.where.JF_BJ ? data.where.JF_BJ : '';
    data2.IS_HANG_UP = data.where.IS_HANG_UP ? data.where.IS_HANG_UP : '';
    // 对齐老系统 buildVarietyQueryPrams 缺失的参数
    data2.Y_M_P_CODE = data.where.Y_M_P_CODE ? data.where.Y_M_P_CODE : '';
    data2.STSEHIS_STATE = data.where.STSEHIS_STATE ? data.where.STSEHIS_STATE : '';
    data2.HOSPITAL_SYNC = data.where.HOSPITAL_SYNC ? data.where.HOSPITAL_SYNC : '';
    data2.CLASS_ONE = data.where.CLASS_ONE ? data.where.CLASS_ONE : '';
    data2.CLASS_TWO = data.where.CLASS_TWO ? data.where.CLASS_TWO : '';
    data2.CLASS_THREE = data.where.CLASS_THREE ? data.where.CLASS_THREE : '';
    data2.CLASSIFIC_PROPERTIES3 = data.where.CLASSIFIC_PROPERTIES3 ? data.where.CLASSIFIC_PROPERTIES3 : '';
    data2.VAR_CREATETIMESTART = data.where.VAR_CREATETIMESTART ? data.where.VAR_CREATETIMESTART : '';
    data2.VAR_CREATETIMEEND = data.where.VAR_CREATETIMEEND ? data.where.VAR_CREATETIMEEND : '';

    // data2.page = data.page ? data.page : 1;
    // data2.size = data.limit ? data.limit : 30;
    data2.field = (typeof data.field === 'string') ? data.field : '';
    // 对齐老系统：order 必须为字符串（"asc"/"desc"），而不是对象
    data2.order = (typeof data.order === 'string') ? data.order : '';


    var pramsStr = Encrypt(JSON.stringify(data2))

    var inArray = {
        prams: pramsStr,
        AesKey: store.state.user.encrypted.KEY,
        page: data.page ? data.page : 1,
        size: data.limit ? data.limit : 30,
    }
    var data3 = formdataify(inArray);

    const res = await request.post('/VarietieBasicInfo/QueryPageLayUI', data3);
    if (res.data.code == 200) {
        return res.data;
    } else {
        return Promise.reject(new Error(res.data.msg));
    }
}

// ========== 定数包品种维护 ==========

// 加载定数包品种列表
export async function GetDefinitePkgList(data) {
    const Token = sessionStorage.getItem(TOKEN_STORE_NAME);
    const params = {
        Token,
        VARIETIE_CODE: data.VARIETIE_CODE || '',
        VARIETIE_NAME: data.VARIETIE_NAME || '',
        wheres: data.wheres || 1,
        page: data.page || 1,
        size: data.size || 30
    };
    const res = await request.get('/VarietieBasicInfo/GetDefinitePkgListpackage', { params });
    if (res.data.code == 200 || res.data.code === '200') {
        return res.data;
    } else {
        return Promise.reject(new Error(res.data.msg));
    }
}

// 加载定数包系数方案详情
export async function GetDefinitePkgDetail(data) {
    const Token = sessionStorage.getItem(TOKEN_STORE_NAME);
    const res = await request.get('/VarietieBasicInfo/GetDefinitePkgALL', {
        params: { Token, varietieCode: data.varietieCode }
    });
    if (res.data.code == 200 || res.data.code === '200') {
        return res.data;
    } else {
        return Promise.reject(new Error(res.data.msg));
    }
}

// 添加定数包系数
export async function InsertDefinite(data) {
    const Token = sessionStorage.getItem(TOKEN_STORE_NAME);
    const res = await request.post('/VarietieBasicInfo/InsertDefinite', formdataify({
        Token,
        DeCodeGuid: data.coefficient,
        varietieCode: data.varietieCode
    }));
    return res.data;
}

// 修改定数包系数
export async function UpdateDefinite(data) {
    const Token = sessionStorage.getItem(TOKEN_STORE_NAME);
    const res = await request.post('/VarietieBasicInfo/UpdateDefinite', formdataify({
        Token,
        DeCodeGuid: data.pkgCode,
        DePkgConefficient: data.coefficient,
        Enable: data.enable
    }));
    return res.data;
}

// 删除定数包系数
export async function DeleteDefinite(data) {
    const Token = sessionStorage.getItem(TOKEN_STORE_NAME);
    const res = await request.post('/VarietieBasicInfo/DeleteDefinite', formdataify({
        Token,
        PkgCode: data.pkgCode
    }));
    return res.data;
}

// 检查是否可以删除定数包
export async function CheckVarietieBasic(data) {
    const Token = sessionStorage.getItem(TOKEN_STORE_NAME);
    const res = await request.get('/VarietieBasicInfo/CheckVarietieBasic', {
        params: { Token, VarietieCode: data.varietieCode, nickname: data.nickname || '' }
    });
    return res.data;
}

// 检查定数包系数是否重复
export async function IsCoefficientSame(data) {
    const Token = sessionStorage.getItem(TOKEN_STORE_NAME);
    const res = await request.get('/Contract/Iscoefficientsame', {
        params: {
            Token,
            varietie_code: data.varietieCode,
            def_no_pkg_coefficient: data.coefficient
        }
    });
    return res.data;
}

// 获取品种详情信息（用于新建定数包时展示品种基本信息）
export async function GetVarietyDetailsInfo(varietieCode) {
    const Token = sessionStorage.getItem(TOKEN_STORE_NAME);
    const res = await request.get('/VarietieBasicInfo/GetDetailsInfo', {
        params: { Token, VarietieCode: varietieCode }
    });
    return res.data;
}

// 导入定数包系数
export async function ImportDefinitePackages(formData) {
    const Token = sessionStorage.getItem(TOKEN_STORE_NAME);
    const res = await request.post(`/VarietieBasicInfo/ImportDefinitePackages?Token=${encodeURIComponent(Token)}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 120000
    });
    return res.data;
}
