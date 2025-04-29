<template>
  <div class="ele-body">
    <ApplyTempSearch
      @search="reload"
      @exportData="exportData"
      @openEdit="openEdit"
      :rowData="current"
    />
    <!-- 数据表格 -->
    <ele-pro-table
      @current-change="onCurrentChange"
      :rowClickCheckedIntelligent="false"
      highlight-current-row
      size="mini"
      ref="table"
      height="60vh"
      :rowClickChecked="true"
      :stripe="true"
      :pageSize="pageSize"
      :pageSizes="pageSizes"
      :columns="columns"
      :needPage="true"
      :datasource="datasource"
      :selection.sync="selection"
      cache-key=""
    >
      <!-- 表头工具栏 -->
      <template v-slot:toolbar>
        <!-- 搜索表单 -->
      </template>

      <!-- 操作列 -->
      <template v-slot:action="{ row }">
        <!-- <el-button type="primary" size="small" @click="search(row)">设置为专属模板</el-button> -->
        <el-popconfirm
          class="ele-action"
          title="确定要删除此用户吗？"
          @confirm="remove(row)"
        >
          <template v-slot:reference>
            <el-link type="danger" :underline="false" icon="el-icon-delete">
              删除
            </el-link>
            <el-link
              @click="editTempletName(row.TempletCode)"
              type="primary"
              :underline="false"
              icon="el-icon-edit"
            >
              编辑
            </el-link>
          </template>
        </el-popconfirm>
      </template>
    </ele-pro-table>
    <UserEdit :visible.sync="showEdit" :data="selection" @done="reload" />
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
  import UserEdit from './user-edit.vue';
  import { utils, writeFile } from 'xlsx';
  import ApplyTempSearch from './ApplyTempSearch.vue';
  import { GetSpdMainsjHeaderIface } from '@/api/Home/masterBaseData';
  export default {
    name: 'ApplyTempTable',
    components: {
      ApplyTempSearch,
      UserEdit
    },
    data() {
      return {
        // 表格列配置
        columns: [
          {
            columnKey: 'selection',
            type: 'selection',
            width: 45,
            align: 'center',
            fixed: 'left'
          },
          // {
          //   columnKey: 'index',
          //   type: 'index',
          //   width: 45,
          //   align: 'center',
          //   showOverflowTooltip: true,
          //   fixed: 'left'
          // },

          {
            prop: 'ERROR_MSG',
            label: '错误消息',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 100,
            show: false
          },
          {
            prop: 'REQUESTNOTEID',
            label: '申请单号',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 140
          },
          {
            prop: 'APPLYDEPT',
            label: '申请部门',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 110
          },
          {
            prop: 'APPLYDATE',
            label: '申请日期',
            align: 'center',
            showOverflowTooltip: true,
            width: 180,
            formatter: (row, column, cellValue) => {
              return this.$moment(row.APPLYDATE).format('YYYY-MM-DD');
            }
          },
          {
            prop: 'YB_SP_STATE',
            label: '是否审批',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 100,
            formatter: (row, column, cellValue) => {
              if (cellValue == 1) {
                return '已审批';
              } else {
                return '未审批';
              }
            }
          },
          {
            prop: 'YB_SP_MARK',
            label: '审批备注',
            // sortable: 'custom',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 120
          },
          {
            prop: 'YB_SP_MAN',
            label: '审批人',
            // sortable: 'custom',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 100
          },
          {
            prop: 'APPLYPEOPLE',
            label: '经办人',
            // sortable: 'custom',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 150
          },
          {
            prop: 'APPLYCODE',
            label: '经办人工号',
            // sortable: 'custom',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 150
          },
          {
            prop: 'APPLYPHONE',
            label: '经办人电话',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 110
          },
          {
            prop: 'PROCESS_STATUS',
            label: '状态',
            align: 'center',
            showOverflowTooltip: true,
            minWidth: 80,
            formatter: (row, column, cellValue) => {
              if (cellValue == 'N') {
                return '已传入中间表';
              } else if (cellValue == 'S') {
                return '已传入SPD';
              } else if (cellValue == 'Y') {
                return '已接收收费编码';
              } else if (cellValue == 'E') {
                return '传入SPD失败';
              } else {
                return '未知状态';
              }
            },
            show: true
          }
        ],
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
        // where.DeptCode = this.$store.state.user.info.DeptNow.Dept_Two_Code;
        // where.UserId = this.$store.state.user.info.ID;
        const formatWhere = {
          ...where,
          WJ_SP_STATE: 1
        };
        let data = GetSpdMainsjHeaderIface({
          page,
          limit,
          where: formatWhere,
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
      onCurrentChange(current) {
        this.current = current;
        // console.log(current);
        this.$emit('getCurrent', current);
      },
      /* 刷新表格 */
      reload(where) {
        this.$refs.table.reload({ page: 1, where: where });
      },
      openEdit(row) {
        if (this.selection.length <= 0) {
          this.$message.warning('请选择要审批的数据');
          return;
        }
        this.showEdit = true;
      },
      exportData(data) {
        const loading = this.$messageLoading('正在导出数据...');
        this.$refs.table.doRequest(({ where, order }) => {
          const formatWhere = {
            ...data,
            WJ_SP_STATE: 1
          };
          GetSpdMainsjHeaderIface({
            page: 1,
            limit: 999999,
            where: formatWhere,
            order: order
          })
            .then((res) => {
              loading.close();
              const array = [
                [
                  '状态',
                  '错误消息',
                  '申请单号',
                  '申请部门',
                  '申请日期',
                  '经办人',
                  '经办人工号',
                  '经办人电话'
                ]
              ];
              res.result.forEach((d) => {
                if (d.PROCESS_STATUS == 'N') {
                  d.PROCESS_STATUS = '已传入中间表';
                } else if (d.PROCESS_STATUS == 'S') {
                  d.PROCESS_STATUS = '已传入SPD';
                } else if (d.PROCESS_STATUS == 'Y') {
                  d.PROCESS_STATUS = '已接收收费编码';
                } else if (d.PROCESS_STATUS == 'E') {
                  d.PROCESS_STATUS = '传入SPD失败';
                } else {
                  d.PROCESS_STATUS = '未知状态';
                }
                array.push([
                  d.PROCESS_STATUS,
                  d.ERROR_MSG,
                  d.REQUESTNOTEID,
                  d.APPLYDEPT,
                  d.APPLYDATE,
                  d.APPLYPEOPLE,
                  d.APPLYCODE,
                  d.APPLYPHONE
                  // this.$util.toDateString(d.createTime)
                ]);
              });
              writeFile(
                {
                  SheetNames: ['Sheet1'],
                  Sheets: {
                    Sheet1: utils.aoa_to_sheet(array)
                  }
                },
                '医保单.xlsx'
              );
              this.$message.success('导出成功');
            })
            .catch((e) => {
              loading.close();
              this.$message.error(e.message);
            });
        });
      }
    },
    mounted() {},
    destroyed() {},
    created() {
      // this.getdatasource();
      // console.log(this.$store.state.user.info.DeptNow.Dept_Two_Code);
    }
  };
</script>
