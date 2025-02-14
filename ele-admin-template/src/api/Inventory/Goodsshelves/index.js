import request from '@/utils/request';
import { formdataify, DataToObject } from '@/utils/formdataify';
import { TOKEN_STORE_NAME } from '@/config/setting';
import { Message } from 'element-ui';
// 封装通用的请求函数
async function sendRequest(url, data, method = 'post') {
    const token = sessionStorage.getItem(TOKEN_STORE_NAME);
    const requestData = { Token: token, ...data };
    const formData = formdataify(requestData);

    let res;
    if (method === 'post') {
        res = await request.post(url, formData);
    } else if (method === 'get') {
        
        res = await request.get(url, { params: requestData }); 
    }

    if (res.data.code == 200) {
        return res.data;
    } else {
        return Promise.reject(new Error(`请求 ${url} 失败: ${res.data.msg}`));
    }
}

// 获取溯源记录列表
export async function GetPDAList(data) {
    const { page, limit, where = {}, order = '', field = '' } = data;
    const requestData = {
        page,
        size: limit,
        condition: where.ks_gs1_search_inp || '',
        bhOrYs: where.ks_gs1_search_bhOrYs || '',
        startTime: where.ks_UseTimeStart || '',
        endTime: where.ks_UseTimeEnd || '',
        IsEnd: '',
        order:'',
        field
    };
    // 假设服务器端接口支持 GET 方法
    return sendRequest('/GS1/Search', requestData, 'get'); 
}


// 获取详情数据
export async function getSourceDetail(data) {
    // 从 data 中提取 Storage_Id 和 Def_No_Pkg_Code
    const { Storage_Id, Def_No_Pkg_Code } = data;
  
    // 打印提示信息，显示提取的数据
    //Message.info(Def_No_Pkg_Code);
  
    // 构建请求数据对象
    const requestData = {
        storageId:Storage_Id,
        defNoPkgCode:Def_No_Pkg_Code
    };
  
    try {
      // 假设服务器端接口支持 GET 方法
      return await sendRequest('/GS1/Trace', requestData, 'get'); 
    } catch (error) {
      console.error('请求详情数据时出错:', error);
      throw error;
    }
  }