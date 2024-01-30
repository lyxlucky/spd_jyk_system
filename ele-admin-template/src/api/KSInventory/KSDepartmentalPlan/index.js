import request from '@/utils/request';
import { formdataify, DataToObject } from '@/utils/formdataify';
import { TOKEN_STORE_NAME } from '@/config/setting';


export async function getDeptAuthVarNew(data) {
    console.log(data)
    var data2 = {}
    data2.Token = sessionStorage.getItem(TOKEN_STORE_NAME);
    data2.page = data.page;
    data2.size = data.limit;
    data2.Varietie_Code_New = data.where.Varietie_Code_New ? data.where.Varietie_Code_New : '';
    data2.Specification_Or_Type = data.where.Specification_Or_Type ? data.where.Specification_Or_Type : '';
    data2.Manufacturing_Ent_Name = data.where.Manufacturing_Ent_Name ? data.where.Manufacturing_Ent_Name : '';
    data2.CLASS_NUM = data.where.CLASS_NUM ? data.where.CLASS_NUM : '';
    data2.DEVICE_REMARK = data.where.DEVICE_REMARK ? data.where.DEVICE_REMARK : '';
    console.log(data2)
    if (data != null) {
        var data3 = formdataify(data);
    }
    var aaa = DataToObject(data2, data2);
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

/* 查询申领单 */
export async function SerachPlanList(data) {
    var data2 = {};
    data2.page = data.page;
    data2.size = data.limit;
    data2.DeptCode = data.where.DeptCode;
    data2.State = data.where.State ? data.where.State : '-1'
    data2.SerachName = data.where.SerachName ? data.where.SerachName : ''
    data2.Start = data.where.Start ? data.where.Start : ''
    data2.End = data.where.End ? data.where.End : ''
    data2.isTwoApp = data.where.isTwoApp ? data.where.DeptCode : ''
    data2.PlanNum = data.where.PlanNum ? data.where.PlanNum : ''
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

/* 创建申领单 */
export async function CreatList(data) {

    var data2 = DataToObject(data, data);
    var data3 = formdataify(data2)
    const res = await request.post('/DeptApplyPlan/CreatList', data3);
    return res.data;
    // if (res.code == 200) {
    //     return res.data;    
    // } else {
    //     return Promise.reject(new Error(res.msg));
    // }
}

/* 查询申领单品种 */
export async function SerachPlanListDeta(data) {
    var data2 = {};
    data2.page = data.page;
    data2.size = data.limit;
    data2.PlanNum = data.where.PlanNum ? data.where.PlanNum : '-1'
    data2.is_second_app = data.where.is_second_app ? data.where.is_second_app : ''
    data2.SerachName = data.where.SerachName ? data.where.SerachName : ''
    data2.dateFrom = data.where.dateFrom ? data.where.dateFrom : ''
    data2.dateTo = data.where.dateTo ? data.where.dateTo : ''
    data2.Token = sessionStorage.getItem(TOKEN_STORE_NAME);

    const res = await request.get('/DeptApplyPlan/SerachPlanListDeta', {
        params: data2
    });
    if (res.data.code == 200) {
        return res.data;
    } else {
        return Promise.reject(new Error(res.data.msg));
    }
}

/* 删除申领单 */
export async function DeletePlanList(data) {
    var data2 = {};
    data2.PlanNum = data.PlanNum ? data.PlanNum : '-1'
    data2.DeptCode = data.PlanDept ? data.PlanDept : ''
    data2.Operater = data.Operater ? data.Operater : ''
    data2.Token = sessionStorage.getItem(TOKEN_STORE_NAME);

    var aaa = formdataify(data2)
    const res = await request.post('/DeptApplyPlan/DeletePlanList', aaa);
    if (res.data.code == 200) {
        return res.data;
    } else {
        return Promise.reject(new Error(res.data.msg));
    }
}

/* 删除申领单品种 */
export async function DeletePlanDeta(data) {
    var data2 = {};
    data2.ID = data.ID ? data.ID : ''
    data2.Token = sessionStorage.getItem(TOKEN_STORE_NAME);

    var rep = formdataify(data2)
    const res = await request.post('/DeptApplyPlan/DeletePlanDeta', rep);
    if (res.data.code == 200) {
        return res.data;
    } else {
        return Promise.reject(new Error(res.data.msg));
    }
}

/* 保存并提交 */
export async function PutInListDeta(data) {
    var data2 = {};
    data2.PlanNum = data.PlanNum ? data.PlanNum : ''
    data2.Token = sessionStorage.getItem(TOKEN_STORE_NAME);

    var rep = formdataify(data2)
    const res = await request.post('/DeptApplyPlan/PutInListDeta', rep);
    if (res.data.code == 200) {
        return res.data;
    } else {
        return Promise.reject(new Error(res.data.msg));
    }
}

export async function isHaveZeroDel(data) {
    var data2 = {};
    data2.PlanNum = data.PlanNum ? data.PlanNum : ''
    data2.Token = sessionStorage.getItem(TOKEN_STORE_NAME);

    var rep = formdataify(data2)
    const res = await request.post('/DeptApplyPlan/isHaveZeroDel', rep);

    return res.data;
    // if (res.data.code == 200) {
    //     return res.data;
    // } else {
    //     return Promise.reject(new Error(res.data.msg));
    // }
}

export async function deleteZeroDel(data) {
    var data2 = {};
    data2.PlanNum = data.PlanNum ? data.PlanNum : ''
    data2.Token = sessionStorage.getItem(TOKEN_STORE_NAME);

    var rep = formdataify(data2)
    const res = await request.post('/DeptApplyPlan/deleteZeroDel', rep);

    return res.data;
    // if (res.data.code == 200) {
    //     return res.data;
    // } else {
    //     return Promise.reject(new Error(res.data.msg));
    // }
}


/* 审批申领单 */
export async function ToExamine(data) {
    var data2 = {};
    data2.PlanNum = data.PlanNum ? data.PlanNum : ''
    data2.Operator = data.Operator ? data.Operator : ''
    data2.Token = sessionStorage.getItem(TOKEN_STORE_NAME);

    var rep = formdataify(data2)
    const res = await request.post('/DeptApplyPlan/ToExamine', rep);
    if (res.data.code == 200) {
        return res.data;
    } else {
        return Promise.reject(new Error(res.data.msg));
    }
}


/* 审批申领单 */
export async function KeeptListDeta(data) {
    var data2 = {};
    data2.type = '0';
    data2.json =  JSON.stringify(data);
    data2.Token = sessionStorage.getItem(TOKEN_STORE_NAME);

    var rep = formdataify(data2);

    const res = await request.post('/DeptApplyPlan/KeeptListDeta', rep);
    if (res.data.code == 200) {
        return res.data;
    } else {
        return Promise.reject(new Error(res.data.msg));
    }
}  


/* 更新备注 */
export async function UpdateApplyPlanBZ(data) {
    var data2 = {};
    data2.ID = data.ID;
    data2.REMARK = data.REMARK ? data.REMARK : ''
    data2.Token = sessionStorage.getItem(TOKEN_STORE_NAME);

    var rep = formdataify(data2);

    const res = await request.post('/DeptApplyPlan/UpdateApplyPlanBZ', rep);
    if (res.data.code == 200) {
        return res.data;
    } else {
        return Promise.reject(new Error(res.data.msg));
    }
}  