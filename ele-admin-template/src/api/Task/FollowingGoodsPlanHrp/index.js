import request from '@/utils/request';
import { formdataify, DataToObject } from '@/utils/formdataify';
import { TOKEN_STORE_NAME } from '@/config/setting';
import store from '@/store';

/* 状态汇总统计 */
export function getStockUpStateList(data) {
    var data2 = {};
    data2.page = data.page || 1;
    data2.size = data.limit || 9999;
    data2.start_time = data.where?.start_time || '';
    data2.end_time = data.where?.end_time || '';
    data2.Token = sessionStorage.getItem(TOKEN_STORE_NAME);
    
    return request.get('ANewStockUp/StockUpStateList', {
      params: data2
    });
  }

export function getStockUpVarInfo(data){
    let data2 = {};
    data2.page = data.page || 1;
    data2.size = data.limit || 10;
    data2.id = data.where?.id || '';
    data2.order_state = data.where?.order_state || '';
    data2.varietie_code = data.where?.varietie_code || '';
    data2.stock_up_plan_no = data.where?.stock_up_plan_no || '';
    data2.supplier_name = data.where?.supplier_name || '';
    data2.Manufacturing_Ent_Name = data.where?.Manufacturing_Ent_Name || '';
    data2.Specification_Or_Type = data.where?.Specification_Or_Type || '';
    data2.PLAN_DEPT_TWO_NAME = data.where?.PLAN_DEPT_TWO_NAME || '';
    data2.start_time = data.where?.start_time || '';
    data2.end_time = data.where?.end_time || '';
    data2.state = data.where?.state || '';
    data2.remark = data.where?.remark || '';
    data2.order_pc = data.order?.order || 'desc';
    data2.Token = sessionStorage.getItem(TOKEN_STORE_NAME);
    
    return request.get('ANewStockUp/StockUpVarInfo', {
      params: data2
    });
}

/* 获取备货计划列表 */
export function getStockUpList(data) {
    let data2 = {};
    data2.page = data.page || 1;
    data2.size = data.limit || 10;
    data2.start_time = data.where?.start_time || '';
    data2.end_time = data.where?.end_time || '';
    data2.order_state = data.where?.order_state || '';
    data2.varietie_code = data.where?.varietie_code || '';
    data2.stock_up_plan_no = data.where?.stock_up_plan_no || '';
    data2.supplier_name = data.where?.supplier_name || '';
    data2.approve_state = data.where?.approve_state || '';
    data2.send_state = data.where?.send_state || '';
    data2.coefficient = data.where?.coefficient || '';
    data2.order_pc = data.order?.order || 'desc';
    data2.SENDHRP = data.where?.SENDHRP || 1;
    data2.isQZJS = data.where?.isQZJS || 1;
    data2.CREATOR = data.where?.CREATOR || '';
    data2.BZ = data.where?.BZ || '';
    data2.Token = sessionStorage.getItem(TOKEN_STORE_NAME);
    return request.get('ANewStockUp/StockUpList', {
      params: data2
    });
}
