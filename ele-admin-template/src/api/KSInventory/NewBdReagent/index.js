import request from '@/utils/request';
import { formdataify, DataToObject } from '@/utils/formdataify';
import { TOKEN_STORE_NAME, } from '@/config/setting';
import store from '@/store/index';
import moment from 'moment';

export async function queryPickAllDetail(data) {
    var Token = sessionStorage.getItem(TOKEN_STORE_NAME);
    var data2 = {}
    data2.Token = Token;
    data2.dept_no = store.state.user.info.DeptNow.Dept_Two_Name
    data2.drugs_code = data.where.drugsCode ? data.where.drugsCode : '0';
    const [start_date, end_date] = data.where.date ? data.where.date : [moment().startOf('month').format('YYYY-MM-DD'), moment().endOf('month').format('YYYY-MM-DD')];
    data2.start_date = start_date
    data2.end_date = end_date
    let data3 = formdataify(data2);
    const res = await request.post('/DepaStorageQuery/QueryPickAllDetail', data3);
    if (res.data.code == 200) {
      return res.data;
    }
    return Promise.reject(new Error(res.data.msg));
  }