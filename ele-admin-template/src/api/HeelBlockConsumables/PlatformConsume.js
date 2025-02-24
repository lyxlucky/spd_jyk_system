import request from '@/utils/request';
import { formdataify, DataToObject } from '@/utils/formdataify';
import { B2B_BASE_CODE, B2B_BASE_URL,HOME_HP } from '@/config/setting';
import { TOKEN_STORE_NAME } from '@/config/setting';
import { toDateString } from 'ele-admin';
import store from '@/store/index';
import { Decrypt } from '@/utils/aes-util.js';

export async function getSupplierList(data) {
    let formataData = {}
    formataData.Token = sessionStorage.getItem(TOKEN_STORE_NAME);
    formataData.page = data.page;
    formataData.size = data.limit;
    formataData.keyword = data.where.search ? data.where.search : '';
    formataData.state = '';
    formataData.field = '';
    formataData.order = '';
    formataData.enable = data.where.value ? data.where.value : '1';
    formataData.supZzState = data.where.supplierValue ? data.where.supplierValue : '0';
    formataData.varZzState = data.where.varietieValue ? data.where.varietieValue : '';
    let req = formdataify(formataData);
    const res = await request.post('/Supplier/GetListZzsh',req);
    const isEncrypt = store.state.user.isEncrypt;
    if(isEncrypt){
        const devData = JSON.parse(Decrypt(res.data.devData))
        if (devData.code == 200) {
            return devData;
        } else {
            return Promise.reject(new Error(devData.msg));
        }
    }else{

        if (res.data.code == 200) {
            return res.data;
        } else {
            return Promise.reject(new Error(res.data.msg));
        }

    }
}
