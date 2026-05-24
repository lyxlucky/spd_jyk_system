import request from '@/utils/request';
import { TOKEN_STORE_NAME } from '@/config/setting';

function buildParams(params) {
  return {
    Token: sessionStorage.getItem(TOKEN_STORE_NAME),
    year: params.year,
    month: params.month,
    deptDimension: params.deptDimension || 'DEPT_TWO',
    deptCodes: params.deptCodes || '',
    deptNames: params.deptNames || ''
  };
}

export async function previewConsumableMonthlyReport(params) {
  const res = await request.get('/ConsumableMonthlyReport/Preview', {
    params: buildParams(params)
  });
  if (res.data.code == 200) return res.data;
  return Promise.reject(new Error(res.data.msg));
}

export async function exportConsumableMonthlyReport(params) {
  return request.get('/ConsumableMonthlyReport/Export', {
    params: buildParams(params),
    responseType: 'blob'
  });
}
