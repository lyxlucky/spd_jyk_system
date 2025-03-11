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

// 暂存库定数包明细列表
export async function GetPDAList(data) {
    const { page, limit, where = {}, order = '', field = '' } = data;
    const requestData = {
        page,
        size: limit,
        condition: where.divrjks2_search_inp || '',
        deptTwoCode: where.divrjks2_search_inpName || '',
        order:'',
        field
    };
    // 假设服务器端接口支持 GET 方法
    return sendRequest('/DeptTwoDefNoPkgTmpStorage/SearchDeptTwoDefCodes', requestData, 'get'); 
}


// 归还数据
export async function Temporary_supplyRevert(data) {
    // 用于存储所有 DEF_NO_PKG_CODE 的数组
    const defNoPkgCodes = [];
 // 打印提示信息，显示提取的数据

    // 从 data 中循环获取 DEF_NO_PKG_CODE
    for (const item of data) {
        if (item.Def_No_Pkg_Code) {
            defNoPkgCodes.push(item.Def_No_Pkg_Code);
        }
    }
    
    // 将 DEF_NO_PKG_CODE 数组用逗号拼接成字符串
    const defNoPkgCodeStr = defNoPkgCodes.join(',');
    // 构建请求数据对象
    const requestData = {
        staff: '',
        defNoPkg: defNoPkgCodes
    };
  
   // Message.info(requestData);
    try {
        // 
        return await sendRequest('/DeptManual/RevertDefToDept', requestData, 'post'); 
    } catch (error) {
        console.error('请求详情数据时出错:', error);
        throw error;
    }
}


// 
export async function initTemporary1(data) {
    const { page, limit, where = {}, order = '', field = '' } = data;
    const requestData = {
        page,
        size: limit,
        Dept_two_Code: where.temporary2_search_inp2 || ''
    };
    // 假设服务器端接口支持 GET 方法
    return sendRequest('/DeptTwoDefNoPkgTmpStorage/LoadDeptTwo', requestData, 'get'); 
}


// 
export async function initTemporary2(data) {
    const { page, limit, where = {}, order = '', field = '' } = data;
    
    const requestData = {
        page,
        size: limit,
        condition: where.temporary2_search_inp || '',
        deptName: where.deptName || '',
        startDate: where.start_time || '',
        endDate: where.end_time || '',
        order:'',
        field
    };
    // 假设服务器端接口支持 GET 方法
    return sendRequest('/DeptTwoDefNoPkgTmpStorage/GetHistoryTmp', requestData, 'get'); 
}
