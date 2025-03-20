import { utils, writeFile } from 'xlsx'; // 添加xlsx库的引入
 
 // 通用的Excel导出方法
 /**
  * 格式都是proTable
  * @param {*} data 对象数组
  * @param {*} columns 字段数组
  * @param {*} fileName 导出文件名
  */
 export function exportToExcel(data,columns, fileName) {
  try {
    // 准备表头
    const headers = columns
      .filter(col => col.type !== 'selection' && col.label)
      .map(col => col.label);
    
    // 准备字段名
    const fields = columns
      .filter(col => col.type !== 'selection' && col.prop)
      .map(col => ({
        prop: col.prop,
        formatter: col.formatter
      }));
    
    // 准备数据
    const excelData = [];
    excelData.push(headers); // 添加表头
    
    // 添加数据行
    data.forEach(row => {
      const rowData = [];
      fields.forEach(field => {
        if (field.formatter) {
          // 如果有格式化函数，使用格式化后的值
          rowData.push(field.formatter(row));
        } else {
          // 否则直接使用原始值
          rowData.push(row[field.prop]);
        }
      });
      excelData.push(rowData);
    });
    
    // 创建工作簿和工作表
    const wb = {
      SheetNames: ['Sheet1'],
      Sheets: {
        Sheet1: utils.aoa_to_sheet(excelData)
      }
    };
    
    // 写入文件并下载
    writeFile(wb, `${fileName}.xlsx`);
  } catch (error) {
    console.error('导出Excel失败:', error);
  }
}