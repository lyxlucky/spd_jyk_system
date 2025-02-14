import request from '@/utils/request';
import { formdataify, DataToObject } from '@/utils/formdataify';
import { TOKEN_STORE_NAME } from '@/config/setting';

// 封装通用的请求函数
async function sendRequest(url, data) {
    const token = sessionStorage.getItem(TOKEN_STORE_NAME);
    const requestData = { Token: token, ...data };
    const formData = formdataify(requestData);
    const res = await request.post(url, formData);
    if (res.data.code == 200) {
        return res.data;
    } else {
        return Promise.reject(new Error(`请求 ${url} 失败: ${res.data.msg}`));
    }
}

// 获取价格记录列表
export async function GetPDAList(data) {
    const { page, limit, where = {}, order = '', field = '' } = data;
    const requestData = {
        page,
        size: limit,
        VARIETIE_SEARCH_VALUE: where.VARIETIE_SEARCH_VALUE || '',
        STATE: where.STATE || '',
        start_time: where.start_time || '',
        end_time: where.end_time || '',
        PriceIsEqual: where.PriceIsEqual || '',
        order,
        field
    };
    return sendRequest('/VarietieBasicInfo/getVarPriceRecode', requestData);
}

// 提交价格记录处理状态
export async function VarPriceRecodeCommit(data) {
    const requestData = {
        json: JSON.stringify(data)
    };
    return sendRequest('/VarietieBasicInfo/varPriceRecodeCommit', requestData);
}