import { menuToRoutes, eachTreeData } from 'ele-admin';
import { HOME_PATH, LAYOUT_PATH, REDIRECT_PATH } from '@/config/setting';
import EleLayout from '@/layout/index.vue';
import RedirectLayout from '@/components/RedirectLayout';
import { iframeMixins } from '@/utils/iframe-mixin';

/**
 * 静态路由
 */
export const routes = [
  {
    path: '/login',
    component: () => import('@/views/login/index.vue'),
    meta: { title: '登录' }
  },
  {
    path: '/forget',
    component: () => import('@/views/forget/index.vue'),
    meta: { title: '忘记密码' }
  },
  // 404
  {
    path: '*',
    component: () => import('@/views/exception/404/index.vue')
  }
];

/**
 * 添加动态路由
 * @param menus 菜单数据
 * @param homePath 菜单数据的第一个页面地址
 */
export function getMenuRoutes(menus, homePath) {
  const routes = [
    // 用于刷新的路由
    {
      path: REDIRECT_PATH + '/:path(.*)',
      component: RedirectLayout,
      meta: { hideFooter: true }
    }
  ];
  // 路由铺平处理
  eachTreeData(
    menuToRoutes(menus, getComponent, [], null, null, iframeMixins),
    (route) => {
      routes.push({ ...route, children: null });
    }
  );
  // 仅开发环境：便于未在库里配菜单时联调「暂存库查询(新)」。生产构建 NODE_ENV=production 不会注入。
  // 正式环境仍以 /Commons/login 返回的 permission_group + 后台菜单为准。
  if (process.env.NODE_ENV === 'development') {
    routes.push({
      path: '/Inventory/NewTemporaryRepositoryQuery',
      component: () =>
        import('@/views/Inventory/NewTemporaryRepositoryQuery/index.vue'),
      meta: { title: '暂存库查询(新)' }
    });
    routes.push({
      path: '/Home/HerpJfDept',
      component: () => import('@/views/Home/HerpJfDept/index.vue'),
      meta: { title: '计费科室维护' }
    });
    routes.push({
      path: '/Home/Department',
      component: () => import('@/views/Home/Department/index.vue'),
      meta: { title: '科室资料维护' }
    });
    routes.push({
      path: '/Home/BatchOutage',
      component: () => import('@/views/Home/BatchOutage/index.vue'),
      meta: { title: '科室授权品种' }
    });
    routes.push({
      path: '/Home/AUpDownKsQuery',
      component: () => import('@/views/Home/AUpDownKsQuery/index.vue'),
      meta: { title: '上下限审批' }
    });
    routes.push({
      path: '/Home/ManufacturingMaintain',
      component: () => import('@/views/Home/ManufacturingMaintain/index.vue'),
      meta: { title: '生产企业维护' }
    });
    routes.push({
      path: '/Inventory/ReviseManagement',
      component: () => import('@/views/Inventory/ReviseManagement/index.vue'),
      meta: { title: '盘点管理(库存稽查)' }
    });
    routes.push({
      path: '/Settle/MensualBills',
      component: () => import('@/views/Settle/MensualBills/index.vue'),
      meta: { title: '月结管理' }
    });
    routes.push({
      path: '/Settle/HishedgingData',
      component: () => import('@/views/Settle/HishedgingData/index.vue'),
      meta: { title: 'HIS消耗数据管理' }
    });
    routes.push({
      path: '/KSInventory/KSConsumeQueryTemp',
      component: () => import('@/views/KSInventory/KSConsumeQueryTemp/index.vue'),
      meta: { title: '科室消耗查询V2' }
    });
    routes.push({
      path: '/KSInventory/FinancialAudit',
      component: () => import('@/views/KSInventory/FinancialAudit/index.vue'),
      meta: { title: '发票签收' }
    });
    routes.push({
      path: '/Inventory/CentreBankTakeGoogs',
      component: () => import('@/views/Inventory/CentreBankTakeGoods/index.vue'),
      meta: { title: '收货作业' }
    });
    routes.push({
      path: '/Task/AuthOrder',
      component: () => import('@/views/Task/AuthOrder/index.vue'),
      meta: { title: '自助订单' }
    });
    routes.push({
      path: '/Home/VarPriceRecode',
      component: () => import('@/views/Home/VarPriceRecode/index.vue'),
      meta: { title: '价格变动记录' }
    });
    routes.push({
      path: '/TraceSource/VarPriceRecode',
      component: () => import('@/views/TraceSource/VarPriceRecode/index.vue'),
      meta: { title: '价格变动记录(新)' }
    });
    routes.push({
      path: '/KSInventory/PKGSourceDetail',
      component: () => import('@/views/KSInventory/PKGSourceDetail/index.vue'),
      meta: { title: '溯源查询' }
    });
    routes.push({
      path: '/TraceSource/PKGSourceDetail',
      component: () => import('@/views/TraceSource/PKGSourceDetail/index.vue'),
      meta: { title: '溯源查询(新)' }
    });
    routes.push({
      path: '/Statistics/EffectiveTip',
      component: () => import('@/views/Statistics/EffectiveTip/index.vue'),
      meta: { title: '效期到期统计' }
    });
    routes.push({
      path: '/Statistics/NewEffectiveTip',
      component: () => import('@/views/Statistics/NewEffectiveTip/index.vue'),
      meta: { title: '效期到期统计(新)' }
    });
  }
  return {
    path: LAYOUT_PATH,
    component: EleLayout,
    redirect: HOME_PATH ?? homePath,
    children: routes
  };
}

/**
 * 获取路由组件
 * @param component 组件名称
 */
function getComponent(component) {
  if (component) {
    return () => import('@/views/' + component);
  }
}
