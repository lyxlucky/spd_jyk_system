import { HOME_HP } from '@/config/setting';

// 三级库初始化库存模板统一生成入口。
// 被 ThreeLevelDbBD / ThirdStockQuery 共用，避免两处各自维护一套列定义。
// 列顺序与后端 ItemArray[0..5]（LhfyController.uploadThirdInventory）
// 及 StzlThreeStockImportService.ValidateAndResolve 严格对应，不可调整。
const IS_STZL = HOME_HP === 'stzl';

const HEADERS = [
  '二级科室编码',
  IS_STZL ? '计费编码（肿瘤填品种编码，勿填0）' : '计费编码',
  '数量',
  '类型（定数包/散货）',
  '定数码',
  '入库类型（普通入库/盘盈入库）'
];

const COLUMN_WIDTHS = [16, 30, 10, 20, 18, 28];

// 示例值取自现场静态模板 ZL/科室库存初始化模板.xlsx
const EXAMPLE_ROW = ['2776', '1010111100576B', '100', '散货', '', '普通入库'];

const VALIDATION_ROWS = 500;

const buildNotes = () => [
  ['三级库初始化库存模板 · 填写说明'],
  [],
  ['列序', '表头', '填写要求'],
  [1, HEADERS[0], '必填。SPD 二级科室编码，且该科室必须已启用三级库并维护 HIS 科室对照'],
  [
    2,
    HEADERS[1],
    IS_STZL
      ? '必填。此列是 HIS 计费编码；肿瘤医院 HIS 传递的值实际就是品种编码（VARIETIE_CODE_NEW），而品种资料里的计费编码多为 0/空，因此请直接填品种编码，不要填 0、留空或填「无」。系统按该值关联品种，若品种未维护计费编码会给出提醒'
      : '必填。请填 HIS 计费编码，需与品种资料中的计费编码一致'
  ],
  [3, HEADERS[2], '必填。实物盘点数量，只能是数字；系统会自动乘以该品种的 HIS 转换比(HIS_ZHB)'],
  [4, HEADERS[3], '必填。只能填「定数包」或「散货」'],
  [5, HEADERS[4], '定数包必填定数码且不可重复；散货可留空'],
  [6, HEADERS[5], '必填。只能填「普通入库」或「盘盈入库」'],
  [],
  ['导入规则'],
  ['1. 只读取第一个工作表的前 6 列，多余的列不会生效；请勿调整列顺序或删除表头行。'],
  ['2. 整单校验：任意一行有误，整份文件都不会写入，请按提示修改后重新上传。'],
  ['3. 同一批数据请勿重复上传（改名、另存为、调整行序也会被识别），重复导入会被整单拒绝。'],
  ['4. 若需修正已导入的数据，请联系管理员按导入批次撤销后，再上传新的文件。'],
  ['5. 第 2 行是示例数据，导入前必须删除，否则会被当作真实库存写入。'],
  ['6. 品种未正确维护计费编码时仍可导入；系统会在提醒中列出行号与该行 Excel 填写的编码、对应品种编码，请据此到品种资料维护。']
];

/**
 * 生成并下载三级库初始化库存模板。
 * 仅第一个工作表是数据区（后端读 sheetIndex=0），第二个工作表只是填写说明。
 */
export async function downloadThreeStockTemplate() {
  const ExcelJS = (await import('exceljs')).default;
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('三级库初始化库存');
  sheet.columns = COLUMN_WIDTHS.map((width) => ({ width }));

  const thinBorder = {
    top: { style: 'thin' },
    bottom: { style: 'thin' },
    left: { style: 'thin' },
    right: { style: 'thin' }
  };

  const headerRow = sheet.addRow(HEADERS);
  headerRow.height = 24;
  headerRow.eachCell((cell) => {
    cell.font = { bold: true, size: 10 };
    cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFD9E1F2' }
    };
    cell.border = thinBorder;
  });

  const exampleRow = sheet.addRow(EXAMPLE_ROW);
  exampleRow.eachCell((cell) => {
    cell.alignment = { horizontal: 'center', vertical: 'middle' };
    cell.border = thinBorder;
  });
  // 下拉校验，减少「类型/入库类型」填错导致的整单失败
  for (let r = 2; r <= VALIDATION_ROWS; r += 1) {
    sheet.getCell(`D${r}`).dataValidation = {
      type: 'list',
      allowBlank: true,
      formulae: ['"定数包,散货"']
    };
    sheet.getCell(`F${r}`).dataValidation = {
      type: 'list',
      allowBlank: true,
      formulae: ['"普通入库,盘盈入库"']
    };
  }

  const noteSheet = workbook.addWorksheet('填写说明');
  noteSheet.columns = [{ width: 8 }, { width: 34 }, { width: 88 }];
  buildNotes().forEach((values) => {
    const row = noteSheet.addRow(values);
    row.getCell(3).alignment = { vertical: 'top', wrapText: true };
  });
  noteSheet.getCell('A1').font = { bold: true, size: 12 };
  noteSheet.getRow(3).eachCell((cell) => {
    cell.font = { bold: true };
  });

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = '三级库初始化库存模板.xlsx';
  a.style.display = 'none';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  // 立即 revoke 在部分浏览器会中断下载，延后释放
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export const THREE_STOCK_TEMPLATE_FILE_NAME = '三级库初始化库存模板.xlsx';
