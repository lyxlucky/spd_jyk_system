import request from '@/utils/request';
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

/** 全院科室统计列表 */
export async function getDeptVarietieStatisticsAll(params = {}) {
  const res = await request.get('/HrpStatistics/DeptVarietieStatistics', {
    params: {
      Token: token(),
      StatisticsTime: params.statisticsTime ?? '0',
      Date: params.date ?? '',
      StatisticsType: params.statisticsType ?? params.statisticsTime ?? '0',
      Field: params.field ?? 'VarietieQty',
      Orderby: params.orderby ?? ''
    }
  });
  return unwrap(res);
}

/** 单科室品种统计 */
export async function getDeptVarietieStatisticsByDept(params = {}) {
  const res = await request.get('/HrpStatistics/DeptVarietieStatistics', {
    params: {
      Token: token(),
      DeptCode: params.deptCode ?? '',
      StatisticsTime: params.statisticsTime ?? '0',
      Date: params.date ?? '',
      StatisticsType: params.statisticsType ?? params.statisticsTime ?? '0'
    }
  });
  return unwrap(res);
}

/** 多科室月度趋势（DeptCode 格式 code:name,code:name） */
export async function getDeptConsumptionMonthYearMulti(params = {}) {
  const res = await request.get('/HrpStatistics/DeptConsumptionMonthYear', {
    params: {
      Token: token(),
      DeptCode: params.deptCode ?? '',
      Year: params.year ?? '',
      StartYear: params.startYear ?? '',
      Field: params.field ?? 'VarietieQty',
      Orderby: params.orderby ?? ''
    }
  });
  return unwrap(res);
}

/** 指定科室指定品种月度趋势（DeptCode 格式 code:name） */
export async function getDeptConsumptionMonthYearVariety(params = {}) {
  const res = await request.get('/HrpStatistics/DeptConsumptionMonthYear', {
    params: {
      Token: token(),
      VarietieName: params.varietieName ?? '',
      DeptCode: params.deptCode ?? '',
      Year: params.year ?? '',
      StartYear: params.startYear ?? '',
      Field: params.field ?? 'VarietieQty',
      Orderby: params.orderby ?? ''
    }
  });
  return unwrap(res);
}
