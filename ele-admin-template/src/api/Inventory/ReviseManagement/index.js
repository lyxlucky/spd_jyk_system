import request from '@/utils/request';
import { formdataify } from '@/utils/formdataify';
import { TOKEN_STORE_NAME } from '@/config/setting';

function getToken() {
  return sessionStorage.getItem(TOKEN_STORE_NAME) || '';
}

function ok(res) {
  const c = res?.data?.code;
  return c === 200 || c === '200';
}

/** 盘点时间列表 */
export async function getIsTimePd() {
  const res = await request.get('/DeptInventory/GetIsTime_PD', {
    params: { Token: getToken() }
  });
  if (ok(res)) {
    return res.data;
  }
  return Promise.reject(new Error(res.data?.msg || '查询失败'));
}

/** 某时间下科室列表 */
export async function getIsDeptPd(time) {
  const res = await request.get('/DeptInventory/GetIsDept_PD', {
    params: { Token: getToken(), time: time ?? '' }
  });
  if (ok(res)) {
    return res.data;
  }
  return Promise.reject(new Error(res.data?.msg || '查询失败'));
}

/** 库存稽查明细 */
export async function getInfoPd(params) {
  const res = await request.get('/DeptInventory/GetInfo_PD', {
    params: {
      Token: getToken(),
      DEPT: params.DEPT ?? '',
      TIME: params.TIME ?? '',
      PD_WAY: params.PD_WAY ?? '',
      STOCK_STATE: params.STOCK_STATE ?? '',
      page: params.page ?? 1,
      size: params.size ?? 20
    }
  });
  if (ok(res)) {
    return res.data;
  }
  return Promise.reject(new Error(res.data?.msg || '查询失败'));
}

/** 导出全部（服务端生成 Excel） */
export async function exportAllInfoExcel(time, stockState) {
  const res = await request.get('/DeptInventory/ExportAllInfo_Excel', {
    params: {
      Token: getToken(),
      TIME: time ?? '',
      STOCK_STATE: stockState ?? ''
    }
  });
  if (ok(res)) {
    return res.data;
  }
  return Promise.reject(new Error(res.data?.msg || '导出失败'));
}

/** 科室导出 */
export async function shanTouDeptPrintPdExcel(params) {
  const res = await request.get('/DeptInventory/ShanTouDeptPrintPDExcel', {
    params: {
      Token: getToken(),
      DEPT: params.DEPT ?? '',
      TIME: params.TIME ?? '',
      deptName: params.deptName ?? '',
      PD_WAY: params.PD_WAY ?? '',
      STOCK_STATE: params.STOCK_STATE ?? ''
    }
  });
  if (ok(res)) {
    return res.data;
  }
  return Promise.reject(new Error(res.data?.msg || '导出失败'));
}

/** 补暂借 */
export async function clickZj(id, staff) {
  const fd = formdataify({
    Token: getToken(),
    ID: id,
    staff: staff ?? ''
  });
  const res = await request.post('/DeptManual/ClickZJ', fd);
  if (ok(res)) {
    return res.data;
  }
  return Promise.reject(new Error(res.data?.msg || '操作失败'));
}

/** 暂借/消耗修正列表 */
export async function searchDsb(params) {
  const res = await request.get('/DeptManual/SearchDSB', {
    params: {
      Token: getToken(),
      strDEF_NO_PKG_CODE: params.strDEF_NO_PKG_CODE ?? '',
      SELECT_TYPE: params.SELECT_TYPE ?? '1',
      page: params.page ?? 1,
      size: params.size ?? 21
    }
  });
  if (ok(res)) {
    return res.data;
  }
  return Promise.reject(new Error(res.data?.msg || '查询失败'));
}

/** 手动补归还 */
export async function revertDefToDept(defNoPkg, staff) {
  const fd = formdataify({
    Token: getToken(),
    defNoPkg: defNoPkg ?? '',
    staff: staff ?? ''
  });
  const res = await request.post('/DeptManual/RevertDefToDept', fd);
  if (ok(res)) {
    return res.data;
  }
  return Promise.reject(new Error(res.data?.msg || '操作失败'));
}
