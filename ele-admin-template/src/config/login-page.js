import { HOME_HP } from '@/config/setting';
import hospitalLoginBg from 'hospital-login-bg';

/**
 * 登录页静态配置（背景、版权等）。
 * 服务电话、地址以 CONFIG 表为准，在「系统参数表」维护：
 * LOGIN_SERVICE_PHONE / LOGIN_SERVICE_ADDRESS
 * 下面 phone、address 仅作接口未返回时的兜底。
 * 背景图按医院打包（hospital-login-bg alias）。
 */
const LOGIN_PAGE_MAP = {
  bd: {
    phone: '5032',
    address: '外科楼负一楼C区汽车出入口、门诊楼负一楼A区汽车出口'
  },
  szhn: {}
};

const DEFAULT_LOGIN_PAGE = {
  phone: '',
  address: '',
  copyright: '上海医药',
  version: 'V 3.0'
};

function assetUrl(asset) {
  if (asset == null || asset === '') {
    return '';
  }
  const path = asset.default != null ? asset.default : asset;
  if (path == null || path === '') {
    return '';
  }
  return String(path);
}

export function getLoginPageConfig() {
  const hospital = LOGIN_PAGE_MAP[HOME_HP] || {};
  return {
    ...DEFAULT_LOGIN_PAGE,
    ...hospital,
    background: assetUrl(hospitalLoginBg)
  };
}
