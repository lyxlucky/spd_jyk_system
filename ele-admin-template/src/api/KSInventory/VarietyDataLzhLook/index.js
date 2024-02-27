import request from '@/utils/request';
import { formdataify, DataToObject } from '@/utils/formdataify';

import { TOKEN_STORE_NAME } from '@/config/setting';


export async function addOneDeptAuthCommit(data) {
    var data2 = {};
    data2.json = JSON.stringify(data);
    data2.Token = sessionStorage.getItem(TOKEN_STORE_NAME);
    data2.type = data.type ? data.type : '';
    data2.dept_two_code = data.dept_two_code ? data.dept_two_code : '';

    var rep = formdataify(data2);

    const res = await request.post('/VarietieBasicInfo/addOneDeptAuthCommit', rep);
    if (res.data.code == 200) {
        return res.data;
    } else {
        return Promise.reject(new Error(res.data.msg));
    }
}
