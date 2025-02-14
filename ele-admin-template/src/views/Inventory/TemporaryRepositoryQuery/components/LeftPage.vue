<template>
  <div class="ele-body">
    <el-card shadow="never">
      <!-- 搜索表单 -->
      <!-- <user-search @search="reload" @exportData="exportData" /> -->
      <!-- 数据表格 -->
      <user-search @search="reload" @exportData="exportData" @returnData="returnData"/>
      <ele-pro-table ref="table" :pageSize="pageSize" :pageSizes="pageSizes" :columns="columns" :datasource="datasource" :selection.sync="selection" cache-key="KSInventoryBasicDataTable">
        <!-- 表头工具栏 -->
        <template v-slot:toolbar>
        </template>

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
import UserSearch from './leftpage-search.vue';
import {
  GetPDAList,Temporary_supplyRevert
} from '@/api/Inventory/TemporaryRepositoryQuery';
export default {
  name: 'SystemUser',
  components: {
    UserSearch,
   
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
        {
          prop: 'CHARGING_CODE',
          label: '计费编码',
          sortable: false,
          align: 'left',
          showOverflowTooltip: true,
          minWidth: 200
        },
        {
          prop: 'Varietie_Name',
          label: '品种全称',
          sortable: false,
          align: 'left',
          showOverflowTooltip: true,
          minWidth: 200
        },
        {
          prop: 'Specification_Or_Type',
          label: '型号/规格',
          sortable: false,
          align: 'left',
          showOverflowTooltip: true,
          minWidth: 100
        },
        {
          prop: 'Unit',
          label: '单位',
          sortable: false,
          align: 'center',
          showOverflowTooltip: true,
          width: 60
        },
        {
          prop: 'Manufacturing_Ent_Name',
          label: '生产企业名称',
          sortable: false,
          align: 'left',
          showOverflowTooltip: true,
          minWidth: 150
        },
        {
          prop: 'Batch',
          label: '生产批号',
          sortable: true,
          align: 'left',
          showOverflowTooltip: true,
          width: 90
        },
        {
          prop: 'Coefficient',
          label: '系数',
          sortable: false,
          align: 'center',
          showOverflowTooltip: true,
          width: 60
        },
        {
          prop: 'Def_No_Pkg_Code',
          label: '定数码',
          sortable: true,
          align: 'left',
          showOverflowTooltip: true,
          width: 120
        },
        {
          prop: 'Serial_Number',
          label: 'UDI码',
          sortable: true,
          align: 'left',
          showOverflowTooltip: true,
          width: 100
        },
        {
          prop: 'Rfid_Code',
          label: 'RFID码',
          sortable: true,
          align: 'left',
          showOverflowTooltip: true,
          width: 100
        },
        {
          prop: 'Operate_Person',
          label: '操作人',
          sortable: false,
          align: 'left',
          showOverflowTooltip: true,
          width: 90
        },
        {
          prop: 'Operate_Time',
          label: '暂借时间',
          sortable: true,
          align: 'left',
          showOverflowTooltip: true,
          width: 150,
          formatter: (row) => {
            return row.Operate_Time.replace("T", " ");
          }
        },
        {
          prop: 'Dept_Two_Up_Shelf_Id',
          width: -2,
          minWidth: -2,
          type: 'space',
          style: 'display: none'
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
