// 接口地址
export const API_BASE_URL = process.env.VUE_APP_API_BASE_URL;

//b2b后端地址
export const B2B_BASE_URL = "http://47.106.243.154:802";

// 医院标识
// bd 北大
// szsmyl 萨米
// lg 龙岗人民医院
// stzl 汕头肿瘤标识
// szhn 华南医院
// stzx 汕头中心
export const HOME_HP = 'lg'

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
export const BACK_BASE_URL = "http://localhost:16416";

// 北大
// export const BACK_BASE_URL = "http://47.106.243.154:9001";

// 北大内网
// export const BACK_BASE_URL = "http://100.100.100.45:8001";

// 龙华妇幼外网
// export const BACK_BASE_URL = "http://61.145.158.182:10082";

// 龙华妇幼内网
// export const BACK_BASE_URL = "http://10.88.10.209:82/";

// 华南医院外网
// export const BACK_BASE_URL = "http://183.62.200.242:82/";

// 华南医院内网
// export const BACK_BASE_URL = "http://172.16.4.59:82/";

// 萨米医院外网
// export const BACK_BASE_URL = "http://120.78.226.92:18002/";

// 萨米医院内网
// export const BACK_BASE_URL = "http://192.168.8.90:18002/";

// 肿瘤外网
// export const BACK_BASE_URL = "http://113.106.170.118:82/";

// 汕头肿瘤内网
// export const BACK_BASE_URL = 'http://199.199.197.110:8001/';

// 中心医院内网
// export const BACK_BASE_URL = 'http://172.16.0.99:82/';

// 龙岗医院外网
// export const BACK_BASE_URL = 'http://218.17.60.162:10052/';

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

