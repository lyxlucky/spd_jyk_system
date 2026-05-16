import request from '@/utils/request';
import { formdataify } from '@/utils/formdataify';
import { TOKEN_STORE_NAME, HOME_HP, B2B_BASE_URL, BACK_BASE_URL } from '@/config/setting';

function token() {
  return sessionStorage.getItem(TOKEN_STORE_NAME);
}

async function getJson(url, params = {}) {
  const res = await request.get(url, { params: { Token: token(), ...params } });
  if (res.data.code == 200) return res.data;
  return Promise.reject(new Error(res.data.msg || '请求失败'));
}

async function postForm(url, data = {}) {
  const res = await request.post(url, formdataify({ Token: token(), ...data }));
  if (res.data.code == 200) return res.data;
  return Promise.reject(new Error(res.data.msg || '请求失败'));
}

async function getAction(action, params = {}) {
  return getJson(`/MonthClearing/${action}`, params);
}

async function postAction(action, data = {}) {
  const res = await request.post(
    `/MonthClearing/${action}`,
    formdataify({ Token: token(), ...data })
  );
  if (res.data.code == 200) return res.data;
  return Promise.reject(new Error(res.data.msg || '请求失败'));
}

export function monthNum(params) {
  return getJson('/MonthClearing/MonthNum', params);
}

export function getMonthDept(params) {
  return getJson('/MonthClearing/GetMonthDept', params);
}

export function getApprovalMonth(params) {
  return getJson('/MonthClearing/GetApprovalMonth', params);
}

export function getMonthShow(params) {
  return getJson('/MonthClearing/GetMonthShow', {
    page: params.page || 1,
    size: params.size || 10,
    SerachName: params.SerachName || '',
    DeptTwoCode: params.DeptTwoCode || '',
    GoodsDayClearingDeptID: params.GoodsDayClearingDeptID || '',
    ...params
  });
}

export function approvalState(json) {
  return getJson('/MonthClearing/ApprovalState', { json });
}

export function approvalStateAll() {
  return getJson('/MonthClearing/ApprovalStateAll');
}

export function sureMonth(action, json, extra = {}) {
  const { bz, date, ...rest } = extra;
  return postAction(action, { json, bz: bz || '', date: date || '', ...rest });
}

export function sendMonthAction(action, monthId) {
  return getAction(action, { MonthID: monthId });
}

export function excelMonthDataOneSheet(params) {
  return getJson('/MonthClearing/ExcelMonthDataOneSheet', { hp: HOME_HP, ...params });
}

export function monthClearingExport(action, params) {
  return getAction(action, params);
}

export function hisSendStzx(monthId) {
  return getJson('/AAxtzx_his/HisSendStzx', { monthId });
}

export function sendOesHisInfo(monthId) {
  return getJson('/AAxtzx_his/SendOesHisInfo', { MONTH_ID: monthId });
}

export function upWxtFph(monthDate) {
  return getJson('/MonthClearing/UpWXT_FPH', { MonthDtae: monthDate });
}

export function shanTouMonthOutExcelSTZL(params) {
  return getAction('ShanTouMonthOutExcelSTZL_NEW_A', params);
}

export function shanTouMonthOutExcel(params) {
  return getAction('ShanTouMonthOutExcel', params);
}

export function stzxMonthPlan(params) {
  return getAction('STZX_MonthPlan', params);
}

export function printPdfGet(path, params) {
  return getJson(path, params);
}

export function pekingReport(url, data) {
  return postForm(url, data);
}

export function getMonthNumber(params) {
  return getJson('/MonthBillMgmt/GetMonthNumber', params);
}

export function updateMonthNumber(data) {
  return postForm('/MonthBillMgmt/updateMonthNumber', data);
}

export function getSupplier(params) {
  return getJson('/MonthBillMgmt/GetSupplier', params);
}

export function getSupplierZL(params) {
  return getJson('/MonthBillMgmt/GetSupplierZL', params);
}

export function showBill(params) {
  return getJson('/MonthBillMgmt/ShowBill', params);
}

export function updateBillState(monthBill) {
  return getJson('/MonthBillMgmt/UpdateState', { MonthBill: monthBill });
}

export function searchMontySupperPrint(params) {
  return getJson('/MonthBillMgmt/SearchMontySupperPrint', params);
}

export function mensMonitbtAmountprint2(data) {
  return postForm('/MonthBillMgmt/MensMonitbtAmountprint2', data);
}

export function fsGetReportYueJieExcel(params) {
  return getJson('/MonthClearing/FsGetReportYueJieExcel', params);
}

export function hrpCreategysExcel(params) {
  return getJson('/HrpSupplerSummary/CreategysExcel', params);
}

export function hrpCreategysmxExcel(params) {
  return getJson('/HrpSupplerSummary/CreategysmxExcel', params);
}

export function excelStorageMonth(data) {
  return postForm('/MonthBillMgmt/excelStorageMonth', data);
}

export function abdzczhPrint(action, params) {
  return getJson(`/Abdzczh/${action}`, params);
}

export function getTextExport(action, params) {
  return getAction(action, params);
}

/** B2B GET 月结推送 */
export async function fetchB2bGet(url) {
  const res = await fetch(url, { method: 'GET' });
  return res.json();
}

/** B2B POST 发票信息 */
export async function postB2bMonthlyInvoic(json) {
  const base = (B2B_BASE_URL || '').replace(/\/$/, '');
  const body = new URLSearchParams({ json });
  const res = await fetch(`${base}/api/MonthlyInvoic/getMonthlyInvoicInfo`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString()
  });
  return res.json();
}

/** B2B 获取发票号 */
export async function b2bGetInvoiceNum(monthlyBalanceId) {
  const base = (B2B_BASE_URL || '').replace(/\/$/, '');
  const res = await fetch(`${base}/api/Supplier/GetInvoice_Num`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ MONTHLY_BALANCE_ID: monthlyBalanceId }).toString()
  });
  return res.json();
}

/** 打开 PDF（MonthClearing/GetSTZX 等） */
export function openMonthPdf(path) {
  const base = (BACK_BASE_URL || '').replace(/\/$/, '');
  const t = token();
  const sep = path.includes('?') ? '&' : '?';
  window.open(`${base}${path}${sep}Token=${encodeURIComponent(t || '')}`);
}

/** 妇幼出库单 PDF 多窗口 */
export function openGZSupOutboundOrder(billMonthNumber, supplierCode, supplierName, type) {
  const base = (BACK_BASE_URL || '').replace(/\/$/, '');
  const t = token();
  const q = `id=73&format=pdf&inline=true&Bill_MonthNumber=${encodeURIComponent(
    billMonthNumber
  )}&Supplier_Code_div=${encodeURIComponent(supplierCode)}&Supplier_Name_div=${encodeURIComponent(
    supplierName || ''
  )}&type=${type}&Token=${encodeURIComponent(t || '')}`;
  window.open(`${base}/api/MonthBillMgmt/excelGZSupOutboundOrder?${q}`);
}
