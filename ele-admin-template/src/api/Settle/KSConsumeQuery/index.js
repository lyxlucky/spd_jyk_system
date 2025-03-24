import request from '@/utils/request';
import { formdataify, DataToObject } from '@/utils/formdataify';
import { TOKEN_STORE_NAME, HOME_HP } from '@/config/setting';
import { Message } from 'element-ui';
// 封装通用的请求函数
async function sendRequest(url, data, method = 'post') {
    const token = sessionStorage.getItem(TOKEN_STORE_NAME);
    const requestData = { Token: token, ...data };
    const formData = formdataify(requestData);

    let res;
    if (method === 'post') {
        res = await request.post(url, formData);
    } else if (method === 'get') {

        res = await request.get(url, { params: requestData });

    }

    if (res.data.code == 200) {
        return res.data;
    } else {
        return Promise.reject(new Error(`请求 ${url} 失败: ${res.data.msg}`));
    }
}

// 获取
export async function GetPDAList(data) {
    const { page, limit, where = {}, order = '', field = '' } = data;
    const requestData = {
        page,
        size: limit,
        varietie: where.KSConsume_search1 || '',
        supplier: where.KSConsume_search2 || '',
        batch: where.KSConsume_search3 || '',
        sfyj: where.sfyj || '',
        deptTwoName: where.KSConsume_search4 || '',
        DEPT_NAME: where.KSConsumeBD_search_j4 || '',
        defNoPkg: where.KSConsume_search5 || '',
        manuEntName: where.KSConsume_search6 || '',
        validDateFrom: where.start_time || '',
        validDateTo: where.end_time || '',
        field: '',
        order: '',
        highOrLow: where.ksConsumeSearch7 || '',
        trade: where.KSConsume_search8 || '',
        classificName: where.KSConsume_search9 || '',
        consumeType: where.ksConsumeSearch10 || '',
        DETAIL_CREATE_TYPE: where.ksConsumeDetailCreateType || '',
        qxfqx: where.ksConsumeQxfqx || '',
        zcz: where.KSConsume_zcz || '',
        useMonth: "false",
        monthFmt: "",
        monthFmt2: "",
        dayClearingDate: where.KSConsumeBD_dayClearingDate || '',
        specType: "",
        isProtect: "",
        isPdaScan: "",
        isSendYg: "",
        goodsQty: where.ksConsumeGoodsQty || '',
        isHisPriceDeff: where.ksConsumeIsHisPriceDeff || '',
        IS_SPECIAL_AIRCRAFT: where.ksConsumeIsSpecialAircraft || '',
        CONTRACT_TYPE: where.ksConsumeContractType || '',
        SOURCE_FROM: where.KSConsume_SOURCE_FROM || '',
        Supply_Price: where.KSConsume_Supply_Price || '',
        IS_JC: where.ksConsumeIsJc || '',
        IS_CHARGE: where.ksConsumeIsJf || '',
        ygOrder: "",
        Patient_Number: "",
        highOrLowClassTwo: where.highOrLowClassTwo1 || '',
        SPD_COST_DEPT_NAME: where.KSConsumeBD_search_cost_dept || '',
        hp: HOME_HP,
        stzx_state: where.stzx_state || '-1',
        stzx_state_gz: where.stzx_gz_state || '-1',
        sendUdi: where.ksConsumeSearchUdi || '',
        stzx_gkjc_state: where.stzx_gkjc_state || '',
        CONFIRM_STAFF: where.stzx_gkjc_state || '',
        REGULATORY_CAT_NAME: where.KSConsume_REGULATORY_CAT_NAME || '',
        HAVE_YGCODE: where.ksConsumeHaveYgcode || ''
    };
    // 假设服务器端接口支持 GET 方法
    return sendRequest('/DeptConsume/Search', requestData, 'get');
}


// 获取详情数据
export async function GetPDAList2(data) {


    const { page, limit, where = {}, order = '', field = '' } = data;
    const requestData = {
        page,
        size: limit,
        sourceFrom: where.sourceFrom || '',
        batchId: where.batchId || '',
        varietieCode: where.varietieCode || '',
        batch: where.batch || '',
        coefficient: where.coefficient || '',
        currUpShelfState: where.currUpShelfState || '',
        condition: where.condition || '',
        field: '',
        order: '',
        storageId: where.storageId || ''

    };
    //window.alert(JSON.stringify(requestData, null, 2));
    // 假设服务器端接口支持 GET 方法
    return sendRequest('/CentralWarehouseDept/SearchDef', requestData, 'get');
}