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

/** 全院品种统计（分页） */
export async function getHospitalVarietieStatistics(params = {}) {
  const res = await request.get('/HrpStatistics/HospitalVarietieStatistics', {
    params: {
      Token: token(),
      SerachName: params.serachName ?? params.searchName ?? '',
      StatisticsTime: params.statisticsTime ?? '0',
      Date: params.date ?? '',
      StatisticsType: params.statisticsType ?? '',
      page: params.page ?? 1,
      size: params.size ?? 20,
      Field: params.field ?? 'VarietieMoney',
      Orderby: params.orderby ?? 'desc'
    }
  });
  return unwrap(res);
}

/** 品种关联科室 */
export async function getVarietieDeptList(params = {}) {
  const res = await request.get('/HrpStatistics/VarietieGetDept', {
    params: {
      Token: token(),
      VarietieName: params.varietieName ?? '',
      Year: params.year ?? '',
      page: params.page ?? 1,
      size: params.size ?? 99999
    }
  });
  return unwrap(res);
}

/** 品种关联供应商 */
export async function getVarietieSupplierList(params = {}) {
  const res = await request.get('/HrpStatistics/VarietieGetSupplier', {
    params: {
      Token: token(),
      VarietieName: params.varietieName ?? '',
      Year: params.year ?? '',
      page: params.page ?? 1,
      size: params.size ?? 99999
    }
  });
  return unwrap(res);
}

/** 品种年度用量（VarietieCode 传品种名称） */
export async function getConsumptionYear(params = {}) {
  const res = await request.get('/HrpStatistics/ConsumptionYear', {
    params: {
      Token: token(),
      VarietieCode: params.varietieCode ?? params.varietieName ?? '',
      Year: params.year ?? ''
    }
  });
  return unwrap(res);
}

/** 科室+品种月度对比 */
export async function getDeptConsumptionMonthYearVariety(params = {}) {
  const res = await request.get('/HrpStatistics/DeptConsumptionMonthYear', {
    params: {
      Token: token(),
      VarietieName: params.varietieName ?? '',
      DeptCode: params.deptCode ?? '',
      Year: params.year ?? '',
      StartYear: params.startYear ?? ''
    }
  });
  return unwrap(res);
}

/** 供应商+品种月度对比 */
export async function getSingleSupplierConsumptionMonthYear(params = {}) {
  const res = await request.get('/HrpStatistics/SingleSupplierConsumptionMonthYear', {
    params: {
      Token: token(),
      VarietieName: params.varietieName ?? '',
      SupplierCode: params.supplierCode ?? '',
      Year: params.year ?? '',
      StartYear: params.startYear ?? ''
    }
  });
  return unwrap(res);
}
