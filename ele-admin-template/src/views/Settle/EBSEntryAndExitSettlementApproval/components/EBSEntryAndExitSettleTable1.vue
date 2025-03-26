<template>
  <div>
    <el-card shadow="never">
      <div slot="header" class="clearfix"> 主表数据列表 </div>
      <div>
        <el-form size="mini" :inline="true">
          <el-form-item label="" prop="LEDGER_NAME">
            <el-input
              v-model="form.LEDGER_NAME"
              placeholder="请输入账本名称"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item label="" prop="SPD_PUSH_MAN">
            <el-input
              v-model="form.SPD_PUSH_MAN"
              placeholder="请输入推送人"
              clearable
            ></el-input>
          </el-form-item>
          <!-- <el-form-item label="推送时间" prop="SPD_PUSH_TIME">
            <el-date-picker
              v-model="form.SPD_PUSH_TIME"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd"
              style="width: 240px"
            ></el-date-picker>
          </el-form-item> -->
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="search"
              >查询</el-button
            >
          </el-form-item>
          <el-form-item>
            <el-button
              size="mini"
              :disabled="!selectedRows.length"
              type="success"
              @click="handleApprove"
              >审批</el-button
            >
          </el-form-item>
        </el-form>
      </div>
      <div>
        <ele-pro-table
          ref="table"
          size="mini"
          height="550"
          :columns="columns"
          :datasource="datasource"
          @row-click="handleRowClick"
          :rowClickChecked="true"
          highlight-current-row
          :selection.sync="selectedRows"
          :row-class-name="tableRowClassName"
          @selection-change="handleSelectionChange"
        >
          <template v-slot:SP_STATE="{ row }">
            <div>
              <el-tag size="mini" type="success" v-if="row.SP_STATE == '1'"
                >已审核</el-tag
              >
              <el-tag size="mini" type="warning" v-else>未审核</el-tag>
            </div>
          </template>
        </ele-pro-table>
      </div>
    </el-card>
  </div>
</template>

<script>
  import {
    getSpdGlSpdTranBatchIface,
    Approval
  } from '@/api/Settle/EBSEntryAndExitSettlementApproval';
  import { formatDate } from '@/utils/formdataify';
  export default {
    name: 'EBSEntryAndExitSettleTable1',
    components: {},
    props: {},
    data() {
      return {
        selectedRows: [],
        currentTableItem1: {},
        form: {
          LEDGER_NAME: '',
          SPD_PUSH_MAN: '',
          SPD_PUSH_TIME: []
        },
        columns: [
          //   {
          //     prop: 'IFACE_BATCH_ID',
          //     label: '接口批次ID',
          //     width: 120,
          //     align: 'center',
          //     search: true,
          //     fieldProps: {
          //       placeholder: '请输入接口批次ID'
          //     }
          //   },
          {
            width: 45,
            type: 'selection',
            columnKey: 'selection',
            align: 'center',
            fixed: 'left'
          },
          {
            prop: 'BATCH_TYPE',
            label: '批次类型',
            width: 160,
            align: 'center',
            search: true,
            fieldProps: {
              placeholder: '请输入批次类型'
            }
          },
          {
            prop: 'DESCRIPTION',
            label: '描述',
            width: 200,
            align: 'center',
            showOverflowTooltip: true
          },
          {
            slot: 'SP_STATE',
            prop: 'SP_STATE',
            label: '审批状态',
            width: 70,
            align: 'center',
            formatter: (row) => {
              return row.SP_STATE == '1' ? '已审批' : '未审批';
            }
          },
          {
            prop: 'SP_TIME',
            label: '审批时间',
            width: 120,
            align: 'center',
            formatter: (row) => {
              if (row.SP_TIME) {
                return formatDate(row.SP_TIME, 'yyyy-mm-dd');
              }
              return '';
            }
          },
          {
            prop: 'SP_MAN',
            label: '审批人',
            width: 120,
            align: 'center'
          },
          {
            prop: 'LEDGER_NAME',
            label: '账本名称',
            width: 150,
            align: 'center'
          },
          {
            prop: 'SPD_PUSH_MAN',
            label: 'SPD推送人',
            width: 120,
            align: 'center'
          },
          {
            prop: 'SPD_PUSH_TIME',
            label: 'SPD推送时间',
            width: 150,
            align: 'center',
            formatter: (row) => {
              if (row.SPD_PUSH_TIME) {
                return formatDate(row.SPD_PUSH_TIME, 'yyyy-mm-dd');
              }
              return '';
            }
          },
          {
            prop: 'PROCESS_FLAG',
            label: '处理标志',
            width: 100,
            align: 'center',
            search: true,
            enum: [
              { label: '未处理', value: 'N' },
              { label: '已处理', value: 'Y' },
              { label: '处理错误', value: 'E' }
            ],
            formatter: (row) => {
              if (row.PROCESS_FLAG === 'N') return '未处理';
              if (row.PROCESS_FLAG === 'Y') return '已处理';
              if (row.PROCESS_FLAG === 'E') return '处理错误';
              return row.PROCESS_FLAG || '';
            },
            fieldProps: {
              clearable: true
            }
          },
          {
            prop: 'COM_CODE',
            label: '公司代码',
            width: 120,
            align: 'center',
            search: true,
            fieldProps: {
              placeholder: '请输入公司代码'
            }
          },
          {
            prop: 'SYNC_DATE',
            label: '同步日期',
            width: 150,
            align: 'center',
            formatter: (row) => {
              if (row.SYNC_DATE) {
                return formatDate(row.SYNC_DATE, 'yyyy-mm-dd');
              }
              return '';
            }
          },
          {
            prop: 'PROCESS_DATE',
            label: '处理日期',
            width: 150,
            align: 'center',
            formatter: (row) => {
              if (row.PROCESS_DATE) {
                return formatDate(row.PROCESS_DATE, 'yyyy-mm-dd');
              }
              return '';
            }
          },
          {
            prop: 'ERROR_MESSAGE',
            label: '错误信息',
            width: 200,
            align: 'center',
            showOverflowTooltip: true
          }

          //   {
          //     prop: 'ATTRIBUTE1',
          //     label: '属性1',
          //     width: 120,
          //     align: 'center',
          //     hide: true
          //   },
          //   {
          //     prop: 'ATTRIBUTE2',
          //     label: '属性2',
          //     width: 120,
          //     align: 'center',
          //     hide: true
          //   },
          //   {
          //     prop: 'ATTRIBUTE3',
          //     label: '属性3',
          //     width: 120,
          //     align: 'center',
          //     hide: true
          //   },
          //   {
          //     prop: 'ATTRIBUTE4',
          //     label: '属性4',
          //     width: 120,
          //     align: 'center',
          //     hide: true
          //   },
          //   {
          //     prop: 'ATTRIBUTE5',
          //     label: '属性5',
          //     width: 120,
          //     align: 'center',
          //     hide: true
          //   },
          //   {
          //     prop: 'ATTRIBUTE6',
          //     label: '属性6',
          //     width: 120,
          //     align: 'center',
          //     hide: true
          //   },
          //   {
          //     prop: 'ATTRIBUTE7',
          //     label: '属性7',
          //     width: 120,
          //     align: 'center',
          //     hide: true
          //   },
          //   {
          //     prop: 'ATTRIBUTE8',
          //     label: '属性8',
          //     width: 120,
          //     align: 'center',
          //     hide: true
          //   },
          //   {
          //     prop: 'ATTRIBUTE9',
          //     label: '属性9',
          //     width: 120,
          //     align: 'center',
          //     hide: true
          //   },
          //   {
          //     prop: 'ATTRIBUTE10',
          //     label: '属性10',
          //     width: 120,
          //     align: 'center',
          //     hide: true
          //   },
          //   {
          //     prop: 'ATTRIBUTE11',
          //     label: '属性11',
          //     width: 120,
          //     align: 'center',
          //     hide: true
          //   },
          //   {
          //     prop: 'ATTRIBUTE12',
          //     label: '属性12',
          //     width: 120,
          //     align: 'center',
          //     hide: true
          //   },
          //   {
          //     prop: 'ATTRIBUTE13',
          //     label: '属性13',
          //     width: 120,
          //     align: 'center',
          //     hide: true
          //   },
          //   {
          //     prop: 'ATTRIBUTE14',
          //     label: '属性14',
          //     width: 120,
          //     align: 'center',
          //     hide: true
          //   },
          //   {
          //     prop: 'ATTRIBUTE15',
          //     label: '属性15',
          //     width: 120,
          //     align: 'center',
          //     hide: true
          //   },

          //   {
          //     prop: 'operation',
          //     label: '操作',
          //     // fixed: 'right',
          //     width: 150,
          //     align: 'center'
          //   }
        ]
      };
    },
    computed: {},
    methods: {
      tableRowClassName({ row, rowIndex }) {
        if (row.SP_STATE == '1') {
          return 'green-row-bg';
        }
      },
      handleApprove(e) {
        if (this.selectedRows.length === 0) {
          this.$message.warning('请选择需要审批的数据');
          return;
        }
        let flag = true;
        this.selectedRows.forEach((item) => {
          if (item.SP_STATE != '1') {
            flag = false;
          }
        });
        if (flag) {
          this.$message.warning('选中的数据中全是已审批的数据，无法进行审批');
          return false;
        }
        const loading = this.$messageLoading('审批中....');
        let ids = [];
        this.selectedRows.forEach((item) => {
          ids.push(item.IFACE_BATCH_ID);
        });
        Approval({
          IFACE_BATCH_IDS: ids
        })
          .then((res) => {
            loading.close();
            this.$message.success('审批成功');
            this.search();
          })
          .catch((err) => {
            loading.close();
            this.$message.error('审批失败');
          });
      },
      handleSelectionChange(rows) {
        this.selectedRows = rows;
      },
      // 点击行
      handleRowClick(row) {
        this.currentTableItem1 = row;
        this.$emit('clickTableRow', row);
      },
      datasource({ page, limit, where, order }) {
        return getSpdGlSpdTranBatchIface({
          page,
          limit,
          where: this.form,
          order
        })
          .then((data) => {
            return {
              count: data.total,
              list: data.data
            };
          })
          .catch((err) => {
            return {
              count: 0,
              list: []
            };
          });
      },
      search() {
        if (this.$refs.table && typeof this.$refs.table.reload === 'function') {
          this.$refs.table.reload();
        } else if (
          this.$refs.table &&
          typeof this.$refs.table.refresh === 'function'
        ) {
          this.$refs.table.refresh();
        } else {
          console.warn('表格组件没有提供 reload 或 refresh 方法');
        }
      }
    }
  };
</script>

<style scoped>
  .el-select-width-100 {
    width: 100px;
  }
  ::v-deep(.green-row-bg) {
    background-color: #f0f9eb;
  }
</style>
