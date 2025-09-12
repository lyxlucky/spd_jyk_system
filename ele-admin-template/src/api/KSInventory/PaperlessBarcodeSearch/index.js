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
  data2.page = params?.page || 1;
  data2.size = params?.size || 10;

  const res = await request.post(
    '/PekingApplication/getPaperlessInfo',
    data2
  );
  return res.data;
}
