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

export function getStorageList() {
  return request.post('/Commons/GetStorageWithToken', formdataify({ Token: token() }));
}

export function searchPickList(data) {
  const where = data.where || {};
  return request.get('PickDistributionmgmt/SearchPickList', {
    params: {
      page: data.page || 1,
      size: data.limit || 10,
      DeptCode: where.DeptCode || '',
      PackNumber: where.PackNumber || '',
      StateDate: where.StateDate || '',
      EndDate: where.EndDate || '',
      PackState: where.PackState ?? -1,
      TransferState: where.TransferState ?? -1,
      storageId: where.storageId || '',
      field: where.field || '',
      order: where.order || '',
      Token: token()
    }
  });
}

export function searchDistributeList(data) {
  const where = data.where || {};
  return request.get('PickDistributionmgmt/SearchDistributeList', {
    params: {
      page: data.page || 1,
      size: data.limit || 10,
      DeptCode: where.DeptCode || '',
      StockNumber: where.StockNumber || '',
      StateDate: where.StateDate || '',
      EndDate: where.EndDate || '',
      replenish_state: where.replenish_state ?? -1,
      field: where.field || '',
      order: where.order || '',
      Token: token()
    }
  });
}

export function getPickDetail(data) {
  return request.get('PickDistributionmgmt/GetPickDetail', {
    params: {
      page: data.page || 1,
      size: data.limit || 10,
      pack_directive_number: data.packDirectiveNumber || '',
      Token: token()
    }
  });
}

export function getPickDefDetail(data) {
  return request.get('PickDistributionmgmt/GetPickDefDetail', {
    params: {
      page: data.page || 1,
      size: data.limit || 10,
      dept_two_var_pack_detail_id: data.detailId || '',
      Token: token()
    }
  });
}

export function getAllPickDefDetail(data) {
  return request.get('PickDistributionmgmt/GetAllPickDefDetail', {
    params: {
      page: data.page || 1,
      size: data.limit || 10,
      pack_directive_number: data.packDirectiveNumber || '',
      Token: token()
    }
  });
}

export function getDistributeDetail(data) {
  return request.get('PickDistributionmgmt/GetDistributeDetail', {
    params: {
      page: data.page || 1,
      size: data.limit || 10,
      stock_out_distribute_number: data.stockOutNumber || '',
      Token: token()
    }
  });
}

export function getDistributeDefDetail(data) {
  return request.get('PickDistributionmgmt/GetDistributeDefDetail', {
    params: {
      page: data.page || 1,
      size: data.limit || 10,
      dept_two_var_distribute_dtl_id: data.detailId || '',
      Token: token()
    }
  });
}

export function insertDeptUpShelf(stockOutNumber) {
  return request.post(
    'PickDistributionmgmt/InsertDeptUpShelf',
    formdataify({ stock_out_distribute_number: stockOutNumber, Token: token() })
  );
}

export function processDefEpcCk(taskNo, departmentNo) {
  return request.post('Bill/Process_DefEpcCk', {
    TaskNo: taskNo,
    DepartmentNo: departmentNo || ''
  });
}

export function processOrder(billNo, departmentNo) {
  return request.post('Bill/ProcessOrder', {
    billNo,
    departmentNo: departmentNo || ''
  });
}

export function getDistributeDefDetailNum(data) {
  return request.get('PickDistributionmgmt/GetDistributeDefDetailNum', {
    params: {
      page: data.page || 1,
      size: data.limit || 10,
      stock_out_distribute_number: data.stockOutNumber || '',
      Token: token()
    }
  });
}

export function deletePickList(id) {
  return request.post(
    'PickDistributionmgmt/DeletePickList',
    formdataify({ ID: id, Token: token() })
  );
}

export function deleteDistribute(stockOutDistributeNumber) {
  return request.post(
    'PickDistributionmgmt/Delete',
    formdataify({ stock_out_distribute_number: stockOutDistributeNumber, Token: token() })
  );
}

export function completeByDirectiveNumber(packDirectiveNumber) {
  return request.post(
    'DefDirective/CompleteByDirectiveNumber',
    formdataify({ Pack_Directive_Number: packDirectiveNumber, Token: token() })
  );
}

export function cancelPickList(id) {
  return request.post(
    'PickDistributionmgmt/CancelPickList',
    formdataify({ id, Token: token() })
  );
}

export function sendBDRobot(packDirectiveNumber) {
  return request.get('PickDistributionmgmt/SendBDRobot', {
    params: { pack_directive_number: packDirectiveNumber, Token: token() }
  });
}

export function updateReplenishState(stockOutNumber) {
  return request.post(
    'PickDistributionmgmt/UpdateReplenishState',
    formdataify({
      homehp: HOME_HP,
      id: stockOutNumber,
      Operate: nickname(),
      Token: token()
    })
  );
}

export function closeDistribute(stockOutNumber) {
  return request.post(
    'PickDistributionmgmt/closeDistribute',
    formdataify({ STOCK_OUT_DISTRIBUTE_NUMBER: stockOutNumber, Token: token() })
  );
}

export function getLhDistributeList(stockOutNumber) {
  return request.get('PickDistributionmgmt/GetLHDistributeList', {
    params: { StockOutDistributeNumber: stockOutNumber, Token: token() }
  });
}

export function createDeliveryExcelLh(directiveNumber, dept) {
  return request.get('PickDistributionmgmt/CreatedeliveryExcel_LH', {
    params: {
      homehp: HOME_HP,
      Directive_Number: directiveNumber,
      dept,
      Operate: nickname(),
      page: 1,
      size: 99999,
      Token: token()
    }
  });
}

export function sendDefHNCK(ckNum) {
  return request.post(
    'Abdzczh/SendDefHNCK',
    formdataify({ CKNUM: ckNum, Token: token() })
  );
}

export function glDeptPlanJp(id, planId) {
  return request.post(
    'PickDistributionmgmt/glDeptPlanJp',
    formdataify({ ID: id, PLAN_ID: planId, Token: token() })
  );
}

export function createPickExcel(directiveNumber, dept) {
  return request.get('PickDistributionmgmt/CreatePickExcel', {
    params: {
      homehp: HOME_HP,
      Directive_Number: directiveNumber,
      dept,
      Operate: nickname(),
      page: 1,
      size: 99999,
      Token: token()
    }
  });
}

export function createDeliveryExcelzhu(directiveNumber, dept) {
  return request.get('PickDistributionmgmt/CreatedeliveryExcelzhu', {
    params: {
      homehp: HOME_HP,
      Directive_Number: directiveNumber,
      dept,
      Operate: nickname(),
      page: 1,
      size: 99999,
      Token: token()
    }
  });
}

export function createDeliveryExcel(directiveNumber, dept) {
  return request.get('PickDistributionmgmt/CreatedeliveryExcel', {
    params: {
      homehp: HOME_HP,
      Directive_Number: directiveNumber,
      dept,
      Operate: nickname(),
      page: 1,
      size: 99999,
      Token: token()
    }
  });
}

export function createDeliveryExcel2(directiveNumber, dept) {
  return request.get('PickDistributionmgmt/CreatedeliveryExcel2', {
    params: {
      homehp: HOME_HP,
      Directive_Number: directiveNumber,
      dept,
      Operate: nickname(),
      page: 1,
      size: 99999,
      Token: token()
    }
  });
}

export function createDeliveryConsignmentExcel(directiveNumber, dept) {
  return request.get('PickDistributionmgmt/CreatedeliveryConsignmentExcel', {
    params: {
      homehp: HOME_HP,
      Directive_Number: directiveNumber,
      dept,
      Operate: nickname(),
      page: 1,
      size: 99999,
      Token: token()
    }
  });
}

export function pickBatch(formData) {
  formData.append('Token', token());
  return request.post('DefDirective/PickBatch', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
}

export { HOME_HP };
