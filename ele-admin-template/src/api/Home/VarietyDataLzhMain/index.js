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

    data2.IS_CHARGE = data.where.IS_CHARGE ? data.where.IS_CHARGE : '';
    data2.HIGH_OR_LOW_CLASS = data.where.HIGH_OR_LOW_CLASS ? data.where.HIGH_OR_LOW_CLASS : '';
    data2.IS_BIDDING = data.where.IS_BIDDING ? data.where.IS_BIDDING : '';
    data2.SPECIAL_PURCHASE = data.where.SPECIAL_PURCHASE ? data.where.SPECIAL_PURCHASE : '';
    data2.ONEOFF_STERILIZATION_PACKAGING = data.where.ONEOFF_STERILIZATION_PACKAGING ? data.where.ONEOFF_STERILIZATION_PACKAGING : '';
    data2.STORAGE_TYPE = data.where.STORAGE_TYPE ? data.where.STORAGE_TYPE : '';
    data2.IS_EMBEDDED = data.where.IS_EMBEDDED ? data.where.IS_EMBEDDED : '';
    data2.IS_SERIAL_NUMBER = data.where.IS_SERIAL_NUMBER ? data.where.IS_SERIAL_NUMBER : '';
    data2.IS_INTERVENED = data.where.IS_INTERVENED ? data.where.IS_INTERVENED : '';
    data2.IS_PROTECT = data.where.IS_PROTECT ? data.where.IS_PROTECT : '';
    data2.HIGH_OR_LOW_CLASS_TWO = data.where.HIGH_OR_LOW_CLASS_TWO ? data.where.HIGH_OR_LOW_CLASS_TWO : '';
    data2.IS_EQUIPMENT_CHANGE = data.where.IS_EQUIPMENT_CHANGE ? data.where.IS_EQUIPMENT_CHANGE : '';
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

    // data2.page = data.page ? data.page : 1;
    // data2.size = data.limit ? data.limit : 30;
    data2.field = data.field ? data.field : '';


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
