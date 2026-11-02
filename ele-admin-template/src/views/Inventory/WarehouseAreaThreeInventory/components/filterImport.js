const text = (value) => String(value == null ? '' : value).trim();
const bytes = (value) => new Blob([value]).size;

// 先校验整个工作表，避免因后续行格式错误导致部分数据已写入。
export function parseFilterImportRows(sheetRows) {
  const headers = (sheetRows[0] || []).map(text);
  const fields = ['计费编码', '是否启用', '过滤备注'];
  const indexes = fields.map((field) => headers.indexOf(field));
  const missing = fields.filter((field, index) => indexes[index] < 0);
  if (missing.length) throw new Error(`缺少表头：${missing.join('、')}`);
  const rows = [];
  sheetRows.slice(1).forEach((cells, index) => {
    const [code, enabled, remark] = indexes.map((column) => text(cells[column]));
    if (!code && !enabled && !remark) return;
    const prefix = `第${index + 2}行：`;
    if (!code) throw new Error(`${prefix}计费编码不能为空`);
    if (bytes(code) > 255) throw new Error(`${prefix}计费编码不能超过255字节`);
    if (bytes(remark) > 500) throw new Error(`${prefix}过滤备注不能超过500字节`);
    const enabledValues = { '1': '1', '0': '0', '启用': '1', '停用': '0', '是': '1', '否': '0' };
    if (!Object.prototype.hasOwnProperty.call(enabledValues, enabled))
      throw new Error(`${prefix}是否启用请填写1、0、启用或停用`);
    rows.push({ CHARGE_CODE: code, IS_ENABLED: enabledValues[enabled], REMARK: remark });
  });
  if (!rows.length) throw new Error('Excel中没有可导入的数据');
  return rows;
}
