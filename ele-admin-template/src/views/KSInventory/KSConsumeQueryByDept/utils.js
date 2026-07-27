export {
  openExcelFile,
  fmtDate10,
  fmtConsumptionType,
  fmtLgZb,
  fmtRestrictConsumable,
  fmtPriceNum,
  fmtPatientInfo
} from '../KSConsumeQuery/utils';

import { HOME_HP } from '@/config/setting';

export function isHideDeptSup() {
  const hp = HOME_HP;
  if (hp === 'csyy' || hp === 'stzx' || hp === 'stse' || hp === 'stzl' || hp === 'stzyyy' || hp === 'fsdwrmyy') {
    return false;
  }
  return true;
}

export function fmtPdaConsumeTime(v) {
  if (!v || v === '0001-01-01T00:00:00') return '';
  return String(v);
}

export function fmtSummaryCost(v) {
  if (v == null || v === '') return '0.00';
  return Number(v).toFixed(2);
}
