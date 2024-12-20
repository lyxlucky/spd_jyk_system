import request from '@/utils/request';
import { formdataify, DataToObject } from '@/utils/formdataify';
import { TOKEN_STORE_NAME } from '@/config/setting';


export async function getJyDeviceTableList(data) {
    const formatData = {
        Token: sessionStorage.getItem(TOKEN_STORE_NAME),
        page: data.page,
        size: data.limit,
        code: data.where.code ? data.where.code : '',
        startDate : data.where.startDate ? data.where.startDate : '',
        endDate : data.where.endDate ? data.where.endDate : '',
    }
    const res = await request.post('/DataStatics/getJyDeviceTableList', formdataify(formatData));
    if (res.data.code == 200) {
        return res.data;
    } else {
        return Promise.reject(new Error(res.data.msg));
    }
}
