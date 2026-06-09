import request from '@/utils/request';
import { formdataify } from '@/utils/formdataify';
import { TOKEN_STORE_NAME } from '@/config/setting';
import store from '@/store';

function token() {
  return sessionStorage.getItem(TOKEN_STORE_NAME);
}

function nickname() {
  return store.state.user.info?.Nickname || '';
}

export function getStorageList() {
  return request.get('/Commons/getSTORAGE');
}

export function searchVarietie(data) {
  const where = data.where || {};
  const condition = where.condition?.trim() ? where.condition.trim() : '99999999999999999999';
  return request.get('/CentralWarehouseBagMakingMgmt/SearchVarietie', {
    params: {
      page: data.page || 1,
      size: data.limit || 20,
      field: where.field || '',
      order: where.order || '',
      Storage_Id: where.storageId ?? '',
      condition,
      Token: token()
    }
  });
}

export function getDefNoPkgStockLimit(varietieCode, storageId) {
  return request.get('/CentralWarehouseBagMakingMgmt/GetDefNoPkgStockLimit', {
    params: {
      varietieCode,
      storageId,
      Token: token()
    }
  });
}

export function lockVarietieQuantityV2(json, state = '0') {
  return request.post(
    '/CentralWarehouseBagMakingMgmt/LockVarietieQuantityV2',
    formdataify({
      json,
      staff: nickname(),
      state,
      Token: token()
    })
  );
}

export function loadLockedVarietiesV2(data) {
  const where = data.where || {};
  return request.get('/CentralWarehouseBagMakingMgmt/LoadLockedVarietiesV2', {
    params: {
      page: data.page || 1,
      size: data.limit || 10,
      Bag_Maker: where.bagMaker || '',
      state: where.state ?? '0',
      Token: token()
    }
  });
}

export function unlockVarietieQuantity(json) {
  return request.post(
    '/CentralWarehouseBagMakingMgmt/UnlockVarietieQuantity',
    formdataify({ json, Token: token() })
  );
}

export function generateVarietieDefCodes(json) {
  return request.post(
    '/CentralWarehouseBagMakingMgmt/GenerateVarietieDefCodes',
    formdataify({
      json,
      staff: nickname(),
      Token: token()
    })
  );
}

export function showVarietieDefCodes(data) {
  return request.get('/CentralWarehouseBagMakingMgmt/ShowVarietieDefCodes', {
    params: {
      page: data.page || 1,
      size: data.limit || 20,
      id: data.where?.batchId || '',
      Token: token()
    }
  });
}

export function upShelf(json) {
  return request.post(
    '/CentralWarehouseBagMakingMgmt/UpShelf',
    formdataify({
      json,
      staff: nickname(),
      Token: token()
    })
  );
}

export function resetLadleMaking(id) {
  return request.post(
    '/CentralWarehouseBagMakingMgmt/ResetLadleMaking',
    formdataify({ ID: id, Token: token() })
  );
}

export function convertToUdi(ids) {
  return request.post(
    '/CentralWarehouseBagMakingMgmt/ConverttoUDI',
    formdataify({ IDS: ids, Token: token() })
  );
}

export function searchBagMakingDefCode(data) {
  const where = data.where || {};
  return request.post(
    '/CentralWarehouseBagMakingMgmt/SearchBagMakingDefCodeNew',
    formdataify({
      bagMakingNumber: where.bagMakingNumber || '',
      condition: where.condition || '',
      defCode: where.defCode || '',
      rfidCode: where.rfidCode || '',
      batch: where.batch || '',
      supplierName: where.supplierName || '',
      page: data.page || 1,
      size: data.limit || 20,
      field: where.field || '',
      order: where.order || '',
      dateFrom: where.dateFrom || '',
      dateTo: where.dateTo || '',
      Storage_Id: where.storageId ?? '',
      DELIVERY_NOTE_NUMBER: where.deliveryNoteNumber || '',
      DELIVERY_NOTE_NUMBER_RFID: where.deliveryNoteRfid ?? '',
      Token: token()
    })
  );
}

export function exportBagMakingDefCode(where) {
  return request.post(
    '/CentralWarehouseBagMakingMgmt/ExportBagMakingDefCode',
    formdataify({
      bagMakingNumber: where.bagMakingNumber || '',
      condition: where.condition || '',
      defCode: where.defCode || '',
      rfidCode: where.rfidCode || '',
      batch: where.batch || '',
      supplierName: where.supplierName || '',
      DELIVERY_NOTE_NUMBER: where.deliveryNoteNumber || '',
      DELIVERY_NOTE_NUMBER_RFID: where.deliveryNoteRfid ?? '',
      field: where.field || '',
      order: where.order || '',
      dateFrom: where.dateFrom || '',
      dateTo: where.dateTo || '',
      page: 1,
      size: 9999999,
      Token: token()
    })
  );
}

export function noTagBagMakingDef(json) {
  return request.post(
    '/Abdzczh/noTagBagMakingDef',
    formdataify({ json, Token: token() })
  );
}

export { nickname, token };
