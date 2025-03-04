import request from '@/utils/request';
import { formdataify, formdataifyGet } from '@/utils/formdataify';
import { TOKEN_STORE_NAME } from '@/config/setting'

import store from '@/store/index';


export function apiSupplierGetList(data){

    let params = {};
    params.Token = sessionStorage.getItem(TOKEN_STORE_NAME);
    
    params.page = data.page || 1; // 页码
    params.size = data.size || 10; // 每页大小
    params.keyword = data.keyword || '' // 搜索
    params.state = data.state || '' 
    params.field = data.field || '' // 排序字段
    params.order = data.order || '' // 升序降序
    params.enable = data.enable || '' // 启用状态
    let url = `/Supplier/GetList${formdataifyGet(params)}`
    return request.get(url)

}