<template>
  <div>
    <el-card>
      <div slot="header" class="clearfix">
        <span>主数据申请单</span>
      </div>
      <ele-pro-table
        size="mini"
        ref="table"
        height="550px"
        :columns="columns"
        highlight-current-row
        :datasource="datasource"
        :paging="false"
      ></ele-pro-table>
    </el-card>
  </div>
</template>

<script>
  import { getOAMainsHeaderIface } from '@/api/Home/hrpMasterData';
  import { formatDate } from '@/utils/formdataify';
  export default {
    name: 'HrpMasterDataTable1',
    data() {
      return {
        columns: [
          //   {
          //     prop: 'HEADER_IFACE_ID',
          //     label: '头接口ID',
          //     width: 150,
          //     align: 'center',
          //     search: true,
          //     fieldProps: {
          //       placeholder: '请输入头接口ID'
          //     }
          //   },

          //   {
          //     prop: 'ERROR_MSG',
          //     label: '错误消息',
          //     width: 180,
          //     align: 'center',
          //     showOverflowTooltip: true
          //   },
          //   {
          //     prop: 'REQUESTNOTEID',
          //     label: '请求单号ID',
          //     width: 150,
          //     align: 'center',
          //     search: true,
          //     fieldProps: {
          //       placeholder: '请输入请求单号ID'
          //     }
          //   },
          {
            prop: 'APPLYDEPT',
            label: '申请部门',
            width: 120,
            align: 'center',
            search: true,
            fieldProps: {
              placeholder: '请输入申请部门'
            }
          },
          {
            prop: 'APPLYDATE',
            label: '申请日期',
            width: 120,
            align: 'center',
            formatter: (row) => {
              // return formatDate('yyyy-mm-dd', row.APPLYDATE);
              return row.APPLYDATE;
            },
            search: true,
            valueType: 'dateRange',
            fieldProps: {
              startPlaceholder: '开始日期',
              endPlaceholder: '结束日期'
            }
          },
          {
            prop: 'APPLYPEOPLE',
            label: '申请人',
            width: 120,
            align: 'center',
            search: true,
            fieldProps: {
              placeholder: '请输入申请人'
            }
          },
          {
            prop: 'APPLYCODE',
            label: '申请编码',
            width: 120,
            align: 'center'
          },
          {
            prop: 'APPLYPHONE',
            label: '申请电话',
            width: 120,
            align: 'center'
          }
          // {
          //   prop: 'operation',
          //   label: '操作',
          //   fixed: 'right',
          //   width: 120,
          //   align: 'center'
          // }
        ]
      };
    },
    methods: {
      datasource({ page, limit, sort, where }) {
        // 实现数据源方法
        return getOAMainsHeaderIface({
          page,
          size: limit
        })
          .then((res) => {
            return {
              list: res.data,
              count: res.total
            };
          })
          .catch((err) => {
            return {
              list: [],
              count: 0
            };
          });
      }
    },
    created() {},
    mounted() {},
    watch: {}
  };
</script>

<style scoped></style>
