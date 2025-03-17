import request from '@/utils/request';
import { formdataify, DataToObject } from '@/utils/formdataify';

import { TOKEN_STORE_NAME } from '@/config/setting';
import store from '@/store';

export async function SearchProdAuthExpired(data) {
  var data2 = {};
  data2.Token = sessionStorage.getItem(TOKEN_STORE_NAME);
  data2.page = data.page ? data.page : '';
  data2.size = data.limit ? data.limit : '';
  data2.sort = data.order.sort ? data.order.sort : '';
  data2.order = data.order.order ? data.order.order : '';

  data2.monty = data.where.monty ? data.where.monty : '0';
  data2.SearchType = data.where.SearchType ? data.where.SearchType : '2';
  var rep = formdataify(data2);

  const res = await request.post('/AuthExpired/SearchProdAuthExpired', rep);
  if (res.data.code == 200) {
    return res.data;
  } else {
    return Promise.reject(new Error(res.data.msg));
  }
}

export async function SearchSupplierAuthExpired(data) {
  var data2 = {};
  data2.Token = sessionStorage.getItem(TOKEN_STORE_NAME);
  data2.page = data.page ? data.page : '';
  data2.size = data.limit ? data.limit : '';
  data2.sort = data.order.sort ? data.order.sort : '';
  data2.order = data.order.order ? data.order.order : '';

  data2.monty = data.where.monty ? data.where.monty : '0';
  data2.supplierEnum = data.where.supplierEnum ? data.where.supplierEnum : '1';
  var rep = formdataify(data2);

  const res = await request.post('/AuthExpired/SearchSupplierAuthExpired', rep);
  if (res.data.code == 200) {
    return res.data;
  } else {
    return Promise.reject(new Error(res.data.msg));
  }
}


export async function SearchContractAuthExpired(data) {
  var data2 = {};
  data2.Token = sessionStorage.getItem(TOKEN_STORE_NAME);
  data2.page = data.page ? data.page : '';
  data2.size = data.limit ? data.limit : '';
  data2.sort = data.order.sort ? data.order.sort : '';
  data2.order = data.order.order ? data.order.order : '';

  data2.monty = data.where.monty ? data.where.monty : '0';
  data2.contractAuthenum = data.where.contractAuthenum ? data.where.contractAuthenum : '';
  var rep = formdataify(data2);

  const res = await request.post('/AuthExpired/SearchContractAuthExpired', rep);
  if (res.data.code == 200) {
    return res.data;
  } else {
    return Promise.reject(new Error(res.data.msg));
  }
}


export async function SearchContractVarietieAuthExpired(data) {
  var data2 = {};
  data2.Token = sessionStorage.getItem(TOKEN_STORE_NAME);
  data2.page = data.page ? data.page : '';
  data2.size = data.limit ? data.limit : '';
  data2.sort = data.order.sort ? data.order.sort : '';
  data2.order = data.order.order ? data.order.order : '';

  data2.monty = data.where.monty ? data.where.monty : '0';
  var rep = formdataify(data2);

  const res = await request.post('/AuthExpired/SearchContractVarietieAuthExpired', rep);
  if (res.data.code == 200) {
    return res.data;
  } else {
    return Promise.reject(new Error(res.data.msg));
  }
}


export async function SearchDeptOneVarietieAuthExpired(data) {
  var data2 = {};
  data2.Token = sessionStorage.getItem(TOKEN_STORE_NAME);
  data2.page = data.page ? data.page : '';
  data2.size = data.limit ? data.limit : '';
  data2.sort = data.order.sort ? data.order.sort : '';
  data2.order = data.order.order ? data.order.order : '';

  data2.monty = data.where.monty ? data.where.monty : '0';
  var rep = formdataify(data2);

  const res = await request.post('/AuthExpired/SearchDeptOneVarietieAuthExpired', rep);
  if (res.data.code == 200) {
    return res.data;
  } else {
    return Promise.reject(new Error(res.data.msg));
  }
}

export async function SearchDeptTwoVarietieAuthExpired(data) {
  var data2 = {};
  data2.Token = sessionStorage.getItem(TOKEN_STORE_NAME);
  data2.page = data.page ? data.page : '';
  data2.size = data.limit ? data.limit : '';
  data2.sort = data.order.sort ? data.order.sort : '';
  data2.order = data.order.order ? data.order.order : '';

  data2.monty = data.where.monty ? data.where.monty : '0';
  var rep = formdataify(data2);

  const res = await request.post('/AuthExpired/SearchDeptTwoVarietieAuthExpired', rep);
  if (res.data.code == 200) {
    return res.data;
  } else {
    return Promise.reject(new Error(res.data.msg));
  }
}