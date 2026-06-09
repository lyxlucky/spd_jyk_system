import request from '@/utils/request';
import { formdataify, toUrlEncodedBody } from '@/utils/formdataify';
import { TOKEN_STORE_NAME, HOME_HP, B2B_BASE_URL } from '@/config/setting';
import store from '@/store';

function token() {
  return sessionStorage.getItem(TOKEN_STORE_NAME);
}

function nickname() {
  return store.state.user.info?.Nickname || '';
}

export function getStorageList() {
  return request.post('/Commons/GetStorageWithToken', toUrlEncodedBody({ Token: token() }), {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  });
}

export function getGoodsList(data) {
  const where = data.where || {};
  return request.get('GoodsReturn/GetGoodsList', {
    params: {
      page: data.page || 1,
      size: data.limit || 10,
      Storage: where.Storage || '',
      SearchSupplier: where.SearchSupplier || '',
      strSearch: where.strSearch || '',
      field: where.field || '',
      order: where.order || '',
      region: where.region ?? '0',
      Token: token()
    }
  });
}

export function searchGoodsReturnList(data) {
  const where = data.where || {};
  return request.post(
    'GoodsReturn/SearchGoodsReturnList',
    formdataify({
      page: data.page || 1,
      size: data.limit || 10,
      condition: where.condition || '',
      state: where.state ?? '',
      isHaveGoods: where.isHaveGoods ?? '',
      dateFrom: where.dateFrom || '',
      dateTo: where.dateTo || '',
      STORAGE_ID: where.STORAGE_ID || '',
      Token: token()
    })
  );
}

export function getGoodsReturnDtlList(data) {
  const where = data.where || {};
  return request.get('GoodsReturn/GetGoodsReturnDtlList', {
    params: {
      page: data.page || 1,
      size: data.limit || 99999,
      RETURN_NUMBER: where.RETURN_NUMBER || '',
      str: where.str || '',
      Token: token()
    }
  });
}

export function creatReturnList(json, region, remark, isHaveGoods) {
  return request.post(
    'GoodsReturn/CreatReturnList',
    formdataify({
      json,
      operator: nickname(),
      region,
      remark: remark || '',
      isHaveGoods: isHaveGoods ?? '1',
      Token: token()
    })
  );
}

export function addReturnList(json, orderId) {
  return request.post(
    'GoodsReturn/AddReturnList',
    formdataify({ json, id: orderId, Token: token() })
  );
}

export function delGoodsReturnInfo(detailId) {
  return request.post(
    'GoodsReturn/DelGoodsReturnInfo',
    formdataify({ state: 2, id: detailId, Token: token() })
  );
}

export function delGoodsLockInfo(orderId) {
  return request.post(
    'GoodsReturn/DelGoodsLockInfo',
    formdataify({ id: orderId, Token: token() })
  );
}

export function returnGoodsExcel(returnNumber, goodsReturnTime) {
  return request.get('GoodsReturn/ReturnGoodsExcel', {
    params: {
      homehp: HOME_HP,
      returningGoodsNumber: returnNumber,
      staff: nickname(),
      goodsRETURN_TIME: goodsReturnTime || '',
      Token: token()
    }
  });
}

export function showGoodsNumBz(returnNumber) {
  return request.post(
    'GoodsReturn/ShowGoodsNumBZ',
    formdataify({ RETURN_NUMBER: returnNumber, Token: token() })
  );
}

export function upGoodsNumBz(returnNumber, bz) {
  return request.post(
    'GoodsReturn/UpGoodsNumBZ',
    formdataify({ RETURN_NUMBER: returnNumber, BZ: bz, Token: token() })
  );
}

export function upGoodsNumState(state, returnNumber, supplierCode) {
  return request.post(
    'GoodsReturn/UpGoodsNumState',
    formdataify({
      STATE: state,
      RETURN_NUMBER: returnNumber,
      SUPPLIER_CODE: supplierCode,
      Token: token()
    })
  );
}

export function inB2bGoodsReturn(payload) {
  const base = (B2B_BASE_URL || '').replace(/\/$/, '');
  return request.post(`${base}/api/GoodsReturn/InB2BGoodsReturn`, formdataify({ json: payload }));
}

export function upB2bGoodsReturn(state, returnNumber, supplierCode, hospitalCode) {
  const base = (B2B_BASE_URL || '').replace(/\/$/, '');
  return request.get(`${base}/api/GoodsReturn/UpB2BGoodsReturn`, {
    params: {
      STATE: state,
      RETURN_NUMBER: returnNumber,
      SUPPLIER_CODE: supplierCode,
      HOSPITAL_CODE: hospitalCode
    }
  });
}

export { HOME_HP, B2B_BASE_URL };
