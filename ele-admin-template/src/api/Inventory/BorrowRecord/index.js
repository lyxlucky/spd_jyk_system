import request from '@/utils/request';
import { TOKEN_STORE_NAME } from '@/config/setting';
import store from '@/store';

/**
 * 领用记录 - 主查询（聚合列表）
 */
export async function getSummaryList(data) {
  const formatData = {
    Token: sessionStorage.getItem(TOKEN_STORE_NAME),
    page: data.page || 1,
    size: data.size || 20,
    StartTime: data.StartTime || '',
    EndTime: data.EndTime || '',
    OperatePerson: data.OperatePerson || '',
    VarietieCode: data.VarietieCode || '',
    VarietieName: data.VarietieName || '',
    DefNoPkgCode: data.DefNoPkgCode || '',
    DeptTwoCode: store.state.user.info?.DeptNow?.Dept_Two_Code || '',
    IsAllCharged: data.IsAllCharged || ''
  };
  const res = await request.post('/BorrowRecord/GetSummaryList', formatData);
  if (res.data.code == 200) {
    return res.data;
  } else {
    return Promise.reject(new Error(res.data.msg));
  }
}

/**
 * 领用记录 - 副查询（明细列表）
 */
export async function getDetailList(data) {
  const formatData = {
    Token: sessionStorage.getItem(TOKEN_STORE_NAME),
    page: data.page || 1,
    size: data.size || 20,
    StartTime: data.StartTime || '',
    EndTime: data.EndTime || '',
    OperatePerson: data.OperatePerson || '',
    VarietieCode: data.VarietieCode || '',
    VarietieName: data.VarietieName || '',
    DefNoPkgCode: data.DefNoPkgCode || '',
    DeptTwoCode: store.state.user.info?.DeptNow?.Dept_Two_Code || '',
    IsAllCharged: data.IsAllCharged || ''
  };
  const res = await request.post('/BorrowRecord/GetDetailList', formatData);
  if (res.data.code == 200) {
    return res.data;
  } else {
    return Promise.reject(new Error(res.data.msg));
  }
}
