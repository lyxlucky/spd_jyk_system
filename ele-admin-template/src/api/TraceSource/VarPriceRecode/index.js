import request from '@/utils/request';
import { formdataify, DataToObject } from '@/utils/formdataify';
import { TOKEN_STORE_NAME, } from '@/config/setting';

export async function GetPDAList(data) {
  
    var data2 ={};
    data2.Token = sessionStorage.getItem(TOKEN_STORE_NAME);
    data2.page = data.page;
    data2.size = data.limit;
    data2.VARIETIE_SEARCH_VALUE=data.where.VARIETIE_SEARCH_VALUE?data.where.VARIETIE_SEARCH_VALUE:'',
    data2.STATE=data.where.STATE?data.where.STATE:'',
    data2.start_time= data.where.start_time?data.where.start_time:'',
    data2.end_time=data.where.end_time?data.where.end_time:'',
    data2.PriceIsEqual= data.where.PriceIsEqual?data.where.PriceIsEqual:'',
    data2.order = data.order ? data.order : '';
    data2.field = data.field ? data.field : '';

    DataToObject(data,data2)
  
    if(data != null){
        var data3 = formdataify(data);
    }
    const res = await request.post('/VarietieBasicInfo/getVarPriceRecode',data3);
    if (res.data.code == 200) {
        return res.data;
    } else {
        return Promise.reject(new Error(res.data.msg));
    }

}

// export async function VarPriceRecodeCommit(data) {
//     // 构建请求数据对象
//     const requestData = {
//         Token: sessionStorage.getItem(TOKEN_STORE_NAME),
//         json: JSON.stringify(data)
//     };
//     // 调用 DataToObject 函数（如果需要的话）
//     DataToObject(data, requestData);
//     // 使用 formdataify 处理请求数据
//     const formData = formdataify(requestData);
//     const response = await request.post(
//         '/VarietieBasicInfo/varPriceRecodeCommit',
//         formData,
//         {
//             timeout: 5000 // 设置超时时间为 5 秒
//         }
//     );
//     if (response.data.code == 200) {
//         return response.data;
//     } else {
//         return Promise.reject(new Error(response.data.msg));
//     }
// }

export async function VarPriceRecodeCommit(data) {

    

    var data2 = {};
    data2.json =  JSON.stringify(data);
    data2.Token = sessionStorage.getItem(TOKEN_STORE_NAME);

    var rep = formdataify(data2);

    const res = await request.post('/VarietieBasicInfo/varPriceRecodeCommit', rep);
    if (res.data.code == 200) {
        return res.data;
    } else {
        return Promise.reject(new Error(res.data.msg));
    }
} 
