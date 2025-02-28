import request from '@/utils/request';
import { formdataify } from '@/utils/formdataify';
import { TOKEN_STORE_NAME } from '@/config/setting'

import store from '@/store/index';

export async function getMANUFACTURINGList(data) {
    console.log("data", data);
    let formataData = {};
    formataData.Token = sessionStorage.getItem(TOKEN_STORE_NAME);
    formataData.MANUFACTURING_ENT_NAME = data.where.MANUFACTURING_ENT_NAME?data.where.MANUFACTURING_ENT_NAME:""; // 制造企业名称
    formataData.startTime = data.where.startTime?data.where.startTime:""; // 开始时间
    formataData.endTime = data.where.endTime?data.where.endTime:""; // 结束时间
    formataData.page = data.page; // 页码
    formataData.size = data.limit; // 每页大小
    console.log("forms", formataData);

    let req = formdataify(formataData);
    try {
        const res = await request.post('/ProdInfo/getMANUFACTURING_ENT', req);
        console.log("forms", formataData);
        console.log("res", res.data);
        return res.data; // 返回响应
    } catch (error) {
        console.error("请求数据时出错:", error);
        return Promise.reject(error); // 处理错误
    }
}


export async function delMANUFACTURING_ENT(data) {
    console.log("data", data);
    let formataData = {};
    formataData.Token = sessionStorage.getItem(TOKEN_STORE_NAME);
   
    formataData.ID = data.ID?data.ID:"";
    formataData.CREATE_MAN =data.CREATE_MAN ;

    let req = formdataify(formataData);
    try {
        const res = await request.post('/ProdInfo/delMANUFACTURING_ENT', req);      
        return res.data; // 返回响应
    } catch (error) {
        console.error("请求数据时出错:", error);
        return Promise.reject(error); // 处理错误
    }
}

export async function addMANUFACTURING_ENT(data) {
    console.log("data", data);
    let formataData = {};
    formataData.Token = sessionStorage.getItem(TOKEN_STORE_NAME);
    formataData.MANUFACTURING_ENT_NAME=data.MANUFACTURING_ENT_NAME; 
    formataData.MANUFACTURING_LICENSE=data.MANUFACTURING_LICENSE;
    formataData.MANUFACTURING_LICENSE_TIME= data.MANUFACTURING_LICENSE_TIME;
    formataData.MANUFACTURING_ADDRES=data.MANUFACTURING_ADDRES;
    formataData.CREATE_MAN= data.CREATE_MAN;
    let req = formdataify(formataData);
    try {
        const res = await request.post('/ProdInfo/insertMANUFACTURING_ENT', req);      
        return res.data; // 返回响应
    } catch (error) {
        console.error("请求数据时出错:", error);
        return Promise.reject(error); // 处理错误
    }
}
export async function updateMANUFACTURING_ENT(data) {
    console.log("data", data);
    let formataData = {};
    formataData.Token = sessionStorage.getItem(TOKEN_STORE_NAME);
    formataData.ID = data.ID?data.ID:"";
   
    formataData.MANUFACTURING_ENT_NAME=data.MANUFACTURING_ENT_NAME; 
    formataData.MANUFACTURING_LICENSE=data.MANUFACTURING_LICENSE;
    formataData.MANUFACTURING_LICENSE_TIME= data.MANUFACTURING_LICENSE_TIME;
    formataData.MANUFACTURING_ADDRES=data.MANUFACTURING_ADDRES;
    formataData.CREATE_MAN= data.CREATE_MAN;

    let req = formdataify(formataData);
    try {
        const res = await request.post('/ProdInfo/upMANUFACTURING_ENT', req);      
        return res.data; // 返回响应
    } catch (error) {
        console.error("请求数据时出错:", error);
        return Promise.reject(error); // 处理错误
    }
}