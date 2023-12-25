// 接口地址
export const API_BASE_URL = process.env.VUE_APP_API_BASE_URL;

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

// 页签同路由不同参数可重复打开的路由
export const REPEATABLE_TABS = [];

// 不需要登录的路由
export const WHITE_LIST = ['/login', '/forget'];

// 开启 KeepAlive 后仍然不需要缓存的路由地址
export const KEEP_ALIVE_EXCLUDES = [];

// 直接指定菜单数据
// export const USER_MENUS = undefined;
export const USER_MENUS = [
  {
    path: '/KSInventory',
    component: null,
    redirect: '/KSInventory/InventoryQueryNew',
    meta: {
      title: '科室申领',
      icon: 'el-icon-setting',
      routePath: '/KSInventory',
    },
    children: [
      {
        path: '/KSInventory/KSInventoryQuery',
        component: '/KSInventory/KSInventoryQuery',
        meta: {
          title: '入出库及库存流向',
          icon: 'el-icon-_user-group',
        },
      },
      {
        path: '/KSInventory/ScanDefHis',
        component: '/KSInventory/ScanDefHis',
        meta: {
          title: '标签扫码出库',
          icon: 'el-icon-_user-group',
        },
      },
      {
        path: '/KSInventory/KSDepartmentalPlan',
        component: '/KSInventory/KSDepartmentalPlan',
        meta: {
          title: '科室计划管理',
          icon: 'el-icon-_user-group',
        },
      },
      {
        path: '/KSInventory/KSInventoryBasicData',
        component: '/KSInventory/KSInventoryBasicData',
        meta: {
          title: '科室品种目录维护',
          icon: 'el-icon-_user-group',
        },
      },
      {
        path: '/KSInventory/ApplyTemp',
        component: '/KSInventory/ApplyTemp',
        meta: {
          title: '申领模板管理',
          icon: 'el-icon-_user-group',
        },
      },
      {
        path: '/KSInventory/KSExpirationReminder',
        component: '/KSInventory/KSExpirationReminder',
        meta: {
          title: '库存近效期提醒',
          icon: 'el-icon-_user-group',
        },
      },

      {
        path: '/KSInventory/InstrumentalAnalysis',
        component: '/KSInventory/InstrumentalAnalysis',
        meta: {
          title: '检验科仪器分析',
          icon: 'el-icon-_user-group',
        },
      },
      {
        path: '/KSInventory/KSNewBatchReminder',
        component: '/KSInventory/KSNewBatchReminder',
        meta: {
          title: '新批号提醒',
          icon: 'el-icon-_user-group',
        },
      },
      {
        path: '/KSInventory/KSUtilizationRatio',
        component: '/KSInventory/KSUtilizationRatio',
        meta: {
          title: '利用率',
          icon: 'el-icon-_user-group',
        },
      },
      // {
      //   path: '/KSInventory/DepaStorageQuery',
      //   component: '/KSInventory/DepaStorageQuery',
      //   meta: {
      //     title: 'SPD出库配送信息',
      //     icon: 'el-icon-_user-group',
      //   },
      // },
      {
        path: '/KSInventory/KSDeptConsumption',
        component: '/KSInventory/KSDeptConsumption',
        meta: {
          title: 'SPD结算信息',
          icon: 'el-icon-_user-group',
        },
      },
      // {
      //   path: '/KSInventory/KSInventoryStock',
      //   component: '/KSInventory/KSInventoryStock',
      //   meta: {
      //     title: '品种基础资料',
      //     icon: 'el-icon-_user-group',
      //   },
      // },
      // {
      //   path: '/KSInventory/KSStorageStatistics',
      //   component: '/KSInventory/KSStorageStatistics',
      //   meta: {
      //     title: '入库统计',
      //     icon: 'el-icon-_user-group',
      //   },
      // },
      // {
      //   path: '/KSInventory/KSOutgoingStatistics',
      //   component: '/KSInventory/KSOutgoingStatistics',
      //   meta: {
      //     title: '出库统计',
      //     icon: 'el-icon-_user-group',
      //   },
      // },
      // {
      //   path: '/KSInventory/KSTakeStock',
      //   component: '/KSInventory/KSTakeStock',
      //   meta: {
      //     title: '盘点库存',
      //     icon: 'el-icon-_user-group',
      //   },
      // },
    ],
  },
  // {
  //   path: '/demo',
  //   redirect: '/demo/test',
  //   meta: { title: '演示', icon: 'el-icon-setting' },
  //   children: [
  //     {
  //       path: '/demo/test',
  //       component: '/demo/test',
  //       meta: {
  //         title: '测试页面',
  //         icon: 'el-icon-setting'
  //       }
  //     }
  //   ]
  // }
];

// 首页名称, 为空则取第一个菜单的名称
export const HOME_TITLE = undefined;

// 首页路径, 为空则取第一个菜单的地址
export const HOME_PATH = undefined;
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

// 医院标识
export const HOME_HP = 'bd'
