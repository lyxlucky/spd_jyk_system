import { HOME_HP } from '@/config/setting';

/**
 * 登录页底栏。按医院标识给默认值，页面上编辑后保存在本机浏览器，会盖过这里的默认值。
 * 需要所有电脑一致时，改对应医院这一条后重新发布。
 */
const LOGIN_PAGE_MAP = {
  // 北京大学深圳医院。底图把医院实景放到 src/assets/bg-login-bd.jpg 后，取消下一行注释
  bd: {
    phone: '5032',
    address: '外科楼负一楼C区汽车出入口、门诊楼负一楼A区汽车出口'
    // background: require('@/assets/bg-login-bd.jpg')
  }
};

const DEFAULT_LOGIN_PAGE = {
  phone: '',
  address: '',
  copyright: '上海医药',
  version: 'V 3.0'
};

const CONTACT_STORE_KEY = 'spd_login_contact';

export function getLoginPageConfig() {
  return {
    ...DEFAULT_LOGIN_PAGE,
    ...(LOGIN_PAGE_MAP[HOME_HP] || {})
  };
}

export function loadLoginContact() {
  const base = getLoginPageConfig();
  try {
    const raw = localStorage.getItem(CONTACT_STORE_KEY);
    if (!raw) {
      return base;
    }
    const saved = JSON.parse(raw);
    if (!saved || typeof saved !== 'object') {
      return base;
    }
    return {
      ...base,
      phone: saved.phone != null ? String(saved.phone) : base.phone,
      address: saved.address != null ? String(saved.address) : base.address
    };
  } catch (e) {
    return base;
  }
}

export function saveLoginContact(contact) {
  localStorage.setItem(
    CONTACT_STORE_KEY,
    JSON.stringify({
      phone: contact.phone || '',
      address: contact.address || ''
    })
  );
}

export function resetLoginContact() {
  localStorage.removeItem(CONTACT_STORE_KEY);
  return getLoginPageConfig();
}
