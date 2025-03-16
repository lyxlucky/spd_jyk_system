import request from '@/utils/request';
import { formdataify, DataToObject } from '@/utils/formdataify';
import { B2B_BASE_CODE, B2B_BASE_URL, HOME_HP } from '@/config/setting';
import { TOKEN_STORE_NAME } from '@/config/setting';
import { toDateString } from 'ele-admin';
import store from '@/store/index';
import { Decrypt } from '@/utils/aes-util.js';

export async function getSupplierList(data) {
  let formataData = {};
  formataData.Token = sessionStorage.getItem(TOKEN_STORE_NAME);
  formataData.page = data.page;
  formataData.size = data.limit;
  formataData.keyword = data.where.search ? data.where.search : '';
  formataData.state = '';
  formataData.field = '';
  formataData.order = '';
  formataData.enable = data.where.value ? data.where.value : '1';
  formataData.supZzState = data.where.supplierValue
    ? data.where.supplierValue
    : '0';
  formataData.varZzState = data.where.varietieValue
    ? data.where.varietieValue
    : '';
  let req = formdataify(formataData);
  const res = await request.post('/Supplier/GetListZzsh', req);
  const isEncrypt = store.state.user.isEncrypt;
  if (isEncrypt) {
    const devData = JSON.parse(Decrypt(res.data.devData));
    if (devData.code == 200) {
      return devData;
    } else {
      return Promise.reject(new Error(devData.msg));
    }
  } else {
    if (res.data.code == 200) {
      return res.data;
    } else {
      return Promise.reject(new Error(res.data.msg));
    }
  }
}

export async function SearchGoodsDeliveryNumbers(data) {
  // console.log(data)
  var data2 = {};
  data2.page = data.page;
  data2.size = data.limit;
  data2.supplierId = data.where.supplierId ? data.where.supplierId : '0';
  data2.condition = data.where.condition ? data.where.condition : '';
  data2.state = data.where.state ? data.where.state : '';
  data2.hp = data.where.hp ? data.where.hp : '';
  data2.depts = data.where.depts ? data.where.depts : '';
  data2.Token = sessionStorage.getItem(TOKEN_STORE_NAME);
  // var rep = formdataify(data2);
  const res = await request.get('/B2BConsumeMgmt/SearchGoodsDeliveryNumbers', {
    params: data2
  });
  if (res.data.code == 200) {
    return res.data;
  } else {
    return Promise.reject(new Error(res.data.msg));
  }
}

export async function SearchDeliveryVarietie(data) {
  // console.log(data)
  var data2 = {};
  data2.page = data.page;
  data2.size = data.limit;
  data2.supplierId = data.where.supplierId ? data.where.supplierId : '0';
  data2.deliveryNumber = data.where.deliveryNumber
    ? data.where.deliveryNumber
    : '';
  data2.condition = data.where.condition ? data.where.condition : '';
  data2.zcz = data.where.zcz ? data.where.zcz : '';
  data2.udi = data.where.udi ? data.where.udi : '';
  data2.Token = sessionStorage.getItem(TOKEN_STORE_NAME);
  // var rep = formdataify(data2);
  const res = await request.get('/B2BConsumeMgmt/SearchDeliveryVarietie', {
    params: data2
  });
  if (res.data.code == 200) {
    return res.data;
  } else {
    return Promise.reject(new Error(res.data.msg));
  }
}

export async function LoadDeliveryConsumedVarietie(data) {
  // console.log(data)
  var data2 = {};
  data2.page = data.page;
  data2.size = data.limit;
  data2.supplierId = data.where.supplierId ? data.where.supplierId : '0';
  data2.deliveryNumber = data.where.deliveryNumber
    ? data.where.deliveryNumber
    : '';
  data2.Token = sessionStorage.getItem(TOKEN_STORE_NAME);
  // var rep = formdataify(data2);
  const res = await request.get(
    '/B2BConsumeMgmt/LoadDeliveryConsumedVarietie',
    {
      params: data2
    }
  );
  if (res.data.code == 200) {
    return res.data;
  } else {
    return Promise.reject(new Error(res.data.msg));
  }
}

export async function LoadVarietieGS1(data) {
  console.log(data);
  var data2 = {};
  data2.page = data.page;
  data2.size = data.limit;
  data2.id = data.where.id ? data.where.id : '';
  data2.Token = sessionStorage.getItem(TOKEN_STORE_NAME);
  // var rep = formdataify(data2);
  const res = await request.get('/B2BConsumeMgmt/LoadVarietieGS1', {
    params: data2
  });
  if (res.data.code == 200) {
    return res.data;
  } else {
    return Promise.reject(new Error(res.data.msg));
  }
}

export async function RemoveVarieties(data) {
  let formataData = {};
  formataData.Token = sessionStorage.getItem(TOKEN_STORE_NAME);
  formataData.json = data;
  let req = formdataify(formataData);
  const res = await request.post('/B2BConsumeMgmt/RemoveVarieties', req);
  if (res.data.code == 200) {
    return res.data;
  } else {
    return Promise.reject(new Error(res.data.msg));
  }
}

export async function UpdatePatientInfo(data) {
  let formataData = {};
  formataData.Token = sessionStorage.getItem(TOKEN_STORE_NAME);
  formataData.deliveryNoteNumber = data.deliveryNoteNumber;
  formataData.hospitalizationNumber = data.hospitalizationNumber;
  formataData.patient = data.patient;
  let req = formdataify(formataData);
  const res = await request.post('/B2BConsumeMgmt/UpdatePatientInfo', req);
  if (res.data.code == 200) {
    return res.data;
  } else {
    return Promise.reject(new Error(res.data.msg));
  }
}

export async function SubmitConsumeVarieties(data) {
  console.log(data);
  var data2 = {};
  data2.id = data.id ? data.id : '';
  data2.staff = data.staff ? data.staff : '';
  data2.Token = sessionStorage.getItem(TOKEN_STORE_NAME);
  // var rep = formdataify(data2);
  const res = await request.get('/B2BConsumeMgmt/SubmitConsumeVarieties', {
    params: data2
  });
  if (res.data.code == 200) {
    return res.data;
  } else {
    return Promise.reject(new Error(res.data.msg));
  }
}

export async function delGtGoodsDeliveryNumber(data) {
  const formatData = {
    token: sessionStorage.getItem(TOKEN_STORE_NAME),
    DELIVERY_NOTE_NUMBER: data.DELIVERY_NOTE_NUMBER
  };
  var req = formdataify(formatData);
  const res = await request.post(
    '/B2BConsumeMgmt/delGtGoodsDeliveryNumber',
    req
  );
  if (res.data.code == 200) {
    return res.data;
  } else {
    return Promise.reject(new Error(res.data.msg));
  }
}
