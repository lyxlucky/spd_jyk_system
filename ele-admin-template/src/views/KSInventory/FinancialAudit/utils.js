import { BACK_BASE_URL, HOME_HP } from '@/config/setting';

export function openExcelFile(fileName) {
  const base = (BACK_BASE_URL || '').replace(/\/$/, '');
  const url = `${base}/Excel/files/${encodeURIComponent(fileName)}`;
  if (HOME_HP === 'szlh') {
    const a = document.createElement('a');
    a.href = url;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  } else {
    window.open(url);
  }
}

export function fmtDate10(v) {
  if (!v) return '';
  return String(v).replace('T', ' ').substring(0, 10);
}

export function fmtDateTime(v) {
  if (!v) return '';
  return String(v).replace('T', ' ').substring(0, 19);
}

export function fmtMonth(v) {
  if (!v) return '';
  return String(v).substring(0, 7);
}

export function fmtExamineState(v) {
  return v == 1 || v === '1' ? '已审批' : '未审批';
}

export function fmtQsState(v) {
  return v == 1 || v === '1' ? '已签收' : '未签收';
}

export function fmtHighOrLowClass(v) {
  if (v == 1 || v === '1') return '高值';
  if (v == 0 || v === '0') return '低值';
  if (v == 2 || v === '2') return '试剂';
  if (v == 3 || v === '3') return '消毒';
  return '无';
}

export function fmtOrderJsType(v) {
  switch (String(v ?? '0')) {
    case '1':
      return '临购';
    case '2':
      return '临购初始化（医院货主）';
    case '3':
      return '原HERP库存初始化（医院货主）';
    case '4':
      return '经费入库';
    case '5':
      return '初始化一出已结算';
    default:
      return '普通';
  }
}

export function fmtClassific(row) {
  if (HOME_HP === 'csyy') {
    const m = {
      2: '低值易耗品',
      3: '化验试剂',
      4: '基因试剂',
      5: '卫生材料',
      6: '胶片材料',
      7: '骨科高值耗材',
      21: '胶片材料'
    };
    return m[row.CLASSIFIC_PROPERTIES] || '无';
  }
  return row.CLASSIFIC_NAME || row.CLASSIFIC_PROPERTIES || '无';
}

export const hpFlags = {
  isBd: HOME_HP === 'bd' || HOME_HP === 'szsmyl',
  isStzx: ['stzx', 'stse', 'csyy', 'stzl', 'stzyyy', 'chrmyy'].includes(HOME_HP),
  isHptx: HOME_HP === 'lg' || HOME_HP === 'nyd',
  isLg: HOME_HP === 'lg',
  isSzse: HOME_HP && HOME_HP.toLowerCase().indexOf('szse') === 0,
  isSzhn: HOME_HP === 'szhn',
  isFszxy: ['fszxy', 'fsdwrmyy', 'fsdl'].includes(HOME_HP),
  showQrSp: HOME_HP !== 'csyy' && HOME_HP !== 'stzx'
};
