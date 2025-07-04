import request from '@/utils/request';
import { formdataify, DataToObject } from '@/utils/formdataify';
import { TOKEN_STORE_NAME } from '@/config/setting';
import store from '@/store/index';

export async function GetbindUseMachin(data) {
    const formatData = {
        Token: sessionStorage.getItem(TOKEN_STORE_NAME),
        page: data.page || 1,
        size: data.limit || 9999,
        BATCH: data.where.BATCH || '',
        DEF_NO_PKG_CODE: data.where.DEF_NO_PKG_CODE || '',
        DEPT_TWO_NAME: data.where.DEPT_TWO_NAME || '',
        CHARGING_CODE: data.where.CHARGING_CODE || '',
        VARIETIE_NAME: data.where.VARIETIE_NAME || '',
        USERNAME: store.state.user.info.UserName
    }
    const res = await request.post('/PekingApplication/GetCurrentUserLoan', formatData);
    if (res.data.code == 200) {
        return res.data;
    } else {
        return Promise.reject(new Error(res.data.msg));
    }
}