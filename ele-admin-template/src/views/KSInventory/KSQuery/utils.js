import store from '@/store';
import { BACK_BASE_URL, HOME_HP } from '@/config/setting';

export function openExcelFile(fileName) {
  const base = (BACK_BASE_URL || '').replace(/\/$/, '');
  const url = `${base}/Excel/files/${encodeURIComponent(fileName)}`;
  if (HOME_HP === 'szlh') {
    const a = document.createElement('a');
    a.href = url;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  } else {
    window.open(url);
  }
}

export function fmtDate10(v) {
  if (!v) return '';
  return String(v).substr(0, 10);
}

/** 有效到期背景色（与旧 KSQuery.cshtml templet 一致） */
export function validityPeriodStyle(row) {
  const bvp = fmtDate10(row.Batch_Validity_Period);
  if (!bvp) return {};
  const thisDate = new Date(bvp).getTime();
  const nowDate = Date.now();
  const day30 = 30 * 24 * 60 * 60 * 1000;
  const day7 = 7 * 24 * 60 * 60 * 1000;
  const isJyk = (row.Source_Name || '').indexOf('检验科') !== -1;

  if (thisDate - nowDate <= 0) {
    return { backgroundColor: 'red', color: '#fff' };
  }
  if (day7 + nowDate >= thisDate && thisDate >= nowDate) {
    return { backgroundColor: 'yellow' };
  }
  if (nowDate + day30 >= thisDate && thisDate >= nowDate + day7) {
    return { backgroundColor: '#60cbcb' };
  }
  if (isJyk) {
    return {};
  }
  return {};
}

export function fmtUpShelfState(v) {
  const map = {
    0: '已退货',
    1: '已上架',
    2: '已锁定',
    3: '已出库'
  };
  return map[v] ?? v;
}

export function fmtSettleState(row) {
  if (row.USE_DEF_NO_PKG_CODE == row.Def_No_Pkg_Code) {
    return '已结算';
  }
  return '未结算';
}

export function hasExportPermission(permissionUrl) {
  const list = store?.state?.user?.info?.permission_group || [];
  return list.some((p) => p.Permission_Url === permissionUrl);
}
