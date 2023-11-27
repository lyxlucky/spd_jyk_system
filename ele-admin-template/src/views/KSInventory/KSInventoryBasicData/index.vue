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
          <!-- <el-button type="primary" size="mini" @click="openEdit(row)">编辑</el-button> -->
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
    <!-- 导入弹窗 -->
    <!-- <user-import :visible.sync="showImport" @done="reload" /> -->
  </div>
</template>

<script>
import { utils, writeFile } from 'xlsx';
import UserSearch from './components/user-search.vue';
import UserEdit from './components/user-edit.vue';
import UserImport from './components/user-import.vue';
import {
  pageUsers,
  removeUser,
  removeUsers,
  updateUserStatus,
  updateUserPassword
} from '@/api/system/user';
import {
  getDeptAuthVarNew,
  UpdateVarietieBasicJyk
} from '@/api/KSInventory/KSInventoryBasicData';
export default {
  name: 'SystemUser',
  components: {
    UserSearch,
    UserEdit
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
          width: 120,
          align: 'center',
          resizable: false,
          slot: 'action',
          showOverflowTooltip: true,
          fixed: 'left'
        },
        {
          prop: 'Varietie_Code_New',
          label: '品种编码',
          sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 150
        },
        {
          prop: 'Varietie_Code',
          label: '品种id',
          sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 150,
          show: false
        },
        {
          prop: 'Varietie_Name',
          label: '品种名称',
          sortable: 'custom',
          align: 'center',
          howOverflowTooltip: true,
          minWidth: 180
        },
        {
          prop: 'Specification_Or_Type',
          label: '规格/型号',
          sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 200
        },
        {
          prop: 'Manufacturing_Ent_Name',
          label: '生产企业名称',
          sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 180
        },
        {
          prop: 'APPROVAL_NUMBER',
          label: '注册证号',
          sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 180
        },
        {
          prop: 'Unit',
          label: '单位',
          align: 'center',
          sortable: 'custom',
          showOverflowTooltip: true,
          minWidth: 80
        },
        {
          prop: 'Price',
          label: '中标价',
          align: 'center',
          sortable: 'custom',
          width: 100,
          showOverflowTooltip: true
        },
        {
          prop: 'CLASS_NUM',
          label: '品种类别',
          width: 220,
          align: 'center',
          showOverflowTooltip: true,
           formatter: (_row, _column, cellValue) => {
            if (cellValue == 1) {
              cellValue = '有毒物品';
            }else if(cellValue == 2){
              cellValue = '质控品';
            }else if(cellValue == 3){
              cellValue = '校准品';
            }else if(cellValue == 4){
              cellValue = '耗材';
            }else if(cellValue == 5){
              cellValue = '试剂';
            }else{
              cellValue = '未定义';
            }
            return cellValue;
          }
        },
        {
          prop: 'CONVERSION_RATIO',
          label: '换算比(试剂)',
          width: 220,
          align: 'center',
          showOverflowTooltip: true
        },
        {
          prop: 'DEVICE_REMARK',
          label: '仪器备注',
          width: 220,
          align: 'center',
          showOverflowTooltip: true
        }
      ],
      toolbar: false,
      pageSize: 5,
      pageSizes: [5, 20, 50, 100, 9999999],
      pagerCount: 5,
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
      where.Dept_One_Code = this.$store.state.user.info.DeptNow.Dept_Two_Code;
      let data = getDeptAuthVarNew({ page, limit, where, order }).then(
        (res) => {
          return res.result;
        }
      );
      return data;
    },
    /* 刷新表格 */
    reload(where) {
      this.$refs.table.reload({ page: 1, where: where });
    },
    /* 打开编辑弹窗 */
    openEdit(row) {
      this.current = row;
      this.showEdit = true;
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
        where.Dept_One_Code = this.$store.state.user.info.DeptNow.Dept_Two_Code;
        getDeptAuthVarNew({
          page: 1,
          limit: 999999,
          where: where,
          order: order
        })
          .then((res) => {
            loading.close();
            const array = [
              [
                '品种编码',
                '品种id',
                '品种名称',
                '规格/型号',
                '生产企业名称',
                '注册证号',
                '单位',
                '中标价',
                '品种类别',
                '换算比(试剂)',
                '仪器备注',
              ]
            ];
            res.result.forEach((d) => {
              array.push([
                d.Varietie_Code_New,
                d.Varietie_Code,
                d.Varietie_Name,
                d.Specification_Or_Type,
                d.Manufacturing_Ent_Name,
                d.APPROVAL_NUMBER,
                d.UNIT,
                d.Price ,
                d.CLASS_NUM,
                d.CONVERSION_RATIO,
                d.DEVICE_REMARK,
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
              '科室入库品种.xlsx'
            );
            this.$message.success("导出成功");
          })
          .catch((e) => {
            loading.close();
            this.$message.error(e.message);
          });
      });
    }
  },
  created() {
    // this.getdatasource();
    // console.log(this.$store.state.user.info)
  }
};
</script>
