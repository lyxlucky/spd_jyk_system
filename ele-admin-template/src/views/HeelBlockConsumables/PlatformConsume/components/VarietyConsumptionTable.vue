<template>
  <div class="ele-body">
    <!-- <AdvanceReceiptNumberSearch @search="reload" :rowData="current" /> -->
    <!-- 数据表格 -->
    <ele-pro-table
      height="300"
      highlight-current-row
      :rowClickCheckedIntelligent="false"
      @current-change="onCurrentChange"
      ref="table"
      :rowClickChecked="true"
      :stripe="false"
      :pageSize="pageSize"
      :pageSizes="pageSizes"
      :columns="columns"
      :datasource="datasource"
      :selection.sync="selection"
      cache-key="VarietyConsumptionTableCacheKey"
    >
      <!-- 表头工具栏 -->
      <template v-slot:toolbar>
        <el-button
          size="mini"
          type="primary"
          class="ele-btn-icon"
          :disabled="!isOperationEnable"
          @click="SubmitConsumeVarietiesFun"
          >提交</el-button
        >
        <el-popconfirm class="ele-action" title="确定删除？" @confirm="remove">
          <template v-slot:reference>
            <el-button
              size="mini"
              :disabled="!isOperationEnable"
              type="danger"
              class="ele-btn-icon"
              >删除</el-button
            >
          </template>
        </el-popconfirm>
      </template>

      <template v-slot:CommonState="{ row }">
        <el-tag v-if="row.CommonState == 0" type="success">新增</el-tag>
        <el-tag v-if="row.CommonState == 1">已提交</el-tag>
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
</style>

<script>
  import AdvanceReceiptNumberSearch from './AdvanceReceiptNumberSearch.vue';
  import { HOME_HP } from '@/config/setting';
  import {
    LoadDeliveryConsumedVarietie,
    RemoveVarieties,
    SubmitConsumeVarieties
  } from '@/api/HeelBlockConsumables/PlatformConsume';
  export default {
    name: 'ApplyTempTable',
    props: ['ApplyTempTableData'],
    components: {
      AdvanceReceiptNumberSearch
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
            prop: 'Varietie_Code',
            label: '品种(材料)编码',
            // sortable: 'custom',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 110
          },
          {
            prop: 'Varietie_Name',
            label: '品种全称',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 150
          },
          {
            prop: 'APPROVAL_NUMBER',
            label: '注册证号',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 70
          },
          {
            prop: 'PROD_REGISTRATION_NAME',
            label: '注册证名称',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 180
          },
          {
            prop: 'Specification_Or_Type',
            label: '型号/规格',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 180
          },
          {
            prop: 'Manufacturing_Ent_Name',
            label: '生产企业名称',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 180
          },
          {
            prop: 'Unit',
            label: '单位',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 60
          },
          {
            prop: 'Consume_Count',
            label: '消耗数量',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 180
          },
          {
            prop: 'SN_Count',
            label: '已关联UDI数量',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 80
          },
          {
            prop: 'Dept_Two_Name',
            label: '注册证号',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 180
          },
          {
            prop: 'Batch',
            label: '生产批号',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 180
          },
          {
            prop: 'Batch_Production_Date',
            label: '生产日期',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 180,
            formatter(row, column, cellValue) {
              return cellValue.substr(0, 10);
            }
          },
          {
            prop: 'Batch_Validity_Period',
            label: '失效日期',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 180,
            formatter(row, column, cellValue) {
              return cellValue.substr(0, 10);
            }
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
      datasource({ page, limit, where, order }) {
        where.supplierId = 0;
        where.deliveryNumber = this.ApplyTempTableData.Delivery_Note_Number;
        let data = LoadDeliveryConsumedVarietie({
          page,
          limit,
          where,
          order
        }).then((res) => {
          var tData = {
            count: res.total,
            list: res.result
          };
          this.$bus.$emit('LoadDeliveryConsumedVarietie', tData);
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
        this.$emit('getVarietyCurrent', current);
      },

      /* 删除数据 */
      remove() {
        // const loading = this.$loading({ lock: true });
        const loading = this.$messageLoading('删除中...');
        var json = [];

        this.selection.forEach((item) => {
          json.push(item.Id);
        });
        RemoveVarieties(json)
          .then((res) => {
            this.$message.success(res.msg);
            loading.close();
            this.reload();
          })
          .catch((err) => {
            loading.close();
            this.$message.error(err);
          });
      },

      tableRowClassName({ row, rowIndex }) {
        if (row.CommonState == 1) {
          return 'success-row';
        } else {
          return '';
        }
      },
      SubmitConsumeVarietiesFun() {
        if (this.ApplyTempTableData == undefined) {
          this.$message.warning('请选择一条数据!');
          return;
        }

        this.$confirm(
          `确定提交收货单号${this.ApplyTempTableData.Delivery_Note_Number}吗?`,
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        )
          .then(() => {
            let loading = this.$messageLoading('提交中...');
            var data = {
              id: this.ApplyTempTableData.Delivery_Note_Number_Id,
              staff: this.$store.state.user.info.Nickname
            };

            SubmitConsumeVarieties(data)
              .then((res) => {
                loading.close();
                if (res.code == 200) {
                  this.$message.success(res.msg);
                } else {
                  this.$message.error(res.msg);
                }
              })
              .catch((err) => {
                loading.close();
                this.$message.error(err);
              })
              .finally(() => {
                this.$bus.$emit(
                  'handleSubmitConsumeVarietiesAndRefreshTopTable',
                  null
                );
                this.reload();
              });
          })
          .catch(() => {
            this.$message.info('已取消提交');
          });
      }
    },
    computed: {
      ApplyTempTableDataSearch() {
        return this.ApplyTempTableData;
      },
      isOperationEnable() {
        return 1 == Number(this.ApplyTempTableData?.Receive_Receipt_State);
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

      this.$bus.$on('AdVanceReceiptNumberDelTableReload', (data) => {
        this.reload();
      });
    },
    destroyed() {
      this.$bus.$off('handleCommand');
      this.$bus.$off('LoadDeliveryConsumedVarietie');
      this.$bus.$off('handleSubmitConsumeVarietiesAndRefreshTopTable');
    },
    created() {}
  };
</script>
