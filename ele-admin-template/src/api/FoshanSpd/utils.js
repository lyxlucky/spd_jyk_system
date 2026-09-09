export const FOSHAN_HOSPITAL_ID = 'fszxy';

export function isFoshanHospital(homeHp = FOSHAN_HOSPITAL_ID) {
  return homeHp === FOSHAN_HOSPITAL_ID;
}

export function assertFoshanHospital(homeHp = FOSHAN_HOSPITAL_ID) {
  if (!isFoshanHospital(homeHp)) {
    throw new Error('当前医院未启用佛大三院接口');
  }
}

function requireValue(value, label) {
  if (value === undefined || value === null || String(value).trim() === '') {
    throw new Error(`选中记录缺少${label}`);
  }
  return value;
}

export function buildMaterialCatalogPayload(rows = [], changeType = 'U') {
  const records = (rows || []).map((row) => ({
    varietyCode: requireValue(row.Varietie_Code_New, '品种编码')
  }));
  if (!records.length) throw new Error('请至少选择一条数据');
  return { records, changeType };
}

export function buildCenterInventoryPayload(rows = []) {
  const records = (rows || []).map((row) => ({
    varietyCode: requireValue(row.Varietie_Code, '品种内部编码'),
    contractCode: requireValue(row.contract_code, '合同编码'),
    coefficient: requireValue(row.Def_No_Pkg_Coefficient, '包装系数'),
    storageId: requireValue(row.StorageID, '库区主键')
  }));
  if (!records.length) throw new Error('请至少选择一条数据');
  return { sourceType: 'central', records };
}

export function buildDepartmentInventoryPayload(rows = []) {
  const records = (rows || []).map((row) => ({
    inventoryId: requireValue(row.ID, '库存记录主键')
  }));
  if (!records.length) throw new Error('请至少选择一条数据');
  return { sourceType: 'department', records };
}

export function buildHighValueUsagePayload(receipt, details = []) {
  const deliveryNumberId = requireValue(
    receipt?.Delivery_Note_Number_Id,
    '收货单主键'
  );
  const detailIds = (details || []).map((row) =>
    requireValue(row.ID, '耗材明细主键')
  );
  return { deliveryNumberId, ...(detailIds.length ? { detailIds } : {}) };
}
