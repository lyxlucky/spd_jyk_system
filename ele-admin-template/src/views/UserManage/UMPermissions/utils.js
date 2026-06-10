import { utils, writeFile } from 'xlsx';

export function isOkCode(code) {
  return code === 200 || code === '200';
}

export function isDeleteOk(data) {
  return data === 1 || data === '1';
}

const EXPORT_HEADERS = ['权限名称', '链接', '备注'];

export function exportPermissionExcel(rows) {
  const data = [EXPORT_HEADERS];
  (rows || []).forEach((row) => {
    data.push([
      row.Permission_Name,
      row.Permission_Url || '',
      row.Remarks || '无'
    ]);
  });
  const sheet = utils.aoa_to_sheet(data);
  writeFile({ SheetNames: ['权限列表'], Sheets: { 权限列表: sheet } }, '权限列表.xlsx');
}

export function formatRemark(remarks) {
  if (remarks == null || remarks === '') {
    return '无';
  }
  return remarks;
}
