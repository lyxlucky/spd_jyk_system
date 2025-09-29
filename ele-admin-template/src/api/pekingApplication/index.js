import request from '@/utils/request';
import { TOKEN_STORE_NAME } from '@/config/setting';

// 获取费用项列表
export async function getBudgets(data) {
    let requestData = {};
    requestData.Token = sessionStorage.getItem(TOKEN_STORE_NAME);
    requestData.page = data.page || 1;
    requestData.size = data.limit || 10;
    const res = await request.post(`/PekingApplication/getBudgets`, requestData);
    if (res.data.code == 200) {
        return res.data;
    }
    return Promise.reject(res.data.msg);
}

//绑定费用项
export async function bindBudget(data) {

    const formatData = {
        ...data,
        Token:sessionStorage.getItem(TOKEN_STORE_NAME)
    }
    const res = await request.post(`/PekingApplication/bindBudgets`, formatData);
    if (res.data.code == 200) {
        return res.data;
    }
    return Promise.reject(res.data.msg);
}