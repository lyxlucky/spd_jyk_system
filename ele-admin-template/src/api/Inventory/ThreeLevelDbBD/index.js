import request from '@/utils/request';
import { TOKEN_STORE_NAME } from '@/config/setting';

/**
 * 获取北大三级库存信息
 * @param {Object} data - 请求参数
 * @param {string} [data.page='1'] - 当前页码
 * @param {string} [data.limit='10'] - 每页显示条数
 * @param {Object} [data.where] - 查询条件
 * @param {string} [data.where.DeptName] - 科室名称
 * @param {string} [data.where.varCode] - 品种编码
 * @param {string} [data.where.varName] - 品种名称
 * @param {string} [data.where.chargingCode] - 计费编码
 * @param {string} [data.where.spec] - 规格型号
 * @param {string} [data.where.manufacter] - 生产企业
 * @param {string} [data.where.prodRegistrationCode] - 批准文号
 * @returns {Promise<Object>} 返回查询结果
 * @throws {Error} 当请求失败时抛出错误
 */
export async function getThirdStockInfo(data) {
    let requestData = {};
    requestData.Token = sessionStorage.getItem(TOKEN_STORE_NAME);
    requestData.page = parseInt(data.page) || 1;
    requestData.size = parseInt(data.limit) || 10;
    requestData.DeptName = data.where?.DeptName || '';
    requestData.varCode = data.where?.varCode || '';
    requestData.varName = data.where?.varName || '';
    requestData.chargingCode = data.where?.chargingCode || '';
    requestData.spec = data.where?.spec || '';
    requestData.manufacter = data.where?.manufacter || '';
    requestData.prodRegistrationCode = data.where?.prodRegistrationCode || '';

    const res = await request.post(`/PekingApplication/getThirdStockInfo`, requestData);

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
    let requestData = {};
    requestData.Token = sessionStorage.getItem(TOKEN_STORE_NAME);
    requestData.varCode = data.where?.varCode;
    requestData.chargingCode = data.where?.chargingCode;
    requestData.page = parseInt(data.page) || 1;
    requestData.size = parseInt(data.size) || 10;

    const res = await request.post(`/PekingApplication/getThirdStockInfoFlow`, requestData);

    if (res.data.code === 200) {
        return res.data;
    }
    return Promise.reject(res.data.msg);
}
