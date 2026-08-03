import { Message } from 'element-ui';
import { getStaticBaseUrl } from '@/config/setting.js';
export function handleCommonExport(res) {
  if (res.data.code === 200) {
    const downloadUrl = `${getStaticBaseUrl()}/Excel/files/${res.data.msg}`;
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = '盘存上传导出.zip';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    Message.success('导出成功');
  } else {
    Message.error(res.data.msg || '导出失败');
  }
}
