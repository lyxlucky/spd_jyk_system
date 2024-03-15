import request from '@/utils/request';
import { formdataify, DataToObject } from '@/utils/formdataify';
import { TOKEN_STORE_NAME, } from '@/config/setting';
import store from '@/store';

export async function GetJykMainShelf(data) {
    console.log(data)
    var data2 = {};
    data2.page = data.page;
    data2.size = data.limit;
    data2.Token = sessionStorage.getItem(TOKEN_STORE_NAME);
    data2.Name = data.where.Name ? data.where.Name : '';
    data2.SPEC = data.where.SPEC ? data.where.SPEC : '';
    data2.MANUFACTURING_ENT_NAME = data.where.MANUFACTURING_ENT_NAME ? data.where.MANUFACTURING_ENT_NAME : '';
    data2.DEPTNAME = data.where.DEPTNAME ? data.where.DEPTNAME : '';
    data2.DEF_NO_PKG_CODE = data.where.DEF_NO_PKG_CODE ? data.where.DEF_NO_PKG_CODE : '';
    data2.TYPE = data.where.TYPE ? data.where.TYPE : '';
    data2.COUNT = data.where.COUNT ? data.where.COUNT : '';
    data2.DELIVERY_NUMBER = data.where.DELIVERY_NUMBER ? data.where.DELIVERY_NUMBER : '';
    // data2.DeptCode = data.where.DeptCode ? data.where.DeptCode : '';
    data2.dept_two_code = store.state.user.info.DeptNow.Dept_Two_Code ? store.state.user.info.DeptNow.Dept_Two_Code :""
    data2.xqDay = data.where.xqDay ? data.where.xqDay : 0;
    data2.order = data.order ? data.order : '';
    const res = await request.get('/AJykDept/GetJykMainShelf', {
        params: data2,
    });
    if (res.data.code == 200) {
        return res.data;
    } else {
        return Promise.reject(new Error(res.data.msg));
    }
}


export async function GetJykMainShelfHz(data) {
    var data2 = {};
    data2.page = data.page;
    data2.size = data.limit;
    data2.Token = sessionStorage.getItem(TOKEN_STORE_NAME);
    data2.Name = data.where.Name ? data.where.Name : '';
    data2.SPEC = data.where.SPEC ? data.where.SPEC : '';
    data2.MANUFACTURING_ENT_NAME = data.where.MANUFACTURING_ENT_NAME ? data.where.MANUFACTURING_ENT_NAME : '';
    data2.DEPTNAME = data.where.DEPTNAME ? data.where.DEPTNAME : '';
    data2.DEF_NO_PKG_CODE = data.where.DEF_NO_PKG_CODE ? data.where.DEF_NO_PKG_CODE : '';
    data2.TYPE = data.where.TYPE ? data.where.TYPE : '';
    data2.COUNT = data.where.COUNT ? data.where.COUNT : '';
    data2.DELIVERY_NUMBER = data.where.DELIVERY_NUMBER ? data.where.DELIVERY_NUMBER : '';
    data2.DeptCode = data.where.DeptCode ? data.where.DeptCode : '';


    const res = await request.get('/AJykDept/GetJykMainShelfHz', {
        params: data2,
    });
    if (res.data.code == 200) {
        return res.data;
    } else {
        return Promise.reject(new Error(res.data.msg));
    }
}


export async function GetJykDetailShelf(data) {
    var data2 = {};
    data2.page = data.page;
    data2.size = data.limit;
    data2.Token = sessionStorage.getItem(TOKEN_STORE_NAME);
    data2.Name = data.where.Name ? data.where.Name : '';
    data2.TYPE = data.where.TYPE ? data.where.TYPE : '';
    data2.DELIVERY_NUMBER = data.where.DELIVERY_NUMBER ? data.where.DELIVERY_NUMBER : '';
    data2.DEF_NO_PKG_CODE = data.where.DEF_NO_PKG_CODE ? data.where.DEF_NO_PKG_CODE : '';
    // data2.DeptCode = store.state.user.info.DeptNow.Dept_Two_Code
    // ? store.state.user.info.DeptNow.Dept_Two_Code : ""
    data2.DeptCode = data.where.DeptCode ? data.where.DeptCode : '';

    const res = await request.get('/AJykDept/GetJykDetailShelf', {
        params: data2,
    });
    if (res.data.code == 200) {
        return res.data;
    } else {
        return Promise.reject(new Error(res.data.msg));
    }
}

export async function saveJykOutInfo(data) {
    var data2 = {};
    data2.Token = sessionStorage.getItem(TOKEN_STORE_NAME);
    data2.VARIETIE_CODE = data.VARIETIE_CODE ? data.VARIETIE_CODE : '';
    data2.BATCH = data.BATCH ? data.BATCH : '';
    data2.DEPT_TWO_CODE = data.DEPT_TWO_CODE ? data.DEPT_TWO_CODE : '';
    data2.BATCH_VALIDITY_PERIOD = data.BATCH_VALIDITY_PERIOD ? data.BATCH_VALIDITY_PERIOD : '2099-01-01';
    data2.COUNT = data.COUNT ? data.COUNT : 0;
    data2.qty = data.qty ? data.qty : 0;
    data2.mark = data.mark ? data.mark : '';

    DataToObject(data, data2)
    if (data != null) {
        var data3 = formdataify(data);
    }
    const res = await request.post('/TwoDeptApply/saveJykOutInfo', data3);
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

export async function DeptReceivingScanOrder(data) {
    var data2 = {};
    data2.Token = sessionStorage.getItem(TOKEN_STORE_NAME);
    data2.DistributeNumber = data.DistributeNumber ? data.DistributeNumber : '';

    var data3 = formdataify(data2)
    // DataToObject(data,data2)
    // if(data != null){
    //     var data3 = formdataify(data);
    // }
    const res = await request.post('/DeptHisDefZxyy/DeptReceivingScanOrder', data3);
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


export async function GenerateStockData(data) {
    var data2 = {};
    data2.page = data.page;
    data2.size = data.limit;
    data2.Token = sessionStorage.getItem(TOKEN_STORE_NAME);
    data2.Name = data.where.Name ? data.where.Name : '';
    data2.SPEC = data.where.SPEC ? data.where.SPEC : '';
    data2.MANUFACTURING_ENT_NAME = data.where.MANUFACTURING_ENT_NAME ? data.where.MANUFACTURING_ENT_NAME : '';
    data2.DEPTNAME = data.where.DEPTNAME ? data.where.DEPTNAME : '';
    data2.DEF_NO_PKG_CODE = data.where.DEF_NO_PKG_CODE ? data.where.DEF_NO_PKG_CODE : '';
    data2.TYPE = data.where.TYPE ? data.where.TYPE : '';
    data2.COUNT = data.where.COUNT ? data.where.COUNT : '';
    data2.DELIVERY_NUMBER = data.where.DELIVERY_NUMBER ? data.where.DELIVERY_NUMBER : '';
    data2.DeptCode = data.where.DeptCode ? data.where.DeptCode : '';
    data2.xqDay = data.where.xqDay ? data.where.xqDay : 0;
    data2.order = data.order ? data.order : '';
    data2.Nickname = data.Nickname ? data.Nickname : '';

    var data3 = formdataify(data2)

    const res = await request.post('/AJykDept/GenerateStockData', data3);
    if (res.data.code == 200) {
        return res.data;
    } else {
        return Promise.reject(new Error(res.data.msg));
    }
}


