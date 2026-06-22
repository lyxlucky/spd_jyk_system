import request from '@/utils/request';
import { formdataify } from '@/utils/formdataify';
import { TOKEN_STORE_NAME } from '@/config/setting';
import store from '@/store/index';
import moment from 'moment';

function formatQueryDateRange(where = {}) {
  if (where.date && where.date.length === 2 && where.date[0] && where.date[1]) {
    return {
      start_date: moment(where.date[0]).startOf('day').format('YYYY-MM-DD HH:mm:ss'),
      end_date: moment(where.date[1]).endOf('day').format('YYYY-MM-DD HH:mm:ss')
    };
  }
  return {
    start_date: moment().startOf('month').format('YYYY-MM-DD HH:mm:ss'),
    end_date: moment().endOf('month').format('YYYY-MM-DD HH:mm:ss')
  };
}

export async function queryPickAllDetail(data) {
  const Token = sessionStorage.getItem(TOKEN_STORE_NAME);
  const where = data.where || {};
  const { start_date, end_date } = formatQueryDateRange(where);
  const data2 = {
    Token,
    page: data.page || 1,
    size: data.limit || 10,
    dept_no: store.state.user.info?.DeptNow?.Dept_Two_Name || '0',
    drugs_code: where.drugsCode ? where.drugsCode : '0',
    start_date,
    end_date
  };
  const data3 = formdataify(data2);
  const res = await request.post('/DepaStorageQuery/QueryPickAllDetail', data3);
  // const res = await fetch('http://47.106.243.154:9001/api/DepaStorageQuery/QueryPickAllDetail',{
  //   method: 'POST',
  //   body: data3
  // }).then(response => response.json());
  if (res.data.code == 1) {
    return res.data.data;
  }
  return Promise.reject(new Error(res.data.msg));
  // if (res.code == 1) {
  //   return res.data;
  // }
  // return Promise.reject(new Error(res.msg));
}
