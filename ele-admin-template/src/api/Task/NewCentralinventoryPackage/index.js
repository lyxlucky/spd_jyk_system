import request from '@/utils/request';
import { formdataify, DataToObject } from '@/utils/formdataify';
import { TOKEN_STORE_NAME } from '@/config/setting';
import store from '@/store';

/* 中心库制包 */
export async function SearchVarietie(data) {
    var data2 = {};
    data2.page = data.page;
    data2.size = data.limit;
    const {sort = '',order = ''} = data.order;
    data2.field = sort;
    data2.order = order;
    data2.Storage_Id = data.where.option ? data.where.option : '';
    data2.condition = data.where.search ? data.where.search : '99999999999999999999';
    const res = await request.get('/CentralWarehouseBagMakingMgmt/SearchVarietie', {
      params: data2
    });
    if (res.data.code == 200) {
      return res.data;
    } else {
      return Promise.reject(new Error(res.data.msg));
    }
  }

  export async function getSTORAGE() {
    const res = await request.get('/Commons/getSTORAGE');
    if (res.data.code == 200) {
      return res.data;
    } else {
      return Promise.reject(new Error(res.data.msg));
    }
  }

  export async function LoadLockedVarieties(data) {
    const formatData = {
      page: data.page,
      size: data.limit,
      Bag_Maker: data.where.search ? data.where.search : '',
      token: sessionStorage.getItem(TOKEN_STORE_NAME)
    };
    const res = await request.get('/CentralWarehouseBagMakingMgmt/LoadLockedVarieties',{
      params: formatData
    });
    if (res.data.code == 200) {
      return res.data;
    } else {
      return Promise.reject(new Error(res.data.msg));
    }
  }

  export async function LockVarietieQuantity(data) {
    const formatData = {
      json: data.json,
      staff:store.state.user.info.Nickname,
      Token: sessionStorage.getItem(TOKEN_STORE_NAME)
    }
    const res = await request.post('/CentralWarehouseBagMakingMgmt/LockVarietieQuantity', formdataify(formatData));
    if (res.data.code == 200) {
        return res.data;
    } else {
        return Promise.reject(new Error(res.data.msg));
    }
}


export async function UnlockVarietieQuantity(data) {
  const formatData = {
    json: data.json,
    token: sessionStorage.getItem(TOKEN_STORE_NAME)
  }
  const res = await request.post('/CentralWarehouseBagMakingMgmt/UnlockVarietieQuantity', formdataify(formatData));
  if (res) {
      return JSON.parse(
        JSON.stringify(
          {
            code:"200",
            msg:"处理成功"
          }
        )
      );
  } else {
      return Promise.reject(new Error(res.data.msg));
  }
}

export async function ShowVarietieDefCodes(data) {
  const formatData = {
    page: data.page,
    size: data.limit,
    id: data.where.id,
  }
  const res = await request.get('/CentralWarehouseBagMakingMgmt/ShowVarietieDefCodes',{
    params: formatData
  });
  if (res.data.code == 200) {
      return res.data;
  } else {
      return Promise.reject(new Error(res.data.msg));
  }
}


export async function UpShelf(data) {
  const formatData = {
    json: data.json,
    staff:store.state.user.info.Nickname,
    Token: sessionStorage.getItem(TOKEN_STORE_NAME)
  }
  const res = await request.post('/CentralWarehouseBagMakingMgmt/UpShelf', formdataify(formatData));
  if (res.data.code == 200) {
      return res.data;
  } else {
      return Promise.reject(new Error(res.data.msg));
  }
}