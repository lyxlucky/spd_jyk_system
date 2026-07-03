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

/** 全院供应商统计列表 */
export async function getSupplierVarietieStatisticsAll(params = {}) {
  const res = await request.get('/HrpStatistics/SupplierVarietieStatistics', {
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

/** 单供应商品种统计 */
export async function getSupplierVarietieStatisticsByCode(params = {}) {
  const res = await request.get('/HrpStatistics/SupplierVarietieStatistics', {
    params: {
      Token: token(),
      SupplierCode: params.supplierCode ?? '',
      StatisticsTime: params.statisticsTime ?? '0',
      Date: params.date ?? '',
      StatisticsType: params.statisticsType ?? params.statisticsTime ?? '0'
    }
  });
  return unwrap(res);
}

/** 多供应商月度趋势（SupplierCode 格式 code:name,code:name） */
export async function getSupplierConsumptionMonthYearMulti(params = {}) {
  const res = await request.get('/HrpStatistics/SupplierConsumptionMonthYear', {
    params: {
      Token: token(),
      SupplierCode: params.supplierCode ?? '',
      Year: params.year ?? '',
      StartYear: params.startYear ?? '',
      Field: params.field ?? 'VarietieQty',
      Orderby: params.orderby ?? ''
    }
  });
  return unwrap(res);
}

/** 指定供应商指定品种月度趋势（SupplierCode 格式 code:name） */
export async function getSingleSupplierConsumptionMonthYear(params = {}) {
  const res = await request.get('/HrpStatistics/SingleSupplierConsumptionMonthYear', {
    params: {
      Token: token(),
      VarietieName: params.varietieName ?? '',
      SupplierCode: params.supplierCode ?? '',
      Year: params.year ?? '',
      StartYear: params.startYear ?? '',
      Field: params.field ?? 'VarietieQty',
      Orderby: params.orderby ?? ''
    }
  });
  return unwrap(res);
}
