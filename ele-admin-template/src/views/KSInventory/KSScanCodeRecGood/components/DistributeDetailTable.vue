<template>
  <div class="ele-body">
    <!-- 数据表格 -->
    <ele-pro-table ref="table" height="67vh" highlight-current-row :stripe="true" :rowClickChecked="true" @current-change="onCurrentChange" :pageSize="pageSize" :pageSizes="pageSizes" :columns="columns" :datasource="datasource" :selection.sync="selection" cache-key="DefNoPkgDataTable">
      <!-- 表头工具栏 -->
      <!-- 右表头 -->
      <!-- <template v-slot:toolkit>
        <el-button size="small" type="danger" icon="el-icon-delete" class="ele-btn-icon" @click="removebatch">
          删除
        </el-button>
      </template> -->
      <!-- 左表头 -->
      <!-- <template v-slot:toolbar>
        <ApplyTempDataSearch @search="reload" :ApplyTempTableDataSearch='ApplyTempTableDataSearch' :selection="selection" @showEditReoad="showEditReoad" />
      </template> -->

      <!-- 操作列 -->
      <!-- <template v-slot:TempletQty="{ row }">
        <el-input-number v-model="row.TempletQty" :min="0" :max="9999" :step="1" size="mini" />
      </template> -->

    </ele-pro-table>
  </div>
</template>

<script>
import DefNoPkgDataSearch from './DefNoPkgDataSearch.vue';
import { GetDistributeDetail } from '@/api/KSInventory/KSScanCodeRecGood';
export default {
  name: 'DefNoPkgDataTable',
  props: ['ReplenishGoodData'],
  components: {
    DefNoPkgDataSearch
  },
  data() {
    return {
      // 表格列配置
      columns: [
        // {
        //   columnKey: 'selection',
        //   type: 'selection',
        //   width: 45,
        //   align: 'center',
        //   fixed: 'left'
        // },
        {
          columnKey: 'index',
          type: 'index',
          width: 45,
          align: 'center',
          showOverflowTooltip: true,
          fixed: 'left'
        },
        // {
        //   columnKey: 'action',
        //   label: '操作',
        //   width: 80,
        //   align: 'center',
        //   resizable: false,
        //   slot: 'action',
        //   showOverflowTooltip: true,
        //   fixed: 'left'
        // },
        {
          prop: 'Varietie_Code',
          label: '品种编码',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 130
        },
        {
          prop: 'Varietie_Name',
          label: '品种名称',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 200
        },
        {
          prop: 'Specification_Or_Type',
          label: '规格型号',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 200
        },
        {
          prop: 'Manufacturing_Ent_Name',
          label: '厂家',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 220
        },
        {
          prop: 'APPROVAL_NUMBER',
          label: '注册证号',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 180
        },
        {
          prop: 'Unit',
          label: '单位',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 80
        },
        {
          prop: 'PRICE',
          label: '价格',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 80
        },
         {
          prop: 'KC_COUNT',
          label: '库存数量',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 80
        },
         {
          prop: 'replenish_quantity',
          label: '收货数量',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 80
        },
      ],
      toolbar: false,
      pageSize: 20,
      pagerCount: 2,
      pageSizes: [10, 20, 50, 100, 9999999],
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
    datasource({ page, limit, where, order }) {
      let data = GetDistributeDetail({ page, limit, where, order }).then(
        (res) => {
          var tData = {
            count: res.total,
            list: res.result
          };
          return tData;
        }
      );
      return data;
    },
    /* 刷新表格 */
    reload(where) {
      // console.log(this.ReplenishGoodData);
      // console.log(this.$store.state.user.info);
      this.$refs.table.reload({ page: 1, where: where });
    },
    onCurrentChange(current) {
      // console.log(current);
      var current2 = current;
      current2.IsRefDefNoPkgDataTable = true;
      this.$emit('getVarCurrent', current2);
    }
  },
  computed: {
    ApplyTempTableDataSearch() {
      return this.ReplenishGoodData;
    }
  },
  watch: {
    ApplyTempTableDataSearch() {
      var where = {
        stock_out_distribute_number:
          this.ReplenishGoodData.stock_out_distribute_number
      };
      this.$refs.table.reload({ page: 1, where: where });
    }
  },
  created() {
    // this.getdatasource();
  }
};
</script>
