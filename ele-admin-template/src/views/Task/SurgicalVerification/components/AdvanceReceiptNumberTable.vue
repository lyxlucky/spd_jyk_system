<template>
  <div class="ele-body">
    <AdvanceReceiptNumberSearch
      @search="reload"
      @approve="handleApprove"
      @catDefNoPkgCode="handleCatDefNoPkgCode"
      :rowData="current"
      style="padding: 0px"
    />

    <AdvanceReceiptNumberEdit
      @search="reload"
      :visible.sync="showEdit"
      :rowData="current"
    />
    <!-- 数据表格 -->
    <ele-pro-table
      height="60vh"
      :paginationStyle="paginationStyle"
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
      cache-key="ApplyTempTable"
    >
      <!-- 表头工具栏 -->
      <template v-slot:toolbar>
        <!-- 搜索表单 -->
      </template>
    </ele-pro-table>
  </div>
</template>

<style>
  .el-table .warning-row {
    background: oldlace;
  }

  .el-table .success-row {
    background: #65bb37;
  }

  .el-card__body {
    padding: 0px;
  }
</style>

<script>
  import AdvanceReceiptNumberSearch from './AdvanceReceiptNumberSearch.vue';
  import AdvanceReceiptNumberEdit from './AdvanceReceiptNumberEdit.vue';
  import { getBdSzYyHisSs, BdSsApprove } from '@/api/Task/SurgicalVerification';
  import { HOME_HP,BACK_BASE_URL } from '@/config/setting';
  export default {
    name: 'ApplyTempTable',
    components: {
      AdvanceReceiptNumberSearch,
      AdvanceReceiptNumberEdit
    },
    data() {
      return {
        // 表格列配置
        columns: [
          {
            prop: 'MZZY',
            label: '类别',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 100,
            formatter: (_row, _column, cellValue) => {
              if (cellValue == '1') return '门诊';
              if (cellValue == '2') return '住院';
            }
          },
          {
            prop: 'SSBH',
            label: '手术编号',
            align: 'center',
            width: 120
          },
          {
            prop: 'SSTH',
            label: '手术台号',
            align: 'center',
            width: 120
          },
          {
            prop: 'ZYHM',
            label: '住院号',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 130
          },
          {
            prop: 'BRXM',
            label: '姓名',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 80
          },
          {
            prop: 'SSRQ',
            label: '手术时间',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 150
          },
          {
            prop: 'SSMC',
            label: '手术名称',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 120
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
        data: []
      };
    },
    methods: {
      /* 表格数据源 */
      async datasource({ page, limit, where, order }) {
        const res = await getBdSzYyHisSs({
          page,
          limit,
          where,
          order
        });
        return { list: res.data, count: res.total };
      },
      /* 刷新表格 */
      reload(where) {
        this.$refs.table.reload({ page: 1, where: where });
      },
      onCurrentChange(current) {
        this.current = current;
        this.$emit('getCurrent', current);
      },
      tableRowClassName({ row, rowIndex }) {
        if (row.CommonState == 1) {
          return 'success-row';
        } else {
          return '';
        }
      },
      handleApprove() {
        if (this.current == null) {
          return this.$message.warning('请先选择一条数据');
        }
        //return
        BdSsApprove({ qdid: this.current.SSBH })
          .then((res) => {
            this.$message.success(res.msg);
          })
          .catch((err) => {
            this.$message.error(err);
          })
          .finally(() => {
            this.reload();
          });
      },
      handleCatDefNoPkgCode() {
        if (this.current == null) {
          return this.$message.warning('请先选择一条数据');
        }
        window.open(`${BACK_BASE_URL}/api/Abdzczh/GetTagQdMx?id=67&format=pdf&inline=true&qdid=${this.current.SSBH}&Token=${sessionStorage.Token}`)
      },
    },
    mounted() {
      this.$bus.$on(
        'handleSubmitConsumeVarietiesAndRefreshTopTable',
        (data) => {
          this.reload();
        }
      );
      this.$bus.$on('handleCommand', (data) => {
        this.reload();
      });

      this.$bus.$on('AdVanceReceiptNumberDelTableReload', () => {
        this.reload();
      });
    },
    destroyed() {
      this.$bus.$off('handleCommand');
      this.$bus.$off('AdVanceReceiptNumberDelTableReload');
      this.$bus.$off('handleSubmitConsumeVarietiesAndRefreshTopTable');
    },
    created() {
      // this.getdatasource();
      // console.log(this.$store.state.user.info.DeptNow.Dept_Two_Code);
    }
  };
</script>
<style scoped>
</style>