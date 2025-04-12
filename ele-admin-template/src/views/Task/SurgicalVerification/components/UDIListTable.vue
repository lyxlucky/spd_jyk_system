<template>
  <div class="ele-body">
    <!-- <AdvanceReceiptNumberSearch @search="reload" :rowData="current" /> -->
    <!-- 数据表格 -->
    <ele-pro-table
      height="300"
      highlight-current-row
      @current-change="onCurrentChange"
      :row-class-name="tableRowClassName"
      ref="table"
      :rowClickChecked="true"
      :stripe="false"
      :pageSize="pageSize"
      :pageSizes="pageSizes"
      :columns="columns"
      :needPage="true"
      :datasource="datasource"
      :selection.sync="selection"
      cache-key="UDIListTableCacheKey"
    >
      <!-- 表头工具栏 -->
      <template v-slot:toolbar>
        <el-button
          size="mini"
          @click="handleLinkUdi"
          type="primary"
          :disabled="isCanLinkUdi"
          class="ele-btn-icon"
          >管理或关联UDI码</el-button
        >
      </template>
    </ele-pro-table>
    <UdiLinkDetail @reload="reload" :UdiListTableDatasource="UdiListTableDatasource" :GrandParentTableCurrent="ApplyTempTableData" :visible.sync="UdiLinkDetailVisible"></UdiLinkDetail>
  </div>
</template>

<style>
  .el-table .warning-row {
    background: oldlace;
  }

  .el-table .success-row {
    background: #65bb37;
  }
</style>

<script>
  import UdiLinkDetail from './UdiLinkDetail.vue';
  import AdvanceReceiptNumberSearch from './AdvanceReceiptNumberSearch.vue';
  import { HOME_HP } from '@/config/setting';
  import { LoadVarietieGS1 } from '@/api/HeelBlockConsumables/PlatformConsume';
  export default {
    name: 'ApplyTempTable',
    props: ['ApplyTempTableData', 'mainTableData'],
    components: {
      AdvanceReceiptNumberSearch,
      UdiLinkDetail
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
            label: '序号',
            columnKey: 'index',
            type: 'index',
            width: 60,
            align: 'center',
            showOverflowTooltip: true,
            fixed: 'left'
          },
          {
            prop: 'Serial_Number',
            label: 'UDI码',
            // sortable: 'custom',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 110
          }
          // {
          //   columnKey: 'action',
          //   label: '操作',
          //   width: 150,
          //   align: 'center',
          //   resizable: false,
          //   slot: 'action',
          //   showOverflowTooltip: true
          //   //fixed: 'right'
          // }
        ],
        paginationStyle: {
          height: '18px',
          padding: '0px 0px 5px 0px',
          'margin-top': '-5px'
        },
        toolbar: false,
        pageSize: 100,
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
        UdiLinkDetailVisible: false,
        UdiListTableDatasource: []  
      };
    },
    methods: {
      /* 表格数据源 */
      datasource({ page, limit, where, order }) {
        where.id = this.ApplyTempTableData.Id;
        let data = LoadVarietieGS1({
          page,
          limit,
          where,
          order
        }).then((res) => {
          var tData = {
            count: res.total,
            list: res.result
          };
          this.UdiListTableDatasource = tData;
          return tData;
        });
        return data;
      },
      /* 刷新表格 */
      reload(where) {
        this.$refs.table.reload({ page: 1, where: where });
      },
      onDone(res) {
        // console.log('res:', res);
        // 例如选中第一条数据
        if (res.data?.length) {
          this.$refs.table.setCurrentRow(res.data[0]);
        }
      },
      onSelectionChange(selection) {
        this.selection = selection;
      },
      onCurrentChange(current) {
        this.current = current;
        this.$emit('getCurrent', current);
      },

      /* 删除数据 */
      tableRowClassName({ row, rowIndex }) {
        if (row.CommonState == 1) {
          return 'success-row';
        } else {
          return '';
        }
      },
      handleLinkUdi() {
        console.log(this?.ApplyTempTableData)
        if(this?.ApplyTempTableData.length == 0) return this.$message.warning('请先选择一条数据');
        this.UdiLinkDetailVisible = true;
      }
    },
    computed: {
      ApplyTempTableDataSearch() {
        return this.ApplyTempTableData;
      },
      isCanLinkUdi() {
        return (
          !(Number(this.mainTableData.Receive_Receipt_State) == 1) &&
          this.ApplyTempTableData.Id
        );
      }
      // pageSize(){
      //   return localStorage.getItem('SerachTempletDetaPageSize')?localStorage.getItem('SerachTempletDetaPageSize'):10
      // }
    },
    watch: {
      ApplyTempTableDataSearch() {
        var where = {
          deliveryNumber: this.ApplyTempTableData.Delivery_Note_Number
        };
        this.$refs.table.reload({ page: 1, where: where });
      }
    },
    mounted() {
      this.$bus.$on('handleCommand', (data) => {
        this.reload();
      });
    },
    destroyed() {
      this.$bus.$off('handleCommand');
    },
    created() {
      // this.getdatasource();
      // console.log(this.$store.state.user.info.DeptNow.Dept_Two_Code);
    }
  };
</script>
<style scoped>
</style>
