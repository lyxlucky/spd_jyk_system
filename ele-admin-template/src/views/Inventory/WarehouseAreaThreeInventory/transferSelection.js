// 所有流水主键保持字符串，避免 19 位 ID 在 JavaScript 中丢失精度。
export function rowId(row) {
  return row && row.ID != null ? String(row.ID) : '';
}

function truthyFlag(value) {
  return value === true || value === 1 || value === '1' || value === 'true';
}

export function createDetailWhere(base = {}) {
  let batches = base.BATCH_NOS || [];
  if (!Array.isArray(batches)) {
    try {
      batches = JSON.parse(batches);
    } catch (e) {
      batches = [];
    }
  }
  return {
    ...base,
    BUSINESS_TYPES: Array.isArray(base.BUSINESS_TYPES)
      ? [...base.BUSINESS_TYPES]
      : String(base.BUSINESS_TYPES || '')
          .split(',')
          .filter(Boolean),
    BATCH_NOS: Array.isArray(batches) ? [...batches] : [],
    BATCH_EMPTY: truthyFlag(base.BATCH_EMPTY)
  };
}

export function canTransferRow(row, sourceArea) {
  if (!rowId(row) || rowId(row) === '0') return false;
  if (!truthyFlag(row.CAN_TRANSFER)) return false;
  if (row.TRANSFER_STATE && row.TRANSFER_STATE !== 'AVAILABLE') return false;
  if (!Number.isFinite(Number(row.QTY)) || Number(row.QTY) <= 0) return false;
  if (!(Number(row.TRANSFERABLE_QTY) > 0)) return false;
  return !sourceArea || String(row.AREA_CODE) === String(sourceArea);
}

export function canDeleteRow(row) {
  if (
    !row ||
    row.CAN_DELETE === false ||
    row.CAN_DELETE === 0 ||
    row.CAN_DELETE === '0'
  )
    return false;
  if (String(row.TYPE) === '7') return false;
  if (row.TRANSFER_SOURCE_ID && String(row.TRANSFER_SOURCE_ID) !== '0')
    return false;
  return !['MOVED', 'OFFSET', 'DELETED'].includes(row.TRANSFER_STATE);
}

export function changeSelection(current, matching, action, sourceArea) {
  const selected = new Map((current || []).map((row) => [rowId(row), row]));
  (matching || []).forEach((row) => {
    const id = rowId(row);
    if (!id) return;
    if (action === 'remove' || (action === 'invert' && selected.has(id)))
      selected.delete(id);
    else if (canTransferRow(row, sourceArea)) selected.set(id, row);
  });
  return Array.from(selected.values());
}

function includesText(value, term) {
  return String(value == null ? '' : value)
    .toLowerCase()
    .includes(String(term).trim().toLowerCase());
}

function inDateRange(value, start, end) {
  if (!start && !end) return true;
  if (!value) return false;
  const date = String(value).replace('T', ' ').slice(0, 19);
  return (
    (!start || date >= String(start)) &&
    (!end ||
      date <= (String(end).length === 10 ? `${end} 23:59:59` : String(end)))
  );
}

export function filterTransferRows(rows, where = {}) {
  const textFields = [
    'VARIETIE_NAME',
    'VARIETIE_CODE_NEW',
    'CHARGE_CODE',
    'SPECIFICATION_OR_TYPE',
    'MANUFACTURING_ENT_NAME',
    'DEPT_CODE',
    'BARCODE_NUMBER',
    'PATIENT_NUMBER',
    'HOSPITALIZATION_NUMBER',
    'MEDICAL_ORDER_ID',
    'JF_ID',
    'ORIGING_CODE'
  ];
  const types = Array.isArray(where.BUSINESS_TYPES)
    ? where.BUSINESS_TYPES
    : String(where.BUSINESS_TYPES || '')
        .split(',')
        .filter(Boolean);
  const batches = Array.isArray(where.BATCH_NOS) ? where.BATCH_NOS : [];
  const deptCode = String(where.DEPT_TWO_CODE || '').trim();
  return (rows || []).filter((row) => {
    if (deptCode && String(row.DEPT_TWO_CODE || '') !== deptCode) return false;
    if (
      textFields.some(
        (field) => where[field] && !includesText(row[field], where[field])
      )
    )
      return false;
    if (
      where.TRANSFER_REMARK &&
      !includesText(row.TRANSFER_REMARK, where.TRANSFER_REMARK) &&
      !includesText(row.ORIGING_CODE, where.TRANSFER_REMARK)
    )
      return false;
    if (where.TYPE && String(row.TYPE) !== String(where.TYPE)) return false;
    if (
      types.length &&
      !types.includes(String(row.BUSINESS_TYPE || row.TYPE || ''))
    )
      return false;
    const emptyBatch = !String(row.BATCH_NO || '').trim();
    if (
      (batches.length || where.BATCH_EMPTY) &&
      !(
        batches.includes(String(row.BATCH_NO || '')) ||
        (where.BATCH_EMPTY && emptyBatch)
      )
    )
      return false;
    if (
      !inDateRange(
        row.OPEARTION_CHARGING_TIME ||
          row.OPERATION_CHARGING_TIME ||
          row.CREATE_TIME,
        where.START_TIME,
        where.END_TIME
      )
    )
      return false;
    if (
      !inDateRange(
        row.CREATE_TIME,
        where.CREATE_START_TIME,
        where.CREATE_END_TIME
      )
    )
      return false;
    if (!inDateRange(row.EXPIRY_DATE, where.EXPIRY_START, where.EXPIRY_END))
      return false;
    const qty = Number(row.QTY);
    if (where.QTY_SIGN === 'positive' && !(qty > 0)) return false;
    if (where.QTY_SIGN === 'negative' && !(qty < 0)) return false;
    if (where.QTY_SIGN === 'zero' && qty !== 0) return false;
    if (where.TRANSFER_STATUS && row.TRANSFER_STATE !== where.TRANSFER_STATUS)
      return false;
    return true;
  });
}

export function utf8Length(value) {
  return new TextEncoder().encode(String(value || '')).length;
}

export function validateTransfer(rows, sourceArea, targetArea, remark) {
  if (!rows || !rows.length) return '请选择需要移库的流水';
  if (
    !sourceArea ||
    rows.some((row) => String(row.AREA_CODE) !== String(sourceArea))
  )
    return '单次移库必须来自同一实际来源库区';
  if (rows.some((row) => !canTransferRow(row, sourceArea)))
    return '所选流水包含不可移库记录，请重新查询';
  if (
    rows.some(
      (row) =>
        !Number.isFinite(Number(row.TRANSFER_QTY)) ||
        Number(row.TRANSFER_QTY) <= 0 ||
        Number(row.TRANSFER_QTY) > Number(row.TRANSFERABLE_QTY)
    )
  )
    return '移库数量须大于0且不能超过剩余可移数量';
  if (!targetArea) return '请选择目标库房/库区';
  if (String(sourceArea) === String(targetArea))
    return '目标必须与来源库房/库区不同';
  if (!String(remark || '').trim()) return '请填写移库备注';
  if (utf8Length(String(remark).trim()) > 500)
    return '移库备注不能超过 UTF-8 500 字节';
  return '';
}

export function filterImpacts(rows, mode) {
  return (rows || []).filter((row) => {
    const sides = ['SOURCE', 'TARGET'];
    if (mode === 'negative')
      return sides.some((side) => Number(row[`${side}_AFTER`]) < 0);
    if (mode === 'worsened')
      return sides.some(
        (side) =>
          Number(row[`${side}_AFTER`]) < 0 &&
          Number(row[`${side}_AFTER`]) < Number(row[`${side}_BEFORE`])
      );
    return true;
  });
}
