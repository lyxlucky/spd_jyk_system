import request from '@/utils/request';
import { TOKEN_STORE_NAME } from '@/config/setting';
import { formdataify, DataToObject } from '@/utils/formdataify';
import { HOME_HP } from '@/config/setting';

export async function getFinacialTableData(data) {
  var data2 = {};
  const formatData = {
    page: data.page,
    size: data.limit,
    Token: sessionStorage.getItem(TOKEN_STORE_NAME),
    spStartDate: data.where.spStartDate ? data.where.spStartDate : '',
    spEndDate: data.where.spEndDate ? data.where.spEndDate : '',
    Supplier: data.where.Supplier ? data.where.Supplier : '',
    Monthbillnum: data.where.Monthbillnum ? data.where.Monthbillnum : '',
    StartDate: data.where.StartDate ? data.where.StartDate : '',
    EndDate: data.where.EndDate ? data.where.EndDate : '',
    State: data.where.State ? data.where.State : '-1',
    isHptx: data.where.isHptx ? data.where.isHptx : '',
    isYG: data.where.isYG ? data.where.isYG : '',
    isDL: data.where.isDL ? data.where.isDL : '',
    SaleNum: data.where.SaleNum ? data.where.SaleNum : '',
    VarietieCode: data.where.VarietieCode ? data.where.VarietieCode : '',
    hp: HOME_HP,
    field: "",
    order: "",
    isFPQS: data.where.isFPQS ? data.where.isFPQS : '',
    SEND_WXT_MARK: data.where.SEND_WXT_MARK ? data.where.SEND_WXT_MARK : '',
    isSendWxt: data.where.isSendWxt ? data.where.isSendWxt : ''
  };
  const res = await request.get('/HrpMonthly/FinanceAudit', {
    params: formatData
  });
  if (res.data.code == 200) {
    return res.data;
  } else {
    return Promise.reject(new Error(res.data.msg));
  }
}
