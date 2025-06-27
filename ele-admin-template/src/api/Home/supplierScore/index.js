import request from '@/utils/request';
import { formdataify, formdataifyGet } from '@/utils/formdataify';
import { TOKEN_STORE_NAME } from '@/config/setting'

import store from '@/store/index';

// 获取供应商列表 - 使用现有的 GetAllVendorInfo 接口
export async function apiSupplierScoreGetList(data, deptCode) {
    let formataData = {}
    formataData.Token = sessionStorage.getItem(TOKEN_STORE_NAME);
    formataData.pageIndex = data.page ? data.page : 1;
    formataData.pageSize = data.size ? data.size : 10;
    formataData.vendorName = data.where.keyword ? data.where.keyword : '';
    formataData.vendorType = data.where.vendorType ? data.where.vendorType : '';
    formataData.deptCode = deptCode;
    
    const res = await request.get('/VendorInfo/GetAllVendorInfo', {
        params: formataData
    });
    if (res.data.code == 200) {
        return {
            total: res.data.total,
            result: res.data.data
        };
    } else {
        return Promise.reject(new Error(res.data.msg));
    }
}

// 添加供应商 - 使用现有的 CreateVendorInfo 接口
export async function addSupplierScore(data) {
    const token = sessionStorage.getItem(TOKEN_STORE_NAME);
    
    // 直接发送JSON数据，因为后端使用[FromBody]接收
    const jsonData = {
        VENDOR_NAME: data.Supplier_Name,
        VENDOR_TYPE: data.VENDOR_TYPE,
        SUPPLY_ITEMS: data.SUPPLY_ITEMS,
        REGISTER_NO: data.Supplier_Code,
        ADDRESS: data.ADDRESS,
        CONTACT_INFO: data.CONTACT_INFO
    };
    
    try {
        const res = await request.post(`/VendorInfo/CreateVendorInfo?token=${token}`, jsonData);      
        return res.data;
    } catch (error) {
        console.error("请求数据时出错:", error);
        return Promise.reject(error);
    }
}

// 更新供应商 - 使用现有的 UpdateVendorInfo 接口
export async function updateSupplierScore(data) {
    const token = sessionStorage.getItem(TOKEN_STORE_NAME);
    
    // 直接发送JSON数据，因为后端使用[FromBody]接收
    const jsonData = {
        ID: data.ID,
        VENDOR_NAME: data.Supplier_Name,
        VENDOR_TYPE: data.VENDOR_TYPE,
        SUPPLY_ITEMS: data.SUPPLY_ITEMS,
        REGISTER_NO: data.Supplier_Code,
        ADDRESS: data.ADDRESS,
        CONTACT_INFO: data.CONTACT_INFO
    };

    try {
        const res = await request.post(`/VendorInfo/UpdateVendorInfo?token=${token}`, jsonData);      
        return res.data;
    } catch (error) {
        console.error("请求数据时出错:", error);
        return Promise.reject(error);
    }
}

// 删除供应商 - 使用现有的 DeleteVendorInfo 接口
export async function deleteSupplierScore(data) {
    const token = sessionStorage.getItem(TOKEN_STORE_NAME);
    
    try {
        const res = await request.get(`/VendorInfo/DeleteVendorInfo?token=${token}&id=${data.ID}`);      
        return res.data;
    } catch (error) {
        console.error("请求数据时出错:", error);
        return Promise.reject(error);
    }
}

// 获取供应商详情 - 使用现有的 GetVendorInfo 接口
export async function getSupplierScoreDetail(data) {
    let formataData = {};
    formataData.Token = sessionStorage.getItem(TOKEN_STORE_NAME);
    formataData.id = data.ID;

    const res = await request.get('/VendorInfo/GetVendorInfo', {
        params: formataData
    });
    if (res.data.code == 200) {
        return res.data;
    } else {
        return Promise.reject(new Error(res.data.msg));
    }
}

// 获取评分记录列表
export async function getSupplierScoreRecords({ vendorId, pageIndex = 1, pageSize = 10 }) {
    const token = sessionStorage.getItem(TOKEN_STORE_NAME);
    const res = await request.get('/VendorScoreRecord/GetVendorScoreRecords', {
        params: {
            token,
            vendorId,
            pageIndex,
            pageSize
        }
    });
    if (res.data.code === 200) {
        return {
            total: res.data.total,
            result: res.data.data,
            pageIndex: res.data.pageIndex,
            pageSize: res.data.pageSize,
            totalPages: res.data.totalPages,
            hasNext: res.data.hasNext,
            hasPrev: res.data.hasPrev
        };
    } else {
        return Promise.reject(new Error(res.data.msg));
    }
}

// 获取评分批次详情
export async function getVendorScoreBatchDetail(batchId) {
    const token = sessionStorage.getItem(TOKEN_STORE_NAME);
    const res = await request.get('/VendorScoreRecord/GetVendorScoreBatchDetail', {
        params: {
            token,
            batchId
        }
    });
    if (res.data.code === 200) {
        return res.data.data;
    } else {
        return Promise.reject(new Error(res.data.msg));
    }
}

// 删除评分批次
export async function deleteVendorScoreBatch(batchId) {
    const token = sessionStorage.getItem(TOKEN_STORE_NAME);
    const res = await request.delete(`/VendorScoreRecord/DeleteVendorScoreBatch?token=${token}&batchId=${batchId}`);
    if (res.data.code === 200) {
        return res.data;
    } else {
        return Promise.reject(new Error(res.data.msg));
    }
}

// 获取评分规则
export async function getVendorScoreRules(vendorType) {
    const token = sessionStorage.getItem(TOKEN_STORE_NAME);
    const res = await request.get('/VendorScoreRule/GetVendorRule', {
        params: {
            token,
            vendorType
        }
    });
    if (res.data.code === 200) {
        return res.data.data;
    } else {
        return Promise.reject(new Error(res.data.msg));
    }
}

// 创建评分记录
export async function createVendorScoreRecord(data) {
    const token = sessionStorage.getItem(TOKEN_STORE_NAME);
    const res = await request.post(`/VendorScoreRecord/CreateVendorScoreRecord?token=${token}`, data);
    if (res.data.code === 200) {
        return res.data;
    } else {
        return Promise.reject(new Error(res.data.msg));
    }
}

// 批量导入供应商
export async function batchImportSuppliers(data) {
    const token = sessionStorage.getItem(TOKEN_STORE_NAME);
    const res = await request.post(`/VendorInfo/ImportSuppliers?token=${token}`, data); 
    if (res.data.code === 200) {
        return res.data;
    } else {
        return Promise.reject(new Error(res.data.msg));
    }
}

// 同步供应商
export async function syncSuppliers(deptCode) {
    const token = sessionStorage.getItem(TOKEN_STORE_NAME);
    const res = await request.post(`/VendorInfo/SyncSuppliers?token=${token}&deptCode=${deptCode}`); 
    if (res.data.code === 200) {
        return res.data;
    } else {
        return Promise.reject(new Error(res.data.msg));
    }
}
