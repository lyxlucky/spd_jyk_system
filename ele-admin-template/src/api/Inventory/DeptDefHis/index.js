import request from '@/utils/request';
import { formdataify, DataToObject } from '@/utils/formdataify';
import { TOKEN_STORE_NAME } from '@/config/setting';
import store from '@/store/index.js';
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

// 
export async function GetPDAList(data) {
    const { page, limit, where = {}, order = '', field = '' } = data;
    const requestData = {
        page,
        size: limit,
        deptTwoName: where.deptTwoName || '',
        varietie: where.varietie || '',
        specType: where.specType || '',
        defNoPkgCode: where.defNoPkgCode || '',
        contractCode: where.contractCode || '',
        supplierName: where.supplierName || '',
        auth_dept_two_codes:'' // store.state.user.info.DeptNow.Dept_Two_Name,
       
    };
    // 假设服务器端接口支持 GET 方法
    return sendRequest('/DeptConsume/SerachDef2Consume4LuoHu', requestData, 'post'); 
}


