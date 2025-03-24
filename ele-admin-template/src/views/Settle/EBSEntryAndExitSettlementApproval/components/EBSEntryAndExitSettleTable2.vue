<template>
  <div>
    <el-card shadow="never">
      <div slot="header" class="clearfix"> 主表数据详细列表 </div>
      <div>
        <el-form size="mini" :inline="true">
          <el-form-item label="审批状态" prop="SP_STATE">
            <el-select
              class="el-select-width-100"
              v-model="form.SP_STATE"
              placeholder="请选择审批状态"
              clearable
            >
              <el-option label="全部" value=""></el-option>
              <el-option label="未审批" value="0"></el-option>
              <el-option label="已审批" value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="search"
              >查询</el-button
            >
          </el-form-item>
        </el-form>
      </div>
      <div>
        <ele-pro-table
          height="550"
          :columns="columns"
          :datasource="datasource"
        ></ele-pro-table>
      </div>
    </el-card>
  </div>
</template>

<script>
  export default {
    name: 'EBSEntryAndExitSettleTable2',
    components: {},
    props: {},
    data() {
      return {
        form: {
          SP_STATE: ''
        },
        columns: [
          //   {
          //     prop: 'TRANSACTION_IFACE_ID',
          //     label: '交易接口ID',
          //     width: 120,
          //     align: 'center',
          //     search: true,
          //     fieldProps: {
          //       placeholder: '请输入交易接口ID'
          //     }
          //   },
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
            prop: 'LEDGER_NAME',
            label: '账本名称',
            width: 150,
            align: 'center'
          },
          {
            prop: 'SP_MAN',
            label: '审批人',
            width: 120,
            align: 'center'
          },
          {
            prop: 'SP_TIME',
            label: '审批时间',
            width: 150,
            align: 'center'
          },
          {
            prop: 'SP_STATE',
            label: '审批状态',
            width: 100,
            align: 'center',
            search: true,
            enum: [
              { label: '未审批', value: '0' },
              { label: '已审批', value: '1' },
              { label: '审批拒绝', value: '2' }
            ],
            formatter: (row) => {
              if (row.SP_STATE === '0') return '未审批';
              if (row.SP_STATE === '1') return '已审批';
              if (row.SP_STATE === '2') return '审批拒绝';
              return row.SP_STATE || '';
            },
            fieldProps: {
              clearable: true
            }
          },
          {
            prop: 'TRANSACTION_TYPE',
            label: '交易类型',
            width: 120,
            align: 'center',
            search: true,
            fieldProps: {
              placeholder: '请输入交易类型'
            }
          },
          {
            prop: 'TRANSACTION_DATE',
            label: '交易日期',
            width: 150,
            align: 'center',
            search: true,
            valueType: 'dateRange',
            fieldProps: {
              startPlaceholder: '开始日期',
              endPlaceholder: '结束日期'
            }
          },
          {
            prop: 'TYPE',
            label: '类型',
            width: 100,
            align: 'center',
            search: true,
            fieldProps: {
              placeholder: '请输入类型'
            }
          },
          {
            prop: 'MEDIC_TYPE',
            label: '医疗类型',
            width: 120,
            align: 'center'
          },
          {
            prop: 'OP_IP_FLAG',
            label: '门诊/住院标志',
            width: 120,
            align: 'center',
            search: true,
            enum: [
              { label: '门诊', value: 'OP' },
              { label: '住院', value: 'IP' }
            ],
            fieldProps: {
              clearable: true
            }
          },
          {
            prop: 'BILL_DEPT_CODE',
            label: '开单部门代码',
            width: 120,
            align: 'center',
            search: true,
            fieldProps: {
              placeholder: '请输入开单部门代码'
            }
          },
          {
            prop: 'BILL_DEPT_DESC',
            label: '开单部门描述',
            width: 150,
            align: 'center',
            showOverflowTooltip: true
          },
          {
            prop: 'BILL_WARD_SN',
            label: '开单病区编号',
            width: 120,
            align: 'center'
          },
          {
            prop: 'BILL_WARD_SN_DESC',
            label: '开单病区描述',
            width: 150,
            align: 'center',
            showOverflowTooltip: true
          },
          {
            prop: 'AMOUNT',
            label: '金额',
            width: 120,
            align: 'center',
            formatter: (row) => {
              return row.AMOUNT ? row.AMOUNT.toFixed(2) : '0.00';
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
            prop: 'RELATE_COM_CODE',
            label: '关联公司代码',
            width: 120,
            align: 'center'
          },
          {
            prop: 'PROJECT_CODE',
            label: '项目代码',
            width: 120,
            align: 'center'
          },
          {
            prop: 'DESCRIPTION',
            label: '描述',
            width: 200,
            align: 'center',
            showOverflowTooltip: true
          },
          {
            prop: 'SYNC_DATE',
            label: '同步日期',
            width: 150,
            align: 'center'
          },
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

          {
            prop: 'operation',
            label: '操作',
            fixed: 'right',
            width: 150,
            align: 'center'
          }
        ]
      };
    },
    computed: {},
    methods: {
      datasource({ page, limit, where, order }) {
        return {
          count: 0,
          list: []
        };
      },
      search() {
        this.$refs.table.search();
      }
    }
  };
</script>

<style lang="scss" scoped>
  .el-select-width-100 {
    width: 100px;
  }
</style>
