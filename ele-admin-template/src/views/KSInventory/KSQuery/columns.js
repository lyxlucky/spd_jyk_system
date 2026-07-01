/** 主表列 — 科室库存汇总 */
export function getMainColumns() {
  return [
    {
      columnKey: 'index',
      type: 'index',
      width: 45,
      align: 'center',
      fixed: 'left'
    },
    {
      prop: 'Source_Name',
      label: '所属科室',
      sortable: 'custom',
      align: 'center',
      minWidth: 100,
      showOverflowTooltip: true
    },
    {
      prop: 'Varietie_Code_New',
      label: '品种编码',
      sortable: 'custom',
      align: 'center',
      minWidth: 120,
      showOverflowTooltip: true
    },
    {
      prop: 'Varietie_Name',
      label: '品种全称',
      sortable: 'custom',
      align: 'center',
      minWidth: 200,
      showOverflowTooltip: true
    },
    {
      prop: 'Specification_Or_Type',
      label: '型号/规格',
      align: 'center',
      minWidth: 160,
      showOverflowTooltip: true
    },
    {
      prop: 'Coefficient',
      label: '系数',
      sortable: 'custom',
      align: 'center',
      width: 70
    },
    {
      prop: 'Def_Qty',
      label: '库存定数包数',
      sortable: 'custom',
      align: 'center',
      width: 110
    },
    {
      prop: 'Dept_Two_Locking_Qty',
      label: '暂存数量',
      align: 'center',
      width: 90
    },
    {
      prop: 'Dept_Two_On_Way_Qty',
      label: '补货在途',
      align: 'center',
      width: 90
    },
    {
      prop: 'PRICE',
      label: '中标价',
      align: 'right',
      width: 80
    },
    {
      prop: 'Unit',
      label: '单位',
      align: 'center',
      width: 60
    },
    {
      prop: 'Manufacturing_Ent_Name',
      label: '生产企业名称',
      align: 'center',
      minWidth: 180,
      showOverflowTooltip: true
    },
    {
      prop: 'Lower',
      label: '库存下限',
      align: 'center',
      width: 90,
      slot: 'lower'
    },
    {
      prop: 'Upper',
      label: '库存上限',
      align: 'center',
      width: 90
    },
    {
      prop: 'Region_Name',
      label: '科室库区',
      align: 'center',
      width: 90
    },
    {
      prop: 'Group_Name',
      label: '分组名称',
      sortable: 'custom',
      align: 'center',
      width: 100
    }
  ];
}

/** 明细表列 — 定数码明细 */
export function getDetailColumns(showSettle = true) {
  const cols = [
    {
      columnKey: 'index',
      type: 'index',
      width: 45,
      align: 'center',
      fixed: 'left'
    },
    {
      prop: 'Source_Name',
      label: '所属科室',
      align: 'center',
      minWidth: 100,
      showOverflowTooltip: true
    },
    {
      prop: 'Varietie_Code_New',
      label: '品种编码',
      align: 'center',
      minWidth: 100,
      showOverflowTooltip: true
    },
    {
      prop: 'Varietie_Name',
      label: '品种全称',
      sortable: 'custom',
      align: 'center',
      minWidth: 180,
      showOverflowTooltip: true
    },
    {
      prop: 'Specification_Or_Type',
      label: '型号/规格',
      align: 'center',
      minWidth: 140,
      showOverflowTooltip: true
    },
    {
      prop: 'JYK_YQM',
      label: '仪器名称',
      align: 'center',
      width: 120,
      showOverflowTooltip: true
    },
    {
      prop: 'Manufacturing_Ent_Name',
      label: '生产企业名称',
      align: 'center',
      minWidth: 150,
      showOverflowTooltip: true
    },
    {
      prop: 'Supplier_Name',
      label: '供应商',
      align: 'center',
      minWidth: 140,
      showOverflowTooltip: true
    },
    {
      prop: 'Batch',
      label: '生产批号',
      align: 'center',
      width: 100
    },
    {
      prop: 'Batch_Production_Date',
      label: '生产日期',
      align: 'center',
      width: 100,
      slot: 'batchProdDate'
    },
    {
      prop: 'Batch_Validity_Period',
      label: '有效到期',
      align: 'center',
      width: 120,
      slot: 'batchValidity'
    },
    {
      prop: 'Coefficient',
      label: '系数',
      align: 'center',
      width: 70
    },
    {
      prop: 'Def_No_Pkg_Code',
      label: '定数码',
      sortable: 'custom',
      align: 'center',
      width: 130,
      showOverflowTooltip: true
    },
    {
      prop: 'Up_Shelf_State',
      label: '库存状态',
      align: 'center',
      width: 90,
      slot: 'upShelfState'
    },
    {
      prop: 'Storaged_Days',
      label: '在库天数',
      sortable: 'custom',
      align: 'center',
      width: 90
    },
    {
      prop: 'RECEIVER',
      label: '收货人',
      sortable: 'custom',
      align: 'center',
      width: 90
    },
    {
      prop: 'STOCK_OUT_DISTRIBUTE_NUMBER',
      label: '收货单号',
      sortable: 'custom',
      align: 'center',
      minWidth: 130,
      showOverflowTooltip: true
    },
    {
      prop: 'RECEIVE_TIME',
      label: '收货时间',
      sortable: 'custom',
      align: 'center',
      width: 100
    },
    {
      prop: 'Remarks',
      label: '备注',
      sortable: 'custom',
      align: 'center',
      width: 90,
      showOverflowTooltip: true
    }
  ];
  if (showSettle) {
    cols.push({
      prop: 'USE_DEF_NO_PKG_CODE',
      label: '是否结算',
      align: 'center',
      width: 90,
      slot: 'settleState'
    });
  }
  return cols;
}
