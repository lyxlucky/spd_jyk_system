<template>
  <div class="ele-body">
    <el-card shadow="never">
      <!-- 搜索表单 -->
      <user-search @search="reload" @exportData="exportData" />
      <!-- 数据表格 -->
      <ele-pro-table ref="table" :pageSize="pageSize" :pageSizes="pageSizes" :columns="columns" :datasource="datasource" :selection.sync="selection" cache-key="KSInventoryBasicDataTable">
        <!-- 表头工具栏 -->
        <!-- <template v-slot:toolbar>
          <el-button size="small" type="primary" icon="el-icon-plus" class="ele-btn-icon" @click="openEdit()">
            新建
          </el-button>
          <el-button size="small" type="danger" icon="el-icon-delete" class="ele-btn-icon" @click="removeBatch">
            删除
          </el-button>
          <el-button size="small" icon="el-icon-upload2" class="ele-btn-icon" @click="openImport">
            导入
          </el-button>
        </template> -->

        <!-- 操作列 -->
        <template v-slot:action="{ row }">
          <el-link type="primary" :underline="false" icon="el-icon-edit" @click="openEdit(row)">
            修改
          </el-link>
          <el-button type="primary" size="mini" @click="openEdit2(row)">修改上下限</el-button>
          <!-- <el-popconfirm class="ele-action" title="确定要删除此用户吗？" @confirm="remove(row)">
            <template v-slot:reference>
              <el-link type="danger" :underline="false" icon="el-icon-delete">
                删除
              </el-link>
            </template>
          </el-popconfirm> -->
        </template>
      </ele-pro-table>
    </el-card>
    <!-- 编辑弹窗 -->
    <user-edit :visible.sync="showEdit" :data="current" @done="reload" />
    <user-edit2 :visible.sync="showEdit2" :data="current2" @done="reload" />
    <!-- 导入弹窗 -->
    <!-- <user-import :visible.sync="showImport" @done="reload" /> -->
  </div>
</template>

<script>
import { reloadPageTab, finishPageTab } from '@/utils/page-tab-util';
import { utils, writeFile } from 'xlsx';
import UserSearch from './components/user-search.vue';
import UserEdit from './components/user-edit.vue';
import userEdit2 from './components/user-edit2.vue';
import {
  pageUsers,
  removeUser,
  removeUsers,
  updateUserStatus,
  updateUserPassword
} from '@/api/system/user';
import { getPROD_REGISTRATION_LIMIT_BUY } from '@/api/KSInventory/PrchaseDataByVar';

export default {
  name: 'SystemUser',
  components: {
    UserSearch,
    UserEdit,
    userEdit2
    // UserImport
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
        {
          columnKey: 'index',
          type: 'index',
          width: 45,
          align: 'center',
          showOverflowTooltip: true,
          fixed: 'left'
        },
        {
          columnKey: 'action',
          label: '操作',
          width: 200,
          align: 'center',
          resizable: false,
          slot: 'action',
          showOverflowTooltip: true,
          fixed: 'left'
        },
        {
          prop: 'XM_NUM',
          label: '项目编号',
          // sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 150
        },
        {
          prop: 'XM_NAME',
          label: '项目名称',
          // sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 120
        },
        {
          prop: 'XM_TYPE',
          label: '项目类型',
          // sortable: 'custom',
          align: 'center',
          howOverflowTooltip: true,
          minWidth: 180
        },
        {
          prop: 'SOURCE_FROM',
          label: '阳光来源',
          // sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 200
        },
        {
          prop: 'PROD_SOURCE_FROM',
          label: '自定义来源',
          // sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 180
        },
        {
          prop: 'PROD_REGISTRATION_NAME',
          label: '注册证名称',
          // sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 180
        },
        {
          prop: 'APPROVAL_NUMBER',
          label: '批准文号',
          align: 'center',
          // sortable: 'custom',
          showOverflowTooltip: true,
          minWidth: 80
        },
        {
          prop: 'MANUFACTURING_ENT_NAME',
          label: '生产企业',
          align: 'center',
          // sortable: 'custom',
          width: 100,
          showOverflowTooltip: true
        },
        {
          prop: 'BUY_TIME',
          label: '起始日期',
          align: 'center',
          // sortable: 'custom',
          width: 100,
          showOverflowTooltip: true,
          formatter(_row, _column, cellValue) {
            return cellValue.substr(0, 10);
          }
        },
        {
          prop: 'BUY_TIME2',
          label: '结束日期',
          width: 120,
          align: 'center',
          showOverflowTooltip: true,
          formatter(_row, _column, cellValue) {
            return cellValue.substr(0, 10);
          }
        },
        {
          prop: 'PRICE',
          label: '单价',
          width: 100,
          align: 'center',
          showOverflowTooltip: true
        },
        {
          prop: 'GOODS_QTY',
          label: '已消耗数量',
          width: 100,
          align: 'center',
          showOverflowTooltip: true
        },
        {
          prop: '',
          label: '余可用数量',
          width: 100,
          align: 'center',
          showOverflowTooltip: true,
          formatter(_row, _column, cellValue) {
            return _row.COUNT - _row.GOODS_QTY;
          }
        },
        {
          prop: 'WCL',
          label: '完成率%',
          width: 100,
          align: 'center',
          showOverflowTooltip: true,
          formatter(_row, _column, cellValue) {
            return _row.WCL.toFixed(2);
          }
        },
        {
          prop: 'ADD_MAN',
          label: '操作人',
          width: 100,
          align: 'center',
          showOverflowTooltip: true
        },
        {
          prop: 'LAST_UPDATE_DATE',
          label: '添加时间',
          width: 100,
          align: 'center',
          showOverflowTooltip: true,
          formatter(_row, _column, cellValue) {
            return _row.LAST_UPDATE_DATE.replace('T', ' ');
          }
        },
        {
          prop: 'BH_COUNT',
          label: '临时备货次数',
          width: 100,
          align: 'center',
          showOverflowTooltip: true
        }
      ],
      toolbar: false,
      pageSize: 20,
      pageSizes: [10, 20, 50, 100, 9999999],
      pagerCount: 5,
      // 表格选中数据
      selection: [],
      // 当前编辑数据
      current: null,
      current2: null,
      // 是否显示编辑弹窗
      showEdit: false,
      showEdit2: false,
      // 是否显示导入弹窗
      showImport: false,
      // datasource: [],
      data: [],
      isDeptTwoAuth: null
    };
  },
  methods: {
    /* 表格数据源 */
    datasource({ page, limit, where, order }) {
      where.deptTwoCode = this.$store.state.user.info.DeptNow.Dept_Two_Code;
      let data = getPROD_REGISTRATION_LIMIT_BUY({
        page,
        limit,
        where,
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
      this.isDeptTwoAuth = where.isDeptTwoAuth;
      this.$refs.table.reload({ page: 1, where: where });
    },
    /* 打开编辑弹窗 */
    openEdit(row) {
      this.current = row;
      this.showEdit = true;
    },
    openEdit2(row) {
      this.current2 = row;
      this.showEdit2 = true;
    },
    /* 打开导入弹窗 */
    openImport() {
      this.showImport = true;
    },
    /* 删除 */
    remove(row) {
      const loading = this.$loading({ lock: true });
      removeUser(row.userId)
        .then((msg) => {
          loading.close();
          this.$message.success(msg);
          this.reload();
        })
        .catch((e) => {
          loading.close();
          this.$message.error(e.message);
        });
    },
    /* 批量删除 */
    removeBatch() {
      if (!this.selection.length) {
        this.$message.error('请至少选择一条数据');
        return;
      }
      this.$confirm('确定要删除选中的用户吗?', '提示', {
        type: 'warning'
      })
        .then(() => {
          const loading = this.$loading({ lock: true });
          removeUsers(this.selection.map((d) => d.userId))
            .then((msg) => {
              loading.close();
              this.$message.success(msg);
              this.reload();
            })
            .catch((e) => {
              loading.close();
              this.$message.error(e.message);
            });
        })
        .catch(() => {});
    },
    /* 重置用户密码 */
    resetPsw(row) {
      this.$confirm('确定要重置此用户的密码为"123456"吗?', '提示', {
        type: 'warning'
      })
        .then(() => {
          const loading = this.$loading({ lock: true });
          updateUserPassword(row.userId)
            .then((msg) => {
              loading.close();
              this.$message.success(msg);
            })
            .catch((e) => {
              loading.close();
              this.$message.error(e.message);
            });
        })
        .catch(() => {});
    },
    /* 更改状态 */
    editStatus(row) {
      const loading = this.$loading({ lock: true });
      updateUserStatus(row.userId, row.status)
        .then((msg) => {
          loading.close();
          this.$message.success(msg);
        })
        .catch((e) => {
          loading.close();
          row.status = !row.status ? 1 : 0;
          this.$message.error(e.message);
        });
    },
    exportData(data) {
      const loading = this.$messageLoading('正在导出数据...');
      this.$refs.table.doRequest(({ where, order }) => {
        where = data;
        where.deptTwoCode = this.$store.state.user.info.DeptNow.Dept_Two_Code;
        getPROD_REGISTRATION_LIMIT_BUY({
          page: 1,
          limit: 999999,
          where: where,
          order: order
        })
          .then((res) => {
            loading.close();
            const array = [
              [
                '阳光来源',
                '自定义来源',
                '注册证名称',
                '批准文号',
                '生产企业',
                '起始日期',
                '结束日期',
                '计划数量',
                '已消耗数量',
                '余可用数量',
                '完成率',
                '操作人',
                '添加时间',
                '项目编号',
                '项目名称',
                '项目类型'
              ]
            ];
            res.result.forEach((d) => {
              array.push([
                d.SOURCE_FROM,
                d.PROD_SOURCE_FROM,
                d.PROD_REGISTRATION_NAME,
                d.APPROVAL_NUMBER,
                d.MANUFACTURING_ENT_NAME,
                d.BUY_TIME.substr(0, 10),
                d.BUY_TIME2.substr(0, 10),
                d.COUNT,
                d.GOODS_QTY,
                d.COUNT - d.GOODS_QTY,
                d.WCL + '%',
                d.ADD_MAN,
                d.LAST_UPDATE_DATE.replace('T', ' '),
                d.XM_NUM,
                d.XM_NAME,
                d.XM_TYPE
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
              '带量采购监控.xlsx'
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
  watch: {
    isDeptTwoAuth() {
      var length = this.columns.length;
      if (this.isDeptTwoAuth == 1) {
        if (this.columns[length - 1].prop == 'DEVICE_REMARK') {
          this.columns.push({
            prop: 'Coefficient',
            label: '系数',
            width: 80,
            align: 'center',
            showOverflowTooltip: true
          });
          this.columns.push({
            prop: 'up',
            label: '上限',
            width: 80,
            align: 'center',
            showOverflowTooltip: true
          });
          this.columns.push({
            prop: 'down',
            label: '下限',
            width: 80,
            align: 'center',
            showOverflowTooltip: true
          });
        }
      } else {
        this.columns = this.columns.slice(1, 13);
      }
    }
  },
  created() {
    // this.getdatasource();
    // console.log(this.$store.state.user.info)
  }
};
</script>
