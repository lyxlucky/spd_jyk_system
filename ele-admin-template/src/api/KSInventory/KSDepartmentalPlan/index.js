import request from '@/utils/request';
import { formdataify } from '@/utils/formdataify';
import { TOKEN_STORE_NAME } from '@/config/setting';


export async function getDeptAuthVarNew(data) {
    data.Token = sessionStorage.getItem(TOKEN_STORE_NAME);
    if(data != null){
        var data2 = formdataify(data);
    }
    const res = await request.post('/VarietieBasicInfo/getDeptAuthVarNew', data2);
    // const res = await request.post('/VarietieBasicInfo/getVar', {
    //     username,
    //     password,
    //     Token
    // });

    if (res.data.code == 200) {
        return res.data;
    } else {
        return Promise.reject(new Error(res.data.msg));
    }
}

export async function SerachPlanList(data) {
    var data2 = {};
    data2.page = data.page;
    data2.size = data.limit;
    data2.DeptCode = data.where.DeptCode;
    data2.State = "-1";
    data2.SerachName = "";
    data2.Start = "";
    data2.End = "";
    data2.isTwoApp = "";
    data2.PlanNum = "";
    data2.Token = sessionStorage.getItem(TOKEN_STORE_NAME);
    
    const res = await request.get('/DeptApplyPlan/SerachPlanList', {
        params: data2
    });
    if (res.data.code == 200) {
        return res.data;
    } else {
        return Promise.reject(new Error(res.data.msg));
    }
}