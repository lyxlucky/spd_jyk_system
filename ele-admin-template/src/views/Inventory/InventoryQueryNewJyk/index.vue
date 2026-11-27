<template>
  <div class="inventory-query-jyk">
    <div ref="mainPane" class="inventory-query-jyk__pane">
      <ele-pro-table
        ref="table"
        class="data-table"
        size="mini"
        border
        stripe
        title="库存列表"
        :height="mainTableHeight"
        full-height="calc(100vh - 90px)"
        :header-overflow-hidden="false"
        :pageSize="pageSize"
        :pageSizes="pageSizes"
        :columns="columns"
        :datasource="datasource"
        :selection.sync="selection"
        cache-key="inventoryQueryJykMainTable"
        @row-click="handleRowClick"
      >
        <template v-slot:toolbar>
          <user-search :sum="mainSum" :amount-sum="mainAmountSum" @search="reload" @exportData="exportData" />
        </template>
      </ele-pro-table>
    </div>
    <div ref="detailPane" class="inventory-query-jyk__pane">
      <ele-pro-table
        ref="table2"
        class="data-table"
        size="mini"
        border
        stripe
        title="定数码明细"
        :height="detailTableHeight"
        full-height="calc(100vh - 90px)"
        :header-overflow-hidden="false"
        :pageSize="pageSize"
        :pageSizes="pageSizes"
        :columns="columns2"
        :datasource="datasource2"
        :selection.sync="selection"
        cache-key="inventoryQueryJykDetailTable"
      >
        <template v-slot:toolbar>
          <user-search2 @search="onDetailSearch" />
        </template>
      </ele-pro-table>
    </div>
  </div>
</template>

<script>
import { utils, writeFile } from 'xlsx';
import UserSearch from './components/user-search.vue';
import UserSearch2 from './components/user-search2.vue';
import { GetPDAList, GetPDAList2, GetPDAListAll } from '@/api/Inventory/InventoryQueryNewJyk';
import { buildDefaultExportRows } from '@/views/Inventory/InventoryQueryNew/utils';
import { measureTableHeight } from '@/views/HeelBlockConsumables/PlatformConsume/paneTableHeight';

export default {
  name: 'InventoryQueryNewJyk',
  components: {
    UserSearch,
    UserSearch2
  },
  data() {
    return {
      mainTableHeight: 160,
      detailTableHeight: 160,
      sourceFrom: '',
      batchId: '',
      varietieCode: '',
      batch: '',
      coefficient: '',
      currUpShelfState: '',
      storageId: '',
      detailCondition: '',
      mainWhere: {},
      mainSum: 0,
      mainAmountSum: 0,
      // 表格列配置
      columns: [
        {
          columnKey: 'selection',
          type: 'selection',
          width: 45,
          align: 'center',
          fixed: 'left'
        },
        {
          prop: 'Source_Name',
          label: '库房位置',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 120
        },
        {
          prop: 'STORAGE_TWO_NAME',
          label: '仓库',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 80
        },{
        prop: 'Up_Shelf_State',
        label: '所属区域',
        align: 'center',
        showOverflowTooltip: true,
        minWidth: 120,
        formatter: function (row) {
            var wzlx = "";
            if (row.VAR_TYPE === "1") {
                wzlx = "-防疫物资";
            }
            if (row.Up_Shelf_State === 1) {
                return '合格区' + wzlx;
            } else if (row.Up_Shelf_State === 6) {
                return '普通隔离区' + wzlx;
            } else if (row.Up_Shelf_State === 11) {
                return '防疫物资区' + wzlx;
            } else if (row.Up_Shelf_State === 7) {
                return '不合格区' + wzlx;
            } else if (row.Up_Shelf_State === 0) {
                return row.Source_Name + wzlx;
            } else if (row.Up_Shelf_State === 8) {
                return '盘损隔离区' + wzlx;
            } else if (row.Up_Shelf_State === 9) {
                return '应急库' + wzlx;
            } else if (row.Up_Shelf_State === 2) {
                return '拣配区' + wzlx;
            } else {
                return '锁定区' + wzlx;
            }
        }
    },
    {
        prop: 'Receive_Property',
        label: '收货类型',
        align: 'center',
        showOverflowTooltip: true,
        minWidth: 120,
        formatter: function (row) {
            if (row.Receive_Property == 0) {
                return "普通收货";
            } else if (row.Receive_Property == 1) {
                return "盘溢收货";
            } else {
                return "无";
            }
        }
    },
    {
        prop: 'Varietie_Code_New',
        label: '品种编码',
        align: 'center',
        showOverflowTooltip: true,
        minWidth: 120
    },
    {
        prop: 'Varietie_Name',
        label: '品种全称',
        align: 'center',
        showOverflowTooltip: true,
        minWidth: 192
    },
    {
        prop: 'Specification_Or_Type',
        label: '型号/规格',
        align: 'center',
        showOverflowTooltip: true,
        minWidth: 120
    },
    {
        prop: 'Unit',
        label: '单位',
        align: 'center',
        showOverflowTooltip: true,
        width: 76
    },
    {
        prop: 'Goods_Qty',
        label: '库存散货',
        align: 'center',
        showOverflowTooltip: true,
        minWidth: 120
    },
    {
        prop: 'APPROVAL_NUMBER',
        label: '注册证号',
        align: 'center',
        showOverflowTooltip: true,
        minWidth: 200
    },
    {
        prop: 'PROVINCE_PLATFORM_CODE',
        label: '药交ID',
        align: 'center',
        showOverflowTooltip: true,
        minWidth: 120,
    },
    {
        prop: 'YG_CODE',
        label: '阳光产品码',
        align: 'center',
        showOverflowTooltip: true,
        minWidth: 120
    },
    {
        prop: 'Manufacturing_Ent_Name',
        label: '生产企业名称',
        align: 'center',
        showOverflowTooltip: true,
        minWidth: 160
    },
    {
        prop: 'Supplier_Name',
        label: '供应商',
        align: 'center',
        showOverflowTooltip: true,
        minWidth: 208
    },
    {
        prop: 'Batch',
        label: '生产批号',
        align: 'center',
        showOverflowTooltip: true,
        minWidth: 120
    },
    {
        prop: 'Batch_Production_Date',
        label: '生产日期',
        align: 'center',
        showOverflowTooltip: true,
        minWidth: 120,
        formatter: function (row) {
            return row.Batch_Production_Date.substr(0, 10);
        }
    },
    {
        prop: 'Batch_Validity_Period',
        label: '有效到期',
        align: 'center',
        showOverflowTooltip: true,
        minWidth: 120,
        formatter: function (row) {
            var bvp_date = row.Batch_Validity_Period.substr(0, 10);
            var this_date = new Date(bvp_date).getTime();
            var nowDate = new Date().getTime();
            if (row.Source_Name.search("检验科") !== -1) {
                //  小于15天
                if ((this_date - 1296000000) <= nowDate) {
                    return row.Batch_Validity_Period.substr(0, 10) + "<i class='invNew_Red'></i>";
                }
                //小于30天2592000000
                if ((this_date - 2592000000) <= nowDate) {
                    return row.Batch_Validity_Period.substr(0, 10) + "<i class='invNew_yellow'></i>";
                }
            }
            if ((this_date - 1296000000) < nowDate) {
                return row.Batch_Validity_Period.substr(0, 10) + "<i class='invNew_yellow'></i>";
            } else {
                return row.Batch_Validity_Period.substr(0, 10);
            }
        }
    },
    {
        prop: 'Coefficient',
        label: '系数',
        align: 'center',
        showOverflowTooltip: true,
        minWidth: 80
    },
    {
        prop: 'Supply_Price',
        label: '结算价',
        align: 'right',
        showOverflowTooltip: true,
        minWidth: 100,
        formatter: function (row) {
            return row.Supply_Price.toFixed(row.price_bl);
        }
    },
    {
        prop: 'Def_Qty',
        label: '库存定数包数',
        align: 'center',
        showOverflowTooltip: true,
        minWidth: 150
    },
    {
        prop: 'Def_Qty',
        label: '库存定数包数转散',
        align: 'center',
        showOverflowTooltip: true,
        minWidth: 200,
        formatter: function (row) {
            return row.Def_Qty * row.Coefficient;
        }
    },
    {
        prop: 'Storaged_Days',
        label: '在库天数',
        align: 'center',
        showOverflowTooltip: true,
        minWidth: 120
    },
    {
        prop: 'Def_Down_Shelf_Qty',
        label: '定数包未上架',
        align: 'center',
        showOverflowTooltip: true,
        minWidth: 140
    },
    {
        prop: 'Goods_Down_Shelf_Qty',
        label: '散货未上架',
        align: 'center',
        showOverflowTooltip: true,
        minWidth: 140
    },
    {
        prop: 'Goods_Look_Qty',
        label: '散货锁定',
        align: 'center',
        showOverflowTooltip: true,
        minWidth: 120
    },
    {
        prop: 'Def_Locking_Qty',
        label: '定数包锁定',
        align: 'center',
        showOverflowTooltip: true,
        minWidth: 120
    },
    {
        prop: 'Pre_Lock_Sum',
        label: '定数包预锁',
        align: 'center',
        showOverflowTooltip: true,
        minWidth: 120
    },
    {
        prop: 'APPROVAL_NUMBER',
        label: '批准文号',
        align: 'center',
        showOverflowTooltip: true,
        minWidth: 120
    },
    {
        prop: 'MEDICAL_CODE',
        label: '医保码',
        align: 'center',
        showOverflowTooltip: true,
        minWidth: 160
    },
    {
        prop: 'Position',
        label: '货位号',
        align: 'center',
        showOverflowTooltip: true,
        minWidth: 100
    },
    {
        prop: 'CONTRACT_NAME',
        label: '合同名称',
        align: 'center',
        showOverflowTooltip: true,
        minWidth: 120
    },
    {
        prop: 'CONTRACT_CODE',
        label: '合同编码',
        align: 'center',
        showOverflowTooltip: true,
        minWidth: 120
    },
    {
        prop: 'CONTRACT_END_TIME',
        label: '合同到期',
        align: 'center',
        showOverflowTooltip: true,
        minWidth: 140,
        formatter: function (row) {
            var bvp_date = row.CONTRACT_END_TIME.substr(0, 10);
            var this_date = new Date(bvp_date).getTime();
            var nowDate = new Date().getTime();
            if (this_date <= nowDate) {
              return  row.CONTRACT_END_TIME.substr(0, 10);
                //return '<span style="color:red">' + row.CONTRACT_END_TIME.substr(0, 10) + '</span>';
            } else {
                return row.CONTRACT_END_TIME.substr(0, 10) + "|" + parseInt(((this_date - nowDate) / (60 * 60 * 24 * 1000)).toFixed(0)) + "天";
            }
        }
    },
    {
        prop: 'DET_CONTRACT_END',
        label: '合同明细到期',
        align: 'center',
        showOverflowTooltip: true,
        minWidth: 140,
        formatter: function (row) {
            var bvp_date = row.DET_CONTRACT_END.substr(0, 10);
            var this_date = new Date(bvp_date).getTime();
            var nowDate = new Date().getTime();
            if (this_date <= nowDate) {
                return '<span style="color:red">' + row.DET_CONTRACT_END.substr(0, 10) + '</span>';
            } else {
                return row.DET_CONTRACT_END.substr(0, 10) + "|" + parseInt(((this_date - nowDate) / (60 * 60 * 24 * 1000)).toFixed(0)) + "天";
            }
        }
    },
    {
        prop: 'INVOICES',
        label: '发票',
        align: 'center',
        showOverflowTooltip: true,
        minWidth: 90,
    },
    {
        prop: 'TYPE',
        label: '库别',
        align: 'center',
        showOverflowTooltip: true,
        minWidth: 100,
        formatter: function (row) {
            if (row.TYPE === "1" || row.TYPE === null) {
                return "普通库";
            }
            if (row.TYPE === "2") {
                return "缓存库";
            }
            return "未知";
        }
    },
    {
        prop: 'NOTE_DESCRIPTION',
        label: '备注',
        align: 'center',
        showOverflowTooltip: true,
        minWidth: 110
    },
    {
        prop: 'NO_CONSUME_NUM',
        label: '科室未结算',
        align: 'center',
        showOverflowTooltip: true,
        minWidth: 130,
        formatter: function (row) {
            if (row.NO_CONSUME_NUM === null) {
                return 0;
            } else {
                return row.NO_CONSUME_NUM;
            }
        }
    },
    {
        prop: 'AVG7',
        label: '周日均用量',
        align: 'center',
        showOverflowTooltip: true,
        minWidth: 130
    },
    {
        prop: 'AVG30',
        label: '月日均用量',
        align: 'center',
        showOverflowTooltip: true,
        minWidth: 130
    },
    {
        prop: 'Batch_Id',
        label: '批次号ID',
        align: 'center',
        showOverflowTooltip: true,
        minWidth: 140
    },
    {
        prop: 'MGMT_CAT_NAME',
        label: '管理类别',
        align: 'center',
        showOverflowTooltip: true,
        minWidth: 120
    },
    {
        prop: 'DELIVERY_NOTE_NUMBER',
        label: 'SPD入库单号',
        align: 'center',
        showOverflowTooltip: true,
        minWidth: 160
    },
    {
        prop: 'DETAIL_CREATE_TYPE',
        label: '是否跟台',
        align: 'center',
        showOverflowTooltip: true,
        minWidth: 120,
        formatter: function (row) {
            if (row.DETAIL_CREATE_TYPE === 1) {
                return "是";
            } else {
                return "否";
            }
        }
    },
    {
        prop: 'DELIVERY_TIME',
        label: '入库时间',
        align: 'center',
        showOverflowTooltip: true,
        minWidth: 120
    },
    {
        prop: 'Varietie_Code',
        label: '',
        align: 'center',
        showOverflowTooltip: true,
        show: false
    },
    {
        prop: 'Source_From',
        label: '',
        align: 'center',
        showOverflowTooltip: true,
        show: false
    },
    {
        prop: 'Batch_Id',
        label: '',
        align: 'center',
        showOverflowTooltip: true,
        show: false
    },
    {
        prop: 'Up_Shelf_State',
        label: '',
        align: 'center',
        showOverflowTooltip: true,
        show: false
    },
    {
        prop: 'Storage_Id',
        label: '',
        align: 'center',
        showOverflowTooltip: true,
        show: false
    }
        
      ],
      columns2: [
        {
          columnKey: 'selection',
          type: 'selection',
          width: 45,
          align: 'center',
          fixed: 'left'
        },
        {
          prop: 'Source_Name',
          label: '库房位置',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 120
        },
        {
          prop: 'Up_Shelf_State',
          label: '所属区域',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 120,
          formatter: function (row) {
            if (row.Up_Shelf_State === 1) {
              return '合格区';
            } else if (row.Up_Shelf_State === 6) {
              return '隔离区';
            } else if (row.Up_Shelf_State === 7) {
              return '不合格区';
            } else if (row.Up_Shelf_State === 9) {
              return '应急库';
            } else if (row.Up_Shelf_State === 0) {
              return row.Source_Name;
            } else if (row.Up_Shelf_State === 2) {
              return "锁定";
            } else {
              return row.Up_Shelf_State;
            }
          }
        },
        {
          prop: 'Varietie_Code_New',
          label: '品种编码',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 120
        },
        {
          prop: 'Varietie_Name',
          label: '品种全称',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 192
        },
        {
          prop: 'Specification_Or_Type',
          label: '型号/规格',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 120
        },
        {
          prop: 'Unit',
          label: '单位',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 60
        },
        {
          prop: 'Manufacturing_Ent_Name',
          label: '生产企业名称',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 180
        },
        {
          prop: 'Supplier_Name',
          label: '供应商',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 208
        },
        {
          prop: 'Batch',
          label: '生产批号',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 100
        },
        {
          prop: 'Batch_Production_Date',
          label: '生产日期',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 120,
          formatter: function (row) {
            return row.Batch_Production_Date.substr(0, 10);
          }
        },
        {
          prop: 'Batch_Validity_Period',
          label: '有效到期',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 120,
          formatter: function (row) {
            var bvp_date = row.Batch_Validity_Period.substr(0, 10);
            var this_date = new Date(bvp_date).getTime();
            var nowDate = new Date().getTime();
            if (row.Source_Name.search("检验科") !== -1) {
              //  小于15天
              if ((this_date - 1296000000) <= nowDate) {
                return row.Batch_Validity_Period.substr(0, 10) + "<i class='invNew_Red'></i>";
              }
              //小于30天2592000000
              if ((this_date - 2592000000) <= nowDate) {
                return row.Batch_Validity_Period.substr(0, 10) + "<i class='invNew_yellow'></i>";
              }
            }
            if ((this_date - 1296000000) < nowDate) {
              return row.Batch_Validity_Period.substr(0, 10) + "<i class='invNew_yellow'></i>";
            } else {
              return row.Batch_Validity_Period.substr(0, 10);
            }
          }
        },
        {
          prop: 'Coefficient',
          label: '系数',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 60
        },
        {
          prop: 'Def_No_Pkg_Code',
          label: '定数码',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 120,
        },
        {
          prop: 'STOCK_OUT_DISTRIBUTE_NUMBER',
          label: '出库单号',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 120,
        },
        {
          prop: 'Position',
          label: '货位号',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 100
        },
        {
          prop: 'Storaged_Days',
          label: '在库天数',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 120,
        },
        {
          prop: 'Brand',
          label: '品牌',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 85
        },
        {
          prop: 'USE_DEF_NO_PKG_CODE',
          label: '是否结算',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 120,
          formatter: function (row) {
            if (row.USE_DEF_NO_PKG_CODE === row.Def_No_Pkg_Code) {
              return "已结算";
            } else {
              return "未结算";
            }
          }
        },
        {
          prop: 'Storage_Id',
          label: '',
          align: 'center',
          showOverflowTooltip: true,
          hidden: true
        }
      ],
      toolbar: false,
      pageSize: 10,
      pageSizes: [10, 20, 50, 100, 9999999],
      pagerCount: 5,
      // 表格选中数据
      selection: [],
      // 当前编辑数据
      current: null,
      // 是否显示编辑弹窗
      showEdit: false,
      // 是否显示导入弹窗
      showImport: false,
      // datasource: [],
      data: []
    };
  },
  methods: {
    /* 表格数据源 */
    async datasource({ page, limit, where, order }) {
      try {
        const w = where || this.mainWhere;
        this.mainWhere = w;
        const res = await GetPDAList({ page, limit, where: w, order });
        this.mainSum = res.sum ?? 0;
        this.mainAmountSum = res.amountSum ?? 0;
        return {
          count: res.total ?? 0,
          list: res.result || []
        };
      } catch (error) {
        this.$message.error(error.message || '获取表格数据源失败，请稍后重试');
        return { count: 0, list: [] };
      }
    },
    async datasource2({ page, limit, order }) {
      if (!this.batchId && !this.varietieCode) {
        return { count: 0, list: [] };
      }
      try {
        const where = {
          sourceFrom: this.sourceFrom,
          batchId: this.batchId,
          varietieCode: this.varietieCode,
          batch: this.batch,
          coefficient: this.coefficient,
          currUpShelfState: this.currUpShelfState,
          storageId: this.storageId,
          condition: this.detailCondition
        };
        const res = await GetPDAList2({ page, limit, where, order });
        return {
          count: res.total ?? 0,
          list: res.result || []
        };
      } catch (error) {
        this.$message.error(error.message || '获取表格2数据源失败，请稍后重试');
        return { count: 0, list: [] };
      }
    },
    handleRowClick(row) {
      this.sourceFrom= row.Source_From;
      this.batchId = row.Batch_Id;
      this.varietieCode = row.Varietie_Code;
      this.batch = row.Batch;
      this.coefficient = row.Coefficient;
      this.currUpShelfState = row.Up_Shelf_State;
      this.storageId = row.Storage_Id;
      this.reload2();
    
    },
    /* 刷新表格 */
    reload(where) {
      this.mainWhere = where || this.mainWhere;
      this.$refs.table.reload({ page: 1, where: this.mainWhere });
    },
    onDetailSearch(payload) {
      this.detailCondition = payload?.condition ?? '';
      this.reload2();
    },
    reload2() {
      this.$refs.table2.reload({ page: 1 });
    },
    /* 打开编辑弹窗 */
    openEdit(row) {
      this.current = row;
      this.showEdit = true;
    },
    /* 打开导入弹窗 */
    openImport() {
      this.showImport = true;
    },
    schedulePaneHeight() {
      if (this._paneTimer) cancelAnimationFrame(this._paneTimer);
      this._paneTimer = requestAnimationFrame(() => this.updatePaneHeights(false));
    },
    updatePaneHeights(followUp) {
      const main = measureTableHeight(this.$refs.mainPane);
      const detail = measureTableHeight(this.$refs.detailPane);
      const changed = (main != null && main !== this.mainTableHeight) || (detail != null && detail !== this.detailTableHeight);
      if (main != null) this.mainTableHeight = main;
      if (detail != null) this.detailTableHeight = detail;
      if (!changed) return;
      this.$nextTick(() => {
        ['table', 'table2'].forEach((name) => {
          const vm = this.$refs[name];
          if (vm && typeof vm.doLayout === 'function') vm.doLayout();
        });
        if (!followUp) this.updatePaneHeights(true);
      });
    },
    async exportData(data) {
      const loading = this.$loading({ lock: true, text: '正在导出数据...' });
      try {
        const res = await GetPDAListAll(data);
        if (res.auditRequired) {
          this.$message.warning('导出需审计审批，请使用库存查询完整版页面申请导出');
          return;
        }
        const rows = buildDefaultExportRows(res.result);
        writeFile(
          { SheetNames: ['库存查询'], Sheets: { 库存查询: utils.aoa_to_sheet(rows) } },
          '库存查询.xlsx'
        );
        this.$message.success('导出成功');
      } catch (error) {
        this.$message.error(error.message || '导出数据失败，请稍后重试');
      } finally {
        loading.close();
      }
    }
  },
  created() {
    
  },
  mounted() {
    this.schedulePaneHeight();
    if (typeof ResizeObserver !== 'undefined') {
      this._paneRo = new ResizeObserver(() => this.schedulePaneHeight());
      if (this.$refs.mainPane) this._paneRo.observe(this.$refs.mainPane);
      if (this.$refs.detailPane) this._paneRo.observe(this.$refs.detailPane);
    }
    window.addEventListener('resize', this.schedulePaneHeight);
    this._fullscreenObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        const el = mutation.target;
        if (!el || !el.classList || !el.classList.contains('ele-pro-table')) {
          return;
        }
        if (!this.$el.contains(el) && el.parentNode !== document.body) {
          return;
        }
        if (el.parentNode === document.body && !(el._spdMarker && this.$el.contains(el._spdMarker))) {
          return;
        }
        const opened = el.classList.contains('ele-pro-table-fullscreen');
        if (opened && el.parentNode !== document.body) {
          const marker = document.createComment('spd-table-fullscreen');
          el.parentNode.insertBefore(marker, el);
          el._spdMarker = marker;
          document.body.appendChild(el);
          this.$nextTick(() => {
            if (el.__vue__ && typeof el.__vue__.doLayout === 'function') {
              el.__vue__.doLayout();
            }
          });
        } else if (!opened && el._spdMarker && el._spdMarker.parentNode) {
          el._spdMarker.parentNode.insertBefore(el, el._spdMarker);
          el._spdMarker.parentNode.removeChild(el._spdMarker);
          el._spdMarker = null;
          this.$nextTick(() => {
            if (el.__vue__ && typeof el.__vue__.doLayout === 'function') {
              el.__vue__.doLayout();
            }
            this.schedulePaneHeight();
          });
        }
      });
    });
    this._fullscreenObserver.observe(document.body, {
      attributes: true,
      subtree: true,
      attributeFilter: ['class']
    });
  },
  beforeDestroy() {
    if (this._paneRo) this._paneRo.disconnect();
    window.removeEventListener('resize', this.schedulePaneHeight);
    if (this._paneTimer) cancelAnimationFrame(this._paneTimer);
    if (this._fullscreenObserver) this._fullscreenObserver.disconnect();
    document.querySelectorAll('body > .ele-pro-table').forEach((el) => {
      if (el._spdMarker && this.$el.contains(el._spdMarker)) {
        el._spdMarker.parentNode.insertBefore(el, el._spdMarker);
        el._spdMarker.parentNode.removeChild(el._spdMarker);
        el._spdMarker = null;
      }
    });
  }
};
</script>

<style scoped lang="scss">
.inventory-query-jyk {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 100%;
  height: 100%;
  max-height: 100%;
  overflow: hidden;
  box-sizing: border-box;
  background: #fff;
}

.inventory-query-jyk__pane {
  display: flex;
  flex: 1 1 0;
  flex-direction: column;
  width: 100%;
  height: 50%;
  max-height: 50%;
  min-width: 0;
  min-height: 0;
  overflow: hidden;
}

.inventory-query-jyk__pane + .inventory-query-jyk__pane {
  border-top: 1px solid #ebeef5;
}

:deep(.ele-pro-table) {
  width: 100%;
  min-width: 0;
  max-width: 100%;
}

:deep(.ele-table-tool) {
  flex-wrap: nowrap;
  align-items: flex-start;
  max-width: 100%;
  margin-bottom: 0;
}

:deep(.ele-table-tool-title),
:deep(.ele-table-tool-title-content) {
  flex: 1 1 auto;
  align-items: flex-start;
  min-width: 0;
  margin: 0;
}

:deep(.ele-table-tool-title-label) {
  flex: none;
  margin-right: 8px;
}

:deep(.ele-table-tool-title-label h6) {
  margin: 0;
  font-size: 13px;
  font-weight: 600;
  line-height: 28px;
  color: #303133;
}

:deep(.ele-tool) {
  flex: none;
  margin: 2px 0 0 6px;
}

:deep(.inventory-jyk-search) {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  width: 100%;
}

:deep(.inventory-jyk-search .el-form-item) {
  display: inline-flex;
  flex: none;
  width: auto;
  margin: 0 8px 2px 0;
}

:deep(.inventory-jyk-search .el-form-item__label),
:deep(.inventory-jyk-search .el-form-item__content) {
  line-height: 28px;
}

:deep(.el-table th.el-table__cell),
:deep(.el-table td.el-table__cell) {
  padding: 1px 0;
}

:deep(.el-table .cell) {
  line-height: 18px;
  padding-left: 6px;
  padding-right: 6px;
}

:deep(.ele-pro-table .el-pagination) {
  margin: 0;
  padding: 2px 0 0;
  font-size: 12px;
  font-weight: normal;
  line-height: 22px;
  white-space: nowrap;
}

:deep(.ele-pro-table .el-pagination > *) {
  margin-top: 0 !important;
  margin-bottom: 0 !important;
}

:deep(.el-pagination button),
:deep(.el-pagination span:not([class*='suffix'])),
:deep(.el-pagination .el-pager li) {
  height: 22px;
  min-width: 22px;
  line-height: 22px;
  font-size: 12px;
}

:deep(.el-pagination .el-input__inner) {
  height: 22px;
  line-height: 22px;
}

:deep(.el-pagination .el-select .el-input) {
  width: 88px;
  margin: 0 4px;
}
</style>

<style lang="scss">
body > .ele-pro-table.ele-pro-table-fullscreen {
  position: fixed !important;
  z-index: 4000 !important;
  top: 0 !important;
  right: 0 !important;
  bottom: 0 !important;
  left: 0 !important;
  width: 100vw !important;
  height: 100vh !important;
  max-width: none !important;
  margin: 0 !important;
  padding: 12px 12px 8px !important;
  overflow: hidden !important;
  background: #fff !important;
  box-sizing: border-box !important;
}
</style>