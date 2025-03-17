import request from '@/utils/request';
import { formdataify, DataToObject } from '@/utils/formdataify';
import { TOKEN_STORE_NAME } from '@/config/setting';
import { Message } from 'element-ui';
// 封装通用的请求函数
async function sendRequest(url, data, method = 'post') {
    const token = sessionStorage.getItem(TOKEN_STORE_NAME);
    const requestData = { Token: token, ...data };
    const formData = formdataify(requestData);

    let res;
    if (method === 'post') {
        res = await request.post(url, formData);
    } else if (method === 'get') {
        
        res = await request.get(url, { params: requestData }); 
      
    }

    if (res.data.code == 200) {
        return res.data;
    } else {
        return Promise.reject(new Error(`请求 ${url} 失败: ${res.data.msg}`));
    }
}

// 获取库存
export async function GetPDAList(data) {
    const { page, limit, where = {}, order = '', field = '' } = data;
    const requestData = {
        page,
        size: limit,
        varietie: where.inventoryNew_search1 || '',
        supplier: where.inventoryNew_search2 || '',
        batch: where.inventoryNew_search3 || '', 
        sourceFrom: where.inventoryNew_search4 || '', 
        manuEntName: where.inventoryNew_search5 || '', 
        APPROVAL_NUMBER:  where.inventoryNew_APPROVAL_NUMBER || '',//注册证
        Up_Shelf_State: where.UpShelfState || '',//所属区域
        conTime:where.conTime || '', //合同到期
        is_hptx:where.hptx|| '', //货票同行
        validDateFrom: where.start_time || '',//开始时间 
        validDateTo: where.start_time || '',//结束时间 
        field: '',
        order: '',
        isCharge: where.isCharge|| '',
        highOrLowClass: where.highOrLowClass|| '',
        isBidding: where.isBidding|| '',
        specialPurchase: where.specialPurchase|| '',
        oneoffSterilizationPackaging: where.oneoffSterilizationPackaging|| '',
        storageType:where.storageType|| '',
        isEmbedded: where.isEmbedded|| '',
        isSerialNumber: where.isSerialNumber|| '',
        isProtect:where.isProtect|| '',
        classificName:where.inventoryNew_classificName || '',//分类属性 
        isIntervened: where.isIntervened|| '',
        highOrLowClassTwo: where.highOrLowClassTwo2 || '',//高低值分类下级属性
        Position:where.inventory_Position || ''  //货位号
    };
    // 假设服务器端接口支持 GET 方法
    return sendRequest('/CentralWarehouseDept/Search', requestData, 'get'); 
}


// 获取详情数据
export async function GetPDAList2(data) {

   
    const { page, limit, where = {}, order = '', field = '' } = data;
    const requestData = {
        page,
        size: limit,
        sourceFrom: where.sourceFrom || '',
        batchId: where.batchId || '',
        varietieCode:  where.varietieCode || '',
        batch:  where.batch || '',
        coefficient:  where.coefficient || '',
        currUpShelfState:  where.currUpShelfState || '',
        condition:  where.condition || '',
        field: '',
        order: '',
        storageId:  where.storageId || ''
      
    };
    //window.alert(JSON.stringify(requestData, null, 2));
    // 假设服务器端接口支持 GET 方法
    return sendRequest('/CentralWarehouseDept/SearchDef', requestData, 'get'); 
  }