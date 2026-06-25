import request from '@/utils/request';
import { TOKEN_STORE_NAME } from '@/config/setting';

function withToken(extra = {}) {
  return {
    Token: sessionStorage.getItem(TOKEN_STORE_NAME),
    ...extra
  };
}

function isSuccess(res) {
  const c = res.data && res.data.code;
  return c === 200 || c === '200';
}

export async function deptStockShareGroupList(params = {}) {
  const res = await request.post(
    '/DeptTwoBasicInfo/GetStockShareGroupList',
    withToken({
      page: params.page ?? 1,
      size: params.size ?? 20,
      Keyword: params.keyword,
      StockShareGroupCode: params.stockShareGroupCode,
      StockShareGroupName: params.stockShareGroupName,
      ShareGroupStatus: params.shareGroupStatus
    })
  );
  if (isSuccess(res)) {
    return res.data;
  }
  return Promise.reject(new Error(res.data.msg || '查询库存共享组失败'));
}

export async function deptStockShareGroupGenerate(params = {}) {
  const res = await request.post(
    '/DeptTwoBasicInfo/GenerateStockShareGroup',
    withToken({
      Prefix: params.prefix
    })
  );
  if (isSuccess(res)) {
    return res.data;
  }
  return Promise.reject(new Error(res.data.msg || '生成库存共享组失败'));
}

export async function deptStockShareGroupSave(data = {}) {
  const res = await request.post(
    '/DeptTwoBasicInfo/SaveStockShareGroup',
    withToken({
      DeptTwoCode: data.deptTwoCode,
      StockShareGroupCode: data.stockShareGroupCode,
      StockShareGroupName: data.stockShareGroupName
    })
  );
  if (isSuccess(res)) {
    return res.data;
  }
  return Promise.reject(new Error(res.data.msg || '保存库存共享组失败'));
}
