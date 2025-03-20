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

// 中心库入库查询
export async function GetPDAList(data) {
    const { page, limit, where = {}, order = '', field = '' } = data;
    const requestData = {
        page,
        size: limit,
        SearchVarietie: where.searchinplt1 || '',
        Supplier: where.searchinplt2 || '',
        Batch:where.searchinplt3 || '',
        InType: where.searchinplt4 || '',
        BUSINESS_BILL: where.searchinplt5 || '',
        StartTime: where.start_time || '',
        EndTime:  where.end_time || '',
        Specifications:  where.cwj_searchinplt6 || '',
        Production: where.searchinplt7 || '',
        field: "UP_SHELF_TIME",
        order: "desc",
        IS_CHARGE:where.isCharge || '-1',
        HIGH_OR_LOW_CLASS:where.highOrLowClass || '-1',
        IS_BIDDING: where.isBidding || '-1',
        SPECIAL_PURCHASE: where.specialPurchase || '-1',
        ONEOFF_STERILIZATION_PACKAGING:where.oneoffSterilizationPackaging || '-1', 
        STORAGE_TYPE:where.storageType || '-1',    
        IS_EMBEDDED: where.isEmbedded || '-1',     
        IS_SERIAL_NUMBER:where.isSerialNumber || '-1', 
        IS_INTERVENED: where.isIntervened || '-1',  
        IS_PROTECT:where.isProtect || '-1',   
        HIGH_OR_LOW_CLASS_TWO:where.highOrLowClassTwo || '-1',   
        IS_EQUIPMENT_CHANGE:where.change || '-1',  
        PREPARE_GOODS_PLAN_NUMBER:where.cwj_hinpPREPARE_GOODS_PLAN_NUMBER || ''
        
    };
    // 假设服务器端接口支持 GET 方法
    return sendRequest('/InStockCheck/GetInStockDetail', requestData, 'post'); 
}

// 中心库出库查询
export async function GetPDAList2(data) {
    const { page, limit, where = {}, order = '', field = '' } = data;
    const requestData = {
        page,
        size: limit,
        SearchVarietie:where.xsearchinplt1 || '',
        Supplier: where.xsearchinplt2 || '',
        Batch: where.xsearchinplt3 || '',
        OutType: where.xsearchinplt4 || '',
        BUSINESS_BILL: where.xsearchinplt5 || '',
        Specifications:'',
        StartTime:where.start_time || '',
        EndTime:where.end_time || '',
        Production:where.xsearchinplt6 || '', 
        field: "RECEIVING_TIME",
        order: "desc",
        IS_CHARGE:where.isCharge || '-1',
        HIGH_OR_LOW_CLASS:where.highOrLowClass || '-1', 
        IS_BIDDING: where.isBidding || '-1', 
        SPECIAL_PURCHASE:where.specialPurchase || '',  
        ONEOFF_STERILIZATION_PACKAGING: where.oneoffSterilizationPackaging || '-1', 
        STORAGE_TYPE: where.storageType || '-1', 
        IS_EMBEDDED: where.isEmbedded || '-1',  
        IS_SERIAL_NUMBER:where.isSerialNumber || '-1',   
        IS_INTERVENED:where.isIntervened || '-1',   
        IS_PROTECT: where.isProtect || '-1',
        HIGH_OR_LOW_CLASS_TWO:where.highOrLowClassTwo || '-1', 
        IS_EQUIPMENT_CHANGE:where.change || '-1'
        
    };
    // 假设服务器端接口支持 GET 方法
    return sendRequest('/InStockCheck/GetOutStockDetail', requestData, 'post'); 
}


// 获取详情数据
export async function getSourceDetail(data) {
    // 从 data 中提取 Storage_Id 和 Def_No_Pkg_Code
    const { Storage_Id, Def_No_Pkg_Code } = data;
  
    // 打印提示信息，显示提取的数据
    //Message.info(Def_No_Pkg_Code);
  
    // 构建请求数据对象
    const requestData = {
        storageId:Storage_Id,
        defNoPkgCode:Def_No_Pkg_Code
    };
  
    try {
      // 假设服务器端接口支持 GET 方法
      return await sendRequest('/GS1/Trace', requestData, 'get'); 
    } catch (error) {
      console.error('请求详情数据时出错:', error);
      throw error;
    }
  }