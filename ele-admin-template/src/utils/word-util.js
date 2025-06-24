import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
import { saveAs } from 'file-saver';

/**
 * 导出 Word 文档
 * @param {String} templateUrl 模板文件的相对路径（如 '/score-template/xxx.docx'）
 * @param {Object} data 要填充的数据对象
 * @param {String} outputName 导出文件名
 */
export async function exportWordFromTemplate(templateUrl, data, outputName = '导出文档.docx') {
  // 1. 加载模板
  const response = await fetch(templateUrl);
  const content = await response.arrayBuffer();

  // 2. 创建 docxtemplater 实例
  const zip = new PizZip(content);
  const doc = new Docxtemplater(zip, {
    paragraphLoop: true,
    linebreaks: true,
  });

  // 3. 设置数据
  doc.setData(data);

  try {
    // 4. 渲染
    doc.render();
  } catch (error) {
    // 错误处理
    console.error('Word 渲染失败:', error);
    throw error;
  }

  // 5. 导出
  const out = doc.getZip().generate({
    type: 'blob',
    mimeType:
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  });
  saveAs(out, outputName);
}
