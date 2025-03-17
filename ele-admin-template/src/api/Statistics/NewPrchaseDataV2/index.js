import request from '@/utils/request';
import { formdataify } from '@/utils/formdataify';
import { TOKEN_STORE_NAME } from '@/config/setting'

import store from '@/store/index';

export async function getPROD_REGISTRATION_LIMIT_BUYV2List(data) {
    console.log("data", data);
    let formataData = {};
    formataData.Token = sessionStorage.getItem(TOKEN_STORE_NAME);

    formataData.PROD_REGISTRATION_NAME =data.where.PROD_REGISTRATION_NAME;
    formataData.APPROVAL_NUMBER =data.where.APPROVAL_NUMBER;
    formataData.MANUFACTURING_ENT_NAME =data.where.MANUFACTURING_ENT_NAME;
    formataData.SOURCE_FROM =data.where.SOURCE_FROM;
    formataData.statrTime =data.where.statrTime;
    formataData.endTime =data.where.endTime;
    formataData.statrTime2 =data.where.statrTime2;
    formataData.endTime2 =data.where.endTime2;
    formataData.CountState =data.where.CountState;
    formataData.order =data.where.order;
    formataData.field =data.where.field;
    formataData.last =data.where.last;
    formataData.XM_NAME =data.where.XM_NAME;
    formataData.XM_NUM =data.where.XM_NUM;
    formataData.XM_TYPE =data.where.XM_TYPE;
    formataData.PRICE_STR =data.where.PRICE;
    formataData.VARIETIE_CODE_NEW =data.where.VARIETIE_CODE_NEW;


    formataData.deptTwoCode='-1';




    formataData.page = data.page; // 页码
    formataData.size = data.limit; // 每页大小
    console.log("forms", formataData);

    let req = formdataify(formataData);
    try {
        const res = await request.post('/ProdInfo/getPROD_REGISTRATION_LIMIT_BUYV2', req);
        console.log("forms", formataData);
        console.log("res", res.data);
        return res.data; // 返回响应
    } catch (error) {
        console.error("请求数据时出错:", error);
        return Promise.reject(error); // 处理错误
    }
}

export async function InitVarLimitBuyXMClassV2() {
    let formataData = {};
    formataData.Token = sessionStorage.getItem(TOKEN_STORE_NAME);
    // formataData.PROD_REGISTRATION_NAME =data.where.PROD_REGISTRATION_NAME;
    // formataData.APPROVAL_NUMBER =data.where.APPROVAL_NUMBER;
    // formataData.MANUFACTURING_ENT_NAME =data.where.MANUFACTURING_ENT_NAME;
    // formataData.SOURCE_FROM =data.where.SOURCE_FROM;
    // formataData.statrTime =data.where.statrTime;
    // formataData.endTime =data.where.endTime;
    // formataData.statrTime2 =data.where.statrTime2;
    // formataData.endTime2 =data.where.endTime2;
    // formataData.CountState =data.where.CountState;
    // formataData.order =data.where.order;
    // formataData.field =data.where.field;
    // formataData.last =data.where.last;
    // formataData.XM_NAME =data.where.XM_NAME;
    // formataData.XM_NUM =data.where.XM_NUM;
    // formataData.XM_TYPE =data.where.XM_TYPE;
    // formataData.PRICE_STR =data.where.PRICE;
    // formataData.VARIETIE_CODE_NEW =data.where.VARIETIE_CODE_NEW;
    // formataData.deptTwoCode='-1';
    // formataData.page = data.page; // 页码
    // formataData.size = data.limit; // 每页大小
    console.log("forms", formataData);
    let req = formdataify(formataData);
    try {
        const res = await request.post('/ProdInfo/GetVarLimitBuyXMClassV2', req);
        return res; // 返回响应
    } catch (error) {
        console.error("请求数据时出错:", error);
        return Promise.reject(error); // 处理错误
    }
}

