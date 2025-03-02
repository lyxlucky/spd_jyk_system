import request from '@/utils/request';
import { formdataify, formdataifyGet } from '@/utils/formdataify';
import { TOKEN_STORE_NAME } from '@/config/setting'

// { page, limit, where, order }
// page: 1
// size: 30
// Token: 10b2e52572054f4b1140
// state: 
// spState: 
// condition: 
// dateFrom: 2025-02-22
// dateTo: 2025-03-01
export function apiGetLoadGoodsDeliveryNumbers(data){
    let params = {};
    params.Token = sessionStorage.getItem(TOKEN_STORE_NAME);
    params.page = data.page || 1; // 页码
    params.size = data.size || 99999; // 每页大小
    params.state = data.where.state 
    params.spState = data.where.spState || '' 
    params.condition = data.where.condition || '' 
    params.dateFrom = data.where.dateFrom || '' 
    params.dateTo = data.where.dateTo || '' 

    let url = `/B2BVarietieConsumeApprove/LoadGoodsDeliveryNumbers${formdataifyGet(params)}`
    return request.get(url)
}


// page: 1
// size: 9999
// Token: 5f392a6de8b4db9a1140
// deliveryNumber: 
// condition: 111

export function apiGetSearchDeliveryVarietie(data){
    let params = {};
    params.Token = sessionStorage.getItem(TOKEN_STORE_NAME);
    params.page = data.page || 1; // 页码
    params.size = data.size || 99999; // 每页大小
    //条件
    params.condition = data.where.condition || '' //搜索内容
    params.deliveryNumber = data.where.deliveryNumber || '' 


    let url = `/B2BVarietieConsumeApprove/SearchDeliveryVarietie${formdataifyGet(params)}`
    return request.get(url)
}


// page: 1
// size: 10
// Token: 5f392a6de8b4db9a1140
// batchId: 
// deliveryNumber: 124441679293584

export function apiGetLoadGeneratedVarietieInfo(data){
    let params = {};
    params.Token = sessionStorage.getItem(TOKEN_STORE_NAME);
    params.page = data.page || 1; // 页码
    params.size = data.size || 99999; // 每页大小
    //条件
    params.batchId = data.where.batchId || '' 
    params.deliveryNumber = data.where.deliveryNumber || '' 

    let url = `/B2BVarietieConsumeApprove/LoadGeneratedVarietieInfo${formdataifyGet(params)}`
    return request.get(url)
}

// page: 1
// size: 9999
// Token: 5f392a6de8b4db9a1140
// orderNum: 124441679293584
// SEARCH_VALUE: 
// TB_TYPE2: 1

export function apiPostSearchTbMainZy(data){
    let params = {};
    params.Token = sessionStorage.getItem(TOKEN_STORE_NAME);
    params.page = data.page || 1; // 页码
    params.size = data.size || 9999; // 每页大小
    //条件
    params.SEARCH_VALUE = data.where.SEARCH_VALUE || '' 
    params.orderNum = data.where.orderNum || '' 
    params.TB_TYPE2 = data.where.TB_TYPE2 || '' 
    let formdata = formdataify(params)

    let url = `/B2BConsumeMgmt/searchTbMainZy`
    return request.post(url,formdata)
}

//状态撤回
// /B2BVarietieConsumeApprove/RejectCommit
export function apiGetSearchTbMainZy(data){
    let params = {};
    params.Token = sessionStorage.getItem(TOKEN_STORE_NAME);
    //条件
    params.deliveryNumberId = data.where.deliveryNumberId || ''

    let url = `/B2BVarietieConsumeApprove/RejectCommit${formdataifyGet()}`
    return request.get(url)
}

// orderNum: 
// TB_ID: 43
// /B2BConsumeMgmt/createDefTb
export function apiPostCreateDefTb(data){
    let params = {};
    params.Token = sessionStorage.getItem(TOKEN_STORE_NAME);
    //条件
    params.orderNum = data.where.orderNum || '' 
    params.TB_ID = data.where.TB_ID || '' 
    let formdata = formdataify(params)

    let url = `/B2BConsumeMgmt/createDefTb`
    return request.post(url,formdata)
}

//护士审批
// /B2BVarietieConsumeApprove/gtSbkSp
// json: jsonStr, state: state
export function apiPostGtSbkSp(data){
    let params = {};
    params.Token = sessionStorage.getItem(TOKEN_STORE_NAME);
    //条件
    params.json = data.where.json || '' 
    params.state = data.where.state || '' 
    let formdata = formdataify(params)

    let url = `/B2BVarietieConsumeApprove/gtSbkSp`
    return request.post(url,formdata)
}

//上传
// Delivery_Note_Number: 
// FILE: (binary)
// /BtbGetVarietie/UploadGtPic
export function apiPostUploadGtPic(data){
    let params = {};
    params.Token = sessionStorage.getItem(TOKEN_STORE_NAME);
    //条件
    params.Delivery_Note_Number = data.where.Delivery_Note_Number || '' 
    params.FILE = data.where.FILE
    let formdata = formdataify(params)

    let url = `/BtbGetVarietie/UploadGtPic`
    return request.post(url,formdata)
}