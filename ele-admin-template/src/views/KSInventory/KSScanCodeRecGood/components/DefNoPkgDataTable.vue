<template>
  <div class="ele-body">
    <!-- 数据表格 -->

    <ele-pro-table ref="table" v-if="IsRefDefNoPkgDataTable==false" height="67vh" highlight-current-row :stripe="true" :rowClickChecked="true" :pageSize="pageSize" :pageSizes="pageSizes" :columns="columns" :datasource="datasource" :selection.sync="selection" cache-key="DefNoPkgDataTable">
      <template v-slot:KC_COUNT="{ row }">
        <el-tag v-if="row.KC_COUNT>0" type="success">在库</el-tag>
        <el-tag v-else type="info">已消耗</el-tag>
      </template>
    </ele-pro-table>

    <ele-pro-table ref="table2" v-else height="67vh" highlight-current-row :stripe="true" :rowClickChecked="true" :pageSize="pageSize" :pageSizes="pageSizes" :columns="columns" :datasource="datasource2" :selection.sync="selection" cache-key="DefNoPkgDataTable">
      <template v-slot:KC_COUNT="{ row }">
        <el-tag v-if="row.KC_COUNT>0" type="success">在库</el-tag>
        <el-tag v-else type="info">已消耗</el-tag>
      </template>
    </ele-pro-table>

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

  </div>
</template>

<script>
import DefNoPkgDataSearch from './DefNoPkgDataSearch.vue';
import {
  GetDistributeDefDetailNum,
  GetDistributeDefDetail
} from '@/api/KSInventory/KSScanCodeRecGood';
export default {
  name: 'DefNoPkgDataTable',
  props: ['ReplenishGoodData', 'DefNoPkgDataData'],
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
          prop: 'batch',
          label: '生产批号',

          align: 'center',
          showOverflowTooltip: true,
          minWidth: 110
        },
        {
          prop: 'Coefficient',
          label: '系数',

          align: 'center',
          showOverflowTooltip: true,
          minWidth: 70
        },
        {
          prop: 'def_no_pkg_code',
          label: '定数码',

          align: 'center',
          showOverflowTooltip: true,
          minWidth: 150
        },
        // {
        //   prop: 'pack_time',
        //   label: '拣配时间',

        //   align: 'center',
        //   showOverflowTooltip: true,
        //   minWidth: 120,
        //   formatter(row, column, cellValue) {
        //     return cellValue ? cellValue.replace('T', ' ') : '';
        //   }
        // },
        // {
        //   prop: 'packer',
        //   label: '拣配人',

        //   align: 'center',
        //   showOverflowTooltip: true,
        //   minWidth: 80
        // },
        // {
        //   prop: 'PositionNum',
        //   label: '货位号',

        //   align: 'center',
        //   showOverflowTooltip: true,
        //   minWidth: 120
        // },
        {
          // prop: 'KC_COUNT',
          slot: 'KC_COUNT',
          label: '库存状态',

          align: 'center',
          showOverflowTooltip: true,
          minWidth: 120
        },
        {
          prop: 'Supplier_Name',
          label: '供应商名称',

          align: 'center',
          showOverflowTooltip: true,
          minWidth: 220
        }
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
      data: [],
      IsRefDefNoPkgDataTable: false
    };
  },
  methods: {
    /* 表格数据源 */
    datasource({ page, limit, where, order }) {
      let data = GetDistributeDefDetailNum({ page, limit, where, order }).then(
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
    datasource2({ page, limit, where, order }) {
      var where2 = {
        page: 1,
        limit: this.pageSize,
        dept_two_var_distribute_dtl_id: this.DefNoPkgDataData.ID
      };
      let data = GetDistributeDefDetail({
        page,
        limit,
        where: where2,
        order
      }).then((res) => {
        var tData = {
          count: res.total,
          list: res.result
        };
        return tData;
      });
      return data;
    },
    /* 刷新表格 */
    reload(where) {
      // console.log(this.ReplenishGoodData);
      // console.log(this.$store.state.user.info);
      this.$refs.table.reload({ page: 1, where: where });
    }
  },
  computed: {
    ApplyTempTableDataSearch() {
      return this.ReplenishGoodData;
    },
    DefNoPkgDataDataSearch() {
      return this.DefNoPkgDataData;
    }
  },
  watch: {
    ApplyTempTableDataSearch() {
      this.IsRefDefNoPkgDataTable =
        this.ReplenishGoodData.IsRefDefNoPkgDataTable;

      // console.log(this.ReplenishGoodData);
      // console.log(this.IsRefDefNoPkgDataTable);

      var where = {
        stock_out_distribute_number:
          this.ReplenishGoodData.stock_out_distribute_number
      };
      if (this.IsRefDefNoPkgDataTable == false) {
        this.$refs.table.reload({ page: 1, where: where });
      }
    },
    DefNoPkgDataDataSearch() {
      this.IsRefDefNoPkgDataTable =
        this.DefNoPkgDataData.IsRefDefNoPkgDataTable;
      var where2 = {
        page: 1,
        limit: this.pageSize,
        dept_two_var_distribute_dtl_id: this.DefNoPkgDataData.ID
      };

      // console.log(this.ReplenishGoodData);
      // console.log(this.IsRefDefNoPkgDataTable);
      if (this.IsRefDefNoPkgDataTable == true) {
        this.$refs.table2.reload({ page: 1, where: where2 });
      }
      // var tData = [];
      // var where = {
      //   page: 1,
      //   limit: this.pageSize,
      //   dept_two_var_distribute_dtl_id: this.DefNoPkgDataData.ID
      // };
      // let data = GetDistributeDefDetail({ where: where }).then((res) => {
      //   tData = {
      //     count: res.total,
      //     list: res.result
      //   };
      //   console.log(tData.list);
      //   this.$refs.table.setData(tData.list);
      //   return tData;
      // });
    }
  },
  created() {
    // this.getdatasource();
  }
};
</script>
