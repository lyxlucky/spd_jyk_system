import request from '@/utils/request';
import { formdataify, formdataifyGet } from '@/utils/formdataify';
import { TOKEN_STORE_NAME } from '@/config/setting'

import store from '@/store/index';


// export function apiSupplierGetList(data) {

//     let params = {};
//     params.Token = sessionStorage.getItem(TOKEN_STORE_NAME);

//     params.page = data.page || 1; // 页码
//     params.size = data.size || 10; // 每页大小
//     params.keyword = data.keyword || '' // 搜索
//     params.state = data.state || ''
//     params.field = data.field || '' // 排序字段
//     params.order = data.order || '' // 升序降序
//     params.enable = data.enable || '' // 启用状态
//     let url = `/Supplier/GetList${formdataifyGet(params)}`
//     return request.get(url)

// }

export async function apiSupplierGetList(data) {
    console.log(data)
    let formataData = {}
    formataData.Token = sessionStorage.getItem(TOKEN_STORE_NAME);
    formataData.page = data.page ? data.page : '1';
    formataData.size = data.size ? data.size : '10';
    formataData.keyword = data.where.keyword ? data.where.keyword : '';
    formataData.state = data.where.state ? data.order.state : '';
    formataData.field = data.order.sort ? data.order.sort : '';
    formataData.order = data.order.order ? data.order.order : '';
    formataData.enable = data.where.enable ? data.where.enable : '';
    const res = await request.get('/Supplier/GetList', {
        params: formataData
    });
    if (res.data.code == 200) {
        return res.data;
    } else {
        return Promise.reject(new Error(res.data.msg));
    }
}
