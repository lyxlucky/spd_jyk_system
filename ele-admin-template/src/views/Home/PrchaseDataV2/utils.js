import { utils, writeFile } from 'xlsx';
import { HOME_HP } from '@/config/setting';

export const isFoshanColumnMode = HOME_HP === 'fszxy' || HOME_HP === 'fsdwrmyy';

export function fmtDate10(val) {
  if (val == null || val === '') return '';
  return String(val).substr(0, 10);
}

export function fmtDateTime(val) {
  if (val == null || val === '') return '';
  return String(val).replace('T', ' ');
}

export function calcDateDiffDays(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || start >= end) return 0;
  return Math.floor((end - start) / (1000 * 60 * 60 * 24));
}

export function calcTimeProgress(row) {
  const currentDate = new Date();
  const startDate = new Date(row.BUY_TIME);
  const endDate = new Date(row.BUY_TIME2);
  if (currentDate <= startDate) return 0;
  if (currentDate >= endDate) return 100;
  const betweenDates = calcDateDiffDays(row.BUY_TIME, currentDate);
  const total = calcDateDiffDays(row.BUY_TIME, row.BUY_TIME2);
  if (!total) return 0;
  return (betweenDates / total) * 100;
}

export function fmtTimeProgress(row) {
  return `${calcTimeProgress(row).toFixed(2)}%`;
}

export function fmtEndDateWithDays(row) {
  const text = fmtDate10(row.BUY_TIME2);
  if (!text) return '';
  const thisDate = new Date(text).getTime();
  const nowDate = Date.now();
  const days = Math.trunc((thisDate - nowDate) / (1000 * 60 * 60 * 24));
  const suffix = `${text}|${days}天`;
  if (thisDate <= nowDate + 61 * 24 * 60 * 60 * 1000) {
    return { text: suffix, danger: true };
  }
  return { text: suffix, danger: false };
}

export function isWarningRow(row) {
  return calcTimeProgress(row) > Number(row.WCL || 0);
}

export function leftQty(row) {
  return Number(row.COUNT || 0) - Number(row.GOODS_QTY || 0);
}

export function deptLeftQty(row) {
  return Number(row.DEPT_LIMIT_QTY || 0) - Number(row.GOODS_QTY || 0);
}

export function regName(row) {
  return row.PROD_REGISTRATION_NAME ?? row.PROD_REGISTRATION_NAME2 ?? '';
}

export function approvalNo(row) {
  return row.APPROVAL_NUMBER ?? row.APPROVAL_NUMBER2 ?? '';
}

export function mfgName(row) {
  return row.MANUFACTURING_ENT_NAME ?? row.MANUFACTURING_ENT_NAME2 ?? '';
}

export function exportAoA(fileName, rows) {
  const ws = utils.aoa_to_sheet(rows);
  const wb = utils.book_new();
  utils.book_append_sheet(wb, ws, 'Sheet1');
  writeFile(wb, fileName);
}

export function defaultWhere() {
  return {
    PROD_REGISTRATION_NAME: '',
    APPROVAL_NUMBER: '',
    MANUFACTURING_ENT_NAME: '',
    SOURCE_FROM: '',
    PRICE: '',
    VARIETIE_CODE_NEW: '',
    CountState: '',
    last: '0',
    statrTime: '',
    endTime: '',
    statrTime2: '',
    endTime2: '',
    statrTime3: '',
    endTime3: '',
    XM_NAME: '',
    XM_NUM: '',
    XM_TYPE: '',
    DeptQuery: ''
  };
}
