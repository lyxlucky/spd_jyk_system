import request from '@/utils/request';
import { formdataify } from '@/utils/formdataify';
import { TOKEN_STORE_NAME } from '@/config/setting';

function getToken() {
  return sessionStorage.getItem(TOKEN_STORE_NAME);
}

export async function getConfigPageList(params) {
  const res = await request.get('/ConfigManage/GetConfigPageList', {
    params: {
      Token: getToken(),
      managePassword: params.managePassword,
      page: params.page,
      size: params.size,
      keyword: params.keyword || ''
    }
  });
  return res.data;
}

export async function saveConfig(data, managePassword) {
  const form = formdataify({
    Token: getToken(),
    ManagePassword: managePassword,
    ID: data.ID || '',
    CONFIG_TYPE: data.CONFIG_TYPE || '',
    CONFIG_MARK: data.CONFIG_MARK || '',
    CONFIG_VALUE: data.CONFIG_VALUE || '',
    CONFIG_VALUE_MARK: data.CONFIG_VALUE_MARK || ''
  });
  const res = await request.post('/ConfigManage/SaveConfig', form);
  return res.data;
}

export async function deleteConfig(id, managePassword) {
  const form = formdataify({
    Token: getToken(),
    ManagePassword: managePassword,
    ID: id
  });
  const res = await request.post('/ConfigManage/DeleteConfig', form);
  return res.data;
}
