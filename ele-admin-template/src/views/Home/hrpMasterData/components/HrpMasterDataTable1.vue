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
        @row-click="rowClick"
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
          {
            prop: 'REQUESTNOTEID',
            label: '申请单号',
            width: 150,
            align: 'center'
          },
          {
            prop: 'APPLYDEPT',
            label: '申请部门', // 保持不变
            width: 120,
            align: 'center',
            search: true,
            fieldProps: {
              placeholder: '请输入申请部门'
            }
          },
          {
            prop: 'APPLYDATE',
            label: '申请日期', // 保持不变
            width: 120,
            align: 'center',
            formatter: (row) => {
              return formatDate(row.APPLYDATE, 'yyyy-MM-dd');
            }
          },
          {
            prop: 'APPLYPEOPLE',
            label: '经办人', // 保持不变
            width: 120,
            align: 'center',
            search: true,
            fieldProps: {
              placeholder: '请输入申请人'
            }
          },
          {
            prop: 'APPLYCODE',
            label: '经办人工号', // 更新
            width: 120,
            align: 'center'
          },
          {
            prop: 'APPLYPHONE',
            label: '经办人电话', // 更新
            width: 120,
            align: 'center'
          },
          {
            prop: 'ERROR_MSG',
            label: '错误消息',
            width: 180,
            align: 'center'
          },
          {
            prop: 'PROCESS_STATUS',
            label: '状态', // 更新
            width: 120,
            align: 'center',
            formatter: (row) => {
              switch (row.PROCESS_STATUS) {
                case 'N':
                  return '已传入中间表';
                case 'S':
                  return '已传入SPD';
                case 'Y':
                  return '已接收收费编码';
                case 'E':
                  return '传入SPD失败';
                default:
                  return row.PROCESS_STATUS;
              }
            }
          }
        ]
      };
    },
    methods: {
      rowClick(row) {
        // 实现行点击事件
        this.$emit('rowClick', row);
      },
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
    }
  };
</script>

<style scoped></style>
