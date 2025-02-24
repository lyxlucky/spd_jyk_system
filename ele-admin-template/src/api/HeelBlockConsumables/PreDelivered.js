import request from '@/utils/request';
import { formdataify, DataToObject } from '@/utils/formdataify';
import { B2B_BASE_CODE, B2B_BASE_URL, HOME_HP } from '@/config/setting';
import { TOKEN_STORE_NAME } from '@/config/setting';
import { toDateString } from 'ele-admin';
import store from '@/store/index';
import { Decrypt } from '@/utils/aes-util.js';


export async function LoadGoodsDeliveryNumbers(data) {
    var data2 = {};
    data2.Token = sessionStorage.getItem(TOKEN_STORE_NAME);
    data2.page = data.page;
    data2.size = data.limit;
    data2.deptTwoJson = data.where.deptTwoJson;
    data2.state = data.where.state ? data.where.state : '';
    data2.condition = data.where.condition ? data.where.condition : '';
    data2.dateFrom = data.date[0] ? data.date[0] : '';
    data2.dateTo = data.date[1] ? data.date[1] : '';
    data2.strApprove = data.where.strApprove ? data.where.strApprove : '';
    data2.strYanShou = data.where.strYanShou ? data.where.strYanShou : '';
    const res = await request.get('B2BPreTakeDelivery/LoadGoodsDeliveryNumbers', {
        params: data2
    });
    return res.data;
}
