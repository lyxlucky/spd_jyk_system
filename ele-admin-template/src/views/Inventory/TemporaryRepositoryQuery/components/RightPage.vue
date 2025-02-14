<template>
  <div class="ele-body">
    <el-card shadow="never">
      <!-- 搜索表单 -->
      <user-search @search="reload" @exportData="exportData" @returnData="returnData"/>
      <div class="table-container">
        <!-- 新增表格 -->
        <ele-pro-table 
          ref="newTable" 
          :pageSize="newPageSize" 
          :pageSizes="newPageSizes" 
          :columns="newColumns" 
          :datasource="newDatasource" 
          cache-key="NewTable"
        >
          <!-- 表头工具栏 -->
          <template v-slot:toolbar>
          </template>
        </ele-pro-table>
        <div class="table-separator"></div>

      
        <!-- 已有表格 -->
        <ele-pro-table 
          ref="table" 
          :pageSize="pageSize" 
          :pageSizes="pageSizes" 
          :columns="columns" 
          :datasource="datasource" 
          :selection.sync="selection" 
          cache-key="KSInventoryBasicDataTable"
        >
          <!-- 表头工具栏 -->
          <template v-slot:toolbar>
          </template>
          <!-- 操作列 -->
          <template v-slot:action="{ row }">
            <el-link type="primary" :underline="false" icon="el-icon-edit" @click="openEdit(row)">
              修改
            </el-link>
          </template>
        </ele-pro-table>
      </div>
    </el-card>
    <!-- 编辑弹窗 -->
    <user-edit :visible.sync="showEdit" :data="current" @done="reload" />
  </div>
</template>

<script>
import { utils, writeFile } from 'xlsx';
import UserSearch from './rightpage-search.vue';
import {
  GetPDAList,
  Temporary_supplyRevert
} from '@/api/Inventory/TemporaryRepositoryQuery';

export default {
  name: 'SystemUser',
  components: {
    UserSearch
  },
  data() {
    return {
      // 新增表格配置
      newColumns: [
        {
          prop: 'DEPT_TWO_NAME',
          label: '二级科室名称',
          sortable: false,
          align: 'left',
          showOverflowTooltip: true
        }
      ],
      newPageSize: 10,
      newPageSizes: [10, 20, 50, 100, 9999999],
      // 已有表格配置
      columns: [
        {
          columnKey: 'selection',
          type: 'selection',
          width: 45,
          align: 'center',
          fixed: 'left'
        },
        {
          prop: 'DEPT_TWO_NAME',
          label: '科室名称',
          sortable: false,
          align: 'left',
          showOverflowTooltip: true,
          minWidth: 120
        },
        {
          prop: 'Varietie_Code',
          label: '品种(材料)编码',
          sortable: true,
          align: 'left',
          showOverflowTooltip: true,
          width: 150
        },
        // 其他已有列配置...
      ],
      toolbar: false,
      pageSize: 10,
      pageSizes: [10, 20, 50, 100, 9999999],
      pagerCount: 5,
      // 表格选中数据
      selection: [],
      // 当前编辑数据
      current: null,
      // 是否显示编辑弹窗
      showEdit: false,
      // 是否显示导入弹窗
      showImport: false,
      data: []
    };
  },
  methods: {
    /* 新增表格数据源 */
    newDatasource({ page, limit, where, order }) {
      let data = GetPDAList({ page, limit, where: where.leftWhere, order }).then(
        (res) => {
          return res.result;
        }
      );
      return data;
    },
    /* 已有表格数据源 */
    datasource({ page, limit, where, order }) {
      let data = GetPDAList({ page, limit, where: where.rightWhere, order }).then(
        (res) => {
          return res.result;
        }
      );
      return data;
    },
    /* 刷新表格 */
    reload({ leftWhere, rightWhere }) {
      this.$refs.newTable.reload({ page: 1, where: leftWhere });
      this.$refs.table.reload({ page: 1, where: rightWhere });
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
    async returnData(where) {
      // 获取选中行的数据
      const selectedData = this.selection;
      // 判断是否有选中的数据
      if (selectedData.length === 0) {
        this.$message.warning('请选择需要归还的行');
        return;
      }
      try {
        // 显示确认框
        const confirmResult = await this.$confirm(
          '确认要归还吗？',
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        );

        if (confirmResult) {
          // 显示加载提示
          // const loadingInstance = this.$message.loading({
          //   message: '处理中...',
          //   duration: 0
          // });
          // 调用封装的标记处理方法
          const responseData = await Temporary_supplyRevert(selectedData);

          this.$message.success(responseData);
          // 关闭加载提示
          //loadingInstance.close();
          // 根据响应结果处理
          if (responseData.code == 200) {
            this.$message.success(responseData.msg);
            // 刷新表格
            this.reload({ leftWhere: {}, rightWhere: {} });
          } else {
            this.$message.error(responseData.msg);
          }
        }
      } catch (error) {
        if (error.message.includes('timeout')) {
          // this.$message.error('请求超时，请检查网络');
        } else {
          //this.$message.error('请求出错，请检查网络');
        }
      }
    },
    exportData({ leftWhere, rightWhere }) {
      const loading = this.$messageLoading('正在导出数据...');
      // 这里假设只导出右侧表格数据，可按需修改
      this.$refs.table.doRequest(({ order }) => {
        GetPDAList({
          page: 1,
          limit: 999999,
          where: rightWhere,
          order: order
        })
          .then((res) => {
            loading.close();
            // 提取 columns 中的 label 作为表头
            const headers = this.columns
              .filter(column => column.prop)
              .map(column => column.label);
            const array = [headers];
            res.result.forEach((d) => {
              const row = this.columns
                .filter(column => column.prop)
                .map(column => {
                  if (column.formatter) {
                    return column.formatter(d);
                  }
                  return d[column.prop];
                });
              array.push(row);
            });
            writeFile(
              {
                SheetNames: ['Sheet1'],
                Sheets: {
                  Sheet1: utils.aoa_to_sheet(array)
                }
              },
              '暂借记录.xlsx'
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

<style scoped>
.table-container {
  display: flex;
  gap: 10px; /* 中间分割间距 */
}

.table-container > ele-pro-table:first-child {
  flex: 0 0 20%; /* 新增表格占 20% */
}

.table-container > ele-pro-table:last-child {
  flex: 1; /* 已有表格占剩余部分 */
}

.table-separator {
  width: 10px;
  background-color: transparent; /* 分割线颜色，可根据需要修改 */
}
</style>