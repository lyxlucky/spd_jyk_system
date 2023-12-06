import request from '@/utils/request';
import { formdataify, DataToObject } from '@/utils/formdataify';
import { TOKEN_STORE_NAME, } from '@/config/setting';

export async function SerachDef2Consume4PDA(data) {
    var data2 = {};
    data2.page = data.page;
    data2.size = data.limit;
    data2.Token = sessionStorage.getItem(TOKEN_STORE_NAME);
    data2.deptTwoName = data.where.deptTwoName ? data.where.deptTwoName : '';
    data2.varietie = data.where.varietie ? data.where.varietie : '';
    data2.specType = data.where.specType ? data.where.specType : '';
    data2.defNoPkgCode = data.where.defNoPkgCode ? data.where.defNoPkgCode : '';
    data2.contractCode = data.where.contractCode ? data.where.contractCode : '';
    data2.supplierName = data.where.supplierName ? data.where.supplierName : '';

    DataToObject(data,data2)
    if(data != null){
        var data3 = formdataify(data);
    }
    const res = await request.post('/DeptConsume/SerachDef2Consume4PDA', data3);
    if (res.data.code == 200) {
        return res.data;
    } else {
        return Promise.reject(new Error(res.data.msg));
    }
}