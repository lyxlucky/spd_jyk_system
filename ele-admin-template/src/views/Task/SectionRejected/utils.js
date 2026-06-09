import { BACK_BASE_URL, HOME_HP } from '@/config/setting';

export const sectionRejectedHpFlags = {
  showStorageFilter: HOME_HP === 'stzl',
  enableEpcBack: false,
  isLhLike: HOME_HP === 'szlh' || HOME_HP === 'szlhfy'
};

export function initSectionRejectedFlags(permissions = []) {
  sectionRejectedHpFlags.enableEpcBack = permissions.some(
    (p) => p.Permission_Url === 'EpcBack'
  );
}

export function unwrapData(res) {
  return res?.data !== undefined ? res.data : res;
}

export function isOkCode(code) {
  return code === 200 || code === '200';
}

export function formatDateTime(val) {
  if (!val) return '';
  return String(val).replace('T', ' ').substr(0, 19);
}

export function formatDate10(val) {
  if (!val) return '';
  return String(val).replace('T', ' ').substr(0, 10);
}

export function formatDefPkgReturnState(state) {
  const map = {
    '0': '未退货',
    '1': '已退货',
    '2': '待退货'
  };
  const text = map[String(state)] || '未知状态';
  return String(state) === '2'
    ? { text, style: { color: '#F56C6C' } }
    : { text };
}

export function formatBulkOperateState(state) {
  return String(state) === '0' || state === 0 ? '新增' : '已退货';
}

export function isBulkOrderNew(state) {
  return String(state) === '0' || state === 0;
}

export function formatOrderType(type) {
  if (String(type) === '-1') return '跨月退中心库';
  if (String(type) === '-2') return '跨月退供应商';
  return '其他';
}

export function formatStorageId(id) {
  if (String(id) === '1') return '院内库区';
  if (String(id) === '2') return '院外库区';
  return id || '';
}

export function formatConsumptionType(type) {
  const map = {
    '0': '条码扫码即消耗',
    '1': 'RFID读码消耗',
    '2': 'HIS计费消耗',
    '3': '散货申领消耗',
    '5': '超时默认消耗'
  };
  return map[String(type)] ?? type ?? '';
}

export function getPkgPrintExcelAction(hp = HOME_HP) {
  if (hp === 'zq') return 'CreatedePackagesExcel_ZQ';
  if (hp === 'chrmyy') return 'CreatedePackagesExcel_CHRM';
  return 'CreatedePackagesExcel';
}

export function openExcelFile(fileName, subPath = '/Excel/files/') {
  const base = (BACK_BASE_URL || '').replace(/\/$/, '');
  const url = `${base}${subPath}${encodeURIComponent(fileName)}`;
  if (sectionRejectedHpFlags.isLhLike) {
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

export function downloadExcelByForm(fileName) {
  const base = (BACK_BASE_URL || '').replace(/\/$/, '');
  const url = `${base}/Excel/files/${encodeURIComponent(fileName)}`;
  const form = document.createElement('form');
  form.method = 'get';
  form.action = url;
  document.body.appendChild(form);
  form.submit();
  document.body.removeChild(form);
}

export function buildInsertVarietieItems(rows, deptTwoCode, orderId, operateNumber) {
  return rows.map((row) => ({
    DeptTwoCode: deptTwoCode,
    DeptTwoGoodsOperateId: parseInt(orderId, 10),
    OperateNumber: operateNumber,
    VarietieCode: row.varietie_code,
    Batch: row.Batch,
    BatchProductionDate: row.batch_production_date,
    BatchValidityPeriod: row.batch_validity_period,
    ReturnSum: parseInt(row._returnQty ?? row.ReturnSum ?? 0, 10),
    BatchId: row.Batch_ID,
    ContractCode: row.Contract_Code,
    SupplierName: row.supplier_name,
    Coefficient: parseInt(row.Coefficient ?? 0, 10),
    DefNoPkgCode: row.Def_No_Pkg_Code,
    ConsumptionType: row.Consumption_Type,
    StorageId: row.Storage_ID,
    SupplyPrice: row.supply_price,
    SupplierCode: row.supplier_code,
    HisId: row.ID
  }));
}

export function validateInsertItems(rows) {
  for (const row of rows) {
    const qty = Number(row._returnQty ?? 0);
    if (qty <= 0) {
      return `品种编码-${row.Varietie_Code_New} 品种全称-${row.varietie_name} 型号/规格-${row.specification_or_type} 批次号-${row.Batch} 的退货数量不能小于或等于0`;
    }
    if (qty > Number(row.CanReturnSum)) {
      return `退货数量不得大于可退货数量${row.CanReturnSum}`;
    }
  }
  return '';
}

export function buildConfirmBulkReturnJson(details, orderId, deptTwoCode, applier) {
  return details.map((row) => {
    const consumptionType = row.Consumption_Type;
    const storageId = row.Storage_ID;
    return `{${[
      orderId,
      applier,
      deptTwoCode,
      row.varietie_code,
      row.Batch,
      row.ReturnSum,
      row.Batch_ID,
      row.supplier_code,
      row.Contract_Code,
      row.supply_price,
      row.ID,
      row.Coefficient,
      row.Def_No_Pkg_Code,
      consumptionType,
      storageId,
      row.Varietie_Code_New
    ].join(',')}}`;
  });
}

export function getDefaultMonthRange() {
  const end = new Date();
  const start = new Date();
  start.setMonth(start.getMonth() - 1);
  const fmt = (d) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
      d.getDate()
    ).padStart(2, '0')}`;
  return [fmt(start), fmt(end)];
}
