import store from '@/store';
import { HOME_HP } from '@/config/setting';

/** 对齐老系统 Home.cshtml isSpt：非阳光采购平台院区为 true */
export function readjustPriceIsSpt(hp = HOME_HP) {
  const h = String(hp || '').toLowerCase();
  const sunshine = [
    'szhn',
    'lg',
    'bd',
    'bdrm',
    'zq',
    'szlhfy',
    'szsmyl',
    'szse',
    'szse_lh',
    'szse_dp'
  ];
  if (sunshine.some((x) => h === x || (x === 'szse' && h.startsWith('szse')))) {
    return false;
  }
  return true;
}

export function formatYesNo(val) {
  return val == 1 || val === '1' || val === true ? '是' : '否';
}

export function formatReadjustState(state) {
  const map = {
    0: '新建计划',
    1: '已经提交',
    2: '审批通过',
    3: '等待执行',
    4: '执行成功',
    5: '异常'
  };
  return map[String(state)] || '未知';
}

export function formatSendState(val) {
  if (val == 0 || val === '0') return '未发送';
  if (val == 1 || val === '1') return '已发送';
  return '未知';
}

export function formatDateTime(val) {
  if (!val) return '';
  return String(val).replace('T', ' ').substring(0, 19);
}

export function formatDate(val) {
  if (!val) return '';
  return String(val).replace('T', ' ').substring(0, 10);
}

function permHit(...keys) {
  const authorities = store?.state?.user?.authorities || [];
  const pg = store?.state?.user?.info?.permission_group || [];
  return keys.some((key) => {
    if (authorities.includes(key)) return true;
    return pg.some((p) =>
      [p.Permission_Url, p.PERMISSION_URL, p.component, p.path, p.title, p.permission_name].some(
        (v) => v === key
      )
    );
  });
}

/** 调价计划审批按钮 */
export function canApproveReadjust() {
  return permHit('调价计划审批按钮');
}

/** 调价计划发送HIS按钮 */
export function canSendHisReadjust() {
  return permHit('调价计划发送HIS按钮');
}

/** 删除计划 / 发送状态筛选：部分医院 */
export function showDeleteAndSendFilter(hp = HOME_HP) {
  return ['stzl', 'stzyyy', 'stse', 'chrmyy', 'se2'].includes(hp);
}

/** 平台合同编号输入 */
export function showPtHtnum(hp = HOME_HP) {
  return ['stse', 'stzl', 'stzx', 'csyy', 'stzyyy', 'chrmyy', 'se2'].includes(hp);
}

export function createDefaultWhere() {
  return {
    readjustNumber: '',
    supplierName: '',
    contractCode: '',
    varietie: '',
    Creater: '',
    state: '',
    IS_CHARGE: '',
    ReadjustSendState: '',
    sp_startTime: '',
    sp_endTime: ''
  };
}

export const IMPORT_TEMPLATE_HEADERS = [
  '供应商名称',
  '合同编码',
  '品种编码',
  '原结算价',
  '调价价格',
  '已消耗未月结是否执行',
  '同步调整基础资料和合同价格',
  '生效时间',
  '调价原因/备注',
  '新合同号(选填)'
];

export const EXPORT_HEADERS = [
  '系统业务编号',
  '供应商名称',
  '合同编码',
  '合同名称',
  '品种编码',
  '品种名称',
  '计费编码',
  '原结算价',
  '新结算价',
  '是否收费',
  '计划生效时间',
  '创建人',
  '计划创建时间',
  '审批人',
  '计划审批时间',
  '调价状态',
  '已消耗未月结数据一并执行调价',
  '库存不调价调整品种合同价格',
  '同步调整基础资料和合同价格',
  '新合同号'
];
