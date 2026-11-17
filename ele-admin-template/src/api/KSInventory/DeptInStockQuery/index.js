/**
 * 科室入库查询（迁移自老系统 Views/KSInventory/DepaStorageQuery.cshtml）
 * 后端：SYS_WebApi/SPD.Domain/Controllers/DepaStorageQueryController.cs
 *   - GetDeptInStockDetail  明细列表
 *   - GetDeptInStockDetail2 按品种汇总
 */
import request from '@/utils/request';
import { formdataify } from '@/utils/formdataify';
import { TOKEN_STORE_NAME } from '@/config/setting';
import store from '@/store';
import moment from 'moment';

/**
 * 老页面 #ShowOut 里的 12 项高级筛选。
 * 后端 DepaStorageQueryController.cs:75-86 会逐项读取并下推 WHERE，
 * 值 '-1' 表示「全部 / 不过滤」。
 */
export const ADVANCED_FILTERS = [
  'IS_CHARGE',
  'HIGH_OR_LOW_CLASS',
  'IS_BIDDING',
  'SPECIAL_PURCHASE',
  'ONEOFF_STERILIZATION_PACKAGING',
  'STORAGE_TYPE',
  'IS_EMBEDDED',
  'IS_SERIAL_NUMBER',
  'IS_PROTECT',
  'IS_INTERVENED',
  'HIGH_OR_LOW_CLASS_TWO',
  'IS_EQUIPMENT_CHANGE'
];

/**
 * Element UI 的排序值是 ascending / descending，
 * 但 DepaStorageQueryApp.cs:30-36 只认 'asc' / 'desc'，
 * 不做映射的话排序永远不生效（现有页面直接透传，属遗留缺陷）。
 */
function normalizeOrder(order) {
  const raw = (order && order.order) || 'descending';
  if (raw === 'asc' || raw === 'ascending') {
    return 'asc';
  }
  return 'desc';
}

function buildParams({ page = 1, limit = 20, where = {}, order = {} } = {}) {
  const today = moment().format('YYYY-MM-DD');
  const sevenDaysBefore = moment()
    .subtract(7, 'days')
    .format('YYYY-MM-DD');
  const info = (store.state.user && store.state.user.info) || {};
  const deptCodes = (info.userDept || [])
    .map((item) => item.Dept_Two_Code)
    .filter(Boolean)
    .join(',');

  // 所有值统一转字符串：formdataify 对非字符串会 JSON.stringify，
  // 后端 Request.Form 期望的是普通标量字符串
  const params = {
    page: String(page),
    size: String(limit),
    Token: sessionStorage.getItem(TOKEN_STORE_NAME) || '',
    SearchVarietie: where.name || '',
    Specifications: where.packagerSpec || '',
    Batch: where.batch || '',
    OutType: where.type || '',
    BUSINESS_BILL: where.code || '',
    Production: where.factory || '',
    // 老页面该 input 被注释，但后端 Reps:256 支持科室/供应商名称模糊查询
    Supplier: where.supplier || '',
    StartTime: where.timeStart || sevenDaysBefore,
    EndTime: where.timeEnd || today,
    field: (order && order.sort) || 'RECEIVING_TIME',
    order: normalizeOrder(order),
    // 后端 Reps:26 会去掉尾部逗号，再下推 DEPT_TWO_CODE in (...)
    DeptCode: deptCodes ? `${deptCodes},` : '',
    // 后端 Controller 读了该值但主 SQL 未使用，保留仅为与老页面参数一致
    SUPPLIER_NAME: where.SUPPLIER_NAME || ''
  };

  ADVANCED_FILTERS.forEach((key) => {
    const value = where[key];
    params[key] =
      value === undefined || value === null || value === ''
        ? '-1'
        : String(value);
  });

  return params;
}

async function post(url, params) {
  const res = await request.post(url, formdataify(params));
  const data = res.data || {};
  if (String(data.code) === '200') {
    return data;
  }
  // code 301 登录过期 / 303 导出审计申请 / 400 无权限，后端都放在 msg 里
  throw new Error(data.msg || `请求失败(code=${data.code})`);
}

/** 明细列表 */
export function GetDeptInStockDetail(payload) {
  return post('/DepaStorageQuery/GetDeptInStockDetail', buildParams(payload));
}

/**
 * 查看汇总。后端 Controller:181 内部强制 size2=999999 做全量 GroupBy，
 * 传入的 size 只用于权限校验，与老页面一致传 999999。
 */
export function GetDeptInStockDetail2(payload) {
  return post(
    '/DepaStorageQuery/GetDeptInStockDetail2',
    buildParams({ ...payload, page: 1, limit: 999999 })
  );
}

// 扫单入库沿用新系统现成组件与接口，不重复实现
export {
  GetDistributeDetail,
  DeptReceivingScanOrder
} from '@/api/KSInventory/NewDepaStorageQuery/index';
