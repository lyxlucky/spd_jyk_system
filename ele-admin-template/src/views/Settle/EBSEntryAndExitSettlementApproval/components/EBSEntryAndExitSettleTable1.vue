<template>
  <div>
    <el-card shadow="never">
      <div slot="header" class="clearfix"> 主表数据列表 </div>
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
    name: 'EBSEntryAndExitSettleTable1',
    components: {},
    props: {},
    data() {
      return {
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
            align: 'center'
          },
          {
            prop: 'BATCH_TYPE',
            label: '批次类型',
            width: 120,
            align: 'center',
            search: true,
            fieldProps: {
              placeholder: '请输入批次类型'
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
            search: true,
            valueType: 'dateRange',
            fieldProps: {
              startPlaceholder: '开始日期',
              endPlaceholder: '结束日期'
            }
          },
          {
            prop: 'PROCESS_DATE',
            label: '处理日期',
            width: 150,
            align: 'center'
          },
          {
            prop: 'ERROR_MESSAGE',
            label: '错误信息',
            width: 200,
            align: 'center',
            showOverflowTooltip: true
          },
          {
            prop: 'DESCRIPTION',
            label: '描述',
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
      datasource({ page, limit, where, order }) {
        return {
          count: 0,
          list: []
        };
      }
    }
  };
</script>

<style scoped></style>
