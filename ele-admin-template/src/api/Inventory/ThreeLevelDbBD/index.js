import request from '@/utils/request';
import { TOKEN_STORE_NAME, HOME_HP } from '@/config/setting';

// 该 api 被 ThreeLevelDbBD / ThirdStockQuery / ThirdStockPanorama 共用，按院区切换入口。
// 肿瘤：页面层会引导到 WarehouseAreaThreeInventory；StzlThreeStock 的 query/flow/summary
// 与 initImport 已整体停用（initImport 只返回引导提示），初始化导入统一走
// WarehouseAreaThreeInventory/ImportInitialInventory（库区页面「初始化导入」）。
const IS_STZL = HOME_HP === 'stzl';
export const THIRD_STOCK_UPLOAD_URL = IS_STZL
    ? '/StzlThreeStock/initImport'
    : '/lhfy/uploadThirdInventory';
const THIRD_STOCK_API = {
    query: IS_STZL ? '/StzlThreeStock/query' : '/PekingApplication/getThirdStockInfo',
    flow: IS_STZL ? '/StzlThreeStock/flow' : '/PekingApplication/getThirdStockInfoFlow',
    summary: IS_STZL ? '/StzlThreeStock/summary' : '/PekingApplication/getThreeKcInfo'
};

/**
 * 获取北大三级库存信息
 * @param {Object} data - 请求参数
 * @param {string} [data.page='1'] - 当前页码
 * @param {string} [data.limit='10'] - 每页显示条数
 * @param {'department'|'material'} [data.queryMode] - 全景页服务端排序维度
 * @param {Object} [data.where] - 查询条件
 * @param {string} [data.where.DeptName] - 科室名称
 * @param {string} [data.where.varCode] - 品种编码
 * @param {string} [data.where.varName] - 品种名称
 * @param {string} [data.where.chargingCode] - 计费编码
 * @param {string} [data.where.spec] - 规格型号
 * @param {string} [data.where.manufacter] - 生产企业
 * @param {string} [data.where.prodRegistrationCode] - 批准文号
 * @param {string} [data.where.enable] - 品种启用状态：空=全部（含停用），1=启用，0=停用
 * @param {boolean} [data.where.excludeNegativeStock] - 是否排除负库存
 * @returns {Promise<Object>} 返回查询结果
 * @throws {Error} 当请求失败时抛出错误
 */
export function buildThirdStockInfoRequest(data = {}, token = '') {
    const where = data.where || {};
    return {
        Token: token,
        page: parseInt(data.page) || 1,
        size: parseInt(data.limit) || 10,
        queryMode: data.queryMode || '',
        DeptCode: where.DeptCode || '',
        DeptName: where.DeptName || '',
        varCode: where.varCode || '',
        varName: where.varName || '',
        chargingCode: where.chargingCode || '',
        spec: where.spec || '',
        manufacter: where.manufacter || '',
        prodRegistrationCode: where.prodRegistrationCode || '',
        enable: where.enable || '',
        excludeNegativeStock: where.excludeNegativeStock === true,
        stockZero: where.stockZero || '',
        statStartTime: where.statStartTime || '',
        operationChargingStartTime: where.operationChargingStartTime || '',
        operationChargingEndTime: where.operationChargingEndTime || '',
        mergeByGroup: where.mergeByGroup === true
    };
}

export async function getThirdStockInfo(data) {
    const requestData = buildThirdStockInfoRequest(
        data,
        sessionStorage.getItem(TOKEN_STORE_NAME)
    );

    const res = await request.post(THIRD_STOCK_API.query, requestData);

    if (res.data.code === 200) {
        return res.data;
    }
    return Promise.reject(res.data.msg);
}

/**
 * 获取三级库全景查询的主维度列表。
 * @param {Object} data - 查询参数
 * @param {'department'|'material'} data.dimension - 主维度
 * @param {Object} [data.where] - 筛选条件
 * @returns {Promise<Object>} 返回科室或品种列表
 */
export async function getThirdStockDimensionOptions(data) {
    let requestData = {};
    requestData.Token = sessionStorage.getItem(TOKEN_STORE_NAME);
    requestData.page = parseInt(data.page) || 1;
    requestData.size = parseInt(data.limit) || 20;
    requestData.dimension = data.dimension || 'department';
    requestData.DeptName = data.where?.DeptName || '';
    requestData.varCode = data.where?.varCode || '';
    requestData.varName = data.where?.varName || '';
    requestData.chargingCode = data.where?.chargingCode || '';
    requestData.spec = data.where?.spec || '';
    requestData.manufacter = data.where?.manufacter || '';
    requestData.prodRegistrationCode = data.where?.prodRegistrationCode || '';
    requestData.enable = data.where?.enable || '';
    requestData.excludeNegativeStock = data.where?.excludeNegativeStock === true;
    requestData.statStartTime = data.where?.statStartTime || '';
    requestData.operationChargingStartTime = data.where?.operationChargingStartTime || '';
    requestData.operationChargingEndTime = data.where?.operationChargingEndTime || '';

    const res = await request.post(`/PekingApplication/getThirdStockDimensionOptions`, requestData);

    if (res.data.code === 200) {
        return res.data;
    }
    return Promise.reject(res.data.msg);
}

/**
 * 获取三级库存流向记录信息
 * @param {Object} data - 请求参数
 * @param {string} data.varCode - 品种编码
 * @param {string} data.chargingCode - 计费编码
 * @param {string} [data.page='1'] - 当前页码
 * @param {string} [data.size='10'] - 每页显示条数
 * @returns {Promise<Object>} 返回查询结果
 * @throws {Error} 当请求失败时抛出错误
 */
export async function getThirdStockInfoFlow(data) {
    console.log(data);
    let requestData = {};
    requestData.Token = sessionStorage.getItem(TOKEN_STORE_NAME);
    requestData.varCode = data.where?.varCode;
    requestData.DeptCode = data.where?.DeptCode;
    requestData.chargingCode = data.where?.chargingCode;
    requestData.MergeGroupId = data.where?.MergeGroupId || '';
    requestData.startTime = data.where?.startTime;
    requestData.endTime = data.where?.endTime;
    requestData.flowDirection = data.where?.flowDirection;
    requestData.origingCode = data.where?.origingCode;
    requestData.barcodeNumber = data.where?.barcodeNumber;
    requestData.consumer = data.where?.consumer;
    requestData.patientNumber = data.where?.patientNumber;
    requestData.hospitalizationNumber = data.where?.hospitalizationNumber;
    requestData.page = parseInt(data.page) || 1;
    requestData.size = parseInt(data.limit) || 10;

    const res = await request.post(THIRD_STOCK_API.flow, requestData);

    if (res.data.code === 200) {
        return res.data;
    }
    return Promise.reject(res.data.msg);
}

/**
 * 三级库汇总分组列表
 */
export async function getThirdStockMergeDepts() {
    const res = await request.post(`/PekingApplication/getThirdStockMergeDepts`, {
        Token: sessionStorage.getItem(TOKEN_STORE_NAME)
    });
    if (res.data.code === 200) {
        return res.data;
    }
    return Promise.reject(res.data.msg);
}

export async function createThirdStockMergeGroup(deptCodes) {
    const res = await request.post(`/PekingApplication/createThirdStockMergeGroup`, {
        Token: sessionStorage.getItem(TOKEN_STORE_NAME),
        DeptCodes: deptCodes
    });
    if (res.data.code === 200) {
        return res.data;
    }
    return Promise.reject(res.data.msg);
}

export async function joinThirdStockMergeGroup(deptCodes, mergeGroupId) {
    const res = await request.post(`/PekingApplication/joinThirdStockMergeGroup`, {
        Token: sessionStorage.getItem(TOKEN_STORE_NAME),
        DeptCodes: deptCodes,
        MergeGroupId: mergeGroupId
    });
    if (res.data.code === 200) {
        return res.data;
    }
    return Promise.reject(res.data.msg);
}

export async function removeThirdStockMergeDept(deptCodes) {
    const res = await request.post(`/PekingApplication/removeThirdStockMergeDept`, {
        Token: sessionStorage.getItem(TOKEN_STORE_NAME),
        DeptCodes: deptCodes
    });
    if (res.data.code === 200) {
        return res.data;
    }
    return Promise.reject(res.data.msg);
}

export async function dissolveThirdStockMergeGroup(mergeGroupId) {
    const res = await request.post(`/PekingApplication/dissolveThirdStockMergeGroup`, {
        Token: sessionStorage.getItem(TOKEN_STORE_NAME),
        MergeGroupId: mergeGroupId
    });
    if (res.data.code === 200) {
        return res.data;
    }
    return Promise.reject(res.data.msg);
}

/**
 * 获取三级库存信息（用于新增的dialog）
 * @param {Object} data - 请求参数
 * @param {string} [data.page='1'] - 当前页码
 * @param {string} [data.limit='10'] - 每页显示条数
 * @param {string} [data.VARIETIE_CODE_NEW] - 品种编码新
 * @param {string} [data.VARIETIE_NAME] - 品种名称
 * @param {string} [data.SPECIFICATION_OR_TYPE] - 规格型号
 * @param {string} [data.UNIT] - 单位
 * @param {string} [data.PRICE] - 价格
 * @param {string} [data.MANUFACTURING_ENT_NAME] - 生产企业名称
 * @param {string} [data.DEPT_TWO_NAME] - 科室名称
 * @param {boolean} [data.groupByDept] - 是否按科室+品种汇总
 * @returns {Promise<Object>} 返回查询结果
 * @throws {Error} 当请求失败时抛出错误
 */
export async function getThreeKcInfo(data) {
    let requestData = {};
    requestData.Token = sessionStorage.getItem(TOKEN_STORE_NAME);
    requestData.page = parseInt(data.page) || 1;
    requestData.size = parseInt(data.limit) || 10;
    requestData.VARIETIE_CODE_NEW = data.VARIETIE_CODE_NEW || '';
    requestData.VARIETIE_NAME = data.VARIETIE_NAME || '';
    requestData.SPECIFICATION_OR_TYPE = data.SPECIFICATION_OR_TYPE || '';
    requestData.UNIT = data.UNIT || '';
    requestData.PRICE = data.PRICE || '';
    requestData.MANUFACTURING_ENT_NAME = data.MANUFACTURING_ENT_NAME || '';
    requestData.DEPT_TWO_NAME = data.DEPT_TWO_NAME || '';
    requestData.groupByDept = data.groupByDept === true || data.groupByDept === '1' || data.groupByDept === 1;
    if (data.startTime) {
        requestData.startTime = data.startTime;
    }
    if (data.endTime) {
        requestData.endTime = data.endTime;
    }

    const res = await request.get(THIRD_STOCK_API.summary, {
        params: requestData,
    });

    if (res.data.code === 200) {
        return res.data;
    }
    return Promise.reject(res.data.msg);
}
