import request from '@/utils/request';
import { formdataify, DataToObject } from '@/utils/formdataify';
import { TOKEN_STORE_NAME } from '@/config/setting';
import store from '@/store/index.js';

/**
 * 获取三级库存查询数据
 * @param {Object} data - 请求参数
 * @param {string} [data.page='1'] - 当前页码
 * @param {string} [data.limit='10'] - 每页显示条数
 * @param {Object} [data.where] - 查询条件
 * @param {string} [data.where.MONTHLY_TIME] - 月份时间
 * @param {string} [data.where.DEPT_ONE_NAME] - 一级部门名称
 * @param {string} [data.where.HERP_ID] - HERP编号
 * @param {string} [data.where.SPD_CHARGING_CODE] - spd收费代码
 * @param {number} [data.where.HISQTY=0] - HIS数量
 * @param {string} [data.where.OPEARTION_CHARGING_TIME] - 手术收费时间
 * @param {string} [data.where.APPLY_DEPT] - 申请科室
 * @param {string} [data.where.CHARGING_CODE] - HIS收费代码
 * @param {string} [data.where.CHARGE_NAME] - 收费名称
 * @param {number} [data.where.USED_QTY=0] - 使用数量
 * @param {number} [data.where.PRICE=0] - 价格
 * @returns {Promise<Object>} 返回查询结果
 * @throws {Error} 当请求失败时抛出错误
 */
export async function getCenterThreeLevelDbQuery(data) {
    let params = {};
    params.Token = sessionStorage.getItem(TOKEN_STORE_NAME);
    params.page = data.page || '1';
    params.size = data.limit || '10';
    params.MONTHLY_TIME = data.where?.MONTHLY_TIME || '';
    params.DEPT_ONE_NAME = data.where?.DEPT_ONE_NAME || '';
    params.HERP_ID = data.where?.HERP_ID || '';
    params.SPD_CHARGING_CODE = data.where?.SPD_CHARGING_CODE || '';
    params.HISQTY = data.where?.HISQTY || '';
    params.OPEARTION_CHARGING_TIME = data.where?.OPEARTION_CHARGING_TIME || '';
    params.APPLY_DEPT = data.where?.APPLY_DEPT || '';
    params.CHARGING_CODE = data.where?.CHARGING_CODE || '';
    params.CHARGE_NAME = data.where?.CHARGE_NAME || '';
    params.USED_QTY = data.where?.USED_QTY || '';
    params.PRICE = data.where?.PRICE || '';
    
    const res = await request.get(`/CenterThreeLevelDbQuery/getCenterThreeLevelDbQuery`,{params:params});
    
    if (res.data.code === 200) {
        return res.data;
    }
    return Promise.reject(res.data.msg);
}

