/** 与旧 PKGSourceDetail.cshtml createSourceDetail 一致 */
export const TYPE_NAMES = [
  '供应商送货',
  'SPD中心库收货',
  'SPD中心库上架散货调拨出库',
  'SPD中心库上架散货调拨入库',
  'SPD中心库制包',
  'SPD中心库上架定数包调拨出库',
  'SPD中心库上架定数包调拨出库',
  'SPD中心库拣配',
  'SPD中心库配送',
  '二级科室收货',
  '二级科室退货',
  '二级科室暂借',
  '二级科室归还',
  '二级科室使用登记（HIS）',
  '二级科室确认退费',
  '使用和消耗匹配',
  '二级科室PDA消耗',
  '逆向消耗',
  '定数包拆包',
  '结束标记',
  '巡回护士审批',
  '申请',
  '回收',
  '清洗',
  '配包',
  '配包审核(合格包)',
  '已灭菌',
  '入库',
  '发放',
  '使用登记'
];

export const TYPE_IDS = [
  '10', '20', '24', '25', '30', '34', '35', '40', '50', '60', '70', '80', '90',
  '100', '105', '110', '115', '65', '177', '120', '85',
  '91', '92', '93', '94', '95', '96', '97', '98', '99'
];

/** 有效到期展示（仅 USE_COUNT==0 时标红/黄） */
export function formatBatchValidity(row) {
  if (!row.Batch_Validity_Period) return '';
  const text = String(row.Batch_Validity_Period).substr(0, 10);
  if (row.USE_COUNT != 0 && row.USE_COUNT !== '0') return text;
  const thisDate = new Date(text).getTime();
  if (Number.isNaN(thisDate)) return text;
  const now = Date.now();
  const month3 = 1000 * 60 * 60 * 24 * 90;
  if (thisDate < now) return { text, level: 'danger' };
  if (thisDate - month3 < now) return { text, level: 'warning' };
  return { text, level: '' };
}

export function batchValidityRowClass(row) {
  const f = formatBatchValidity(row);
  if (!f || typeof f === 'string') return '';
  if (f.level === 'danger') return 'pkg-source-row-danger';
  if (f.level === 'warning') return 'pkg-source-row-warning';
  return '';
}

/**
 * @param {Array} objs 接口 result
 * @param {string} pkSerialNumber 当前行 UDI
 * @returns {{ staff, time, dot, jobTracking, msg }[]}
 */
export function buildTraceDetailRows(objs, pkSerialNumber = '') {
  if (!objs || !objs.length) return [];

  const rows = [];
  let isDone = 0;

  for (let i = 0; i < objs.length; i++) {
    const obj = { ...objs[i] };
    if (obj.Type_Id === '120') {
      isDone = 1;
      continue;
    }
    if (obj.Type_Id === '100') {
      obj.Operatation_Staff = '系统';
      if (obj.Operate_Msg && obj.Operate_Msg.lastIndexOf('手术医生：') !== -1) {
        const ss1 = obj.Operate_Msg.substr(0, obj.Operate_Msg.lastIndexOf('：') + 1);
        obj.Operate_Msg = ss1 + '/';
      }
    }
    if (obj.Type_Id === '110') {
      obj.Operatation_Staff = '系统';
    }
    if (obj.Type_Id === '10' || obj.Type_Id === '110' || obj.Type_Id === '115') {
      obj.Operate_Msg = (obj.Operate_Msg || '') + 'UDI:' + pkSerialNumber;
    }

    let operateMsg = obj.Operate_Msg || '';
    if (obj.Type_Id === '80' && operateMsg.indexOf('PDA') === -1) {
      operateMsg = operateMsg.replace('暂借出库', '智能设备自动识别出库');
    }
    if (obj.Type_Id === '30') {
      operateMsg = operateMsg + '[' + (obj.Def_No_Pkg_Code || '') + ']';
    }

    const idx = TYPE_IDS.indexOf(String(obj.Type_Id));
    rows.push({
      staff: obj.Operatation_Staff || '',
      time: obj.Operate_Time_String || '',
      dot: i === 0 ? 'red' : 'green',
      jobTracking: idx >= 0 ? TYPE_NAMES[idx] : '',
      msg: operateMsg
    });
  }

  if (isDone !== 1 && objs.length) {
    const lastTypeID = objs[objs.length - 1].Type_Id;
    const start = TYPE_IDS.indexOf(String(lastTypeID)) + 1;
    for (let j = start; j < TYPE_IDS.length; j++) {
      rows.push({
        staff: '',
        time: '',
        dot: 'gray',
        jobTracking: TYPE_NAMES[j],
        msg: ''
      });
    }
    if (rows.length) rows.pop();
  }

  if (rows.length && rows[rows.length - 1].dot === 'green') {
    rows[rows.length - 1].dot = 'red';
  }

  return rows;
}
