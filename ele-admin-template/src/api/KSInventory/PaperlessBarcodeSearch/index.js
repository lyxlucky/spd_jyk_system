import request from '@/utils/request';
import { formdataify, DataToObject } from '@/utils/formdataify';
import { TOKEN_STORE_NAME } from '@/config/setting';
import store from '@/store';

/**
 * 获取无纸化条码信息
 * GET /PekingApplicaiton/getPaperlessInfo
 * params: { inpatientNo, admissionTimes, page, size }
 */
export async function getPaperlessInfo(params) {
  var data2 = {};
  data2.HospitalNumber = params?.inpatientNo || '';
  data2.AdnissTimes = params?.admissionTimes ?? '';
  data2.Token = sessionStorage.getItem(TOKEN_STORE_NAME);
  data2.USER_DEPT = store.state.user.info?.DeptNow?.Dept_Two_Code || '0';
  data2.page = params?.page || 1;
  data2.size = params?.size || 10;

  const res = await request.post(
    '/PekingApplication/getPaperlessInfo',
    data2
  );
  return res.data;
}

/**
 * 无纸化条码重新生成回执
 * POST /PekingApplication/CaseStatusReceipt
 * params: { uniqueIdentifier }
 */
export async function regenerateCaseStatusReceipt(params) {
  const res = await request.post('/PekingApplication/CaseStatusReceipt', {
    project: 'emr',
    uniqueIdentifier: params?.uniqueIdentifier || '',
    appId: '532041839864005',
    eventType: '2',
    svcOperateName: '病历采集通知',
    svcOperateTime: '2025-09-09T16:32:58.416387184',
    svcOperatePeople: '测试管理员',
    svcOperatePeopleDept: [],
    svcExtension: [],
    msgSendTime: '2025-09-09T16:32:58.416410236',
    msgSender: '测试管理员',
    msgReceiptAppIds: [],
    msgCopyForAppIds: []
  });
  return res.data;
}
