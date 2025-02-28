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
    data2.dateFrom = data.where.date[0] ? data.where.date[0] : '';
    data2.dateTo = data.where.date[1] ? data.where.date[1] : '';
    data2.strApprove = data.where.strApprove ? data.where.strApprove : '';
    data2.strYanShou = data.where.strYanShou ? data.where.strYanShou : '';
    const res = await request.get('B2BPreTakeDelivery/LoadGoodsDeliveryNumbers', {
        params: data2
    });
    if (res.data.code == 200) {
        return res.data;
    } else {
        return Promise.reject(new Error(res.data.msg));
    }
}

export async function SearchDeliveryVarietie(data) {
    var data2 = {};
    data2.Token = sessionStorage.getItem(TOKEN_STORE_NAME);
    data2.page = data.page;
    data2.size = data.limit;
    data2.deliveryNumberId = data.where.deliveryNumberId ? data.where.deliveryNumberId : '';
    data2.condition = data.where.condition ? data.where.condition : '';

    const res = await request.get('B2BPreTakeDelivery/SearchDeliveryVarietie', {
        params: data2
    });
    if (res.data.code == 200) {
        return res.data;
    } else {
        return Promise.reject(new Error(res.data.msg));
    }
}

export async function Approve(data) {
    var data2 = {};
    data2.json = data.json ? data.json : '';
    data2.ApproveMan = data.ApproveMan ? data.ApproveMan : '';
    data2.Token = sessionStorage.getItem(TOKEN_STORE_NAME);
    var rep = formdataify(data2);
    const res = await request.post('/B2BPreTakeDelivery/Approve', rep);
    if (res.data.code == 200) {
        return res.data;
    } else {
        return Promise.reject(new Error(res.data.msg));
    }
}

export async function SoftDeleteDeliveryNumber(data) {
    var data2 = {};
    data2.staff = data.staff ? data.staff : '';
    data2.deliveryNumberId = data.deliveryNumberId ? data.deliveryNumberId : '';
    data2.Token = sessionStorage.getItem(TOKEN_STORE_NAME);
    var rep = formdataify(data2);
    const res = await request.post('/B2BPreTakeDelivery/SoftDeleteDeliveryNumber', rep);
    if (res.data.code == 200) {
        return res.data;
    } else {
        return Promise.reject(new Error(res.data.msg));
    }
}

export async function Confirm(data) {
    var data2 = {};
    data2.staff = data.staff ? data.staff : '';
    data2.deliveryNumberId = data.deliveryNumberId ? data.deliveryNumberId : '';
    data2.Token = sessionStorage.getItem(TOKEN_STORE_NAME);

    const res = await request.get('B2BPreTakeDelivery/Confirm', {
        params: data2
    });
    if (res.data.code == 200) {
        return res.data;
    } else {
        return Promise.reject(new Error(res.data.msg));
    }
}


export async function Save(data) {
    var data2 = {};
    data2.staff = data.staff ? data.staff : '';
    data2.dtlArgsJson = data.dtlArgsJson ? data.dtlArgsJson : '';
    data2.Token = sessionStorage.getItem(TOKEN_STORE_NAME);
    var rep = formdataify(data2);
    const res = await request.post('/B2BPreTakeDelivery/Save', rep);
    if (res.data.code == 200) {
        return res.data;
    } else {
        return Promise.reject(new Error(res.data.msg));
    }
}

export async function searchTbMainZyYp(data) {
    console.log(data)
    var data2 = {};
    data2.page = data.page;
    data2.size = data.limit;
    data2.orderNum = data.where.orderNum ? data.where.orderNum : '';
    data2.SEARCH_VALUE = data.where.SEARCH_VALUE ? data.where.SEARCH_VALUE : '';
    data2.TB_TYPE2 = data.where.TB_TYPE2 ? data.where.TB_TYPE2 : '';
    data2.Token = sessionStorage.getItem(TOKEN_STORE_NAME);
    var rep = formdataify(data2);
    const res = await request.post('/B2BConsumeMgmt/searchTbMainZyYp', rep);
    if (res.data.code == 200) {
        return res.data;
    } else {
        return Promise.reject(new Error(res.data.msg));
    }
}
