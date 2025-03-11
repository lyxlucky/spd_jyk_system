<template>
  <div class="ele-body">
    <div class="card-container">
      <div class="left-card">
        <el-card shadow="never">
          <!-- 数据表格 -->
          <user-search @search="reload" />
          <ele-pro-table ref="table1" :pageSize="pageSize" :pageSizes="pageSizes" :columns="columns1" :datasource="datasource" :selection.sync="selection" cache-key="KSInventoryBasicDataTable"  @row-click="handleTable1RowClick">
            <!-- 表头工具栏 -->
            <template v-slot:toolbar>
            </template>
          </ele-pro-table>
        </el-card>
      </div>
      <div class="right-card">
        <el-card shadow="never">
          <!-- 数据表格 -->
          <UserSearch2 @search="reload2" />
          <ele-pro-table ref="table2" :pageSize="pageSize" :pageSizes="pageSizes" :columns="columns2" :datasource="datasource2" :selection.sync="selection" cache-key="KSInventoryBasicDataTable">
            <!-- 表头工具栏 -->
            <template v-slot:toolbar>
            </template>
          </ele-pro-table>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script>
import { utils, writeFile } from 'xlsx';
import UserSearch from './rightpage-search.vue';
import UserSearch2 from './rightpage-search2.vue';
import {
  GetPDAList,initTemporary1,initTemporary2
} from '@/api/Inventory/TemporaryRepositoryQuery';
export default {
  name: 'SystemUser',
  components: {
    UserSearch,
    UserSearch2
  },
  data() {
    return {
      // 表格列配置
      columns1: [
         {
          prop: 'Dept_two_name',
          label: '二级科室名称',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 120
        }
        
      ],
      columns2: [
      {
          prop: 'Varietie_Code',
          label: '品种编码',
          align: 'center',
          showOverflowTooltip: true,
          width: 90,
        },
        {
          prop: 'Varietie_Name',
          label: '品种名称',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 200
        },
        {
          prop: 'Specification_Or_Type',
          label: '型号/规格',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 100
        },
        {
          prop: 'Unit',
          label: '单位',
          align: 'center',
          showOverflowTooltip: true,
          width: 50
        },
        {
          prop: 'Manufacturing_Ent_Name',
          label: '生产企业名称',
          align: 'center',
          showOverflowTooltip: true,
          minWidth: 150
        },
        {
          prop: 'Batch',
          label: '生产批号',
          align: 'center',
          showOverflowTooltip: true,
          width: 90,
        },
        {
          prop: 'Coefficient',
          label: '系数',
          align: 'center',
          showOverflowTooltip: true,
          width:60,
        },
        {
          prop: 'Def_No_Pkg_Code',
          label: '定数码',
          align: 'center',
          showOverflowTooltip: true,
          width: 120,
        },
        {
          prop: 'Serial_Number',
          label: 'UDI码',
          align: 'center',
          showOverflowTooltip: true,
          width: 100,
        },
        {
          prop: 'Rfid_Code',
          label: 'RFID码',
          align: 'center',
          showOverflowTooltip: true,
          width: 100,
        },
        {
          prop: 'Operate_Person',
          label: '操作人',
          align: 'center',
          showOverflowTooltip: true,
          width: 90
        },
        {
          prop: 'Operate_Time',
          label: '暂借时间',
          align: 'center',
          showOverflowTooltip: true,
          width: 150
        },
        {
          prop: 'ID',
          label: 'ID',
          align: 'center',
          showOverflowTooltip: true,
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
      let data = initTemporary1({ page, limit, where, order }).then(
        (res) => {
            var tData = {
              count: res.total,
              list: res.result
            };
            return tData;
          }
      );
      return data;
    },
    datasource2({ page, limit, where, order }) {
      if (this.selectedDeptTwoName) {
     
        where = { ...where, deptName: this.selectedDeptTwoName };
      }
      let data = initTemporary2({ page, limit, where, order }).then(
        (res) => {
            var tData = {
              count: res.total,
              list: res.result
            };
            return tData;
          }
      );
      return data;
    },
    /* 刷新表格 */
    reload(where) {
      this.$refs.table1.reload({ page: 1, where: where });
    },
    reload2(where) {
      this.$refs.table2.reload({ page: 1, where: where });
    },
    handleTable1RowClick(row) {
      this.selectedDeptTwoName = row.Dept_two_name;
    
      this.reload2();
    },
    
    exportData(data) {
      const loading = this.$messageLoading('正在导出数据...');
      this.$refs.table1.doRequest(({ where, order }) => {
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

<style scoped>
.card-container {
  display: flex;
  gap: 1mm;
  height: 100%;
}

.left-card {
  width: 25%;
  height: 100%;
}

.right-card {
  width: calc(75% - 1mm);
  height: 100%;
}

.ele-body.full-height {
  height: 100vh;
}

.ele-pro-table {
  height: 75vh;/* 减去搜索框和其他元素的高度 */
}
</style>     