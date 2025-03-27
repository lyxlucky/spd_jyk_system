
import request from '@/utils/request';
import { formdataify, formdataifyGet } from '@/utils/formdataify';
import { TOKEN_STORE_NAME } from '@/config/setting'



export async function GetSpdMainsjHeaderIface(data) {
    let formataData = {}
    formataData.Token = sessionStorage.getItem(TOKEN_STORE_NAME);
    formataData.page = data.page ? data.page : '1';
    formataData.size = data.size ? data.size : '10';
    formataData.PROCESS_STATUS = data.where.PROCESS_STATUS ? data.where.PROCESS_STATUS : '';
    formataData.REQUESTNOTEID = data.where.REQUESTNOTEID ? data.where.REQUESTNOTEID : '';
    formataData.APPLYDEPT = data.where.APPLYDEPT ? data.where.APPLYDEPT : '';
    formataData.APPLYPEOPLE = data.where.APPLYPEOPLE ? data.where.APPLYPEOPLE : '';
    formataData.YB_SP_STATE = data.where.YB_SP_STATE ? data.where.YB_SP_STATE : '';
    formataData.WJ_SP_STATE = data.where.WJ_SP_STATE ? data.where.WJ_SP_STATE : '';

    console.log(formataData)
    let req = formdataify(formataData);
    const res = await request.post('/AJykDept/GetSpdMainsjHeaderIface', req)
    if (res.data.code == 200) {
        return res.data;
    } else {
        return Promise.reject(new Error(res.data.msg));
    }
}

export async function GetSpdMainsjLinesIface(data) {
    let formataData = {}
    formataData.Token = sessionStorage.getItem(TOKEN_STORE_NAME);
    formataData.page = data.page ? data.page : '1';
    formataData.size = data.size ? data.size : '10';
    formataData.HEADER_IFACE_ID = data.where.HEADER_IFACE_ID ? data.where.HEADER_IFACE_ID : '-1';
    formataData.REGISTRATION_NAME = data.where.REGISTRATION_NAME ? data.where.REGISTRATION_NAME : '';
    formataData.REGISTRATION_NO = data.where.REGISTRATION_NO ? data.where.REGISTRATION_NO : '';
    formataData.ITEM_NUMBER = data.where.ITEM_NUMBER ? data.where.ITEM_NUMBER : '';
    formataData.STAND_VALUE = data.where.STAND_VALUE ? data.where.STAND_VALUE : '';

    console.log(formataData)
    let req = formdataify(formataData);
    const res = await request.post('/AJykDept/GetSpdMainsjLinesIface', req)
    if (res.data.code == 200) {
        return res.data;
    } else {
        return Promise.reject(new Error(res.data.msg));
    }
}

export async function ImportSpdMainsjLinesIfaceExcel(data) {
    data.Token = sessionStorage.getItem(TOKEN_STORE_NAME);
    const res = await request.post('/AJykDept/ImportSpdMainsjLinesIfaceExcel', data);
    if (res.data.code == 200) {
        return res.data;
    } else {
        return Promise.reject(new Error(res.data.msg));
    }
}


export async function ApproveYBSpdMainsjLinesIface(data) {
    let formataData = {}
    formataData.Token = sessionStorage.getItem(TOKEN_STORE_NAME);
    formataData.YB_SP_MAN = data.YB_SP_MAN ? data.YB_SP_MAN : '';
    formataData.YB_SP_MARK = data.YB_SP_MARK ? data.YB_SP_MARK : '';
    formataData.HEADER_IFACE_ID = data.HEADER_IFACE_ID ? data.HEADER_IFACE_ID : '';

    let req = formdataify(formataData);
    const res = await request.post('/AJykDept/ApproveYBSpdMainsjLinesIface', req);
    console.log(res)
    if (res.data.code == 200) {
        return res.data;
    } else {
        return Promise.reject(new Error(res.data.msg));
    }
}

