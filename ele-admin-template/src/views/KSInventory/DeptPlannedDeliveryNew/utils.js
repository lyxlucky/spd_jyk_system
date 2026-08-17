import { utils, writeFile } from 'xlsx';
import { HOME_HP } from '@/config/setting';

export const dpdHpFlags = {
  isJp: ['stzx', 'stzl'].includes(HOME_HP),
  isSpt: ['bd', 'bdrm'].includes(HOME_HP),
  isHnPagType: HOME_HP === 'szhn',
  isBd: HOME_HP === 'bd',
  isBdrm: HOME_HP === 'bdrm',
  isCg: HOME_HP === 'szlh',
  isLg: HOME_HP === 'lg',
  isHideYw: HOME_HP === 'szse' || HOME_HP === 'se2',
  useRowStorage: ['szse', 'se2', 'szse_dp', 'szse_lh'].includes(HOME_HP)
};

export function selectionCol() {
  return {
    columnKey: 'selection',
    type: 'selection',
    width: 45,
    align: 'center',
    className: 'dpd-checkbox-col',
    fixed: 'left'
  };
}

export function formatPriority(val) {
  if (String(val) === '0') return '普通';
  if (String(val) === '1') return '紧急';
  if (String(val) === '2') return '非常紧急';
  return '-';
}

export function formatPlanApplyState(row) {
  if (String(row.Apply_State) === '10') return '强制结束';
  if (row.Left_Apply_Qty == row.Apply_Qty && String(row.Apply_State) !== '10') return '新增';
  if (row.Left_Apply_Qty > 0 && row.Left_Apply_Qty != row.Apply_Qty && String(row.Apply_State) !== '10') {
    return '未收全';
  }
  if (row.Left_Apply_Qty == 0 && String(row.Apply_State) !== '10') return '已收全';
  return '-';
}

export function formatContractType(type) {
  if (String(type) === '0') return '-';
  if (String(type) === '1') return '中标';
  if (String(type) === '2') return '临采';
  return '';
}

export function formatDeleteFlag(val) {
  if (String(val) === '1') return '未剔除';
  if (String(val) === '0') return '已剔除';
  return '';
}

export function formatIsBidding(val) {
  if (String(val) === '1') return '中标';
  if (String(val) === '0') return '非中标';
  return '';
}

export function formatDeptAuth(val) {
  return Number(val) > 0 ? '是' : '否';
}

export function formatRemark(row) {
  const flags = dpdHpFlags;
  if (flags.isBd || flags.isBdrm) {
    const parts = [row.SQREMARK, row.Note_Description, row.REMARK].filter(Boolean);
    return parts.join('');
  }
  if (row.Note_Description != null) {
    return `${row.Note_Description}${row.REMARK || ''}`;
  }
  return row.REMARK || '';
}

export function formatSendState(state) {
  const map = {
    '0': '未发送（SPD）',
    '1': '已发送（SPD）',
    '2': '已查看（B2B）',
    '3': '处理中（B2B）',
    '4': '部分送货（B2B）',
    '5': '全部送货（B2B）',
    '6': '部分收货（SPD）',
    '7': '全部收货（SPD）',
    '8': '强制关闭'
  };
  return map[String(state)] || '未知';
}

export function formatApproveState(state) {
  if (String(state) === '0') return '未审批';
  if (String(state) === '1') return '已成功审批';
  return '拒绝审批';
}

export function formatPrice(row) {
  const price = row.Purchase_Price ?? row.supply_price;
  if (price == null || price === '') return '';
  return Number(price).toFixed(4);
}

function formatDateYmd(date) {
  const pad = (n) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/** 对齐老系统：默认近 7 天 */
export function defaultPlanDateRange() {
  const dateTo = new Date();
  const dateFrom = new Date(dateTo.getTime() - 7 * 86400000);
  return {
    dateFrom: formatDateYmd(dateFrom),
    dateTo: formatDateYmd(dateTo)
  };
}

export function defaultPlanWhere() {
  const { dateFrom, dateTo } = defaultPlanDateRange();
  return {
    planNumber: '',
    varietieCodeNew: '',
    dp_new_sup: '',
    specType: '',
    manEntName: '',
    deptTwoName: '',
    dateFrom,
    dateTo,
    deptPlanMan: '',
    containLeftZero: '0',
    isDelete: '1',
    planIsZb: '',
    planIsZg: '',
    planIsJYK: '',
    planIsHcfl: '',
    planIsZxk_sh: '',
    planIsZxk_dsb: '',
    isHaveBh: '',
    STORAGE_TYPE: '',
    RELATED_RFID: '',
    OPERATE_TYPE: '',
    planState: ['6', '3']
  };
}

/** 科室计划列表列（vxe-grid）；列宽对齐老系统，缩屏靠横向滚动 */
export function buildPlanColumns() {
  const f = dpdHpFlags;
  const overflow = true;
  const cols = [
    {
      type: 'checkbox',
      width: 45,
      align: 'center',
      fixed: 'left',
      className: 'dpd-checkbox-col'
    },
    {
      type: 'seq',
      title: '序号',
      width: 45,
      align: 'center',
      fixed: 'left'
    },
    { field: 'Plan_Number', title: '计划单号', width: 90, align: 'center', showOverflow: overflow },
    {
      field: 'Priority',
      title: '订单优先级',
      width: 90,
      align: 'center',
      formatter: ({ row }) => formatPriority(row.Priority)
    },
    { field: 'Plan_Time', title: '计划时间', width: 100, align: 'center', showOverflow: overflow },
    {
      field: 'Apply_State',
      title: '计划单状态',
      width: 80,
      align: 'center',
      formatter: ({ row }) => formatPlanApplyState(row)
    },
    {
      field: 'Dept_Two_Name',
      title: '二级科室名称/审核科室',
      width: 100,
      align: 'center',
      showOverflow: overflow,
      slots: { default: 'deptTwoName' }
    },
    {
      field: 'BZ',
      title: '备注',
      width: 80,
      align: 'center',
      showOverflow: overflow,
      formatter: ({ row }) => formatRemark(row)
    },
    {
      field: 'SOURCE_FROM',
      title: '来源',
      width: 100,
      align: 'center',
      showOverflow: overflow
    },
    { field: 'SPDBZ', title: 'SPD备注', width: 100, align: 'center', showOverflow: overflow },
    { field: 'REMARK', title: '科室备注', width: 100, align: 'center', showOverflow: overflow },
    {
      field: 'DEPT_AUTH_CODE',
      title: '二级科室授权',
      width: 80,
      align: 'center',
      formatter: ({ row }) => formatDeptAuth(row.DEPT_AUTH_CODE)
    }
  ];
  if (f.isJp) {
    cols.push({
      field: 'CLASSIFIC_NAME',
      title: '耗材分类',
      width: 80,
      align: 'center',
      showOverflow: overflow
    });
  }
  cols.push(
    { field: 'Varietie_Code_New', title: '品种编码', width: 120, align: 'center', showOverflow: overflow },
    { field: 'CHARGING_CODE', title: '计费编码', width: 120, align: 'center', showOverflow: overflow }
  );
  if (!f.isSpt) {
    cols.push({ field: 'YG_CODE', title: '阳光产品码', width: 105, align: 'center', showOverflow: overflow });
  }
  cols.push(
    { field: 'PROVINCE_PLATFORM_CODE', title: '药交ID', width: 100, align: 'center', showOverflow: overflow },
    { field: 'Varietie_Name', title: '品种名称', width: 150, align: 'center', showOverflow: overflow },
    { field: 'Specification_Or_Type', title: '规格型号', width: 150, align: 'center', showOverflow: overflow },
    { field: 'Unit', title: '单位', width: 80, align: 'center' },
    { field: 'Price', title: '中标价', width: 90, align: 'center' },
    { field: 'Apply_Qty', title: '申请数量', width: 105, align: 'center' },
    { field: 'Left_Apply_Qty', title: '剩余申请数量', width: 100, align: 'center' }
  );
  if (f.isJp) {
    cols.push({ field: 'GET_QTY', title: '科室收货数量', width: 80, align: 'center' });
  }
  cols.push(
    { field: 'Center_Inside_Goods_Qty', title: '院内散货数量', width: 100, align: 'center' },
    { field: 'Center_Outside_Goods_Qty', title: '院外散货数量', width: 100, align: 'center', hide: f.isHideYw },
    { field: 'Center_Inside_Def_Qty', title: '院内定数包', width: 100, align: 'center' },
    { field: 'Center_Outside_Def_Qty', title: '院外定数包', width: 100, align: 'center', hide: f.isHideYw },
    { field: 'BH_NUM', title: '备货数（散）', width: 100, align: 'center', slots: { default: 'planQty' } },
    { field: 'SUPPLIER_NAME', title: '供应商', width: 120, align: 'center', showOverflow: overflow },
    { field: 'CONTRACT_CODE', title: '合同编码', width: 120, align: 'center', showOverflow: overflow },
    {
      field: 'CONTRACT_TYPE',
      title: '合同类型',
      width: 120,
      align: 'center',
      formatter: ({ row }) => formatContractType(row.CONTRACT_TYPE)
    },
    { field: 'Manufacturing_Ent_Name', title: '生产企业名称', width: 120, align: 'center', showOverflow: overflow },
    { field: 'USE_GOODS_QTY', title: '近30天用量（对应科室）', width: 160, align: 'center' },
    { field: 'STOREHOUSE_UPPPER', title: '中心库上限', width: 140, align: 'center' },
    { field: 'STOREHOUSE_LOWER', title: '中心库下限', width: 140, align: 'center' }
  );
  if (!f.isHnPagType) {
    cols.push(
      { field: 'MIDDLE_PACKAGE_COUNT', title: '中包装数量', width: 140, align: 'center' },
      { field: 'BIG_BOX_COUNT', title: '大包装数量', width: 140, align: 'center' }
    );
  } else {
    cols.push({ field: 'PAG_TYPE', title: '包装规格', width: 140, align: 'center' });
  }
  cols.push(
    { field: 'APPROVAL_NUMBER', title: '注册证', width: 180, align: 'center', showOverflow: overflow },
    { field: 'PLAN_SUBMITTER', title: '申领人', width: 120, align: 'center', showOverflow: overflow },
    { field: 'Storage_Id', title: '收货库区', width: 120, align: 'center', slots: { default: 'rowStorage' } },
    { field: 'BatchInfo', title: '批次号信息', width: 140, align: 'center', slots: { default: 'batchInfo' } },
    {
      field: 'Is_Bidding',
      title: '是否中标',
      width: 120,
      align: 'center',
      formatter: ({ row }) => formatIsBidding(row.Is_Bidding)
    },
    { field: 'actions', title: '操作', width: 175, align: 'center', slots: { default: 'actions' }, fixed: 'right' },
    {
      field: 'DTL_IS_DELETE',
      title: '剔除标记',
      width: 120,
      align: 'center',
      formatter: ({ row }) => formatDeleteFlag(row.DTL_IS_DELETE)
    },
    { field: 'Dtl_Id', title: '唯一ID', width: 100, align: 'center', showOverflow: overflow }
  );
  // 后端 SearchDeptPlanMsg 无 field/order；本表一次拉全量，用前端本地排序
  const noSortFields = new Set(['actions', 'BatchInfo', 'Storage_Id', 'BH_NUM']);
  return cols
    .filter((c) => !c.hide)
    .map((col) =>
      col.field && !col.type && !noSortFields.has(col.field)
        ? { ...col, sortable: true }
        : col
    );
}

export function buildPickingListColumns() {
  // 后端 GetPickingList 无 field/order（固定 create_time DESC）；对齐老系统 layui 当前页本地排序
  const cols = [
    { prop: 'Stock_Up_Plan_No', label: '备货计划单号', minWidth: 130, align: 'center', showOverflowTooltip: true },
    { prop: 'Creator', label: '创建人', minWidth: 80, align: 'center', showOverflowTooltip: true },
    { prop: 'supplier_name', label: '供应商名称', minWidth: 120, align: 'center', showOverflowTooltip: true },
    { prop: 'Address', label: '收货库区', minWidth: 90, align: 'center', showOverflowTooltip: true },
    {
      prop: 'Create_Time',
      label: '创建时间',
      minWidth: 100,
      align: 'center',
      slot: 'createTime'
    },
    { prop: 'REMARK', label: '备注', minWidth: 90, align: 'center', showOverflowTooltip: true, slot: 'pickingRemark' },
    {
      prop: 'Approve_State',
      label: '审批状态',
      minWidth: 90,
      align: 'center',
      formatter: (row) => formatApproveState(row.Approve_State)
    },
    {
      prop: 'Send_State',
      label: '发送状态',
      minWidth: 110,
      align: 'center',
      formatter: (row) => formatSendState(row.Send_State)
    }
  ];
  return cols.map((col) =>
    col.prop && col.prop !== 'REMARK' ? { ...col, sortable: true } : col
  );
}

export function buildPickingDetailColumns() {
  // 后端 GetPickingInfo 无 field/order（固定 VARIETIE_CODE_NEW）；本表明细一次拉全量，用前端本地排序
  const cols = [
    selectionCol(),
    { prop: 'REMARKS', label: '备注', minWidth: 90, align: 'center', showOverflowTooltip: true },
    { prop: 'Varietie_Code_New', label: '品种(材料)编码', minWidth: 160, align: 'center', showOverflowTooltip: true },
    { prop: 'Varietie_Name', label: '品种全称', minWidth: 140, align: 'center', showOverflowTooltip: true },
    { prop: 'Specification_Or_Type', label: '型号/规格', minWidth: 120, align: 'center', showOverflowTooltip: true },
    { prop: 'Unit', label: '单位', minWidth: 85, align: 'center' },
    { prop: 'Manufacturing_Ent_Name', label: '生产企业名称', minWidth: 120, align: 'center', showOverflowTooltip: true },
    { prop: 'Purchase_Price', label: '价格', minWidth: 80, align: 'center', formatter: (row) => formatPrice(row) },
    { prop: 'Coefficient', label: '系数', minWidth: 85, align: 'center' },
    { prop: 'Stock_Up_Plan_Def_Quantity', label: '备货/包', minWidth: 100, align: 'center' },
    { prop: 'Stock_Up_Plan_Goods_Quantity', label: '备货/散', minWidth: 100, align: 'center' },
    { prop: 'ReceiptQty', label: '实收数量', minWidth: 120, align: 'center' },
    {
      prop: 'RemainQty',
      label: '剩余备货',
      minWidth: 120,
      align: 'center',
      formatter: (row) =>
        Number(row.Stock_Up_Plan_Goods_Quantity || 0) - Number(row.ReceiptQty || 0),
      sortMethod: (a, b) =>
        Number(a.Stock_Up_Plan_Goods_Quantity || 0) -
        Number(a.ReceiptQty || 0) -
        (Number(b.Stock_Up_Plan_Goods_Quantity || 0) - Number(b.ReceiptQty || 0))
    },
    {
      prop: 'Plan_Time',
      label: '备货时间',
      minWidth: 150,
      align: 'center',
      showOverflowTooltip: true,
      formatter: (row) =>
        row.Plan_Time ? String(row.Plan_Time).replace('T', ' ').substring(0, 19) : ''
    },
    { prop: 'supplier_name', label: '供应商名称', minWidth: 120, align: 'center', showOverflowTooltip: true }
  ];
  return cols.map((col) =>
    col.prop && !col.type ? { ...col, sortable: true } : col
  );
}

export function exportPlanTable(rows) {
  const f = dpdHpFlags;
  const headers = [
    '计划单号',
    '订单优先级',
    '计划时间',
    '计划单状态',
    '二级科室名称',
    '品种编码',
    '品种名称',
    '规格型号',
    '单位',
    '供应商',
    '生产企业名称',
    '注册证',
    '药交ID',
    '价格',
    '申请数量',
    '剩余申请数量',
    '院内散货数量',
    '院外散货数量',
    '院内定数包',
    '院外定数包',
    '备注',
    '来源',
    'SPD备注',
    '科室备注',
    '是否中标',
    '标记剔除',
    '申领人',
    '已转备货数',
    '阳光产品码',
    '二级科室授权',
    '计费编码',
    '近30天用量',
    '唯一ID',
    '合同编码'
  ];
  if (f.isJp) {
    headers.push('耗材分类', '科室收货数量', 'HRP订单号');
  }
  headers.push('科室库区', '存储条件', '是否RFID');

  const data = [headers];
  (rows || []).forEach((row) => {
    const line = [
      row.Plan_Number,
      formatPriority(row.Priority),
      row.Plan_Time,
      formatPlanApplyState(row),
      row.Dept_Two_Name,
      row.Varietie_Code_New,
      row.Varietie_Name,
      row.Specification_Or_Type,
      row.Unit,
      row.SUPPLIER_NAME,
      row.Manufacturing_Ent_Name,
      row.APPROVAL_NUMBER,
      row.PROVINCE_PLATFORM_CODE,
      row.Price,
      row.Apply_Qty,
      row.Left_Apply_Qty,
      row.Center_Inside_Goods_Qty,
      row.Center_Outside_Goods_Qty,
      row.Center_Inside_Def_Qty,
      row.Center_Outside_Def_Qty,
      formatRemark(row),
      row.SOURCE_FROM,
      row.SPDBZ,
      row.REMARK,
      formatIsBidding(row.Is_Bidding),
      formatDeleteFlag(row.DTL_IS_DELETE),
      row.PLAN_SUBMITTER,
      row.BH_NUM,
      row.YG_CODE,
      formatDeptAuth(row.DEPT_AUTH_CODE),
      row.CHARGING_CODE,
      row.USE_GOODS_QTY,
      row.Dtl_Id,
      row.CONTRACT_CODE
    ];
    if (f.isJp) {
      line.push(row.CLASSIFIC_NAME, row.GET_QTY, row.HRP_ORDER_NO);
    }
    line.push(row.STORAGE_NAME || row.Storage_Id, row.STORAGE_TYPE_NAME, row.RELATED_RFID);
    data.push(line);
  });
  const sheet = utils.aoa_to_sheet(data);
  const book = utils.book_new();
  utils.book_append_sheet(book, sheet, '科室计划配送');
  writeFile(book, `科室计划配送_${Date.now()}.xlsx`);
}

export function buildStockUpItems(selection, storageId, hpFlags = dpdHpFlags) {
  return (selection || []).map((row) => ({
    Varietie_Code: row.Varietie_Code,
    varietie_Code_New: row.Varietie_Code_New,
    Def_No_Pkg_Coefficient: '1',
    Arg_Plan: row.Plan_Qty ?? row._planQty ?? 0,
    Goods_Qty: row.Plan_Qty ?? row._planQty ?? 0,
    StorageID: hpFlags.useRowStorage ? row.Storage_Id : storageId,
    PLAN_DEPT_TWO_CODE: row.Receive_Dept_Code,
    PLAN_DEPT_TWO_NAME: row.Dept_Two_Name,
    Dtl_Id: row.Dtl_Id,
    SPECIFICATION_OR_TYPE: row.SPECIFICATION_OR_TYPE,
    PAG_TYPE: row.PAG_TYPE
  }));
}

export function validateGoodsApplySelection(selection, storageId, storageName, allRows) {
  if (!selection?.length) {
    return '请至少选中一行数据';
  }
  const isInside = String(storageId) === '1';
  for (const row of selection) {
    const qty = isInside ? row.Center_Inside_Goods_Qty : row.Center_Outside_Goods_Qty;
    if (Number(qty) === 0) {
      return `计划单号:${row.Plan_Number},品种编码:${row.Varietie_Code_New}${storageName}散货数量等于0不能勾选`;
    }
  }
  const selectedPlanMap = {};
  const kyPlanNumbers = {};
  selection.forEach((row) => {
    selectedPlanMap[row.Plan_Number] = (selectedPlanMap[row.Plan_Number] || 0) + 1;
    if (String(row.OPERATE_TYPE) === '4') {
      kyPlanNumbers[row.Plan_Number] = true;
    }
  });
  for (const planNum of Object.keys(kyPlanNumbers)) {
    const totalInTable = (allRows || []).filter(
      (r) => r.Plan_Number === planNum && Number(r.Left_Apply_Qty) > 0
    ).length;
    if ((selectedPlanMap[planNum] || 0) < totalInTable) {
      return `科研计划单号【${planNum}】不允许部分转单，该计划共${totalInTable}条待转明细，当前仅选中${selectedPlanMap[planNum]}条，请全部勾选后再操作`;
    }
  }
  return '';
}

export function validatePickListSelection(selection, storageId, storageName) {
  if (!selection?.length) return '请至少选中一行数据';
  const isInside = String(storageId) === '1';
  for (const row of selection) {
    const defQty = isInside ? row.Center_Inside_Def_Qty : row.Center_Outside_Def_Qty;
    if (Number(defQty) === 0) {
      return `计划单号:${row.Plan_Number},品种编码:${row.Varietie_Code_New}${storageName}定数包数量等于0不能勾选`;
    }
  }
  return '';
}
