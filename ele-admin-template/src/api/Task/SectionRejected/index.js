import request from '@/utils/request';
import { formdataify } from '@/utils/formdataify';
import { TOKEN_STORE_NAME, HOME_HP } from '@/config/setting';
import store from '@/store';

function token() {
  return sessionStorage.getItem(TOKEN_STORE_NAME);
}

function nickname() {
  return store.state.user.info?.Nickname || '';
}

export function getDeptTwoReturningGoodsList(data) {
  const where = data.where || {};
  return request.get('/DeptTwoReturningGoods/GetDeptTwoReturningGoodsList', {
    params: {
      page: data.page || 1,
      size: data.limit || 22,
      field: where.field || '',
      order: where.order || '',
      return_number: where.return_number || '',
      dept: where.dept || '',
      var: where.var || '',
      Token: token()
    }
  });
}

export function getDeptTwoReturningGoodsDetail(data) {
  const where = data.where || {};
  return request.get('/DeptTwoReturningGoods/GetDeptTwoReturningGoodsDetail', {
    params: {
      page: data.page || 1,
      size: data.limit || 20,
      returningGoodsNumber: where.returningGoodsNumber || '',
      condition: where.condition || '',
      field: where.field || '',
      order: where.order || '',
      Token: token()
    }
  });
}

export function confirmTheReturn(goodsReturnNumber) {
  return request.post('/DeptTwoReturningGoods/ConfirmTheReturn', {
    Token: token(),
    goodsReturnNumber
  });
}

export function updateReturningGoodsBz(returnningGoodsId, remark) {
  return request.post(
    '/DeptTwoReturningGoods/UpdateReturningGoodsBZ',
    formdataify({
      Token: token(),
      Returnning_Goods_Id: returnningGoodsId,
      REMARK: remark || ''
    })
  );
}

export function updateReturningGoods2Bz(id, remark) {
  return request.post(
    '/DeptTwoReturningGoods/UpdateReturningGoods2BZ',
    formdataify({
      Token: token(),
      ID: id,
      REMARK: remark || ''
    })
  );
}

export function createPackagesExcel(returningGoodsNumber, excelAction = 'CreatedePackagesExcel') {
  return request.get(`/DeptTwoReturningGoods/${excelAction}`, {
    params: {
      homehp: HOME_HP,
      returningGoodsNumber,
      Token: token()
    },
    timeout: 600000
  });
}

export function processReturnGoods(billNo) {
  return request.post(
    '/Bill/ProcessReturnGoods',
    formdataify({ billNo })
  );
}

export function getTwoDeptList(data) {
  const where = data.where || {};
  return request.get('/TwoDeptReturnGoods/GetDept', {
    params: {
      page: data.page || 1,
      size: data.limit || 9999,
      SearchName: where.SearchName || '',
      Token: token()
    }
  });
}

export function getReturnGoodsList(data) {
  const where = data.where || {};
  return request.get('/TwoDeptReturnGoods/GetReturnGoodsList', {
    params: {
      page: data.page || 1,
      size: data.limit || 99,
      SearchName: where.SearchName || '',
      DeptTwoCode: where.DeptTwoCode || '',
      StartTime: where.StartTime || '',
      EndTime: where.EndTime || '',
      OrderType: where.OrderType ?? '',
      IsHaveGoods: where.IsHaveGoods ?? '',
      Token: token()
    }
  });
}

export function getVarietieList(data) {
  const where = data.where || {};
  return request.get('/TwoDeptReturnGoods/GetVarietie', {
    params: {
      page: data.page || 1,
      size: data.limit || 10,
      DeptTwoCode: where.DeptTwoCode || '',
      SearchVarietie: where.SearchVarietie || '',
      SupplierName: where.SupplierName || '',
      STORAGE_ID: where.STORAGE_ID ?? '',
      Batch: where.Batch || '',
      specification_or_type: where.specification_or_type || '',
      field: where.field || '',
      order: where.order || '',
      Token: token()
    }
  });
}

export function getVarietieDetailList(data) {
  const where = data.where || {};
  return request.get('/TwoDeptReturnGoods/GetVarietieDeta', {
    params: {
      page: data.page || 1,
      size: data.limit || 99999,
      ID: where.ID || '',
      SearchName: where.SearchName || '',
      field: where.field || '',
      order: where.order || '',
      Token: token()
    }
  });
}

export function insertVarietie(deptTwoCode, json) {
  return request.post(
    '/TwoDeptReturnGoods/InsertVarietie',
    formdataify({
      Token: token(),
      DeptTwoCode: deptTwoCode,
      json
    })
  );
}

export function createReturnGoodsOrder(payload) {
  return request.post(
    '/TwoDeptReturnGoods/CreateReturnGoodsOrder',
    formdataify({
      Token: token(),
      DeptTwoCode: payload.deptTwoCode,
      OrderType: payload.orderType ?? '0',
      IsHaveGoods: payload.isHaveGoods ?? '1',
      Remark: payload.remark || ''
    })
  );
}

export function updateReturn(json) {
  return request.post(
    '/TwoDeptReturnGoods/UpdateRetrun',
    formdataify({ json, Token: token() })
  );
}

export function deleteReturnGoodsOrder(id) {
  return request.post(
    '/TwoDeptReturnGoods/DeleteReturnGoodsOrder',
    formdataify({ ID: id, Token: token() })
  );
}

export function submitReturnGoodsAudit(id) {
  return request.post(
    '/TwoDeptReturnGoods/SubmitReturnGoodsAudit',
    formdataify({ ID: id, Token: token() })
  );
}

export function deleteVarieties(dtlIds) {
  return request.post(
    '/TwoDeptReturnGoods/DeleteVarieties',
    formdataify({ dtlIds, Token: token() })
  );
}

export function createReturnExcel(payload) {
  return request.get('/TwoDeptReturnGoods/CreatedeRrturnExcel', {
    params: {
      homehp: HOME_HP,
      ID: payload.id,
      Operate_Number: payload.operateNumber,
      SerachName: payload.searchName || '',
      dept: payload.deptName || '',
      page: payload.page || 1,
      size: payload.size || 99999,
      strpribtCount: payload.printCount || '',
      Token: token()
    },
    timeout: 600000
  });
}

export { HOME_HP, nickname };
