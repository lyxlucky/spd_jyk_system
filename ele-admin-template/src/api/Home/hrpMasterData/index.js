import request from '@/utils/request';
import { formdataify, formdataifyGet } from '@/utils/formdataify';
import { TOKEN_STORE_NAME } from '@/config/setting'

export async function getOAMainsHeaderIface(data){
    let params = {}
    params.Token = sessionStorage.getItem(TOKEN_STORE_NAME);
    
    let resData = await request.get(`HRPMasterData/getOAMainsHeaderIface${formdataifyGet(params)}`)
    if (resData.data.code == 200) {
        return resData.data
    }
    return new Promise.reject(resData.data)
}

export async function getOAMainsLinesIface(data){
    let params = {}
    params.Token = sessionStorage.getItem(TOKEN_STORE_NAME);
    
    let resData = await request.get(`HRPMasterData/getOAMainsLinesIface${formdataifyGet(params)}`)
   
    if (resData.data.code == 200) {
        return resData.data
    }
    return new Promise.reject(resData.data)
}