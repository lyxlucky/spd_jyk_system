const FLOW_TYPE_NAMES = {
  1: '散货退货',
  2: '散货申领',
  3: '定数包入库',
  4: '定数包退库',
  5: 'HIS计费'
};

function numberValue(value) {
  const result = Number(value);
  return Number.isFinite(result) ? result : 0;
}

function dateText(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function calcCurrentStock(row = {}) {
  return (
    numberValue(row.KS_QTY) +
    numberValue(row.JF_QTY) +
    numberValue(row.JF_DEF_QTY)
  );
}

export function buildFlowWhere(row = {}, flowForm = {}) {
  return {
    DeptCode: row.DEPT_TWO_CODE || '',
    varCode: row.VARIETIE_CODE_NEW || '',
    chargingCode: row.CHARGE_CODE || '',
    startTime: flowForm.startTime || '',
    endTime: flowForm.endTime || '',
    origingCode: flowForm.origingCode || '',
    barcodeNumber: flowForm.barcodeNumber || '',
    consumer: flowForm.consumer || '',
    patientNumber: flowForm.patientNumber || '',
    hospitalizationNumber: flowForm.hospitalizationNumber || ''
  };
}

export function buildRelationWhere(mode, dimension = {}, where = {}) {
  const result = { ...where };
  if (mode === 'department') {
    result.DeptCode = dimension.CODE || '';
  } else {
    result.chargingCode = dimension.CHARGE_CODE || dimension.CODE || '';
  }
  return result;
}

export function isCurrentRequest({
  requestId,
  currentRequestId,
  requestMode,
  currentMode,
  requestDimensionCode,
  currentDimensionCode
}) {
  return (
    requestId === currentRequestId &&
    requestMode === currentMode &&
    requestDimensionCode === currentDimensionCode
  );
}

export function createDefaultFlowForm() {
  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - 29);
  return {
    startTime: dateText(start),
    endTime: dateText(end),
    origingCode: '',
    barcodeNumber: '',
    consumer: '',
    patientNumber: '',
    hospitalizationNumber: ''
  };
}

export function formatStorageType(value) {
  if (value === -1 || value === '-1') return '混合入库';
  if (value === 0 || value === '0') return '普通入库';
  if (value === 1 || value === '1') return '盘盈入库';
  return '未标记';
}

export function formatFlowDirection(row = {}) {
  const qty = numberValue(row.QTY);
  if (qty > 0 && row.HOSPITALIZATION_NUMBER) return '消退';
  if (qty > 0) return '入库';
  if (qty < 0) return '出库';
  return '平账';
}

export function formatFlowType(value) {
  return FLOW_TYPE_NAMES[value] || '其他业务';
}

export function stockTagType(row) {
  const qty = calcCurrentStock(row);
  if (qty > 0) return 'success';
  if (qty < 0) return 'danger';
  return 'info';
}

export function stockStatusText(row) {
  const qty = calcCurrentStock(row);
  if (qty > 0) return '有库存';
  if (qty < 0) return '负库存';
  return '零库存';
}
