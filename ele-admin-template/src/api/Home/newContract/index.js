
import request from '@/utils/request';
import { formdataify, formdataifyGet } from '@/utils/formdataify';
import { TOKEN_STORE_NAME } from '@/config/setting'

/**
 * 获取供应商列表
 * @param {请求参数对象} data 
 * @returns 
 */
export function conditionsSupplier(data) {
    let params = {};
    params.Token = sessionStorage.getItem(TOKEN_STORE_NAME);
    
    params.page = data.page; // 页码
    params.size = data.size; // 每页大小
    params.IS_ENABLE = data.IS_ENABLE // 状态 1启用，''全部，0停用
    params.supplier_code = data.supplier_code || '' // 供应商编号
    params.supplier_name = data.supplier_name || '' // 供应商名称
    
    let url = `/SupplierInfo/conditions_supplier${formdataifyGet(params)}`
    return request.get(url)
    
}

/**
 * 获取供应商合同列表
 * @param {请求参数对象} data 
 * @returns 
 */
export function Get_Contractcode(data) {
    let params = {};
    params.Token = sessionStorage.getItem(TOKEN_STORE_NAME);
    params.page = data.page || 1; // 页码
    params.size = data.size || 999999; // 每页大小
    params.supplier_code = data.supplier_code // 状态 1启用，''全部，0停用
    params.contract_code = data.contract_code || '' // 供应商编号
    params.contract_name = data.contract_name || '' // 供应商名称
    
    let url = `/Contract/Get_Contractcode${formdataifyGet(params)}`
    return request.get(url)
    
}

/**
 * 获取供应商合同详情
 * @param {请求参数对象} data 
 * @returns 
 */
export function Get_Contractcodedetails(data) {
    let params = {};
    params.Token = sessionStorage.getItem(TOKEN_STORE_NAME);
    params.contract_code = data.contract_code || 1; // 页码
    let url = `/Contract/Get_Contractcodedetails${formdataifyGet(params)}`
    return request.get(url)
    
}

/**
 * 获取供应商合同授权品种列表
 * @param {请求参数对象} data 
 * @returns 
 */
// page: 1
// size: 10
// Token: 74cc79ac7f5acc0d1140
// varietie_code: 
// varietie_name: 
// specification_or_type: 
// unit: 
// manufacturing_ent_name: 
// approval_number: 
// contract_code: HT24040941852817(1)
// field: 
// order: 
export function GetListPagealready(data) {
    let params = {};
    params.Token = sessionStorage.getItem(TOKEN_STORE_NAME);
    params.contract_code = data.contract_code || 1; // 页码
    params.page = data.page || 1; // 页码
    params.size = data.size || 999999; // 每页大小
    params.varietie_code = data.varietie_code || ''; //品种代码
    params.varietie_name = data.varietie_name || ''; // 品种名称
    params.specification_or_type = data.specification_or_type || ''; // 品种规则型号
    params.unit = data.unit || ''; // 单位
    params.manufacturing_ent_name = data.manufacturing_ent_name || ''; // 生产企业
    params.approval_number = data.approval_number || ''; // 注册证号
    params.contract_code = data.contract_code; // 合同编号
    params.field = data.field || 'TwoSupCode'; 
    params.order = data.order || ''; 
    
    let url = `/Contract/GetListPagealready${formdataifyGet(params)}`
    return request.get(url)
    
}