
import request from '@/utils/request';
import { formdataify, formdataifyGet } from '@/utils/formdataify';
import { TOKEN_STORE_NAME } from '@/config/setting'



export async function GetSpdMainsjHeaderIface(data) {
    console.log(data)
    let formataData = {}
    formataData.Token = sessionStorage.getItem(TOKEN_STORE_NAME);
    formataData.page = data.page ? data.page : '1';
    formataData.size = data.size ? data.size : '10';
    formataData.PROCESS_STATUS = data.where.PROCESS_STATUS ? data.where.PROCESS_STATUS : '';
    formataData.REQUESTNOTEID = data.where.REQUESTNOTEID ? data.where.REQUESTNOTEID : '';
    formataData.APPLYDEPT = data.where.APPLYDEPT ? data.where.APPLYDEPT : '';
    formataData.APPLYPEOPLE = data.where.APPLYPEOPLE ? data.where.APPLYPEOPLE : '';

    console.log(formataData)
    let req = formdataify(formataData);
    const res = await request.post('/AJykDept/GetSpdMainsjHeaderIface', req)
    if (res.data.code == 200) {
        return res.data;
    } else {
        return Promise.reject(new Error(res.data.msg));
    }
}

export async function GetSpdHisMainsjLinesIface(data) {
    console.log(data)
    let formataData = {}
    formataData.Token = sessionStorage.getItem(TOKEN_STORE_NAME);
    formataData.page = data.page ? data.page : '1';
    formataData.size = data.size ? data.size : '10';
    formataData.HEADER_IFACE_ID = data.where.HEADER_IFACE_ID ? data.where.HEADER_IFACE_ID : '-1';
    formataData.HIS_ITEM_NUMBER = data.where.HIS_ITEM_NUMBER ? data.where.HIS_ITEM_NUMBER : '';
    formataData.HIS_ITEM_DESCRIPTION = data.where.HIS_ITEM_DESCRIPTION ? data.where.HIS_ITEM_DESCRIPTION : '';
    formataData.HIS_STAND_VALUE = data.where.HIS_STAND_VALUE ? data.where.HIS_STAND_VALUE : '';

    console.log(formataData)
    let req = formdataify(formataData);
    const res = await request.post('/AJykDept/GetSpdHisMainsjLinesIface', req)
    if (res.data.code == 200) {
        return res.data;
    } else {
        return Promise.reject(new Error(res.data.msg));
    }
}


export async function ImportSpdHisMainsjLinesIfaceExcel(data) {
    data.Token = sessionStorage.getItem(TOKEN_STORE_NAME);
    const res = await request.post('/AJykDept/ImportSpdHisMainsjLinesIfaceExcel', data);
    if (res.data.code == 200) {
        return res.data;
    } else {
        return Promise.reject(new Error(res.data.msg));
    }
}
