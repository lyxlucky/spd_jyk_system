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
      path: '/Settle/NissinBills',
      component: () => import('@/views/Settle/NissinBills/index.vue'),
      meta: { title: '日清管理' }
    });
    routes.push({
      path: '/Settle/printUseDeptTwo',
      component: () => import('@/views/Settle/PrintUseDeptTwo/index.vue'),
      meta: { title: '日清his计费打印' }
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
      path: '/Task/FollowingGoodsPlan',
      component: () => import('@/views/Task/FollowingGoodsPlan/index.vue'),
      meta: { title: '备货计划跟踪' }
    });
    routes.push({
      path: '/Inventory/PickingMnagement',
      component: () => import('@/views/Inventory/PickingMnagement/index.vue'),
      meta: { title: '拣配及配送' }
    });
    routes.push({
      path: '/Task/BuyBack',
      component: () => import('@/views/Task/BuyBack/index.vue'),
      meta: { title: '中心库退购' }
    });
    routes.push({
      path: '/Task/SectionRejected',
      component: () => import('@/views/Task/SectionRejected/index.vue'),
      meta: { title: '二级库退货' }
    });
    routes.push({
      path: '/Task/CentralinventoryPackage',
      component: () => import('@/views/Task/CentralinventoryPackage/index.vue'),
      meta: { title: '制包作业' }
    });
    routes.push({
      path: '/Task/BhInfo',
      component: () => import('@/views/Task/BhInfo/index.vue'),
      meta: { title: '品种备货分析' }
    });
    routes.push({
      path: '/UserManage/UMUsers',
      component: () => import('@/views/UserManage/UMUsers/index.vue'),
      meta: { title: '用户管理' }
    });
    routes.push({
      path: '/UserManage/UMPDA',
      component: () => import('@/views/UserManage/UMPDA/index.vue'),
      meta: { title: 'PDA用户管理' }
    });
    routes.push({
      path: '/UserManage/UMGroups',
      component: () => import('@/views/UserManage/UMGroups/index.vue'),
      meta: { title: '权限组管理' }
    });
    routes.push({
      path: '/UserManage/UMPermissions',
      component: () => import('@/views/UserManage/UMPermissions/index.vue'),
      meta: { title: '权限管理' }
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
      path: '/Statistics/EffectiveTipWinShow',
      component: () => import('@/views/Statistics/EffectiveTipWinShow/index.vue'),
      meta: { title: '效期到期弹框' }
    });
    routes.push({
      path: '/Inventory/VwHptx',
      component: () => import('@/views/Inventory/VwHptx/index.vue'),
      meta: { title: '货票同行入库' }
    });
    routes.push({
      path: '/Inventory/TertiaryInventory',
      component: () => import('@/views/Inventory/TertiaryInventory/index.vue'),
      meta: { title: '三级库存查询' }
    });
    routes.push({
      path: '/Inventory/ThirdInventoryQuery',
      component: () => import('@/views/Inventory/ThirdInventoryQuery/index.vue'),
      meta: { title: '三级库申领库存查询' }
    });
    routes.push({
      path: '/Inventory/picVarCode',
      component: () => import('@/views/Inventory/picVarCode/index.vue'),
      meta: { title: '品种资质审核' }
    });
    routes.push({
      path: '/KSInventory/NoMoveSell',
      component: () => import('@/views/KSInventory/NoMoveSell/index.vue'),
      meta: { title: '不动销查询' }
    });
    routes.push({
      path: '/KSInventory/Stockmaintenance',
      component: () => import('@/views/KSInventory/Stockmaintenance/index.vue'),
      meta: { title: '库存养护' }
    });
    routes.push({
      path: '/Inventory/Snapshot',
      component: () => import('@/views/Inventory/Snapshot/index.vue'),
      meta: { title: '库存快照' }
    });
    routes.push({
      path: '/Statistics/VarUseStatistics',
      component: () => import('@/views/Statistics/VarUseStatistics/index.vue'),
      meta: { title: '品种消耗统计' }
    });
    routes.push({
      path: '/Home/PrchaseDataV2',
      component: () => import('@/views/Home/PrchaseDataV2/index.vue'),
      meta: { title: '带量采购监测V2' }
    });
    routes.push({
      path: '/Statistics/DeptUseCountStatistics',
      component: () => import('@/views/Statistics/DeptUseCountStatistics/index.vue'),
      meta: { title: '科室用量统计' }
    });
    routes.push({
      path: '/Statistics/DeptAnalysisStatistical',
      component: () => import('@/views/Statistics/DeptAnalysisStatistical/index.vue'),
      meta: { title: '科室统计分析' }
    });
    routes.push({
      path: '/Statistics/MaterialStatistics',
      component: () => import('@/views/Statistics/MaterialStatistics/index.vue'),
      meta: { title: '耗材监管统计' }
    });
    routes.push({
      path: '/Statistics/RegistrationLimitPlan',
      component: () => import('@/views/Statistics/RegistrationLimitPlan/index.vue'),
      meta: { title: '注册证限量' }
    });
    routes.push({
      path: '/Home/YgVarInfo',
      component: () => import('@/views/Home/YgVarInfo/index.vue'),
      meta: { title: '阳光本院目录' }
    });
    routes.push({
      path: '/Home/YgPlatView',
      component: () => import('@/views/Home/YgPlatView/index.vue'),
      meta: { title: '阳光平台发送查看' }
    });
    routes.push({
      path: '/Home/YgPlatReceivGoods',
      component: () => import('@/views/Home/YgPlatReceivGoods/index.vue'),
      meta: { title: '阳光平台收货' }
    });
    routes.push({
      path: '/Statistics/YGCGPlatform',
      component: () => import('@/views/Statistics/YGCGPlatform/index.vue'),
      meta: { title: '阳光采购平台比价' }
    });
    routes.push({
      path: '/Home/BidVarInfo',
      component: () => import('@/views/Home/BidVarInfo/index.vue'),
      meta: { title: '本院中标目录' }
    });
    routes.push({
      path: '/Home/VarietieVarJC',
      component: () => import('@/views/Home/VarietieVarJC/index.vue'),
      meta: { title: '集采品种维护' }
    });
    routes.push({
      path: '/Home/healthInsuranceDirectory',
      component: () => import('@/views/Home/HealthInsuranceDirectory/index.vue'),
      meta: { title: '深圳医保目录' }
    });
    routes.push({
      path: '/Home/YGVARCL_SM',
      component: () => import('@/views/Home/YgVarClSm/index.vue'),
      meta: { title: '物价目录审核(萨米)' }
    });
    routes.push({
      path: '/Home/YGVARCLLOOK_SM',
      component: () => import('@/views/Home/YgVarClLookSm/index.vue'),
      meta: { title: '物价目录审核查看(萨米)' }
    });
    routes.push({
      path: '/KSInventory/GY_CLML_SPD',
      component: () => import('@/views/KSInventory/GyClmlSpd/index.vue'),
      meta: { title: 'HIS计费目录' }
    });
    routes.push({
      path: '/KSInventory/HighValueConsumables',
      component: () => import('@/views/KSInventory/HighValueConsumables/index.vue'),
      meta: { title: '第一批高值医用耗材目录' }
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
