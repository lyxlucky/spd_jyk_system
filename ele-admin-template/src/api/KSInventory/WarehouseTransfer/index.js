import request from '@/utils/request';
import { formdataify, DataToObject } from '@/utils/formdataify';
import { TOKEN_STORE_NAME, } from '@/config/setting';
import store from '@/store/index';


export async function getDEPT_TK_MAIN(data) {
    var Token = sessionStorage.getItem(TOKEN_STORE_NAME);
    var data2 = {}
    //添加参数
    data2.Token = Token;
    data2.page = data.page;
    data2.size = data.limit;
    const userDepts = store.state.user.info.userDept.map((item) => {
      return `'${item.Dept_Two_Code}'`;
    }).join(',')
    data2.TK_DEPT_TWO_CODE = userDepts
    data2.TK_ORDER = data.where.TK_ORDER ? data.where.TK_ORDER : '';
    data2.CREATE_TIME_START = data.where.CREATE_TIME_START ? data.where.CREATE_TIME_START : '';
    data2.CREATE_TIME_END = data.where.CREATE_TIME_END ? data.where.CREATE_TIME_END : '';
    let data3 = formdataify(data2);
    const res = await request.post('/DeptConsume/getDEPT_TK_MAIN', data3);
    if (res.data.code == 200) {
      return res.data;
    }
    return Promise.reject(new Error(res.data.msg));
  }

  export async function createDEPT_TK_MAIN(data) {
    var Token = sessionStorage.getItem(TOKEN_STORE_NAME);
    var data2 = {}
    //添加参数
    data2.Token = Token;
    data2.TK_DEPT_TWO_CODE = store.state.user.info.DeptNow.Dept_Two_Code
    let data3 = formdataify(data2);
    const res = await request.post('/DeptConsume/createDEPT_TK_MAIN', data3);
    if (res.data.code == 200) {
      return res.data;
    }
    return Promise.reject(new Error(res.data.msg));
  }

  export async function deleteDEPT_TK_MAIN(data) {
    var Token = sessionStorage.getItem(TOKEN_STORE_NAME);
    var data2 = {}
    //添加参数
    data2.Token = Token;
    data2.ID = data.ID
    let data3 = formdataify(data2);
    const res = await request.post('/DeptConsume/deleteDEPT_TK_MAIN', data3);
    if (res.data.code == 200) {
      return res.data;
    }
    return Promise.reject(new Error(res.data.msg));
  }

  export async function getDEPT_TK_Del(data) {
    var Token = sessionStorage.getItem(TOKEN_STORE_NAME);
    var data2 = {}
    //添加参数
    data2.Token = Token;
    data2.page = data.page;
    data2.size = data.limit;
    data2.TK_MAIN_ID = data.where.ID ? data.where.ID : '';
    let data3 = formdataify(data2);
    const res = await request.post('/DeptConsume/getDEPT_TK_Del', data3);
    if (res.data.code == 200) {
      return res.data;
    }
    return Promise.reject(new Error(res.data.msg));
  }

  export async function delDEPT_TK_VAR(data) {
    var Token = sessionStorage.getItem(TOKEN_STORE_NAME);
    var data2 = {}
    //添加参数
    data2.Token = Token;
    data2.json = data.json;
    let data3 = formdataify(data2);
    const res = await request.post('/DeptConsume/delDEPT_TK_VAR', data3);
    if (res.data.code == 200) {
      return res.data;
    }
    return Promise.reject(new Error(res.data.msg));
  }

  export async function getDEPT_TK_DEF(data) {
    var Token = sessionStorage.getItem(TOKEN_STORE_NAME);
    var data2 = {}
    //添加参数
    data2.Token = Token;
    data2.page = data.page;
    data2.size = data.limit;
    data2.TK_MAIN_ID = data.where.TK_MAIN_ID ? data.where.TK_MAIN_ID : '';
    data2.TK_DEL_ID = data.where.TK_DEL_ID ? data.where.TK_DEL_ID : '';
    // data2.TK_MAIN_ID = '';
    // data2.TK_DEL_ID = '4';
    let data3 = formdataify(data2);
    const res = await request.post('/DeptConsume/getDEPT_TK_DEF', data3);
    if (res.data.code == 200) {
      return res.data;
    }
    return Promise.reject(new Error(res.data.msg));
  }

  export async function delDEPT_TK_DEF(data) {
    var Token = sessionStorage.getItem(TOKEN_STORE_NAME);
    var data2 = {}
    //添加参数
    data2.Token = Token;
    data2.json = data.json;
    let data3 = formdataify(data2);
    const res = await request.post('/DeptConsume/delDEPT_TK_DEF', data3);
    if (res.data.code == 200) {
      return res.data;
    }
    return Promise.reject(new Error(res.data.msg));
  }

  export async function chooseDefPkgTableList(data) {
    var Token = sessionStorage.getItem(TOKEN_STORE_NAME);
    var data2 = {}
    //添加参数
    data2.Token = Token;
    data2.deptCode = store.state.user.info.DeptNow.Dept_Two_Code
    data2.search = data.where.search ? data.where.search : '';
    data2.page = data.page;
    data2.size = data.limit;
    let data3 = formdataify(data2);
    const res = await request.post('/DeptConsume/chooseDefPkgTableList', data3);
    if (res.data.code == 200) {
      return res.data;
    }
    return Promise.reject(new Error(res.data.msg));
  }

  export async function createDEPT_TK_VAR(data) {
    var Token = sessionStorage.getItem(TOKEN_STORE_NAME);
    var data2 = {}
    //添加参数
    data2.Token = Token;
    data2.TK_MAIN_ID = data.TK_MAIN_ID;
    data2.json = data.json;
    let data3 = formdataify(data2);
    const res = await request.post('/DeptConsume/createDEPT_TK_VAR', data3);
    if (res.data.code == 200) {
      return res.data;
    }
    return Promise.reject(new Error(res.data.msg));
  }


  export async function itemDefPkgTableList(data) {
    var Token = sessionStorage.getItem(TOKEN_STORE_NAME);
    var data2 = {}
    //添加参数
    data2.Token = Token;
    data2.deptCode = store.state.user.info.DeptNow.Dept_Two_Code
    data2.code = data.where.code;
    data2.page = data.page;
    data2.size = data.limit;
    let data3 = formdataify(data2);
    const res = await request.post('/DeptConsume/itemDefPkgTableList', data3);
    if (res.data.code == 200) {
      return res.data;
    }
    return Promise.reject(new Error(res.data.msg));
  }

  export async function createDEPT_TK_DEF(data) {
    var Token = sessionStorage.getItem(TOKEN_STORE_NAME);
    var data2 = {}
    //添加参数
    data2.Token = Token;
    data2.TK_DEL_ID = data.id;
    data2.json = data.json;
    let data3 = formdataify(data2);
    const res = await request.post('/DeptConsume/createDEPT_TK_DEF', data3);
    if (res.data.code == 200) {
      return res.data;
    }
    return Promise.reject(new Error(res.data.msg));
  }

export async function commitTkInfo(dataArray) {
  try {
    const Token = sessionStorage.getItem(TOKEN_STORE_NAME);

    // 创建一个包含所有请求的Promise数组
    const requests = dataArray.map((item) => {
      const data = {
        Token,
        ID: item.ID,
      };
      const formData = formdataify(data);
      
      // 发送请求并返回Promise
      return request.post('/DeptConsume/commitTkInfo', formData)
        .then((res) => {
          if (res.data.code == 200) {
            return res.data;
          } else {
            throw new Error(res.data.msg);
          }
        });
    });

    // 使用Promise.all等待所有请求完成
    const results = await Promise.all(requests);
    return results;
  } catch (error) {
    return Promise.reject(error);
  }
}

export async function TjTkInfo(data) {
  var Token = sessionStorage.getItem(TOKEN_STORE_NAME);
  //添加参数
  var data2 = {}
  data2.Token = Token;
  data2.ID = data.ID;
  let data3 = formdataify(data2);
  const res = await request.post('/DeptConsume/TjTkInfo', data3);
  if (res.data.code == 200) {
    return res.data;
  }
  return Promise.reject(new Error(res.data.msg));
}

export async function addTemplateVarietie(data) {
  var Token = sessionStorage.getItem(TOKEN_STORE_NAME);
  //添加参数
  var data2 = {}
  data2.Token = Token;
  data2.deptCode = store.state.user.info.DeptNow.Dept_Two_Code
  data2.id = data.id;
  data2.json = data.json;
  let data3 = formdataify(data2);
  const res = await request.post('/DeptConsume/addTemplateVarietie', data3);
  if (res.data.code == 200) {
    return res.data;
  }
  return Promise.reject(new Error(res.data.msg));
}


export async function templateVarietieList(data) {
  var Token = sessionStorage.getItem(TOKEN_STORE_NAME);
  //添加参数
  var data2 = {}
  data2.Token = Token;
  data2.id = data.where.id;
  data2.page = data.page;
  data2.size = data.limit;
  let data3 = formdataify(data2);
  const res = await request.post('/DeptConsume/templateVarietieList', data3);
  if (res.data.code == 200) {
    return res.data;
  }
  return Promise.reject(new Error(res.data.msg));
}

export async function pullDataAsExcel() {
  var Token = sessionStorage.getItem(TOKEN_STORE_NAME);
  //添加参数
  var data2 = {}
  data2.Token = Token;
  let data3 = formdataify(data2);
  const res = await request.post('/DeptConsume/pullDataAsExcel', data3);
  if (res.data.code == 200) {
    return res.data;
  }
  return Promise.reject(new Error(res.data.msg));
}

export async function updateDEPT_TK_DelNum(data) {
  var Token = sessionStorage.getItem(TOKEN_STORE_NAME);
  //添加参数
  var data2 = {}
  data2.Token = Token;
  data2.tkIds = data.tkIds;
  data2.num = data.num;
  let data3 = formdataify(data2);
  const res = await request.post('/DeptConsume/updateDEPT_TK_DelNum', data3);
  if (res.data.code == 200) {
    return res.data;
  }
  return Promise.reject(new Error(res.data.msg));
}

export async function getlogInfoTable(data) {
  console.log(data)
  var Token = sessionStorage.getItem(TOKEN_STORE_NAME);
  var data2 = {}
  //添加参数
  data2.Token = Token;
  data2.page = data.page;
  data2.size = data.limit;
  data2.tkOrder = data.where.search ? data.where.search : '';
  const [startDate,endDate] = data.where.date ? data.where.date : '';
  data2.startDate = startDate ? startDate : '';
  data2.endDate = endDate ? endDate : '';
  data2.sort = data.order.sort ? data.order.sort : '';
  data2.order = data.order.order ? data.order.order : '';
  let data3 = formdataify(data2);
  const res = await request.post('/DeptConsume/getlogInfoList', data3);
  if (res.data.code == 200) {
    return res.data;
  }
  return Promise.reject(new Error(res.data.msg));
}