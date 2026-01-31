// 接口地址
export const API_BASE_URL = process.env.VUE_APP_API_BASE_URL;

//b2b后端地址
export const B2B_BASE_URL = "http://47.106.243.154:802";

// 请求超时时间配置（毫秒）
const getRequestTimeout = () => {
  const env = process.env.VUE_APP_ENV;
  const envTimeoutMap = {
    'local': 3600000, // 1小时
    'test': 3600000,  // 1小时
    'bjww': 3600000,  // 1小时
    'bjnw': 3600000,  // 1小时
    'bjnwhttps': 3600000, // 1小时
    'bdww': 4*60*60*1000,  // 4小时
    'bdnw': 4*60*60*1000,  // 4小时
    'lhfyww': 3600000, // 1小时
    'lhfynw': 3600000, // 1小时
    'hnww': 3600000,  // 1小时
    'hnnw': 3600000,  // 1小时
    'smww': 3600000,  // 1小时
    'smnw': 3600000,  // 1小时
    'stzlww': 3600000, // 1小时
    'stzlnw': 3600000, // 1小时
    'zxww': 3600000,  // 1小时
    'zxnw': 3600000,  // 1小时
    'lgww': 3600000,  // 1小时
    'sebb': 3600000, // 1小时
    'sebbww': 3600000, // 1小时
    'sedp': 3600000,  // 1小时
    'sedpww': 3600000,  // 1小时
    'selh': 3600000,   // 1小时
    'selhww': 3600000,   // 1小时
    'xhww': 3600000,  // 1小时
    'xhnw': 3600000   // 1小时
  };
  console.log(env,envTimeoutMap[env]);
  return envTimeoutMap[env] || 3600000;
}

export const REQUEST_TIMEOUT = getRequestTimeout();

// 医院标识
// bd 北大
// szsmyl 萨米
// lg 龙岗人民医院
// stzl 汕头肿瘤标识
// szhn 华南医院
// stzx 汕头中心
// szlhfy 龙华妇幼
// bdrm 北京人民

// 根据环境自动获取医院标识
const getHomeHp = () => {
  const env = process.env.VUE_APP_ENV;
  const envHpMap = {
    'local': 'bdrm',
    'test': 'bdrm',
    'bjww': 'bdrm',
    'bjnw': 'bdrm',
    'bjnwhttps': 'bdrm',
    'bdww': 'bd',
    'bdnw': 'bd',
    'lhfyww': 'szlhfy',
    'lhfynw': 'szlhfy',
    'hnww': 'szhn',
    'hnnw': 'szhn',
    'smww': 'szsmyl',
    'smnw': 'szsmyl',
    'stzlww': 'stzl',
    'stzlnw': 'stzl',
    'zxww': 'stzx',
    'zxnw': 'stzx',
    'lgww': 'lg',
    'sebb': 'se2',  // 市二本部、大鹏院区、龙华院区统一使用同一个HOME_HP
    'sebbww': 'se2',  // 市二本部、大鹏院区、龙华院区统一使用同一个HOME_HP
    'sedp': 'se2',   // 三个环境使用同一个LOGO（待定）
    'sedpww': 'se2',   // 三个环境使用同一个LOGO（待定）
    'selh': 'se2',    // 三个环境使用同一个LOGO（待定）
    'selhww': 'se2',    // 三个环境使用同一个LOGO（待定）
    'xhww': 'xh',   // 新华外网
    'xhnw': 'xh'    // 新华内网
  };
  return envHpMap[env] || 'bd';
}

export const HOME_HP = getHomeHp();

// 计算b2b的的医院ID
const caculateB2bCode = () => {
  switch (HOME_HP) {
    case 'zq':
      return '81';
    case 'szhn':
      return '161';
    case 'bd':
      return '1';
    case 'lg':
      return '2';
    case 'szlhfy':
      return '221';
    default:
      return ''; // 默认值
  }
}

export const B2B_BASE_CODE = caculateB2bCode();


// 后端地址
const getBackBaseUrl = () => {
  const env = process.env.VUE_APP_ENV;
  const envMap = {
    'local': 'http://localhost:16416',
    'test': 'http://120.79.135.98:891',
    'bjww': 'http://39.107.78.98:6049',
    'bjnw': 'http://172.27.2.102:18002',
    'bjnwhttps': 'https://spd.pkuph.cn:10082',
    'bdww': 'http://47.106.243.154:9001',
    'bdnw': 'http://100.100.100.45:8001',
    'lhfyww': 'http://61.145.158.182:10082',
    'lhfynw': 'http://10.88.10.209:82',
    'hnww': 'http://183.62.200.242:82',
    'hnnw': 'http://172.16.4.59:82',
    'smww': 'http://120.78.226.92:18002',
    'smnw': 'http://192.168.8.90:18002',
    'stzlww': 'http://113.106.170.118:82',
    'stzlnw': 'http://199.199.197.110:8001',
    'zxww': 'http://47.106.243.154:831',
    'zxnw': 'http://172.16.0.99:82',
    'lgww': 'http://218.17.60.162:10052',
    'sebb': 'http://10.173.128.80:18101/sebb',
    'sebbww': 'http://47.106.243.154:18101/sebb',
    'sedp': 'http://10.173.128.80:18105',
    'sedpww': 'http://47.106.243.154:18101/sedp',
    'selh': 'http://10.173.128.80:18103',
    'selhww': 'http://47.106.243.154:18101/selh',
    'xhww': 'http://47.106.243.154:891',
    'xhnw': 'http://172.21.152.3:891'
  };
  return envMap[env] || 'http://localhost:16416';
}

export const BACK_BASE_URL = getBackBaseUrl();

// 项目名称
export const PROJECT_NAME = process.env.VUE_APP_NAME;

// 不显示侧栏的路由
export const HIDE_SIDEBARS = [];

// 不显示页脚的路由
export const HIDE_FOOTERS = [
  '/system/dictionary',
  '/system/organization',
  '/form/advanced'
];

//路由黑名单
export const BLACK_LIST_ROUTERS = [
  //UDI院内流转查询
  '/KSInventory/productcodesearch',
  //医疗耗材验收
  '/KSInventory/productcodescan',
  //HIS使用计费
  '/KSInventory/BasicInformation',
  //产品主码管理
  '/KSInventory/productcode',
  //利用率
  '/KSInventory/KSUtilizationRatio',
  //入库管理V2
  '/KSInventory/StorageManagementV2',
  //库存查询
  '/KSInventory/JTQueryList',
  //调库
  'tiaoku:left:submit',
  'tiaoku:left:confirm',

  //科室，在用，中标目录控制
  'keshimulu',
  'zaiyongmulu',
  'zhongbiaomulu',
  'shenlinzhiyin',
  'keshi-export',
  'zhongbiao-export'
]

// 页签同路由不同参数可重复打开的路由
export const REPEATABLE_TABS = [];

// 不需要登录的路由
export const WHITE_LIST = ['/login', '/forget'];

// 开启 KeepAlive 后仍然不需要缓存的路由地址
export const KEEP_ALIVE_EXCLUDES = [];

// 直接指定菜单数据
export const USER_MENUS = undefined;

// 首页名称, 为空则取第一个菜单的名称
export const HOME_TITLE = undefined;

// 首页路径, 为空则取第一个菜单的地址
export const HOME_PATH = '/KSInventory/MenuList';
// export const HOME_PATH = '/home/home';

// 外层布局的路由地址
export const LAYOUT_PATH = '/';

// 刷新路由的路由地址
export const REDIRECT_PATH = '/redirect';

// 开启页签栏是否缓存组件
//export const TAB_KEEP_ALIVE = process.env.NODE_ENV !== 'development';
export const TAB_KEEP_ALIVE = true;

// token 传递的 header 名称
export const TOKEN_HEADER_NAME = 'Authorization';

// token 存储的名称
export const TOKEN_STORE_NAME = 'Token';

// 主题配置存储的名称
export const THEME_STORE_NAME = 'theme';

// i18n 缓存的名称
export const I18N_CACHE_NAME = 'i18n-lang';

// 是否开启国际化功能
export const I18N_ENABLE = true;

// 高德地图 key , 自带的只能用于测试, 正式项目请自行到高德地图官网申请 key
export const MAP_KEY = '006d995d433058322319fa797f2876f5';

// EleAdmin 授权码, 自带的只能用于演示, 正式项目请更换为自己的授权码
// export const LICENSE_CODE =
//   'dk9mcwJyetRWQlxWRiojIqJWdzJCLi4WakJCLxojI0NWZkJiOi4Wah12bkFWZsVmLv1WZsISbvNmLulWbkJVUiojIklmI2JCLik3SFZHOiojIu9WazJXZQfgISMx4SM0NW==';
export const LICENSE_CODE =
  'dk9mcwJyetRWQlxWRiojIqJWdzJCLi4Wa0kjN3ojI0NWZBVmI6ICZpJCLiwiIkZGbph1N6Iibvl2cyVmdQfiETMuEjI0NW==';

