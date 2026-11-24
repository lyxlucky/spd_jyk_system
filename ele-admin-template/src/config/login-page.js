import { HOME_HP } from '@/config/setting';

/**
 * 登录页静态配置（背景、版权等）。
 * 服务电话、地址以 CONFIG 表为准，在「系统参数表」维护：
 * LOGIN_SERVICE_PHONE / LOGIN_SERVICE_ADDRESS
 * 下面 phone、address 仅作接口未返回时的兜底。
 */
const LOGIN_PAGE_MAP = {
  // 北京大学深圳医院。底图放到 src/assets/bg-login-bd.jpg 后取消注释
  bd: {
    phone: '5032',
    address: '外科楼负一楼C区汽车出入口、门诊楼负一楼A区汽车出口'
    // background: require('@/assets/bg-login-bd.jpg')
  },
  // 深圳大学附属华南医院
  szhn: {
    background: require('@/assets/bg-login-szhn.jpg')
  }
};

const DEFAULT_LOGIN_PAGE = {
  phone: '',
  address: '',
  copyright: '上海医药',
  version: 'V 3.0'
};

function assetUrl(asset) {
  if (!asset) {
    return '';
  }
  const path = asset.default ? asset.default : asset;
  return String(path);
}

export function getLoginPageConfig() {
  const hospital = LOGIN_PAGE_MAP[HOME_HP] || {};
  return {
    ...DEFAULT_LOGIN_PAGE,
    ...hospital,
    background: assetUrl(hospital.background)
  };
}
