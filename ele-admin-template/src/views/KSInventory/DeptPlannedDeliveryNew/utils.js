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

export function defaultPlanWhere() {
  return {
    planNumber: '',
    varietieCodeNew: '',
    dp_new_sup: '',
    specType: '',
    manEntName: '',
    deptTwoName: '',
    dateFrom: '',
    dateTo: '',
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

export function buildPlanColumns() {
  const f = dpdHpFlags;
  const cols = [
    selectionCol(),
    {
      columnKey: 'index',
      type: 'index',
      label: '序号',
      width: 60,
      align: 'center',
      fixed: 'left'
    },
    { prop: 'Plan_Number', label: '计划单号', minWidth: 90, align: 'center', showOverflowTooltip: true },
    {
      prop: 'Priority',
      label: '订单优先级',
      minWidth: 120,
      align: 'center',
      formatter: (row) => formatPriority(row.Priority)
    },
    { prop: 'Plan_Time', label: '计划时间', minWidth: 120, align: 'center', showOverflowTooltip: true },
    {
      prop: 'Apply_State',
      label: '计划单状态',
      minWidth: 120,
      align: 'center',
      formatter: (row) => formatPlanApplyState(row)
    },
    {
      prop: 'Dept_Two_Name',
      label: '二级科室名称/审核科室',
      minWidth: 200,
      align: 'center',
      showOverflowTooltip: true,
      slot: 'deptTwoName'
    },
    {
      prop: 'BZ',
      label: '备注',
      minWidth: 100,
      align: 'center',
      showOverflowTooltip: true,
      formatter: (row) => formatRemark(row)
    },
    { prop: 'SPDBZ', label: 'SPD备注', minWidth: 100, align: 'center', showOverflowTooltip: true },
    { prop: 'REMARK', label: '科室备注', minWidth: 100, align: 'center', showOverflowTooltip: true },
    {
      prop: 'DEPT_AUTH_CODE',
      label: '二级科室授权',
      minWidth: 120,
      align: 'center',
      formatter: (row) => formatDeptAuth(row.DEPT_AUTH_CODE)
    }
  ];
  if (f.isJp) {
    cols.push({
      prop: 'CLASSIFIC_NAME',
      label: '耗材分类',
      minWidth: 120,
      align: 'center',
      showOverflowTooltip: true
    });
  }
  cols.push(
    { prop: 'Varietie_Code_New', label: '品种编码', minWidth: 90, align: 'center', showOverflowTooltip: true },
    { prop: 'CHARGING_CODE', label: '计费编码', minWidth: 90, align: 'center', showOverflowTooltip: true }
  );
  if (!f.isSpt) {
    cols.push({ prop: 'YG_CODE', label: '阳光产品码', minWidth: 95, align: 'center', showOverflowTooltip: true });
  }
  cols.push(
    { prop: 'PROVINCE_PLATFORM_CODE', label: '药交ID', minWidth: 100, align: 'center', showOverflowTooltip: true },
    { prop: 'Varietie_Name', label: '品种名称', minWidth: 140, align: 'center', showOverflowTooltip: true },
    { prop: 'Specification_Or_Type', label: '规格型号', minWidth: 120, align: 'center', showOverflowTooltip: true },
    { prop: 'Unit', label: '单位', minWidth: 55, align: 'center' },
    { prop: 'Price', label: '中标价', minWidth: 70, align: 'center' },
    { prop: 'Apply_Qty', label: '申请数量', minWidth: 120, align: 'center' },
    { prop: 'Left_Apply_Qty', label: '剩余申请数量', minWidth: 120, align: 'center' }
  );
  if (f.isJp) {
    cols.push({ prop: 'GET_QTY', label: '科室收货数量', minWidth: 120, align: 'center' });
  }
  cols.push(
    { prop: 'Center_Inside_Goods_Qty', label: '院内散货数量', minWidth: 120, align: 'center' },
    { prop: 'Center_Outside_Goods_Qty', label: '院外散货数量', minWidth: 120, align: 'center', hide: f.isHideYw },
    { prop: 'Center_Inside_Def_Qty', label: '院内定数包', minWidth: 120, align: 'center' },
    { prop: 'Center_Outside_Def_Qty', label: '院外定数包', minWidth: 120, align: 'center', hide: f.isHideYw },
    { prop: 'BH_NUM', label: '备货数（散）', minWidth: 120, align: 'center', slot: 'planQty' },
    { prop: 'SUPPLIER_NAME', label: '供应商', minWidth: 120, align: 'center', showOverflowTooltip: true },
    { prop: 'CONTRACT_CODE', label: '合同编码', minWidth: 100, align: 'center', showOverflowTooltip: true },
    {
      prop: 'CONTRACT_TYPE',
      label: '合同类型',
      minWidth: 100,
      align: 'center',
      formatter: (row) => formatContractType(row.CONTRACT_TYPE)
    },
    { prop: 'Manufacturing_Ent_Name', label: '生产企业名称', minWidth: 120, align: 'center', showOverflowTooltip: true },
    { prop: 'USE_GOODS_QTY', label: '近30天用量（对应科室）', minWidth: 200, align: 'center' },
    { prop: 'STOREHOUSE_UPPPER', label: '中心库上限', minWidth: 120, align: 'center' },
    { prop: 'STOREHOUSE_LOWER', label: '中心库下限', minWidth: 120, align: 'center' }
  );
  if (!f.isHnPagType) {
    cols.push(
      { prop: 'MIDDLE_PACKAGE_COUNT', label: '中包装数量', minWidth: 120, align: 'center' },
      { prop: 'BIG_BOX_COUNT', label: '大包装数量', minWidth: 120, align: 'center' }
    );
  } else {
    cols.push({ prop: 'PAG_TYPE', label: '包装规格', minWidth: 90, align: 'center' });
  }
  cols.push(
    { prop: 'APPROVAL_NUMBER', label: '注册证', minWidth: 120, align: 'center', showOverflowTooltip: true },
    { prop: 'PLAN_SUBMITTER', label: '申领人', minWidth: 80, align: 'center', showOverflowTooltip: true },
    { prop: 'Storage_Id', label: '收货库区', minWidth: 100, align: 'center', slot: 'rowStorage' },
    { prop: 'BatchInfo', label: '批次号信息', minWidth: 120, align: 'center', slot: 'batchInfo' },
    {
      prop: 'Is_Bidding',
      label: '是否中标',
      minWidth: 120,
      align: 'center',
      formatter: (row) => formatIsBidding(row.Is_Bidding)
    },
    { prop: 'actions', label: '操作', minWidth: 170, align: 'center', slot: 'actions', fixed: 'right' },
    {
      prop: 'DTL_IS_DELETE',
      label: '剔除标记',
      minWidth: 120,
      align: 'center',
      formatter: (row) => formatDeleteFlag(row.DTL_IS_DELETE)
    },
    { prop: 'Dtl_Id', label: '唯一ID', minWidth: 90, align: 'center', showOverflowTooltip: true }
  );
  return cols.filter((c) => !c.hide);
}

export function buildPickingListColumns() {
  return [
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
}

export function buildPickingDetailColumns() {
  return [
    selectionCol(),
    { prop: 'REMARKS', label: '备注', minWidth: 90, align: 'center', showOverflowTooltip: true },
    { prop: 'Varietie_Code_New', label: '品种(材料)编码', minWidth: 160, align: 'center', showOverflowTooltip: true },
    { prop: 'Varietie_Name', label: '品种全称', minWidth: 140, align: 'center', showOverflowTooltip: true },
    { prop: 'Specification_Or_Type', label: '型号/规格', minWidth: 120, align: 'center', showOverflowTooltip: true },
    { prop: 'Unit', label: '单位', minWidth: 55, align: 'center' },
    { prop: 'Manufacturing_Ent_Name', label: '生产企业名称', minWidth: 120, align: 'center', showOverflowTooltip: true },
    { prop: 'Purchase_Price', label: '价格', minWidth: 80, align: 'center', formatter: (row) => formatPrice(row) },
    { prop: 'Coefficient', label: '系数', minWidth: 55, align: 'center' },
    { prop: 'Stock_Up_Plan_Def_Quantity', label: '备货/包', minWidth: 80, align: 'center' },
    { prop: 'Stock_Up_Plan_Goods_Quantity', label: '备货/散', minWidth: 80, align: 'center' },
    { prop: 'ReceiptQty', label: '实收数量', minWidth: 90, align: 'center' },
    {
      prop: 'RemainQty',
      label: '剩余备货',
      minWidth: 90,
      align: 'center',
      formatter: (row) =>
        Number(row.Stock_Up_Plan_Goods_Quantity || 0) - Number(row.ReceiptQty || 0)
    },
    { prop: 'Plan_Time', label: '备货时间', minWidth: 100, align: 'center' },
    { prop: 'supplier_name', label: '供应商名称', minWidth: 120, align: 'center', showOverflowTooltip: true }
  ];
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
    '药交ID',
    '价格',
    '申请数量',
    '剩余申请数量',
    '院内散货数量',
    '院外散货数量',
    '院内定数包',
    '院外定数包',
    '备注',
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
      row.PROVINCE_PLATFORM_CODE,
      row.Price,
      row.Apply_Qty,
      row.Left_Apply_Qty,
      row.Center_Inside_Goods_Qty,
      row.Center_Outside_Goods_Qty,
      row.Center_Inside_Def_Qty,
      row.Center_Outside_Def_Qty,
      formatRemark(row),
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
