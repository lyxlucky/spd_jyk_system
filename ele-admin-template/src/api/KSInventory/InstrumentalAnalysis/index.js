import request from '@/utils/request';
import { formdataify, DataToObject } from '@/utils/formdataify';
import { TOKEN_STORE_NAME, } from '@/config/setting';

export async function GetPDAList(data) {
    var data2 ={};
    data2.Token = sessionStorage.getItem(TOKEN_STORE_NAME);
    data2.page = data.page;
    data2.size = data.limit;
    data2.BIND_MACHINE = data.where.BIND_MACHINE ? data.where.BIND_MACHINE : '';
    data2.VARIETIE_CODE_NEW = data.where.VARIETIE_CODE_NEW ? data.where.VARIETIE_CODE_NEW : '';
    data2.VARIETIE_NAME = data.where.VARIETIE_NAME ? data.where.VARIETIE_NAME : '';
    data2.SPECIFICATION_OR_TYPE = data.where.SPECIFICATION_OR_TYPE ? data.where.SPECIFICATION_OR_TYPE : '';
    data2.order = data.order ? data.order : '';
    data2.field = data.field ? data.field : '';

    DataToObject(data,data2)
    if(data != null){
        var data3 = formdataify(data);
    }
    const res = await request.post('/AJykDept/GetPDAList',data3);
    if (res.data.code == 200) {
        return res.data;
    } else {
        return Promise.reject(new Error(res.data.msg));
    }
}
