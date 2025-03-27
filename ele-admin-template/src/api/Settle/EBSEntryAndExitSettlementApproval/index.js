import request from '@/utils/request';
import { TOKEN_STORE_NAME } from '@/config/setting';
import { formdataify } from '@/utils/formdataify';
import store from '@/store';


/**
 * 获取EBS出入库结算审批数据
 * @param {Object} data - 查询参数
 * @returns {Promise} - 返回请求Promise
 */
export async function getSpdGlSpdTransactionIface(data) {
    
    const formatData = {
        Token: sessionStorage.getItem(TOKEN_STORE_NAME),
        page: data.page || 1,
        size: data.limit || 10,
        IFACE_BATCH_ID: data.where?.IFACE_BATCH_ID || '',
        LEDGER_NAME: data.where?.LEDGER_NAME || '',
        TRANSACTION_DATE_START: data.where?.TRANSACTION_DATE[0] || '',
        TRANSACTION_DATE_END: data.where?.TRANSACTION_DATE[1] || '',
        SP_STATE: data.where?.SP_STATE || ''
      }
      
      const res = await request.get(
        '/EBSEntryAndExitSettlementApproval/getSpdGlSpdTransactionIface',
        {
            params: formatData
        }
      );
      if (res.data.code == 200) {
        return res.data;
      } else {
        return Promise.reject(res.data);
      }
}


/**
 * 获取EBS出入库结算批量审批数据
 * @param {Object} data - 查询参数
 * @returns {Promise} - 返回请求Promise
 */
export async function getSpdGlSpdTranBatchIface(data) {
    const formatData = {
        Token: sessionStorage.getItem(TOKEN_STORE_NAME),
        page: data.page || 1,
        size: data.limit || 10,
        SPD_PUSH_MAN: data.where?.SPD_PUSH_MAN || '',
        DESCRIPTION: data.where?.DESCRIPTION || '',
        SP_STATE: data.where?.SP_STATE || '',
        LEDGER_NAME: data.where?.LEDGER_NAME || '',
        // SPD_PUSH_DATE_START: data.where?.SPD_PUSH_DATE[0] || '',
        // SPD_PUSH_DATE_END: data.where?.SPD_PUSH_DATE[1] || ''
    }
    
    const res = await request.get(
        '/EBSEntryAndExitSettlementApproval/getSpdGlSpdTranBatchIface',
        {
            params: formatData
        }
    );
    
    if (res.data.code == 200) {
        return res.data;
    } else {
        return Promise.reject(res.data);
    }
}

//审核
export async function Approval(data) {
    let formatData = {
        Token: sessionStorage.getItem(TOKEN_STORE_NAME),
        IFACE_BATCH_IDS: data.IFACE_BATCH_IDS || [],
        Account: store.state.user?.info?.UserName || ''
    };
    // formatData = formdataify(formatData);
    const res = await request.post(
        '/EBSEntryAndExitSettlementApproval/Approval',
        formatData
    );
    if (res.data.code == 200) {
        return res.data;
    } else {
        return Promise.reject(res.data);
    }
}

