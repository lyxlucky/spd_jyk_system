import request from '@/utils/request';
import { formdataify } from '@/utils/formdataify';
import { TOKEN_STORE_NAME } from '@/config/setting';

function token() {
  return sessionStorage.getItem(TOKEN_STORE_NAME) || localStorage.getItem('Token') || '';
}

function unwrap(res) {
  if (res.data?.code == 301 || res.data === 301) {
    throw new Error(res.data?.msg || '登录失效，请重新登录');
  }
  if (res.data?.code == 200 || res.data?.code === '200') {
    return res.data;
  }
  throw new Error(res.data?.msg || '操作失败');
}

function buildFields(where, page, size) {
  const [time1Start, time1End] = where.time1Range || ['2023-01', '2023-12'];
  const [time2Start, time2End] = where.time2Range || ['2022-01', '2022-12'];
  return {
    Token: token(),
    deptState: where.deptState ?? '1',
    IS_CHARGE: where.IS_CHARGE ?? '',
    timeState: where.timeState ?? '1',
    time1Start: time1Start || '2023-01',
    time1End: time1End || '2023-12',
    time2Start: time2Start || '2022-01',
    time2End: time2End || '2022-12',
    orderState: where.orderState ?? '1',
    page,
    size
  };
}

/** 科室医用耗材支出情况 */
export async function getMaterialStatisticsDept(where, page = 1, size = 99999) {
  const res = await request.post(
    '/VarietieBasicInfo/GetMaterialStatisticsDept',
    formdataify(buildFields(where, page, size))
  );
  return unwrap(res);
}
