<template>
  <div class="ele-body">
    <el-card shadow="never">
      <!-- 搜索表单 -->
      <!-- <user-search @search="reload" @exportData="exportData" /> -->
      <!-- 数据表格 -->
      <user-search @search="reload" @exportData="exportData" @markAsProcessed="markAsProcessed" />
      <ele-pro-table ref="table" :pageSize="pageSize" :pageSizes="pageSizes" :columns="columns" :datasource="datasource" :selection.sync="selection" cache-key="KSInventoryBasicDataTable">
        <!-- 表头工具栏 -->
        <template v-slot:toolbar>
        </template>
      </ele-pro-table>
    </el-card>
   
  </div>
</template>

<script>
import { utils, writeFile } from 'xlsx';
import UserSearch from './components/user-search.vue';

import {
  GetPDAList,VarPriceRecodeCommit
} from '@/api/TraceSource/VarPriceRecode';
export default {
  name: 'VarPriceRecode',
  components: {
    UserSearch,
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
          label: '序',
          columnKey: 'index',
          type: 'index',
          width: 45,
          align: 'center',
          showOverflowTooltip: true,
          fixed: 'left'
        },
        {
          prop: 'STATE',
          label: '处理状态',
          sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 150,
          formatter: (row) => {
            return row.STATE === '1' ? '已处理' : '未处理';
          }
        },
        {
          prop: 'CREATE_TIME',
          label: '记录时间',
          sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          width: 150,
          formatter: (row) => {
            return row.CREATE_TIME.replace('T', ' ');
          }
        },
        {
          prop: 'VARIETIE_CODE_NEW',
          label: '品种编码',
          sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 150,
          show: false
        },
        {
          prop: 'CHARGING_CODE',
          label: '计费编码',
          sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          width: 80
        },
        {
          prop: 'VARIETIE_NAME',
          label: '品种名称',
          sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 220
        },
        {
          prop: 'SPECIFICATION_OR_TYPE',
          label: '规格型号',
          sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 220
        },
        {
          prop: 'MANUFACTURING_ENT_NAME',
          label: '生产企业',
          sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 220
        },
        {
          prop: 'APPROVAL_NUMBER',
          label: '注册证号',
          sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          width: 150
        },
        {
          prop: 'UNIT',
          label: '单位',
          sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true
        },
        {
          prop: 'OLD_PRICE',
          label: '旧价格',
          sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          width: 80
        },
        {
          prop: 'NEW_PRICE',
          label: '新价格',
          sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          width: 80
        },
        {
          prop: 'UP_PRICE',
          label: '收货价格',
          sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          width: 80
        },
        {
          prop: 'SUPPLIER_NAME',
          label: '合同供应商',
          sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          width: 80
        },
        {
          prop: 'DELIVERY_NOTE_NUMBER',
          label: '收货单号',
          sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          width: 100
        },
        {
          prop: 'DELIVERY_TIME',
          label: '价格变动第一次收货时间',
          sortable: 'custom',
          align: 'center',
          showOverflowTooltip: true,
          width: 250,
          formatter: (row) => {
            return row.DELIVERY_TIME === '0001-01-01T00:00:00' ? '' : row.DELIVERY_TIME.replace('T', ' ');
          }
        }
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
      // datasource: [],
      data: []
    };
  },
  methods: {
    /* 表格数据源 */
    datasource({ page, limit, where, order }) {
      let data = GetPDAList({ page, limit, where, order }).then(
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
    /* 标记处理 */
    async markAsProcessed(where) {
      // 获取选中行的数据
      const selectedData = this.selection;
      // 判断是否有选中的数据
      if (selectedData.length === 0) {
        this.$message.warning('请选择需要标记处理的行');
        return;
      }
      try {
        // 显示确认框
        const confirmResult = await this.$confirm(
          '确认标记已处理吗？',
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
          const responseData = await VarPriceRecodeCommit(selectedData);
          // 关闭加载提示
          //loadingInstance.close();
          // 根据响应结果处理
          if (responseData.code === 200) {
            this.$message.success(responseData.msg);
            // 刷新表格
            this.reload(where);
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
    exportData(data) {
      const loading = this.$messageLoading('正在导出数据...');
      this.$refs.table.doRequest(({ where, order }) => {
        where = data;
        where.Dept_One_Code = this.$store.state.user.info.DeptNow.Dept_Two_Code;
        GetPDAList({
          page: 1,
          limit: 999999,
          where: where,
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
              '价格变动记录.xlsx'
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