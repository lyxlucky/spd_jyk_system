/**
 * 菜单图标集中配置（侧边主/子菜单栏 + 主页九宫格共用）
 *
 * 仅在数据库 ICON 为空或非法时兜底，改这里不需要动数据库，所有院区发布一次即同步生效。
 * 可选图标值：
 *   - ele-admin/es/ele-icon-picker/icons.js 中的 500 个 el-icon-* 类名
 *   - src/assets/svg/*.svg 的文件名（不含扩展名，如 pinzhong、hrp）
 *
 * 覆盖策略（优先级从高到低）：
 *   1. MENU_ICON_MAP  人工精确映射，想给某个菜单换图标就在这里加一条
 *   2. MENU_ICON_RULES + ICON_POOLS  按标题语义自动分配，同类菜单按标题散列取不同图标
 *   3. DEFAULT_*_ICON  配置异常时的最后防线，保证永远不会渲染空白
 */
export const DEFAULT_TOP_MENU_ICON = 'el-icon-menu';
export const DEFAULT_SUB_MENU_ICON = 'el-icon-document';

/** 精确匹配：先按菜单 path，再按菜单标题 */
export const MENU_ICON_MAP = {
  // 一级主菜单（沿用老系统 Home.cshtml 的菜单名）
  主控面板: 'el-icon-s-home',
  基础数据管理: 'el-icon-folder-opened',
  库存管理: 'el-icon-box',
  科室申领: 'el-icon-goods',
  结算管理: 'el-icon-coin',
  作业管理: 'el-icon-s-order',
  数据维护: 'el-icon-s-tools',
  后勤物资管理: 'el-icon-suitcase',
  溯源管理: 'el-icon-connection',
  跟台耗材管理: 'el-icon-first-aid-kit',
  数据分析: 'el-icon-data-analysis',
  质控管理: 'el-icon-circle-check',
  深圳阳光平台对接: 'el-icon-link',
  新华HIS视图: 'el-icon-view',
  医保物价审核: 'el-icon-document-checked',
  重点监控分类: 'el-icon-s-flag',
  检验科系统: 'el-icon-cpu',
  汕头智能桩: 'el-icon-monitor',
  中七HRP系统: 'el-icon-office-building',
  HRP同步: 'el-icon-refresh',
  省平台模块: 'el-icon-s-platform',
  口腔模块: 'el-icon-school',
  历史数据: 'el-icon-time',
  系统配置: 'el-icon-setting',
  潮汕医院: 'el-icon-house',
  审计查询: 'el-icon-search',

  // 常用二级子菜单
  监管类别维护: 'el-icon-s-management',
  注册证维护: 'el-icon-document-checked',
  品种资料维护: 'el-icon-collection',
  中标目录: 'el-icon-tickets',
  在用目录: 'el-icon-files',
  科室目录: 'el-icon-folder',
  申领指引: 'el-icon-notebook-2',
  入库记录: 'el-icon-receiving',
  出库记录: 'el-icon-sold-out',
  库存查询: 'el-icon-search',
  效期预警: 'el-icon-bell',
  用户管理: 'el-icon-user',
  角色管理: 'el-icon-s-custom',
  数据字典: 'el-icon-setting',
  运行监控: 'el-icon-monitor',
  同品类使用排名: 'el-icon-data-line'
};

/**
 * 语义图标池：同类菜单从池里按标题散列取一个，既贴切又不会整屏同一个图标。
 * 池内图标全部来自 ele-admin 的 500 个有效类名，改动后请用校验脚本确认。
 */
export const ICON_POOLS = {
  common: [
    'el-icon-document', 'el-icon-menu', 'el-icon-folder', 'el-icon-tickets',
    'el-icon-collection', 'el-icon-files', 'el-icon-notebook-2', 'el-icon-document-copy'
  ],
  query: [
    'el-icon-search', 'el-icon-data-line', 'el-icon-pie-chart', 'el-icon-data-analysis',
    'el-icon-view', 'el-icon-s-data', 'el-icon-s-grid', 'el-icon-sort'
  ],
  audit: [
    'el-icon-document-checked', 'el-icon-circle-check', 'el-icon-s-check',
    'el-icon-s-claim', 'el-icon-edit', 'el-icon-coordinate', 'el-icon-brush', 'el-icon-s-order'
  ],
  config: [
    'el-icon-setting', 'el-icon-s-tools', 'el-icon-s-operation', 'el-icon-s-management',
    'el-icon-edit', 'el-icon-s-platform', 'el-icon-s-fold', 'el-icon-s-grid'
  ],
  file: [
    'el-icon-folder-opened', 'el-icon-folder', 'el-icon-collection', 'el-icon-document',
    'el-icon-files', 'el-icon-tickets', 'el-icon-notebook-2', 'el-icon-picture-outline'
  ],
  stock: [
    'el-icon-box', 'el-icon-goods', 'el-icon-receiving', 'el-icon-sold-out',
    'el-icon-suitcase', 'el-icon-truck', 'el-icon-s-shop', 'el-icon-s-cooperation'
  ],
  finance: [
    'el-icon-coin', 'el-icon-bank-card', 'el-icon-wallet', 'el-icon-s-finance',
    'el-icon-tickets', 'el-icon-date', 'el-icon-s-order', 'el-icon-s-data'
  ],
  alert: [
    'el-icon-bell', 'el-icon-warning', 'el-icon-time', 'el-icon-monitor',
    'el-icon-date', 'el-icon-refresh', 'el-icon-view', 'el-icon-data-line'
  ],
  integration: [
    'el-icon-refresh', 'el-icon-connection', 'el-icon-link', 'el-icon-upload',
    'el-icon-download', 'el-icon-printer', 'el-icon-monitor', 'el-icon-mobile-phone'
  ],
  subject: [
    'el-icon-user', 'el-icon-s-custom', 'el-icon-s-cooperation', 'el-icon-office-building',
    'el-icon-school', 'el-icon-house', 'el-icon-coordinate', 'el-icon-s-check'
  ],
  plan: [
    'el-icon-date', 'el-icon-s-order', 'el-icon-tickets', 'el-icon-s-claim',
    'el-icon-notebook-2', 'el-icon-time', 'el-icon-s-flag', 'el-icon-s-management'
  ],
  quality: [
    'el-icon-circle-check', 'el-icon-medal', 'el-icon-trophy', 'el-icon-s-check',
    'el-icon-first-aid-kit', 'el-icon-cpu', 'el-icon-monitor', 'el-icon-view'
  ]
};

/**
 * 标题语义规则：按顺序匹配，命中后从对应图标池取图标。
 * 未命中的菜单走 common 池，仍能被分配到一个确定的图标。
 */
export const MENU_ICON_RULES = [
  { test: /审核|审批|复核|验收|对码|授权|确认|提交|校验/, pool: 'audit' },
  { test: /统计|分析|报表|排名|看板|大屏|汇总|利用率/, pool: 'query' },
  { test: /查询|检索|明细|清单|浏览|查看/, pool: 'query' },
  { test: /预警|提醒|效期|监控|日志|记录|追溯|溯源|跟踪/, pool: 'alert' },
  { test: /同步|接口|对接|平台|上传|导出|导入|打印|下发|推送|B2B|HRP|HIS|UDI/i, pool: 'integration' },
  { test: /结算|账单|发票|对账|付款|计费|价格|物价|费用/, pool: 'finance' },
  { test: /入库|出库|库存|盘点|调库|退转|申领|配送|收货|移库|补货/, pool: 'stock' },
  { test: /目录|品种|资料|档案|证照|注册证|资质|主数据|编码/, pool: 'file' },
  { test: /维护|配置|设置|参数|字典|规则|定义|分类|类别/, pool: 'config' },
  { test: /用户|角色|权限|科室|供应商|生产企业|人员|部门|账号|评价|评分/, pool: 'subject' },
  { test: /预约|计划|订单|单据|申请|排班|任务/, pool: 'plan' },
  { test: /质控|质量|考核|指标|日清|清点/, pool: 'quality' }
];
