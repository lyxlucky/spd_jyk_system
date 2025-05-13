import { utils, writeFile } from 'xlsx'; // 添加xlsx库的引入
 
 // 通用的Excel导出方法

 /**
  * columns: [{
  *   ...
  *   excelConfig: {
  *     label: '', // 表头
  *     prop: '', // 字段 （不用填写）
  *     formatter: (row, column, cellValue) => {}, // 格式化函数，支持三个参数
  *     width: number, // 列宽
  *     hide: bool, // true:不导出该列
  *     style: {}, // 单元格样式
  *     wrapText: bool // 是否自动换行，默认为true
  *   }
  * }]
  * 
  * /

 /**
  * 格式都是proTable
  * @param {*} data 对象数组
  * @param {*} columns 字段数组
  * @param {*} fileName 导出文件名
  */
 export function exportToExcel(data, columns, fileName) {
  try {
    // 准备表头
    const headers = columns
      .filter(col => col.type !== 'selection' && col.label && (!col.excelConfig?.hide))
      .map(col => col.excelConfig?.label || col.label);
    
    // 准备字段名和配置
    const fields = columns
      .filter(col => col.type !== 'selection' && col.prop)
      .map(col => ({
        prop: col.excelConfig?.prop || col.prop || '',
        formatter: col.excelConfig?.formatter || col.formatter,
        width: col.excelConfig?.width,
        style: col.excelConfig?.style,
        wrapText: col.excelConfig?.wrapText !== undefined ? col.excelConfig?.wrapText : false
      }));
    
    // 准备数据
    const excelData = [];
    excelData.push(headers); // 添加表头
    
    // 添加数据行
    data.forEach(row => {
      const rowData = [];
      fields.forEach(field => {
        if (field.formatter) {
          // 创建模拟的column对象，包含当前字段信息
          const column = { property: field.prop };
          // 获取单元格值作为第三个参数
          const cellValue = row[field.prop];
          // 传递三个参数：row, column, cellValue
          rowData.push(field.formatter(row, column, cellValue));
        } else {
          rowData.push(row[field.prop]);
        }
      });
      excelData.push(rowData);
    });
    
    // 创建工作表
    const ws = utils.aoa_to_sheet(excelData);
    
    // 设置列宽
    // 创建一个与列数相同长度的数组，确保列宽顺序正确
    const colsArray = new Array(fields.length);
    fields.forEach((field, index) => {
        colsArray[index] = { width: field.width || 10 };
    });
    ws['!cols'] = colsArray

    // 设置单元格样式
    for (let row = 0; row < excelData.length; row++) {
      for (let col = 0; col < fields.length; col++) {
        const cellRef = utils.encode_cell({ r: row, c: col });
        if (row === 0) {
          // 表头样式
          ws[cellRef].s = {
            font: { bold: true },
            alignment: { horizontal: 'center', vertical: 'center', wrapText: false },
            fill: { fgColor: { rgb: "CCCCCC" } }
          };
        } else if (fields[col].style) {
          // 数据单元格自定义样式
          ws[cellRef].s = fields[col].style;
        } else {
          // 默认数据单元格样式 - 根据配置决定是否自动换行
          ws[cellRef].s = {
            alignment: { horizontal: 'left', vertical: 'center', wrapText: fields[col].wrapText }
          };
        }
      }
    }
    
    // 创建工作簿
    const wb = {
      SheetNames: ['Sheet1'],
      Sheets: { Sheet1: ws }
    };
    
    // 写入文件并下载
    writeFile(wb, `${fileName}.xlsx`);
  } catch (error) {
    console.error('导出Excel失败:', error);
  }
}