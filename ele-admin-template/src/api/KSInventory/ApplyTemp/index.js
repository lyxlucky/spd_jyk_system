import request from '@/utils/request';
import { formdataify, DataToObject } from '@/utils/formdataify';

import { TOKEN_STORE_NAME } from '@/config/setting';
import store from '@/store';

/* 获取科室计划模板 */
export async function SerachTempletList(data) {
  var data2 = {};
  data2.page = data.page;
  data2.size = data.limit;
  data2.DeptCode = data.where.DeptCode;
  data2.SerachName = data.where.SerachName ? data.where.SerachName : '';
  data2.UserId = data.where.UserId ? data.where.UserId : '';
  data2.Token = sessionStorage.getItem(TOKEN_STORE_NAME);

  const res = await request.get('/DeptApplyPlan/SerachTempletList', {
    params: data2
  });
  if (res.data.code == 200) {
    return res.data;
  } else {
    return Promise.reject(new Error(res.data.msg));
  }
}

/* 添加科室计划模板 */
export async function CreateTemplet(data) {
  // var data2 = DataToObject(data);
  data.Token = sessionStorage.getItem(TOKEN_STORE_NAME);
  var rep = formdataify(data);
  const res = await request.post('/DeptApplyPlan/CreateTemplet', rep);
  if (res.data.code == 200) {
    return res.data;
  } else {
    return Promise.reject(new Error(res.data.msg));
  }
}

/* 删除科室计划模板 */
export async function DeleteTemplet(data) {
  var data2 = {};
  data2.ID = data.ID ? data.ID : '';
  data2.Token = sessionStorage.getItem(TOKEN_STORE_NAME);
  var rep = formdataify(data2);
  const res = await request.post('/DeptApplyPlan/DeleteTemplet', rep);
  if (res.data.code == 200) {
    return res.data;
  } else {
    return Promise.reject(new Error(res.data.msg));
  }
}

/* 获取科室计划模板 */
export async function SerachTempletDeta(data) {
  var data2 = {};
  data2.page = data.page;
  data2.size = data.limit;
  data2.DeptCode = data.where.DeptCode;
  data2.SerachName = data.where.SerachName ? data.where.SerachName : '';
  data2.UserId = data.where.UserId ? data.where.UserId : '';
  data2.TempletMasteID = data.where.TempletMasteID
    ? data.where.TempletMasteID
    : '';
  data2.dateFrom = data.where.dateFrom ? data.where.dateFrom : '';
  data2.dateTo = data.where.dateTo ? data.where.dateTo : '';
  data2.Token = sessionStorage.getItem(TOKEN_STORE_NAME);

  const res = await request.get('/DeptApplyPlan/SerachTempletDeta', {
    params: data2
  });
  if (res.data.code == 200) {
    return res.data;
  } else {
    return Promise.reject(new Error(res.data.msg));
  }
}

/* 删除科室计划模板品种 */
export async function DeleteTempletDeta(data) {
  var data2 = {};
  data2.ID = data.ID ? data.ID : '';
  data2.Token = sessionStorage.getItem(TOKEN_STORE_NAME);
  var rep = formdataify(data2);
  const res = await request.post('/DeptApplyPlan/DeleteTempletDeta', rep);
  if (res.data.code == 200) {
    return res.data;
  } else {
    return Promise.reject(new Error(res.data.msg));
  }
}

/* 获取授权品种 */
export async function SerachAuthVar(data) {
  var data2 = {};
  data2.DeptCode = data.where.DeptCode ? data.where.DeptCode : '';
  data2.SerachName = data.where.SerachName ? data.where.SerachName : '';
  data2.Token = sessionStorage.getItem(TOKEN_STORE_NAME);
  data2.page = data.page;
  data2.size = data.limit;
  data2.SPECIFICATION_OR_TYPE = data.where.SerachName ? data.where.SerachName : '';
  data2.MANUFACTURING_ENT_NAME = data.where.SerachName ? data.where.SerachName : '';

  // var data2 = DataToObject(data);
  // var rep = formdataify(data2)
  const res = await request.get('/DeptApplyPlan/SerachAuthVar', {
    params: data2
  });
  if (res.data.code == 200) {
    return res.data;
  } else {
    return Promise.reject(new Error(res.data.msg));
  }
}

/* 模板添加品种 */
export async function CreateTempletDeta(data) {
  var data2 = {};
  data2.json = JSON.stringify(data);
  data2.Token = sessionStorage.getItem(TOKEN_STORE_NAME);

  var rep = formdataify(data2);

  const res = await request.post('/DeptApplyPlan/CreateTempletDeta', rep);
  if (res.data.code == 200) {
    return res.data;
  } else {
    return Promise.reject(new Error(res.data.msg));
  }
}

/* 其他模板添加品种 */
export async function KeeptListDeta(data) {
  var data2 = {};
  data2.json = JSON.stringify(data);
  data2.Token = sessionStorage.getItem(TOKEN_STORE_NAME);
  data2.type = '0';

  var rep = formdataify(data2);

  const res = await request.post('/DeptApplyPlan/KeeptListDeta', rep);
  if (res.data.code == 200) {
    return res.data;
  } else {
    return Promise.reject(new Error(res.data.msg));
  }
}

/*  */
export async function KeepTempletDeta(data) {
  var data2 = {};
  data2.json = JSON.stringify(data);
  data2.Token = sessionStorage.getItem(TOKEN_STORE_NAME);

  var rep = formdataify(data2);

  const res = await request.post('/DeptApplyPlan/KeepTempletDeta', rep);
  if (res.data.code == 200) {
    return res.data;
  } else {
    return Promise.reject(new Error(res.data.msg));
  }
}

/* 设置常规模板 */
export async function UpdateCommon(data) {
  var data2 = {};
  data2.ID = data.ID;
  data2.Token = sessionStorage.getItem(TOKEN_STORE_NAME);

  var rep = formdataify(data2);

  const res = await request.post('/DeptApplyPlan/UpdateCommon', rep);
  if (res.data.code == 200) {
    return res.data;
  } else {
    return Promise.reject(new Error(res.data.msg));
  }
}

/* 取消常规模板 */
export async function UpdateCommon2(data) {
  var data2 = {};
  data2.ID = 0;
  data2.Token = sessionStorage.getItem(TOKEN_STORE_NAME);

  var rep = formdataify(data2);

  const res = await request.post('/DeptApplyPlan/UpdateCommon', rep);
  if (res.data.code == 200) {
    return res.data;
  } else {
    return Promise.reject(new Error(res.data.msg));
  }
}

/* 导入模板 */
export async function ImportTempExcel(data) {
  const res = await request.post('/DeptApplyPlan/ImportTempExcel', data);
  if (res.data.code == 200) {
    return res.data;
  } else {
    return Promise.reject(new Error(res.data.msg));
  }
}

// 重命名模板
export async function EditTempName(data) {
  const formatData = {
    TempCode: data.TempCode,
    TempName: data.TempName,
    Token: sessionStorage.getItem(TOKEN_STORE_NAME)
  }
  const res = await request.get('/DeptApplyPlan/EditTempName', {params:formatData});
  if (res.data.code == 200) {
    return res.data;
  } else {
    return Promise.reject(new Error(res.data.msg));
  }
}