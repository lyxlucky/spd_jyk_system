import request from '@/utils/request';
import { formdataify } from '@/utils/formdataify';
import { TOKEN_STORE_NAME, HOME_HP, B2B_BASE_URL } from '@/config/setting';
import store from '@/store';

function token() {
  return sessionStorage.getItem(TOKEN_STORE_NAME);
}

export { needSendState, PostPrepareCloseOrderData } from '@/api/Task/FollowingGoodsPlanHrp';

/** 库区下拉 */
export function getStorageList() {
  return request.post('/Commons/GetStorageWithToken', formdataify({ Token: token() }));
}

/** 状态汇总统计 */
export function getStockUpStateList(data) {
  return request.get('ANewStockUp/StockUpStateList', {
    params: {
      page: data.page || 1,
      size: data.limit || 9999,
      start_time: data.where?.start_time || '',
      end_time: data.where?.end_time || '',
      STORAGE_ID: data.where?.STORAGE_ID || '',
      Token: token()
    }
  });
}

/** 备货计划单品种明细 */
export function getStockUpVarInfo(data) {
  const where = data.where || {};
  return request.get('ANewStockUp/StockUpVarInfo', {
    params: {
      page: data.page || 1,
      size: data.limit || 99999,
      id: where.id || '',
      order_state: where.order_state || '',
      varietie_code: where.varietie_code || '',
      stock_up_plan_no: where.stock_up_plan_no || '',
      supplier_name: where.supplier_name || '',
      Manufacturing_Ent_Name: where.Manufacturing_Ent_Name || '',
      Specification_Or_Type: where.Specification_Or_Type || '',
      PLAN_DEPT_TWO_NAME: where.PLAN_DEPT_TWO_NAME || '',
      start_time: where.start_time || '',
      end_time: where.end_time || '',
      state: where.state || '',
      remark: where.remark || '',
      varType: where.varType || '',
      STORAGE_ID: where.STORAGE_ID || '',
      order_pc: data.order?.order || 'desc',
      Token: token()
    }
  });
}

/** 备货计划单号列表（跟踪页 SENDHRP=-1） */
export function getStockUpList(data) {
  const where = data.where || {};
  return request.get('ANewStockUp/StockUpList', {
    params: {
      page: data.page || 1,
      size: data.limit || 9,
      start_time: where.start_time || '',
      end_time: where.end_time || '',
      order_state: where.order_state || '',
      varietie_code: where.varietie_code || '',
      stock_up_plan_no: where.stock_up_plan_no || '',
      supplier_name: where.supplier_name || '',
      approve_state: where.approve_state || '',
      send_state: where.send_state || '',
      coefficient: where.coefficient || '',
      order_pc: where.order_pc || 'desc',
      SENDHRP: where.SENDHRP ?? -1,
      isQZJS: where.isQZJS ? 1 : 0,
      CREATOR: where.CREATOR || '',
      BZ: where.BZ || '',
      STORAGE_ID: where.STORAGE_ID || '',
      REVIEW_STATE: where.REVIEW_STATE || '',
      Token: token()
    }
  });
}

export function postNoApprove(data) {
  return request.post(
    'ANewStockUp/NoApprove',
    formdataify({
      ID: data.ID,
      Person: data.Person || store.state.user.info?.Nickname,
      Token: token()
    })
  );
}

export async function UpFundsSource(data) {
  const res = await request.post(
    '/ANewStockUp/UpFundsSource',
    formdataify({ Token: token(), FUNDS_SOURCE_TYPE: data.type })
  );
  if (res.data.code == 200) return res.data;
  return Promise.reject(new Error(res.data.msg));
}

export async function YesApprove(data) {
  const res = await request.post(
    '/ANewStockUp/YesApprove',
    formdataify({
      ID: data.ID,
      Token: token(),
      Person: store.state.user.info?.Nickname
    })
  );
  if (res.data.code == 200) return res.data;
  return Promise.reject(new Error(res.data.msg));
}

export async function CheckPlanPriceInfo(data) {
  const res = await request.get('/CentralWarehouseMonitor/CheckPlanPriceInfo', {
    params: { Stock_Up_Plan_No: data.order, Token: token() }
  });
  if (res.data.code == 200) return res.data;
  return Promise.reject(res.data);
}

export async function GetPickingInfo(data) {
  const res = await request.get('/CentralWarehouseMonitor/GetPickingInfo', {
    params: { Stock_Up_Plan_No: data.order, Token: token() }
  });
  if (res.data.code == 200) return res.data;
  return Promise.reject(new Error(res.data.msg));
}

export async function UpdateSendState(data) {
  return request.post(
    '/CentralWarehouseMonitor/UpdateSendState',
    formdataify({ ID: data.ID, Token: token() })
  );
}

export async function ReceiveSpdStockup(json) {
  const base = (B2B_BASE_URL || '').replace(/\/$/, '');
  const res = await fetch(`${base}/api/SpdBtb/ReceiveSpdStockup`, {
    method: 'POST',
    body: formdataify({ json })
  });
  return res.json();
}

/** 保存备货计划(包)修改 */
export function upStockUpDefNum(json) {
  return request.post(
    'ANewStockUp/UpStockUpDefNum',
    formdataify({ json, Token: token() })
  );
}

/** 通知/取消通知科室 */
export function upStockUpVarInfoState(json, state) {
  return request.post(
    'ANewStockUp/upStockUpVarInfoState',
    formdataify({ json, state, Token: token() })
  );
}

/** 批量备注 */
export function batchUpDelRemarks(data) {
  return request.post(
    'ANewStockUp/BatchUpDelRemarks',
    formdataify({
      IDS: data.IDS,
      REMARKS: data.REMARKS,
      DEPT_TWO_CODE: data.DEPT_TWO_CODE,
      DEPT_TWO_NAME: data.DEPT_TWO_NAME,
      Token: token()
    })
  );
}

/** 发送审批 */
export function upStockToHrp(json) {
  return request.post(
    'ANewStockUp/UpStockToHrp',
    formdataify({ json, Token: token() })
  );
}

/** 批量发送审批 */
export function upStockToHrpList(stockUpPlanNoList) {
  return request.post(
    'ANewStockUp/UpStockToHrpList',
    formdataify({ Stock_Up_Plan_No_List: stockUpPlanNoList, Token: token() })
  );
}

/** 设置订单类型 */
export function setOrderType(stockUpPlanNoList, orderLevel) {
  return request.post(
    'ANewStockUp/SetOrderType',
    formdataify({
      Stock_Up_Plan_No_List: stockUpPlanNoList,
      ORDER_LEVEL: orderLevel,
      Token: token()
    })
  );
}

/** 科室列表（批量备注） */
export function getDeptTwoBasicInfoAll() {
  return request.get('DeptTwoBasicInfo/GetAll', {
    params: { Token: token() }
  });
}

/** 未到货品种列表 */
export function getStockUpNotVarInfo(data) {
  const where = data.where || {};
  return request.get('ANewStockUp/StockUpNotVarInfo', {
    params: {
      page: data.page || 1,
      size: data.limit || 30,
      id: where.id || '',
      order_state: where.order_state || '',
      varietie_code: where.varietie_code || '',
      stock_up_plan_no: where.stock_up_plan_no || '',
      supplier_name: where.supplier_name || '',
      Manufacturing_Ent_Name: where.Manufacturing_Ent_Name || '',
      Specification_Or_Type: where.Specification_Or_Type || '',
      start_time: where.start_time || '',
      end_time: where.end_time || '',
      state: where.state || '',
      remark: where.remark || '',
      storage: where.storage || '',
      order_pc: where.order_pc || 'desc',
      Token: token()
    }
  });
}

/** 更新备货数为收货数 */
export function upStockDelSame(json) {
  return request.post(
    'ANewStockUp/upStockDelSame',
    formdataify({ json, Token: token() })
  );
}

/** 监控详情-品种搜索 */
export function searchStockMonitor(data) {
  return request.get('ANewStockUp/Search', {
    params: {
      page: data.page || 1,
      size: data.limit || 15,
      UseLevel: data.UseLevel ?? -1,
      EnableState: data.EnableState ?? 1,
      SearchName: data.SearchName || '',
      EnableLowUp: data.EnableLowUp ?? 1,
      field: data.field || '',
      order: data.order || '',
      StorageID: data.StorageID ?? '-1',
      Supplier: data.Supplier || '',
      VARIETIE_CODE_NEWS: data.VARIETIE_CODE_NEWS || '',
      Token: token()
    }
  });
}

/** 增加明细-供应商品种搜索 */
export function supplierSearch(data) {
  return request.get('ANewStockUp/SupplierSearch', {
    params: {
      page: data.page || 1,
      size: data.limit || 10,
      UseLevel: data.UseLevel ?? -1,
      EnableState: data.EnableState ?? 0,
      SearchName: data.SearchName || '',
      EnableLowUp: data.EnableLowUp ?? 1,
      field: data.field || '',
      order: data.order || '',
      StorageID: data.StorageID || '',
      Supplier: data.Supplier || '',
      VARIETIE_CODE_NEW: data.VARIETIE_CODE_NEW || '',
      SPECIFICATION_OR_TYPE: data.SPECIFICATION_OR_TYPE || '',
      MANUFACTURING_ENT_NAME: data.MANUFACTURING_ENT_NAME || '',
      Token: token()
    }
  });
}

/** 追加备货明细 */
export function addStockData(json, stockUpPlanNo) {
  return request.post(
    'ANewStockUp/AddStockData',
    formdataify({ json, Stock_Up_Plan_No: stockUpPlanNo, Token: token() })
  );
}

/** 剔除品种-SPD */
export function upStockUpVars(json, hospitalCode) {
  return request.post(
    'ANewStockUp/UpStockUpVars',
    formdataify({ json, HOSPITAL_CODE: hospitalCode, Token: token() })
  );
}

/** 剔除品种-B2B */
export async function closeStokOrderDel(planNumber, hospitalCode, spdIds) {
  const base = (B2B_BASE_URL || '').replace(/\/$/, '');
  const res = await request.get(`${base}/api/Stock/closeStokOrderDel`, {
    params: {
      PLAN_NUMBER: planNumber,
      HOSPITAL_CODE: hospitalCode,
      SPDID: spdIds
    }
  });
  return res.data;
}

/** 中心库扩展信息 */
export function getCentralWarehouseExtend(varietieCode) {
  return request.get('CentralWarehouse/GetExtend', {
    params: { VarietieCode: varietieCode, Token: token() }
  });
}

export { HOME_HP };
