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
    dept: data.where.dept ? data.where.dept : '',
    var: ''
  };

  const res = await request.get(
    '/DeptTwoReturningGoods/GetDeptTwoReturningGoodsListJyk',
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

export async function CreateReturningGoodsMain() {
  const formatData = {
    Token: sessionStorage.getItem(TOKEN_STORE_NAME)
  };
  const res = await request.post(
    '/DeptTwoReturningGoods/CreateReturningGoodsMain',
    formdataify(formatData)
  );
  if (res.data.code == 200) {
    return res.data;
  } else {
    return Promise.reject(new Error(res.data.msg));
  }
}

export async function AddReturningGoodsItems(data) {
  const formatData = {
    Token: sessionStorage.getItem(TOKEN_STORE_NAME),
    list: data
  };
  const res = await request.post(
    '/DeptTwoReturningGoods/AddReturningGoodsItems',
    formatData
  );
  if (res.data.code == 200) {
    return res.data;
  } else {
    return Promise.reject(new Error(res.data.msg));
  }
}


export async function DeleteReturningGoodsItems(data) {
  const formatData = {
    Token: sessionStorage.getItem(TOKEN_STORE_NAME),
    list: data
  };
  const res = await request.post(
    '/DeptTwoReturningGoods/DeleteReturningGoodsItems',
    formatData
  );
  if (res.data.code == 200) {
    return res.data;
  } else {
    return Promise.reject(new Error(res.data.msg));
  }
}

export async function getGoodsReturnDetailList(data) {
  const formatData = {
    Token: sessionStorage.getItem(TOKEN_STORE_NAME),
    deptTwoCode: store.state.user.info.DeptNow.Dept_Two_Code,
    goodsReturnNumber: data.where.Returning_Goods_Number
  };
  const res = await request.post(
    '/DeptTwoReturningGoods/getGoodsReturnDetailList',
    formatData
  );
  if (res.data.code == 200) {
    return res.data;
  } else {
    return Promise.reject(new Error(res.data.msg));
  }
}

export async function ConfirmReturningGoodsItems(data) {
  const formatData = {
    Token: sessionStorage.getItem(TOKEN_STORE_NAME),
    goodsReturnNumber: data.Returning_Goods_Number
  };
  const res = await request.post(
    '/DeptTwoReturningGoods/ConfirmReturningGoodsItems',
    formatData
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
