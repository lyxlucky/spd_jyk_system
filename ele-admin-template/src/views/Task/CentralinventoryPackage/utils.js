import { BACK_BASE_URL, HOME_HP, TOKEN_STORE_NAME } from '@/config/setting';

export const LABEL_OPTIONS = [
  { value: '1', label: '打印二维码标签' },
  { value: '2', label: '打印条码标签' },
  { value: '5', label: '打印条码标签(简易)' },
  { value: '3', label: '二维码标签(100mm*50mm)' },
  { value: '16', label: '二维码标签(100mm*38mm)' },
  { value: '9', label: '新二维码标签(100mm*50mm)' },
  { value: '4', label: '打印二维码标签(扩容)' },
  { value: '8', label: '打印二维码标签(简洁)' },
  { value: '6', label: '打印条码标签(一维)' },
  { value: '7', label: '一体标签打印-1' },
  { value: '17', label: '定数包标签(60mm*40mm)' },
  { value: '18', label: '定数包标签(70mm*50mm)' },
  { value: '-1', label: '标记不打印标签' }
];

export const cipHpFlags = {
  isLhLike: HOME_HP === 'szlh' || HOME_HP === 'szlhfy',
  isStzx: HOME_HP === 'stzx',
  isFszxy: HOME_HP === 'fszxy',
  showStzxZngBtn: HOME_HP === 'stzx',
  showBjYbkBtn: HOME_HP === 'bdrm' || HOME_HP === 'bd'
};

export function unwrapData(res) {
  return res?.data !== undefined ? res.data : res;
}

export function isOkCode(code) {
  return code === 200 || code === '200';
}

export function formatDate10(val) {
  if (!val) return '';
  return String(val).replace('T', ' ').substr(0, 10);
}

export function formatBagMakingState(state) {
  if (String(state) === '1') return '已制包';
  if (String(state) === '0') return '未制包';
  return '未知项';
}

export function formatPrintUpShelfState(state) {
  if (String(state) === '1') return '已打印上架';
  if (String(state) === '0') return '未打印上架';
  return '未知';
}

export function isNearExpiry(validityDate) {
  if (!validityDate) return false;
  const expiry = new Date(formatDate10(validityDate)).getTime();
  return expiry - 30 * 24 * 3600 * 1000 < Date.now();
}

export function isExpiryBelow5Days(validityDate) {
  if (!validityDate) return false;
  const expiry = new Date(formatDate10(validityDate)).getTime();
  return expiry - 5 * 24 * 3600 * 1000 < Date.now();
}

export function buildLockItems(rows) {
  return rows.map((row) => `{${row.Up_Shelf_Id},${row._coefficient},${row._makeQty}}`);
}

export function validateLockItems(rows) {
  if (!rows.length) return '请至少选中一行数据';
  const storageId = rows[0].Storage_Id;
  for (const row of rows) {
    if (row.Storage_Id !== storageId) {
      return '添加失败，不能添加不同仓库的品种';
    }
    const qty = Number(row._makeQty ?? 0);
    const coef = Number(row._coefficient ?? 0);
    if (qty <= 0) {
      return `制包失败，品种${row.Varietie_Code}${row.Varietie_Name}的制包数量不能为0`;
    }
    if (coef <= 0) {
      return '系数不能为0';
    }
    if (Number(row.Up_Quantity) < qty * coef || Number(row.Up_Quantity) < qty) {
      return `制包数量*系数不能大于可用散货数量${row.Up_Quantity}`;
    }
  }
  return '';
}

export function getExpiryWarning(rows) {
  for (const row of rows) {
    if (isExpiryBelow5Days(row.Batch_Validity_Period)) {
      return `制包失败，品种${row.Varietie_Code}${row.Varietie_Name}的有效期低于5天`;
    }
  }
  return '';
}

export function normalizeSearchRows(list) {
  return (list || []).map((row) => ({
    ...row,
    _coefficient: Array.isArray(row.Coefficients)
      ? row.Coefficients[0]
      : row.Coefficients,
    _makeQty: Number(row._makeQty ?? 0)
  }));
}

export function openExcelFile(fileName) {
  const base = (BACK_BASE_URL || '').replace(/\/$/, '');
  const url = `${base}/Excel/files/${encodeURIComponent(fileName)}`;
  if (cipHpFlags.isLhLike) {
    const form = document.createElement('form');
    form.method = 'get';
    form.action = url;
    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);
  } else {
    window.open(url);
  }
}

export function buildReportUrl(path, params) {
  const base = (BACK_BASE_URL || '').replace(/\/$/, '');
  const token = sessionStorage.getItem(TOKEN_STORE_NAME) || '';
  const query = new URLSearchParams({ ...params, Token: token }).toString();
  return `${base}${path}?${query}`;
}

export function openManagePrint(printId, batchIds) {
  const json = JSON.stringify(batchIds);
  if (printId === '7' || cipHpFlags.isLhLike) {
    return buildReportUrl('/api/CentralWarehouseBagMakingMgmt/GetLHReportById', {
      id: printId,
      format: 'pdf',
      inline: 'true',
      json
    });
  }
  if (cipHpFlags.isStzx && printId === '6') {
    return buildReportUrl('/api/Commons/GetReportById_zbstzx', {
      id: printId,
      format: 'pdf',
      inline: 'true',
      json,
      hp: HOME_HP
    });
  }
  if (cipHpFlags.isFszxy) {
    return null;
  }
  return buildReportUrl('/api/Commons/GetReportById', {
    id: printId,
    format: 'pdf',
    inline: 'true',
    json
  });
}

export function openQueryReprint(printId, detailIds) {
  const json = JSON.stringify(detailIds);
  if (cipHpFlags.isLhLike) {
    return buildReportUrl('/api/CentralWarehouseBagMakingMgmt/GetLHReportById_BD', {
      id: printId,
      format: 'pdf',
      inline: 'true',
      json
    });
  }
  return buildReportUrl('/api/Commons/GetReportById_BD', {
    id: printId,
    format: 'pdf',
    inline: 'true',
    json,
    hp: HOME_HP
  });
}

export function openPrintBagMakingOrder(numbers) {
  const json = [...new Set(numbers)].join(',');
  return buildReportUrl('/api/PrintPdf/GetReportById_ZB', {
    id: '85',
    format: 'pdf',
    inline: 'true',
    json
  });
}

export function getDefaultQueryRange() {
  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - 7);
  const fmt = (d) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
      d.getDate()
    ).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(
      d.getMinutes()
    ).padStart(2, '0')}:${String(d.getSeconds()).padStart(2, '0')}`;
  return [fmt(start), fmt(end)];
}
