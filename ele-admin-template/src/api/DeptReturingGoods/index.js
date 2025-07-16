import request from '@/utils/request';
import { formdataify, DataToObject } from '@/utils/formdataify';
import { TOKEN_STORE_NAME } from '@/config/setting';
import store from '@/store';

export async function GetDeptTwoReturningGoodsList(data) {
  const formatData = {
    page: data.page,
    size: data.limit,
    field: '',
    order: '',
    return_number: data.where.return_number ? data.where.return_number : '',
    Token: sessionStorage.getItem(TOKEN_STORE_NAME),
    dept: data.where.dept ? data.where.dept : ''
  };

  const res = await request.get(
    '/DeptTwoReturningGoods/GetDeptTwoReturningGoodsList',
    {
      params: formatData
    }
  );
  if (res.data.code == 200) {
    return res.data;
  } else {
    return Promise.reject(new Error(res.data.msg));
  }
}

export async function GetDeptTwoReturningGoodsDetail(data) {
  const formatData = {
    page: data.page,
    size: data.limit,
    field: '',
    order: '',
    returningGoodsNumber: data.where.returningGoodsNumber
      ? data.where.returningGoodsNumber
      : '',
    Token: sessionStorage.getItem(TOKEN_STORE_NAME),
    condition: data.where.condition ? data.where.condition : ''
  };

  const res = await request.get(
    '/DeptTwoReturningGoods/GetDeptTwoReturningGoodsDetail',
    {
      params: formatData
    }
  );
  if (res.data.code == 200) {
    return res.data;
  } else {
    return Promise.reject(new Error(res.data.msg));
  }
}
